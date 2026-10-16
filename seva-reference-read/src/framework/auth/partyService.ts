import { http } from "../network";

export interface AspNetParty {
  id: string;
  name: string;
  mobileNo: string;
  eMail?: string | null;
  email?: string | null;
}

export interface AspNetPartyRequest {
  Id: string | number | null;
  Email?: string | null;
  MobileNo: string;
  Name: string;
}

export interface CreatePartyRequest {
  AspNetParty: AspNetPartyRequest;
}

export async function getPartyData(mobileNo: string): Promise<AspNetParty> {
  return http.post<AspNetParty>("/user/getpartydata", {
    MobileNo: mobileNo,
  });
}

export async function postPartyData(
  data: CreatePartyRequest,
): Promise<AspNetParty> {
  return http.post<AspNetParty>("/user/postpartydata", data);
}
