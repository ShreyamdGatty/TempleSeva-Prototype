import { create } from "zustand";

import {
  Seva,
  sevaNeedsSankalpam,
} from "@/src/features/sevas/types/seva.types";
import { payForOrder, placeOrder } from "@/src/services/ccavenue.service";
import { useTempleStore } from "@/src/shared/temple/templeStore";
import { getModel, getSevaAvailability } from "../services/order.service";
import {
  PaymentStatusResponse,
  POSTranModel,
  PosTrDet,
} from "../types/order.types";

const EMPTY_ROWS: PosTrDet[] = [];

export type AddResult =
  | { ok: true }
  | { ok: false; reason: "unavailable"; status: string }
  | {
      ok: false;
      reason: "no-model" | "slot-required" | "error" | "max-qty";
    };

export type SubmitResult =
  | {
      ok: true;
      paid: boolean;
      data: PaymentStatusResponse | null;
      paymentPending?: boolean;
    }
  | { ok: false; reason: "no-model" | "empty" | "error"; error?: unknown };

// User details for the order header. Set by the caller before submit.
export type OrderParty = {
  extPartyId: string;
  partyName: string;
  mobile: string;
  email: string;
};

// Display-only info (NOT sent to the server). Keyed by itMastID.
type SevaDisplay = {
  itMastId: string; // used for GetSevaAvailability on increment
  sevaName: string;
  sevaGroup?: string | null;
  rate: number;
  maxQtyPerBill: number;
  needsSankalpam: boolean;
  slotNameById: Record<string, string>;
};

interface OrderState {
  model: POSTranModel | null;
  detSeq: number;
  worshipDate: string;
  loadingModel: boolean;
  submitting: boolean;

  display: Record<string, SevaDisplay>;

  initModel: (worshipDate: string) => Promise<void>;

  addItem: (
    seva: Seva,
    slotId: string,
    slotRequired: boolean,
  ) => Promise<AddResult>;

  incrementByRow: (detId: string) => Promise<AddResult>;

  decrementRow: (detId: string) => void;
  removeRow: (detId: string) => void;
  clearSeva: (itMastID: string, slotID: string) => void;

  setDevotee: (
    detId: string,
    devotee: { devoteeName: string; nak: string; ras: string; got: string },
  ) => void;

  submitOrder: (party: OrderParty) => Promise<SubmitResult>;

  clearOrder: () => void;
}

function recomputeGross(det: PosTrDet[]): number {
  return det.reduce((sum, d) => sum + d.entryAmt, 0);
}

function qtyFor(det: PosTrDet[], itMastID: string, SevaSlotID: string): number {
  return det
    .filter((d) => d.itMastID === itMastID && d.SevaSlotID === SevaSlotID)
    .reduce((n, d) => n + d.entryQty, 0);
}

// Recompute gross/net together (disc + round stay 0 for now).
function withAmounts(posTr: POSTranModel["posTr"], det: PosTrDet[]) {
  const entryGrossAmt = recomputeGross(det);
  const entryDiscAmt = posTr.entryDiscAmt ?? 0;
  const entryRoundAmt = posTr.entryRoundAmt ?? 0;
  const entryNetAmt = entryGrossAmt - entryDiscAmt + entryRoundAmt;
  return {
    ...posTr,
    posTrDets: det,
    entryGrossAmt,
    entryDiscAmt,
    entryRoundAmt,
    entryNetAmt,
  };
}

