import { apiRequest } from './apiClient'

export interface TempleSummary { id: string; name: string; location: string; description?: string; imageUrl?: string }
export interface SevaSummary { id: string; templeId: string; name: string; description?: string; price: number; maxQuantity?: number; requiresDevoteeDetails?: boolean }
export interface AvailabilityDate { date: string; label?: string; available: boolean }
export interface AvailabilitySlot { id: string; name: string; available: boolean }
export interface BookingReceipt { bookingId: string; templeName: string; sevaName: string; paymentStatus: 'pending' | 'paid' | 'failed'; qrPayload?: string }

export const templeSevaApi = {
  // These paths mirror the mobile application's known contracts. Request bodies
  // should be completed with the backend's exact DTOs before production wiring.
  searchTemples: (body: unknown) => apiRequest<TempleSummary[]>('/digiorg/GetDigiOrgList', { method: 'POST', body: JSON.stringify(body) }),
  listSevas: (body: unknown) => apiRequest<SevaSummary[]>('/sevaitem/getsevalist', { method: 'POST', body: JSON.stringify(body) }),
  getDates: (body: unknown) => apiRequest<AvailabilityDate[]>('/digiorg/GetSevaCalendar', { method: 'POST', body: JSON.stringify(body) }),
  checkAvailability: (body: unknown) => apiRequest<AvailabilitySlot>('/sevaItem/GetSevaAvailability', { method: 'POST', body: JSON.stringify(body) }),
  getBooking: (body: unknown) => apiRequest<BookingReceipt>('/POSTransaction/POSTranList', { method: 'POST', body: JSON.stringify(body) }),
}
