import { http } from "@/src/framework/network";
import {
  InitTransactionResponse,
  PaymentResponse,
  PaymentStatusResponse,
  POSTranModel,
  SevaAvailabilityRequest,
  SevaAvailabilityResponse,
} from "../types/order.types";

export function getModel(signal?: AbortSignal): Promise<POSTranModel> {
  return http.get<POSTranModel>("POSTransaction/GetModel", { signal });
}

export function getSevaAvailability(
  request: SevaAvailabilityRequest,
  signal?: AbortSignal,
): Promise<SevaAvailabilityResponse> {
  return http.post<SevaAvailabilityResponse>(
    "sevaItem/GetSevaAvailability",
    request,
    { signal },
  );
}

export async function initTransaction(
  model: POSTranModel,
  signal?: AbortSignal,
): Promise<InitTransactionResponse> {
  const response = await http.post<InitTransactionResponse>(
    "POSTransaction/InitTransaction",
    model,
    {
      signal,
    },
  );

  return response;
}

export async function confirmPayment(
  response: PaymentResponse,
  signal?: AbortSignal,
): Promise<PaymentStatusResponse> {
  const result = await http.post<PaymentStatusResponse>(
    "POSTransaction/ConfirmPayment",
    response,
    { signal },
  );

  return result;
}