export const useOrderStore = create<OrderState>((set, get) => ({
  model: null,
  detSeq: 0,
  worshipDate: "",
  loadingModel: false,
  submitting: false,
  display: {},

  // ---------------------------------------------------------------
  // INIT MODEL
  // ---------------------------------------------------------------
  initModel: async (worshipDate) => {
    set({ loadingModel: true });

    try {
      const fresh = await getModel();
      const temple = useTempleStore.getState().selected;

      const model: POSTranModel = {
        ...fresh,
        digiOrgId: temple?.id ?? "",
        posTr: {
          ...fresh.posTr,
          sdId: temple?.sdId ?? "",
          locId: temple?.locId ?? "",
          secId: temple?.secId ?? "",
          phId: temple?.phId ?? "",
          bilNo: fresh.posTr.bilNo ?? "",
          extPartyId: fresh.posTr.extPartyId ?? "",
          partyName: fresh.posTr.partyName ?? "",
          mobile: fresh.posTr.mobile ?? "",
          email: fresh.posTr.email ?? "",
          posTrDets: [],
          entryGrossAmt: 0,
          entryDiscAmt: 0,
          entryRoundAmt: 0,
          entryNetAmt: 0,
        },
      };

      set({
        model,
        detSeq: 0,
        worshipDate,
        display: {},
        loadingModel: false,
      });
    } catch {
      set({ loadingModel: false });
    }
  },

  // ---------------------------------------------------------------
  // ADD (availability-gated)
  // ---------------------------------------------------------------
  addItem: async (seva, slotId, slotRequired) => {
    const state = get();
    if (!state.model) return { ok: false, reason: "no-model" };

    if (slotRequired && !slotId) {
      return { ok: false, reason: "slot-required" };
    }

    const normalizedSlot = slotId ?? "";

    const currentQty = qtyFor(
      state.model.posTr.posTrDets,
      seva.itMastId,
      normalizedSlot,
    );
    if (currentQty >= seva.maxQtyPerBill) {
      return { ok: false, reason: "max-qty" };
    }

    let availability: { canBook: boolean; availabilityStatus: string };
    try {
      availability = await getSevaAvailability({
        sevaDate: state.worshipDate,
        itMastId: seva.itMastId,
        slotId: normalizedSlot,
        entryQty: currentQty + 1,
      });
    } catch {
      return { ok: false, reason: "error" };
    }

    if (!availability.canBook) {
      return {
        ok: false,
        reason: "unavailable",
        status: availability.availabilityStatus,
      };
    }

    const needsSankalpam = sevaNeedsSankalpam(seva);
    const rate = seva.rate ?? 0;
    const slotName =
      seva.sevaSlots?.find((sl) => sl.id === normalizedSlot)?.slotName ?? "";

    set((s) => {
      if (!s.model) return s;
      const posTr = s.model.posTr;
      const det = [...posTr.posTrDets];
      let seq = s.detSeq;

      if (!needsSankalpam) {
        const existing = det.find(
          (d) =>
            d.itMastID === seva.itMastId && d.SevaSlotID === normalizedSlot,
        );
        if (existing) {
          const idx = det.indexOf(existing);
          const entryQty = existing.entryQty + 1;
          det[idx] = { ...existing, entryQty, entryAmt: rate * entryQty };
        } else {
          seq += 1;
          det.push(
            buildDetRow(
              posTr.id,
              seq,
              seva,
              normalizedSlot,
              s.worshipDate,
              rate,
            ),
          );
        }
      } else {
        seq += 1;
        det.push(
          buildDetRow(posTr.id, seq, seva, normalizedSlot, s.worshipDate, rate),
        );
      }

      const display = {
        ...s.display,
        [seva.itMastId]: {
          itMastId: seva.itMastId,
          sevaName: seva.sevaName,
          sevaGroup: seva.sevaGroup,
          rate,
          maxQtyPerBill: seva.maxQtyPerBill,
          needsSankalpam,
          slotNameById: {
            ...(s.display[seva.itMastId]?.slotNameById ?? {}),
            ...(normalizedSlot ? { [normalizedSlot]: slotName } : {}),
          },
        },
      };

      return {
        detSeq: seq,
        display,
        model: { ...s.model, posTr: withAmounts(posTr, det) },
      };
    });

    return { ok: true };
  },

  // ---------------------------------------------------------------
  // INCREMENT BY ROW (cart +)
  // ---------------------------------------------------------------
  incrementByRow: async (detId) => {
    const state = get();
    if (!state.model) return { ok: false, reason: "no-model" };

    const row = state.model.posTr.posTrDets.find((d) => d.id === detId);
    if (!row) return { ok: false, reason: "error" };

    const info = state.display[row.itMastID];
    if (!info) return { ok: false, reason: "error" };

    const currentQty = qtyFor(
      state.model.posTr.posTrDets,
      row.itMastID,
      row.SevaSlotID,
    );
    if (currentQty >= info.maxQtyPerBill) {
      return { ok: false, reason: "max-qty" };
    }

    let availability: { canBook: boolean; availabilityStatus: string };
    try {
      availability = await getSevaAvailability({
        sevaDate: state.worshipDate,
        itMastId: info.itMastId,
        slotId: row.SevaSlotID,
        entryQty: currentQty + 1,
      });
    } catch {
      return { ok: false, reason: "error" };
    }

    if (!availability.canBook) {
      return {
        ok: false,
        reason: "unavailable",
        status: availability.availabilityStatus,
      };
    }

    set((s) => {
      if (!s.model) return s;
      const posTr = s.model.posTr;
      const det = [...posTr.posTrDets];
      let seq = s.detSeq;

      if (!info.needsSankalpam) {
        const idx = det.findIndex((d) => d.id === detId);
        if (idx >= 0) {
          const cur = det[idx]!;
          const entryQty = cur.entryQty + 1;
          det[idx] = { ...cur, entryQty, entryAmt: cur.entryRate * entryQty };
        }
      } else {
        seq += 1;
        det.push({
          id: `${posTr.id}_${seq}`,
          posTrId: posTr.id,
          itMastID: row.itMastID,
          entryQty: 1,
          entryRate: row.entryRate,
          entryAmt: row.entryRate,
          sevaDt: row.sevaDt,
          SevaSlotID: row.SevaSlotID,
          devoteeName: "",
          ras: "",
          nak: "",
          got: "",
          mobile: "",
          eMail: "",
        });
      }

      return {
        detSeq: seq,
        model: { ...s.model, posTr: withAmounts(posTr, det) },
      };
    });

    return { ok: true };
  },

  // ---------------------------------------------------------------
  // DECREMENT
  // ---------------------------------------------------------------
  decrementRow: (detId) =>
    set((s) => {
      if (!s.model) return s;
      const posTr = s.model.posTr;
      let det = [...posTr.posTrDets];
      const row = det.find((d) => d.id === detId);
      if (!row) return s;

      if (row.entryQty > 1) {
        const idx = det.indexOf(row);
        const entryQty = row.entryQty - 1;
        det[idx] = { ...row, entryQty, entryAmt: row.entryRate * entryQty };
      } else {
        det = det.filter((d) => d.id !== detId);
      }

      return { model: { ...s.model, posTr: withAmounts(posTr, det) } };
    }),

  // ---------------------------------------------------------------
  // REMOVE ROW
  // ---------------------------------------------------------------
  removeRow: (detId) =>
    set((s) => {
      if (!s.model) return s;
      const posTr = s.model.posTr;
      const det = posTr.posTrDets.filter((d) => d.id !== detId);
      return { model: { ...s.model, posTr: withAmounts(posTr, det) } };
    }),

  clearSeva: (itMastID, slotID) =>
    set((s) => {
      if (!s.model) return s;
      const posTr = s.model.posTr;
      const det = posTr.posTrDets.filter(
        (d) => !(d.itMastID === itMastID && d.SevaSlotID === slotID),
      );
      return { model: { ...s.model, posTr: withAmounts(posTr, det) } };
    }),

  // ---------------------------------------------------------------
  // SET DEVOTEE (sankalpam)
  // ---------------------------------------------------------------
  setDevotee: (detId, devotee) =>
    set((s) => {
      if (!s.model) return s;
      const posTr = s.model.posTr;
      const det = posTr.posTrDets.map((d) =>
        d.id === detId ? { ...d, ...devotee } : d,
      );
      return { model: { ...s.model, posTr: { ...posTr, posTrDets: det } } };
    }),

  // ---------------------------------------------------------------
  // SUBMIT (InitTransaction)
  // ---------------------------------------------------------------
  submitOrder: async (party) => {
    const state = get();
    const model = state.model;

    if (!model) return { ok: false, reason: "no-model" };
    if (model.posTr.posTrDets.length === 0)
      return { ok: false, reason: "empty" };

    const temple = useTempleStore.getState().selected;

    const toSend: POSTranModel = {
      ...model,
      posTr: {
        ...model.posTr,
        locId: temple?.locId ?? "",
        secId: temple?.secId ?? "",
        phId: temple?.phId ?? "",
        extPartyId: party.extPartyId,
        partyName: party.partyName,
        mobile: party.mobile,
        email: party.email,
        posTrPays: [
          {
            id: `${model.posTr.id}_1`,
            posTrId: model.posTr.id,
            entryAmt: model.posTr.entryNetAmt,
            payCode: "L",
          },
        ],
      },
    };

    set({ submitting: true });

    // STEP 1 — Place the order (InitTransaction). Saves it server-side.
    let init;
    try {
      init = await placeOrder(toSend);
    } catch (error) {
      set({ submitting: false });
      return { ok: false, reason: "error", error };
    }

    // Order is saved. Clear the cart NOW so this id can never be reused.
    // The SevaContent effect auto re-inits a fresh model.
    get().clearOrder();

    // STEP 2 — Attempt payment for the saved order.
    try {
      const paymentResult = await payForOrder(init);
      set({ submitting: false });

      const paid = paymentResult.result.paymentStatus === 1;
      return { ok: true, paid, data: paymentResult.result };
    } catch {
      // Order IS placed (pending). Payment failed/cancelled → retry from My Sevas.
      set({ submitting: false });
      return { ok: true, paid: false, data: null, paymentPending: true };
    }
  },

  clearOrder: () =>
    set({
      model: null,
      detSeq: 0,
      worshipDate: "",
      display: {},
    }),
}));

