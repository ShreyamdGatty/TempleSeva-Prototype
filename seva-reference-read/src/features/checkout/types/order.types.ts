export interface PosTrDet {
  id: string;
  posTrId: string;
  itMastID: string;
  entryQty: number;
  entryRate: number;
  entryAmt: number;
  sevaDt: string; // "YYYY-MM-DD" (DateOnly)
  SevaSlotID: string;
  devoteeName: string; // devotee name (was sanName)
  ras: string;
  nak: string;
  got: string;
  mobile: string; // per-devotee (empty for now)
  eMail: string; // per-devotee (empty for now)
}
export interface InitTransactionResponse {
  valid: boolean;
  extId: string;
  encRequest: string;
  accessCode: string;
}
export interface PosTrPay {
  id: string;
  posTrId: string;
  entryAmt: number;
  payCode: string;
}

export interface PosTr {
  id: string;
  dt: string;
  locId: string;
  secId: string;
  phId: string;
  extPartyId: string;
  bilNo: string;
  partyName: string;
  mobile: string;
  email: string;
  entryGrossAmt: number;
  entryDiscAmt: number;
  entryRoundAmt: number;
  entryNetAmt: number;
  sdId: string;
  posTrDets: PosTrDet[];
  posTrPays: PosTrPay[];
}

export interface POSTranModel {
  digiOrgId: string;
  posTr: PosTr;
}

export interface SevaAvailabilityRequest {
  sevaDate: string; // "YYYY-MM-DD"
  itMastId: string;
  slotId: string;
  entryQty: number;
}

export interface SevaAvailabilityResponse {
  canBook: boolean;
  availabilityStatus: string;
}

export interface PaymentResponse {
  statusCode: number;
  statusMessage: string;
  orderStatus: string;
  encResponse: string;
}

export interface PaymentStatusResponse {
  id: string;
  dt: string;
  billNo: string;
  orderStatus: number;
  qrCodeText: string;
  paymentStatus: number;
  entryNetAmt: number;
  posTranDetItems: PaymentStatusDetItem[];
}

export interface PaymentStatusDetItem {
  id: string;
  posTranId: string;
  sevaName: string;
  devoteeName: string;
  qty: number;
  entryAmt: number;
  sevaDt: string;
  ras: string;
  nak: string;
  got: string;
  slotName: string | null;
}
