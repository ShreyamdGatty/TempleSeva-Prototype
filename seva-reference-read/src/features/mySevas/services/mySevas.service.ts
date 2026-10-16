import { http } from "@/src/framework/network";
import type { RetryPaymentRequestResponse } from "../types/mySevas.types";
import {
  POSTranListRequest,
  POSTranListResponse,
} from "../types/mySevas.types";

export async function getMySevas(
  payload: POSTranListRequest,
): Promise<POSTranListResponse> {
  const result = await http.post<POSTranListResponse>(
    "/POSTransaction/POSTranList",
    payload,
  );

  return result;
}
export async function cancelTransaction(id: string): Promise<unknown> {
  return http.get(
    `/POSTransaction/CancelTransaction/${encodeURIComponent(id)}`,
  );
}

export async function retryPayment(
  id: string,
): Promise<RetryPaymentRequestResponse> {
  return http.get<RetryPaymentRequestResponse>(
    `/POSTransaction/RetryPayment/${encodeURIComponent(id)}`,
  );
}
