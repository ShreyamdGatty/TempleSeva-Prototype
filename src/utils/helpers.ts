/* ── Utility helpers ── */

/** Format a number as Indian Rupees */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Generate a unique order ID */
export function generateOrderId(): string {
  return `TS-${Date.now().toString().slice(-7)}`
}

/** Get initials from a name (max 2 chars) */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Render filled/empty stars for a given rating */
export function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

/** Check password strength: 0 = weak, 1 = fair, 2 = good, 3 = strong */
export function passwordStrength(pw: string): number {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++
  return Math.min(score, 3)
}

export const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
export const strengthColors = ['#d94444', '#e6a23c', '#67c23a', '#28724d']

/** Delay utility for demo animations */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
