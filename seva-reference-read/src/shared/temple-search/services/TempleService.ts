import { http } from "@/src/framework/network";
import {
  DigiOrgSearchRequest,
  DigiorgSearchResponse,
} from "../types/digiorg.types";

export async function searchDigiOrgs(
  request: DigiOrgSearchRequest,
  signal?: AbortSignal,
): Promise<DigiorgSearchResponse> {
  return http.post<DigiorgSearchResponse>("/digiorg/GetDigiOrgList", request, {
    signal,
    skipTenant: true,
  });
}

//ShrineList
export async function getShrineList(signal?: AbortSignal): Promise<string[]> {
  return http.get<string[]>("/digiorg/GetShrineList", { signal,skipTenant: true, });
}
