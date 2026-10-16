export interface DigiOrgSearchRequest {
  lastId: string | null;
  pageSize: number;
  orgName: string;
  shrine: string;
}
export interface DigiorgSearchItem {
  id: string;
  sdId: string;  
  orgName: string;
  add1: string;
  add2: string;
  add3: string;
  post: string;
  shrine: string;
   locId: string;   
  secId: string;   
  phId: string;
  templeImg: string;
}
export interface DigiorgSearchResponse {
  digiOrgSearchItems: DigiorgSearchItem[];
  hasMore: boolean;
  nextCursor: string | null;
}
