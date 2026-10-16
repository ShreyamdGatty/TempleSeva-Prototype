export interface AspNetPartyDevotee {
  id: string;
  aspNetPartyId: string;
  name: string;
  mobileNo: string;
  email?: string | null;
  ras: string;
  nak: string;
  got: string;
}

export interface PostPartyDevoteeRequest {
  AspNetPartyDevotee: {
    id: string;
    aspNetPartyId: string;
    name: string;
    mobileNo: string;
    email?: string | null;
    ras: string;
    nak: string;
    got: string;
  };
}

export interface DeletePartyDevoteeRequest {
  aspNetPartyId: string;
  aspNetPartyDevoteeId: string;
}
