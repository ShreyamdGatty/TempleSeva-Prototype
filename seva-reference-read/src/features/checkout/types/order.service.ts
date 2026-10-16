import { http } from "@/src/framework/network";
import {
    POSTranModel,
    SevaAvailabilityRequest,
} from "../types/order.types";

/**
 * Fetches a blank order model (POSTranModel) for the current temple.
 * Tenant (temple) travels via headers, so no body/params needed.
 * Call this when an order starts AND whenever the temple changes.
 */
export function getModel(signal?: AbortSignal): Promise<POSTranModel> {
  return http.get<POSTranModel>("POSTransaction/GetModel", { signal });
}

/**
 * Checks whether a seva can be booked for the given date + slot.
 * Returns true (can book) or false (not available).
 * Called before every add / increment.
 */
export function getSevaAvailability(
  request: SevaAvailabilityRequest,
  signal?: AbortSignal,
): Promise<boolean> {
  return http.post<boolean>("sevaItem/GetSevaAvailability", request, { signal });
}