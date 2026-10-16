import { http } from "@/src/framework/network/HttpClient";

import type {
    AspNetPartyDevotee,
    DeletePartyDevoteeRequest,
    PostPartyDevoteeRequest,
} from "../types/devotee.types";

export async function postPartyDevotee(
  payload: PostPartyDevoteeRequest,
): Promise<AspNetPartyDevotee> {
  const response = await http.post<AspNetPartyDevotee>(
    "/user/PostPartyDevotee",
    payload,
  );

  return response;
}

export async function getAllPartyDevotees(
  aspNetPartyId: string,
): Promise<AspNetPartyDevotee[]> {
  const response = await http.get<AspNetPartyDevotee[]>(
    `/user/getAllPartyDevotees/${encodeURIComponent(aspNetPartyId)}`,
  );

  return response;
}

export async function deletePartyDevotee(
  payload: DeletePartyDevoteeRequest,
): Promise<boolean> {
  return await http.post<boolean>("/user/DeletePartyDevotee", payload);
}
