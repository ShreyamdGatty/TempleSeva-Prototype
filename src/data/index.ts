import type { Temple, Seva, Review, Coupon } from '../types'

/* ── Storage keys ── */
export const STORAGE_USER = 'temple-seva.credentials'
export const STORAGE_SESSION = 'temple-seva.session'
export const STORAGE_ORDERS = 'temple-seva.orders'
export const STORAGE_WISHLIST = 'temple-seva.wishlist'
export const STORAGE_ADDRESSES = 'temple-seva.addresses'
export const STORAGE_DEVOTEES = 'temple-seva.devotees'
export const STORAGE_RECENT = 'temple-seva.recent'
export const STORAGE_TEMPLE = 'temple-seva.selectedTemple'

/* ── Temples ── */
export const temples: Temple[] = [
  { id: 'meenakshi', name: 'Shree Meenakshi Temple', location: 'Madurai, Tamil Nadu', image: '/temple-hero.webp', description: 'A timeless home of devotion, music, and living tradition.' },
  { id: 'venkateswara', name: 'Sri Venkateswara Swamy', location: 'Tirupati, Andhra Pradesh', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=85', description: 'A beloved sacred place for prayer and service.' },
  { id: 'kashi', name: 'Kashi Vishwanath', location: 'Varanasi, Uttar Pradesh', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85', description: 'Find a moment of stillness beside the sacred Ganga.' },
]

/* ── Sevas ── */
export const sevas: Seva[] = [
  {
    id: 'abhishekam', name: 'Abhishekam', price: 501, originalPrice: 601, category: 'pooja',
    image: '/temple-hero.webp',
    description: 'A sacred bathing ritual with traditional offerings.',
    longDescription: 'The deity is ceremonially bathed with sacred substances — milk, honey, curd, ghee, sandalwood paste, and holy water — while Vedic mantras are chanted by trained priests. This ancient ritual purifies the devotee and bestows divine blessings.',
    requiresDevotee: true, rating: 4.8, reviewCount: 234, popular: true, duration: '45 min',
    benefits: ['Spiritual purification', 'Removal of negative energy', 'Divine blessings for family', 'Prasadam included'],
  },
  {
    id: 'archana', name: 'Archana', price: 251, category: 'archana',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=700&q=80',
    description: 'A personal offering made with your family name.',
    longDescription: 'Archana is a deeply personal form of worship where the priest chants the divine names while offering flowers at the feet of the deity. Your name, nakshatra, and gotram are recited, creating a direct spiritual connection.',
    requiresDevotee: true, rating: 4.6, reviewCount: 189, popular: true, duration: '20 min',
    benefits: ['Personal divine connection', 'Name recitation by priest', 'Fresh flower offering', 'Kumkum prasadam'],
  },
  {
    id: 'sahasranamam', name: 'Sahasranamam', price: 751, originalPrice: 901, category: 'special',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80',
    description: 'A peaceful recitation of the thousand names.',
    longDescription: 'The Sahasranamam is the recitation of a thousand divine names, each representing a unique quality of the deity. This powerful chanting creates a protective spiritual field and brings deep inner peace and clarity.',
    requiresDevotee: false, rating: 4.9, reviewCount: 312, popular: true, duration: '60 min',
    benefits: ['Deep spiritual peace', 'Protection from negativity', 'Mental clarity', 'Community prayer energy'],
  },
  {
    id: 'deepa', name: 'Deepa Alankara', price: 351, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80',
    description: 'An offering of light for peace and blessings.',
    longDescription: 'Deepa Alankara is the decoration of the deity with numerous oil lamps, symbolising the triumph of light over darkness. The warm glow of hundreds of lamps creates a mesmerising atmosphere of devotion.',
    requiresDevotee: false, rating: 4.5, reviewCount: 156, popular: false, duration: '30 min',
    benefits: ['Illumination of mind', 'Peace and tranquility', 'Auspicious merit', 'Beautiful ceremony'],
  },
  {
    id: 'ganapathi-homam', name: 'Ganapathi Homam', price: 1501, category: 'homam',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=700&q=80',
    description: 'A fire ritual to remove obstacles and bring success.',
    longDescription: 'Ganapathi Homam is a sacred fire ceremony dedicated to Lord Ganesha, the remover of obstacles. Sacred offerings of ghee, sesame, and special herbs are offered into the consecrated fire while powerful mantras invoke divine protection.',
    requiresDevotee: true, rating: 4.9, reviewCount: 178, popular: true, duration: '90 min',
    benefits: ['Obstacle removal', 'Success in new ventures', 'Academic excellence', 'Divine protection'],
  },
  {
    id: 'navagraha-homam', name: 'Navagraha Homam', price: 2001, originalPrice: 2501, category: 'homam',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80',
    description: 'A fire ritual to pacify the nine planetary deities.',
    longDescription: 'The Navagraha Homam is performed to appease all nine celestial bodies that influence human destiny. This elaborate fire ceremony uses specific herbs, grains, and mantras for each planet, harmonising their cosmic influence on your life.',
    requiresDevotee: true, rating: 4.7, reviewCount: 143, popular: false, duration: '120 min',
    benefits: ['Planetary harmony', 'Career growth', 'Health improvement', 'Relationship stability'],
  },
  {
    id: 'kumkumarchana', name: 'Kumkum Archana', price: 151, category: 'archana',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80',
    description: 'A beautiful offering using sacred kumkum powder.',
    longDescription: 'Kumkum Archana is an intimate offering where sacred vermillion is used to worship the deity. Each pinch of kumkum represents a divine name, making this a vibrant and visually stunning form of devotion.',
    requiresDevotee: false, rating: 4.4, reviewCount: 98, popular: false, duration: '25 min',
    benefits: ['Goddess blessings', 'Marital harmony', 'Prosperity', 'Sacred kumkum prasadam'],
  },
  {
    id: 'rudra-abhishekam', name: 'Rudra Abhishekam', price: 1001, category: 'special',
    image: '/temple-hero.webp',
    description: 'A grand abhishekam with Sri Rudram chanting.',
    longDescription: 'Rudra Abhishekam is the most powerful form of Shiva worship. The Sri Rudram, one of the oldest Vedic hymns, is chanted while the Shiva Lingam is bathed with panchamritam. This deeply transformative ritual bestows health, wealth, and liberation.',
    requiresDevotee: true, rating: 4.9, reviewCount: 267, popular: true, duration: '75 min',
    benefits: ['Powerful healing energy', 'Karma purification', 'Wealth and prosperity', 'Spiritual liberation'],
  },
]

/* ── Reviews ── */
export const reviews: Review[] = [
  { id: 'r1', sevaId: 'abhishekam', userName: 'Ramesh K.', rating: 5, comment: 'The most divine experience. The priests were very attentive and the entire ritual was performed with utmost devotion. Highly recommended!', date: '2 weeks ago' },
  { id: 'r2', sevaId: 'abhishekam', userName: 'Priya S.', rating: 5, comment: 'Felt a deep sense of peace after the abhishekam. The prasadam was wonderful. Booking process was very smooth.', date: '1 month ago' },
  { id: 'r3', sevaId: 'abhishekam', userName: 'Venkat R.', rating: 4, comment: 'Beautiful ceremony. Wish the slot timings were more flexible, but overall a great experience.', date: '1 month ago' },
  { id: 'r4', sevaId: 'archana', userName: 'Lakshmi N.', rating: 5, comment: 'The priest chanted our names beautifully. Such a personal and touching experience. Will book again.', date: '3 weeks ago' },
  { id: 'r5', sevaId: 'archana', userName: 'Suresh M.', rating: 4, comment: 'Quick and meaningful. The flower offering was lovely. Good value for the price.', date: '2 months ago' },
  { id: 'r6', sevaId: 'sahasranamam', userName: 'Anjali D.', rating: 5, comment: 'Listening to the thousand names being chanted was incredibly powerful. An unforgettable spiritual experience.', date: '1 week ago' },
  { id: 'r7', sevaId: 'sahasranamam', userName: 'Karthik V.', rating: 5, comment: 'The most peaceful hour I have experienced. The collective energy of the chanting was extraordinary.', date: '3 weeks ago' },
  { id: 'r8', sevaId: 'ganapathi-homam', userName: 'Meera J.', rating: 5, comment: 'Booked this before starting my new business. Everything went smoothly. I truly believe in the power of this homam.', date: '2 weeks ago' },
  { id: 'r9', sevaId: 'ganapathi-homam', userName: 'Arun P.', rating: 5, comment: 'The fire ritual was mesmerising. Professional priests, well-organised ceremony. Worth every rupee.', date: '1 month ago' },
  { id: 'r10', sevaId: 'rudra-abhishekam', userName: 'Shiva K.', rating: 5, comment: 'This is the pinnacle of Shiva worship. The Rudram chanting gave me goosebumps. A life-changing experience.', date: '1 week ago' },
  { id: 'r11', sevaId: 'rudra-abhishekam', userName: 'Divya R.', rating: 5, comment: 'Performed this for my father\'s health. The energy was incredible. He is doing much better now. Grateful beyond words.', date: '3 weeks ago' },
  { id: 'r12', sevaId: 'deepa', userName: 'Ganesh B.', rating: 4, comment: 'Beautiful ceremony with hundreds of lamps. The temple looked absolutely magical. Very peaceful.', date: '1 month ago' },
  { id: 'r13', sevaId: 'navagraha-homam', userName: 'Ravi T.', rating: 5, comment: 'Was going through a tough Saturn period. After this homam, things started improving noticeably. Highly recommend.', date: '2 weeks ago' },
  { id: 'r14', sevaId: 'kumkumarchana', userName: 'Padma L.', rating: 4, comment: 'A simple but beautiful offering. The kumkum prasadam was special. Affordable and meaningful.', date: '1 month ago' },
]

/* ── Coupons ── */
export const coupons: Coupon[] = [
  { code: 'FIRSTSEVA', discount: 100, type: 'flat', minAmount: 500, description: '₹100 off on your first booking' },
  { code: 'FIRST50', discount: 50, type: 'flat', minAmount: 200, description: '₹50 off on your first booking' },
  { code: 'SEVA10', discount: 10, type: 'percent', minAmount: 500, description: '10% off on bookings above ₹500' },
  { code: 'SPECIAL10', discount: 10, type: 'percent', minAmount: 1000, description: '10% off on special bookings above ₹1,000' },
  { code: 'DIVINE20', discount: 20, type: 'percent', minAmount: 2500, description: '20% off on divine bookings above ₹2,500' },
  { code: 'FESTIVE20', discount: 20, type: 'percent', minAmount: 1000, description: '20% off on festive bookings above ₹1,000' },
  { code: 'HOMAM15', discount: 15, type: 'percent', minAmount: 1500, description: '15% off on Homam services' },
]

/* ── Categories ── */
export const categories: string[] = ['All', 'pooja', 'homam', 'archana', 'special']

/* ── Static lists ── */
export const categoryLabels: Record<string, string> = {
  all: 'All Sevas',
  pooja: 'Pooja',
  homam: 'Homam',
  archana: 'Archana',
  special: 'Special',
}

export const dates = ['15 Oct', '16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct']

export const nakshatras = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]

export const rashis = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
]

export const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: '◉', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: '▭', description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '⏣', description: 'All major banks supported' },
  { id: 'wallet', label: 'Wallet', icon: '◈', description: 'Paytm, Amazon Pay, Freecharge' },
]

export const defaultAddresses = [
  {
    id: 'addr-1', label: 'Home', name: '', phone: '', line1: '', line2: '',
    city: '', state: '', pincode: '', isDefault: true,
  },
]

/* ── Testimonials for home page ── */
export const testimonials = [
  { name: 'Ramesh K.', location: 'Bangalore', quote: 'Temple Seva made it so easy to book our annual family pooja. The process is smooth and trustworthy.', rating: 5 },
  { name: 'Priya S.', location: 'Chennai', quote: 'Living abroad, I can now participate in temple sevas back home. This platform is a blessing.', rating: 5 },
  { name: 'Venkat R.', location: 'Hyderabad', quote: 'The homam booking was seamless. Received the prasadam right at my doorstep. Wonderful service!', rating: 5 },
]

/* ── Stats for home page ── */
export const stats = [
  { value: '10,000+', label: 'Sevas Completed' },
  { value: '3', label: 'Sacred Temples' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '5,000+', label: 'Happy Devotees' },
]
