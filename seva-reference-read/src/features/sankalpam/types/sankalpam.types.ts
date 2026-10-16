export type FamilyProfile = {
  id: string;
  aspNetPartyId: string;

  fullName: string;
  mobileNo: string;
  email: string | null;

  nakshatra: string;
  rashi: string;
  gotra: string;
};

export type TicketAssignment = {
  ticketId: string;
  cartItemId: string;
  sevaId: string;

  familyProfileId: string | null;

  fullName: string;
  nakshatra: string;
  rashi: string;
  gotra: string;
};

export type SankalpamTicket = {
  ticketId: string;

  cartItemId: string;

  sevaId: string;

  sevaName: string;

  quantityIndex: number;

  worshipDate: string;

  selectedSlot: {
    id: string;
    slotName: string;
  } | null;

  assignment: TicketAssignment | null;
};
