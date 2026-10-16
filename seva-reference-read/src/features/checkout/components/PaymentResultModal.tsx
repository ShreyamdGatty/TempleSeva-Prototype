import QRCodeModal, {
  type SevaRecord,
} from "@/src/shared/components/QRCodeModal";
import { useTempleStore } from "@/src/shared/temple/templeStore";

import type { PaymentStatusResponse } from "../types/order.types";

type Props = {
  visible: boolean;
  result: PaymentStatusResponse | null;
  onDone: () => void;
  onClose: () => void;
};

export default function PaymentResultModal({
  visible,
  result,
  onDone,
  onClose,
}: Props) {
  const selectedTemple = useTempleStore((state) => state.selected);

  if (!result?.qrCodeText) {
    return null;
  }

  const firstSeva = result.posTranDetItems?.[0];

  const selectedSeva: SevaRecord = {
    sevaId: result.id,
    devoteeName: firstSeva?.devoteeName ?? "",
    templeName: selectedTemple?.orgName ?? "",
    sevaName: firstSeva?.sevaName ?? "Seva Booking",
    bookingId: result.billNo,
    qrCodeText: result.qrCodeText,
    amount: result.entryNetAmt,
    status: "active",
  };

  return (
    <QRCodeModal
      visible={visible}
      onClose={onClose}
      selectedSeva={selectedSeva}
      sevaRecords={[selectedSeva]}
    />
  );
}
