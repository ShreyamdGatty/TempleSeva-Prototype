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

/* ── Sevas (Categorized by Temple) ── */
export const sevas: Seva[] = [
  /* ── 1. Shree Meenakshi Temple (Madurai) ── */
  {
    id: 'meenakshi-abhishekam', templeId: 'meenakshi', name: 'Sundareswarar Abhishekam', price: 501, originalPrice: 601, category: 'pooja',
    image: '/temple-hero.webp',
    description: 'Sacred ceremonial bathing ritual for Lord Sundareswarar with panchamritam.',
    longDescription: 'Priests chant Vedic hymns while the holy Shiva Lingam is consecrated with milk, honey, sandalwood, and sacred waters, bringing peace and purification.',
    requiresDevotee: true, rating: 4.8, reviewCount: 234, popular: true, duration: '45 min',
    maxQuantity: 5,
    availableSlots: ['06:30 AM - Pratah Abhishekam', '09:00 AM - Madhyahna Batch', '05:30 PM - Sandhya Abhishekam'],
    reminder: '🔔 Priest sanctum notification & WhatsApp confirmation 1 hr prior',
    benefits: ['Inner peace', 'Family harmony', 'Spiritual purification', 'Blessed Vibhuti prasadam'],
  },
  {
    id: 'meenakshi-kalyanam', templeId: 'meenakshi', name: 'Meenakshi Thirukalyanam', price: 1501, originalPrice: 1801, category: 'homam',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=700&q=80',
    description: 'Celestial divine wedding ceremony invoking Goddess Meenakshi for marital bliss.',
    longDescription: 'The auspicious celestial wedding of Goddess Meenakshi and Lord Sundareswarar performed with consecrated fire offerings, Mangalyam rituals, and special mantras.',
    requiresDevotee: true, rating: 4.9, reviewCount: 342, popular: true, duration: '90 min',
    maxQuantity: 3,
    availableSlots: ['08:30 AM - Kalyanotsava Batch', '11:00 AM - Auspicious Muhurtham'],
    reminder: '🔔 Sanctum priest calls you with personalized sankalpa recitation',
    benefits: ['Marital happiness', 'Obstacle removal in matrimony', 'Prosperity and longevity'],
  },
  {
    id: 'meenakshi-kumkumarchana', templeId: 'meenakshi', name: 'Golden Kumkumarchana', price: 251, category: 'archana',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80',
    description: 'Vedic Lalitha Sahasranama chanting with vermillion petal offerings.',
    longDescription: 'Direct devotional archana where your name and gotra are recited at the sanctum sanctorum of Mother Meenakshi with energized kumkum.',
    requiresDevotee: true, rating: 4.7, reviewCount: 189, popular: true, duration: '20 min',
    maxQuantity: 5,
    availableSlots: ['07:30 AM - Morning Batch', '10:00 AM - Nitya Archana', '06:00 PM - Sandhya Archana'],
    reminder: '🔔 Sacred vermillion prasadam dispatched immediately after archana',
    benefits: ['Goddess grace', 'Protection from evil eyes', 'Sacred kumkum prasadam'],
  },
  {
    id: 'meenakshi-deepam', templeId: 'meenakshi', name: 'Nitya Deepa Alankara', price: 351, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80',
    description: 'Offering of 108 illuminated brass ghee lamps at the golden shrine.',
    longDescription: 'The divine corridors and sanctum are illuminated with pure cow ghee lamps symbolising the removal of darkness and ignorance from your home.',
    requiresDevotee: false, rating: 4.6, reviewCount: 156, popular: false, duration: '30 min',
    maxQuantity: 5,
    availableSlots: ['06:00 PM - Sayam Deepotsava', '07:30 PM - Nitya Deeparadhane'],
    reminder: '🔔 High-definition photo of lit lamps sent to your WhatsApp',
    benefits: ['Removes negativity', 'Illumination of life and career', 'Auspicious merit'],
  },

  /* ── 2. Sri Venkateswara Swamy (Tirupati) ── */
  {
    id: 'tirupati-suprabhatam', templeId: 'venkateswara', name: 'Suprabhatha Seva', price: 501, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=85',
    description: 'Auspicious dawn hymn awakening ritual for Lord Venkateswara.',
    longDescription: 'The first ritual of the day conducted in the holy sanctum of Tirumala invoking the blessings of the Lord of the Seven Hills with sacred Vedic hymns.',
    requiresDevotee: true, rating: 4.9, reviewCount: 512, popular: true, duration: '40 min',
    maxQuantity: 4,
    availableSlots: ['03:00 AM - Brahma Muhurtham', '04:30 AM - Usha Kala Seva'],
    reminder: '🔔 Special alarm notification and live priest sankalpa SMS at 2:30 AM',
    benefits: ['Supreme spiritual awakening', 'Prosperity in endeavors', 'Lord Balaji direct grace'],
  },
  {
    id: 'tirupati-kalyanotsavam', templeId: 'venkateswara', name: 'Srinivasa Kalyanotsavam', price: 2501, originalPrice: 3001, category: 'special',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80',
    description: 'Grand celestial marriage of Lord Venkateswara with Sridevi and Bhudevi.',
    longDescription: 'One of the most magnificent sevas in Tirumala celebrating the eternal wedding of the Lord with Vedic priests, mangala vadhyam, and vastra samarpana.',
    requiresDevotee: true, rating: 5.0, reviewCount: 620, popular: true, duration: '120 min',
    maxQuantity: 2,
    availableSlots: ['10:30 AM - Kalyanotsava Mandapam', '02:00 PM - Vishesha Kalyanam'],
    reminder: '🔔 Authentic Tirupati laddu prasadam and sacred angavastram delivered',
    benefits: ['Lifelong family protection', 'Marital bonding', 'Abundance and wealth'],
  },
  {
    id: 'tirupati-thomala', templeId: 'venkateswara', name: 'Thomala Garland Seva', price: 751, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=700&q=80',
    description: 'Adorning the Lord with fragrant tulasi and flower garlands.',
    longDescription: 'Pristine flower and tulasi garlands are draped over the sacred deity while priests recite sacred Tamil and Sanskrit pasurams.',
    requiresDevotee: true, rating: 4.8, reviewCount: 290, popular: false, duration: '30 min',
    maxQuantity: 5,
    availableSlots: ['05:30 AM - Morning Thomala', '06:30 PM - Sandhya Thomala'],
    reminder: '🔔 Consecrated dry flower petal blessings included in prasadam',
    benefits: ['Tulasi healing merit', 'Mental peace', 'Divine favor of Lord Balaji'],
  },
  {
    id: 'tirupati-annadanam', templeId: 'venkateswara', name: 'Nitya Anna Prasada Seva', price: 1001, category: 'special',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80',
    description: 'Sponsor sacred mid-day meals for hungry pilgrims at the hill shrine.',
    longDescription: 'Feeding devotees is the highest form of worship at Tirumala. Your contribution provides warm, nutritious, satvik prasadam meals to visiting devotees.',
    requiresDevotee: false, rating: 4.9, reviewCount: 450, popular: true, duration: 'Whole Day',
    maxQuantity: 5,
    availableSlots: ['11:30 AM - Anna Prasada Santharpana', '06:30 PM - Nitya Bhojana Seva'],
    reminder: '🔔 Official donor merit receipt and tax exemption certificate sent',
    benefits: ['Immense karmic merit', 'Removal of ancestral doshas', 'Joy of anna daana'],
  },

  /* ── 3. Kashi Vishwanath (Varanasi) ── */
  {
    id: 'kashi-mangala', templeId: 'kashi', name: 'Mangala Aarti Darshan', price: 501, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85',
    description: 'First sacred dawn aarti at the golden spire sanctum of Baba Kashi Vishwanath.',
    longDescription: 'Conducted at 3:00 AM before dawn with resonating damru beats, shankha naada, and sacred camphor lamps for the eternal Lord of Kashi.',
    requiresDevotee: true, rating: 4.9, reviewCount: 310, popular: true, duration: '60 min',
    maxQuantity: 4,
    availableSlots: ['03:00 AM - Brahma Muhurtha Mangala Aarti', '04:15 AM - Pratah Darshan'],
    reminder: '🔔 Live audio stream link and early morning wake-up reminder sent',
    benefits: ['Direct darshan merit', 'Liberation from birth cycle', 'Kashi teertha blessings'],
  },
  {
    id: 'kashi-rudrabhisheka', templeId: 'kashi', name: 'Ganga Theertha Rudrabhisheka', price: 1001, category: 'pooja',
    image: '/temple-hero.webp',
    description: 'Abhishekam with pure holy Ganga water, milk, and Sri Rudram Vedic recitation.',
    longDescription: 'Special priests carry fresh holy waters of mother Ganga directly to the Jyotirlinga, performing continuous panchamrita abhishekam with fresh bilva leaves.',
    requiresDevotee: true, rating: 5.0, reviewCount: 420, popular: true, duration: '75 min',
    maxQuantity: 3,
    availableSlots: ['06:30 AM - Pratah Rudrabhisheka', '09:30 AM - Mahanyasa Rudra', '05:00 PM - Sandhya Rudra'],
    reminder: '🔔 Sanctum priest recites your gotra while pouring Ganga theertham',
    benefits: ['Profound disease healing', 'Karma resolution', 'Mental serenity'],
  },
  {
    id: 'kashi-shringar-bhog', templeId: 'kashi', name: 'Shringar & Madhyahna Bhog Aarti', price: 651, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=700&q=80',
    description: 'Sacred adornment of the Jyotirlinga with chandan, flowers, and midday rajbhog.',
    longDescription: 'The sacred Jyotirlinga is embellished with fragrant sandalwood paste, belpatra, and floral crowns followed by the divine royal noon bhog offering.',
    requiresDevotee: true, rating: 4.8, reviewCount: 198, popular: true, duration: '45 min',
    maxQuantity: 4,
    availableSlots: ['11:15 AM - Madhyahna Shringar Bhog', '12:30 PM - Rajbhog Samarpan'],
    reminder: '🔔 Auspicious photo blessing of decorated sanctum delivered to your WhatsApp',
    benefits: ['Abundance and prosperity', 'Fulfillment of genuine prayers', 'Lord Shiva benevolence'],
  },
  {
    id: 'kashi-saptarishi', templeId: 'kashi', name: 'Sapta Rishi Sandhya Aarti', price: 751, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80',
    description: 'Ancient evening aarti conducted simultaneously by seven revered Vedic archakas.',
    longDescription: 'Seven traditional priest lineages simultaneously conduct deeparadhana representing the eternal Sapta Rishis, filling the sanctum with spiritual resonance.',
    requiresDevotee: true, rating: 4.9, reviewCount: 265, popular: true, duration: '60 min',
    maxQuantity: 4,
    availableSlots: ['07:00 PM - Prathama Sapta Rishi Batch', '08:00 PM - Dvitiya Batch'],
    reminder: '🔔 Consecrated dry flower petals and vibhuti dispatched to your home',
    benefits: ['Harmony and protection', 'Relief from planetary afflictions', 'Spiritual elevation'],
  },
  {
    id: 'kashi-shayana-aarti', templeId: 'kashi', name: 'Ratri Shayana Aarti Darshan', price: 351, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85',
    description: 'Serene night closing ritual where sacred lullabies and hymns are sung.',
    longDescription: 'The day concludes peacefully as Lord Shiva and Goddess Parvati are adorned with night garlands accompanied by gentle veena and flute chants.',
    requiresDevotee: false, rating: 4.7, reviewCount: 142, popular: false, duration: '35 min',
    maxQuantity: 5,
    availableSlots: ['10:30 PM - Ratri Shayana Aarti', '11:00 PM - Antima Darshana'],
    reminder: '🔔 Auspicious night mantra notification and peaceful sleep blessings',
    benefits: ['Peaceful sleep and calmness', 'Overcoming anxiety', 'Subtle spiritual healing'],
  },
  {
    id: 'kashi-mrityunjaya', templeId: 'kashi', name: 'Maha Mrityunjaya Homam', price: 2101, originalPrice: 2501, category: 'homam',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=700&q=80',
    description: 'Powerful fire sacrifice invoking Lord Shiva for longevity, health, and vitality.',
    longDescription: 'Sacred offerings made into the consecrated sacrificial fire with continuous chanting of the Tryambakam Maha Mantra by trained Vedic scholars in Kashi.',
    requiresDevotee: true, rating: 4.9, reviewCount: 215, popular: true, duration: '120 min',
    maxQuantity: 2,
    availableSlots: ['07:00 AM - Ayushya Homam', '10:00 AM - Mahamrityunjaya Purna Ahuti'],
    reminder: '🔔 Energized silver protective coin and homa bhasma dispatched to you',
    benefits: ['Longevity and health', 'Overcomes fears and accidents', 'Life vitality'],
  },
  {
    id: 'kashi-laghu-rudra', templeId: 'kashi', name: 'Laghu Rudra Ekadasani Anushthan', price: 3101, originalPrice: 3501, category: 'homam',
    image: '/temple-hero.webp',
    description: 'Grand 11-fold Sri Rudram chanting with sacred havan for deep karmic purification.',
    longDescription: 'A profound Vedic ceremony comprising eleven recitations of the sacred Namakam and Chamakam followed by eleven offering rounds in the sanctified homa kunda.',
    requiresDevotee: true, rating: 5.0, reviewCount: 175, popular: true, duration: '150 min',
    maxQuantity: 2,
    availableSlots: ['08:00 AM - Ekadasa Rudra Japa & Homa', '02:00 PM - Purna Ahuti Batch'],
    reminder: '🔔 Blessed Rudraksha bead consecrated in the yajna sent to your doorstep',
    benefits: ['Dissolution of past karmic burdens', 'Protection for entire family', 'Spiritual empowerment'],
  },
  {
    id: 'kashi-bilva-sahasranama', templeId: 'kashi', name: 'Bilva Patra Sahasranama Archana', price: 451, category: 'archana',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=700&q=80',
    description: 'Offering 1,008 fresh sacred bilva leaves with 1,000 holy names of Lord Shiva.',
    longDescription: 'Priests chant the Shiva Sahasranamavali while placing consecrated, unblemished trifoliate bilva patras directly on the Jyotirlinga for your sankalpa.',
    requiresDevotee: true, rating: 4.8, reviewCount: 220, popular: true, duration: '40 min',
    maxQuantity: 5,
    availableSlots: ['08:30 AM - Pratah Sahasranama', '11:00 AM - Madhyahna Batch', '05:30 PM - Sandhya Archana'],
    reminder: '🔔 Pure sacred vibhuti and bilva leaf prasadam sent via express courier',
    benefits: ['Fulfillment of desires', 'Ancestral peace', 'Divine grace of Vishwanath'],
  },
  {
    id: 'kashi-mokshadeepa', templeId: 'kashi', name: 'Moksha Deepa at Dashashwamedh Ghat', price: 401, category: 'special',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80',
    description: 'Floating sacred brass earthen lamps upon the holy flowing waters of Ganga.',
    longDescription: 'Priests light consecrated oil lamps at Dashashwamedh Ghat at twilight, offering prayers for the peace and spiritual upliftment of your family lineage.',
    requiresDevotee: false, rating: 4.7, reviewCount: 180, popular: false, duration: '30 min',
    maxQuantity: 5,
    availableSlots: ['06:00 PM - Ganga Aarti Sunset', '07:30 PM - Sandhya Deepotsava'],
    reminder: '🔔 Video snippet of your floating lamp sent directly to your phone',
    benefits: ['Peace for ancestors', 'Spiritual tranquility', 'Divine mother Ganga blessings'],
  },
  {
    id: 'kashi-annadanam', templeId: 'kashi', name: 'Kashi Vishwanath Nitya Anna Daan Seva', price: 1101, category: 'special',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85',
    description: 'Sponsor pure satvik meals for hungry pilgrims, sadhus, and ascetics across Varanasi.',
    longDescription: 'In the sacred city of Lord Vishwanath, feeding seekers and sadhus is considered the greatest charity. Your offering provides warm meals and sweet kheer.',
    requiresDevotee: false, rating: 4.9, reviewCount: 388, popular: true, duration: 'Whole Day',
    maxQuantity: 5,
    availableSlots: ['11:30 AM - Sadhu Sant Bhojanam', '06:30 PM - Nitya Bhiksha Santharpana'],
    reminder: '🔔 Certificate of donation and prasadam packet dispatched to your address',
    benefits: ['Inestimable punya merit', 'Removal of ancestral debt', 'Joy of anna daana'],
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
