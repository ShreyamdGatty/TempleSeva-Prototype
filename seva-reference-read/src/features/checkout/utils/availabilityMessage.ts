// Maps backend AvailabilityStatus codes to friendly user messages.
const DEFAULT_MESSAGE = "This seva isn't available for the selected date/slot.";

const STATUS_MESSAGES: Record<string, string> = {
  AVAILABLE: "Available",
  WAITING_LIST: "Only waiting list available for this slot.",
  FULL: "Sold out for this slot.",
  QUOTA_CLOSED: "Booking quota is closed for this seva.",
  NOT_OPEN: "Booking hasn't opened yet for this date.",
  BOOKING_CLOSED: "Booking is closed for this date.",
  UNAVAILABLE: DEFAULT_MESSAGE,
};

export function availabilityMessage(status: string): string {
  return STATUS_MESSAGES[status] ?? DEFAULT_MESSAGE;
}