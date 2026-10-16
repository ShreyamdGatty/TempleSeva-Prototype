export interface GetSevasRequest {
  SevaName: string;
  SevaGroup: string;      
  LastId: string | null;
  PageSize: number;
  IsCountNeed: boolean;
}
export interface SevaSlot {
  id: string;
  slotName: string;
}
export interface Seva {
  itMastId: string;
  sevaName: string;
  rate: number;
  maxQtyPerBill: number;
  itImg?: string | null;
  rem?: string | null;
  sevaSlots?: SevaSlot[];
  sevaGroup?: string | null;
  reqPriest?: number | null;
  reqNak?: number | null;
  reqGothra?: number | null;
  reqMob?: number | null;
  reqSlot?: number | null;
}

export interface GetSevasResponse {
   sevaSearchItems: Seva[];
  hasMore: boolean;
  nextCursor: string | null;
  totalCount?: number | null;
}
export type GetSevaGroupsResponse = string[];
export interface CalendarRequest {
  DigiOrgId: string;
  StartDate: string;
  Count: number;
}

export interface CalendarItem {
  dt: string;
  tithi: string;
  note: string;
}

export interface CalendarResponse {
  calendarItems: CalendarItem[];
}

/**
 * A seva needs per-unit (per-devotee) rows when any of
 * ReqNak / ReqGothra / ReqPriest is set (1 = required).
 */
export function sevaNeedsSankalpam(seva: Seva): boolean {
   return seva.reqNak === 1 || seva.reqGothra === 1;
}

export function getSevaDevoteeRequirements(seva: Seva) {
  return {
    requiresNakshatra: seva.reqNak === 1,

    requiresGothra: seva.reqGothra === 1,
  };
}

export function sevaNeedsDevoteeDetails(seva: Seva): boolean {
  return seva.reqNak === 1 || seva.reqGothra === 1;
}