// ---------------------------------------------------------------
// Helper
// ---------------------------------------------------------------
function buildDetRow(
  posTrId: string,
  seq: number,
  seva: Seva,
  SevaSlotID: string,
  sevaDt: string,
  rate: number,
): PosTrDet {
  return {
    id: `${posTrId}_${seq}`,
    posTrId,
    itMastID: seva.itMastId,
    entryQty: 1,
    entryRate: rate,
    entryAmt: rate * 1,
    sevaDt,
    SevaSlotID: SevaSlotID,
    devoteeName: "",
    ras: "",
    nak: "",
    got: "",
    mobile: "",
    eMail: "",
  };
}

// ---------------------------------------------------------------
// Selector hooks
// ---------------------------------------------------------------
export const useOrderCount = () =>
  useOrderStore((s) =>
    s.model ? s.model.posTr.posTrDets.reduce((n, d) => n + d.entryQty, 0) : 0,
  );

export const useOrderTotal = () =>
  useOrderStore((s) => s.model?.posTr.entryNetAmt ?? 0);

export const useOrderRows = () =>
  useOrderStore((s) => s.model?.posTr.posTrDets ?? EMPTY_ROWS);

export const useOrderReady = () => useOrderStore((s) => s.model !== null);

export const useOrderSubmitting = () => useOrderStore((s) => s.submitting);

export const useSevaQuantity = (itMastID: string, SevaSlotID: string) =>
  useOrderStore((s) => {
    if (!s.model) return 0;
    return s.model.posTr.posTrDets
      .filter(
        (d) => d.itMastID === itMastID && d.SevaSlotID === (SevaSlotID ?? ""),
      )
      .reduce((n, d) => n + d.entryQty, 0);
  });
