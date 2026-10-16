import { http } from "@/src/framework/network";
import {
  CalendarRequest,
  CalendarResponse,
  GetSevaGroupsResponse,
  GetSevasRequest,
  GetSevasResponse,
} from "../types/seva.types";
export async function getSevas(request: GetSevasRequest, signal?: AbortSignal) {
  return http.post<GetSevasResponse>("/sevaitem/getsevalist", request, {
    signal,
  });
}
export async function getSevaGroups(signal?: AbortSignal) {
  return http.get<GetSevaGroupsResponse>("/sevaitem/getsevagroup", {
    signal,
  });
}
export async function getSevaCalendar(
  request: CalendarRequest,
  signal?: AbortSignal,
) {
  return http.post<CalendarResponse>("/digiorg/GetSevaCalendar", request, {
    signal,
  });
}
