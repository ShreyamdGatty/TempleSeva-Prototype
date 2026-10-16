export interface POSTranListRequest {
  LastId: string;
  PageSize: number;
  IsCountNeed: boolean;
  ExtPartyId: string;
}

export interface POSTranListResponse {
  total: number;
  posTranListItems: POSTranListItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface POSTranListItem {
  id: string;
  billNo: string;
  dt: string;
  entryNetAmt: number;
  orderStatus: number;
  paymentStatus: number;
  qrCodeText: string;
  posTranDetItems: POSTranDetItem[];
}

export interface POSTranDetItem {
  id: string;
  posTranId: string;
  sevaName: string;
  devoteeName: string;
  qty: number;
  entryAmt: number;
  sevaDt: string;
  slotName: string | null;
  ras: string;
  nak: string;
  got: string;
}

export interface RetryPaymentRequestResponse {
  valid: boolean;
  extId: string;
  encRequest: string;
  accessCode: string;
}
