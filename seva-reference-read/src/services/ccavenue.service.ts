import { CCAvenueOrder, CCAvenueSDK } from "ccavenue-india-sdk-react-native";

import {
  confirmPayment,
  initTransaction,
} from "../features/checkout/services/order.service";

import {
  PaymentResponse,
  PaymentStatusResponse,
  POSTranModel,
} from "../features/checkout/types/order.types";

// CCAvenue init data returned by InitTransaction.
export interface PlaceOrderResult {
  extId: string;
  accessCode: string;
  encRequest: string;
}

export interface CCAvenuePaymentResult {
  extId: string;
  result: PaymentStatusResponse;
}

/**
 * STEP 1 — Place the order.
 * InitTransaction saves the order server-side and returns
 * the CCAvenue initialization data.
 */
export async function placeOrder(
  model: POSTranModel,
): Promise<PlaceOrderResult> {
  const response = await initTransaction(model);

  if (!response.valid) {
    throw new Error("CCAvenue transaction initialization failed");
  }

  if (!response.accessCode) {
    throw new Error("CCAvenue access code is missing");
  }

  if (!response.encRequest) {
    throw new Error("CCAvenue encrypted request is missing");
  }

  return {
    extId: String(response.extId),
    accessCode: response.accessCode,
    encRequest: response.encRequest,
  };
}

/**
 * Parse the native callback string or JSON response.
 */
function parseSdkResponse(sdkResult: unknown): Record<string, unknown> {
  if (sdkResult && typeof sdkResult === "object") {
    return sdkResult as Record<string, unknown>;
  }

  if (typeof sdkResult !== "string") {
    throw new Error("CCAvenue SDK returned no usable response.");
  }

  const callback = sdkResult.trim();

  // First, support a JSON-formatted response.
  try {
    const parsed: unknown = JSON.parse(callback);

    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Continue to parse the native Kotlin callback format.
  }

  // Example:
  // CCAvenueResponseCallback(
  //   statusCode=0,
  //   statusMessage=Success,
  //   data=OrderStatus(
  //     orderStatus=Success,
  //     accessCode=...,
  //     encResponse=...
  //   )
  // )

  const statusCodeMatch = callback.match(/\bstatusCode\s*=\s*(\d+)/);
  const statusMessageMatch = callback.match(/\bstatusMessage\s*=\s*([^,)]*)/);
  const orderStatusMatch = callback.match(/\borderStatus\s*=\s*([^,)]*)/);
  const encResponseMatch = callback.match(/\bencResponse\s*=\s*([a-fA-F0-9]+)/);

  if (!statusCodeMatch) {
    throw new Error("Could not parse the CCAvenue SDK callback status.");
  }

  return {
    statusCode: Number(statusCodeMatch[1]),
    statusMessage: statusMessageMatch?.[1]?.trim() ?? "",
    orderStatus: orderStatusMatch?.[1]?.trim() ?? "",
    encResponse: encResponseMatch?.[1] ?? "",
  };
}

/**
 * STEP 2 — Pay for an already-placed order.
 * Opens the CCAvenue SDK and confirms the response with the backend.
 */
export async function payForOrder(
  init: PlaceOrderResult,
): Promise<CCAvenuePaymentResult> {
  const paymentEnvironment =
    process.env.EXPO_PUBLIC_CCAVENUE_ENV === "production"
      ? "production"
      : "uat";

  const order = new CCAvenueOrder({
    accessCode: init.accessCode,
    encRequest: init.encRequest,
    paymentEnvironment,
    encryptionMode: "aes128",
    appColor: "#1F46BD",
    fontColor: "#FFFFFF",
  });

  const sdkResult: unknown = await new CCAvenueSDK().initTransaction(order);

  // Avoid logging the complete encrypted response.
  const parsed = parseSdkResponse(sdkResult);

  const statusCode = Number(parsed.statusCode ?? -1);
  const statusMessage = String(parsed.statusMessage ?? "");

  // Failed SDK callbacks must never reach ConfirmPayment.
  if (statusCode !== 0) {
    throw new Error(
      `CCAvenue SDK failed (${statusCode}): ${
        statusMessage || "Unknown SDK error"
      }`,
    );
  }

  const encResponse =
    typeof parsed.encResponse === "string" ? parsed.encResponse.trim() : "";

  if (!encResponse) {
    throw new Error(
      "CCAvenue SDK reported success but returned no encrypted response. ConfirmPayment was skipped.",
    );
  }

  const paymentResponse: PaymentResponse = {
    statusCode,
    statusMessage,
    orderStatus: String(parsed.orderStatus ?? ""),
    encResponse,
  };

  const confirmed = await confirmPayment(paymentResponse);

  return {
    extId: init.extId,
    result: confirmed,
  };
}
