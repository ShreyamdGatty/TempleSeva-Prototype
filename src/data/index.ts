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
  {
    id: 'ananthapura',
    name: 'Ananthapura Lake Temple',
    location: 'Naikapu, Kasaragod',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=85',
    description: 'Ancient 9th-century lake temple and the sacred moolasthana of Lord Ananthapadmanabha Swamy.'
  },
  {
    id: 'udupi-krishna',
    name: 'Sri Krishna Temple',
    location: 'Udupi, Karnataka',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=85',
    description: 'World-renowned holy shrine founded by Jagadguru Sri Madhvacharya.'
  },
  {
    id: 'mangaladevi',
    name: 'Mangaladevi Temple',
    location: 'Attavar, Mangalore, Karnataka',
    image: '/temple-hero.webp',
    description: 'Historic 9th-century sanctum of Goddess Mangaladevi, who gave Mangalore its sacred name.'
  },
  {
    id: 'kateel',
    name: 'Kateel Sri Durgaparameshwari Temple',
    location: 'Kateel, Mangalore, Karnataka',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85',
    description: 'Sacred river island sanctuary situated on the sacred Nandini River.'
  },
  { id: 'meenakshi', name: 'Shree Meenakshi Temple', location: 'Madurai, Tamil Nadu', image: '/temple-hero.webp', description: 'A timeless home of devotion, music, and living tradition.' },
  { id: 'venkateswara', name: 'Sri Venkateswara Swamy', location: 'Tirupati, Andhra Pradesh', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=85', description: 'A beloved sacred place for prayer and service.' },
  { id: 'kashi', name: 'Kashi Vishwanath', location: 'Varanasi, Uttar Pradesh', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85', description: 'Find a moment of stillness beside the sacred Ganga.' },
]

/* ── Sevas (Categorized by Temple) ── */
export const sevas: Seva[] = [
  /* ── 1. Ananthapura Lake Temple (Naikapu, Kasaragod) ── */
  {
    id: 'ananthapura-panchamritha', templeId: 'ananthapura', name: 'Panchamritha Abhishekam', price: 401, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    description: 'Sacred bathing ritual with milk, honey, curd, ghee, and sugar for Lord Anantha.',
    longDescription: 'Priests chant sacred Vedic hymns at the lake sanctum while consecrating the deity with pure panchamritam.',
    requiresDevotee: true, rating: 4.9, reviewCount: 165, popular: true, duration: '40 min',
    maxQuantity: 5,
    availableSlots: ['07:30 AM - Usha Pooja', '10:30 AM - Madhyahna Pooja', '06:00 PM - Sandhya Pooja'],
    reminder: '🔔 Sacred theertham and sandalwood paste dispatched to your home',
    benefits: ['Inner calm', 'Family prosperity', 'Health and spiritual blessings'],
  },
  {
    id: 'ananthapura-sarovara', templeId: 'ananthapura', name: 'Sarovara Pushpanjali & Naivedya', price: 251, category: 'archana',
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional flower archana offered in your gotra beside the sacred lake.',
    longDescription: 'Holy pushpanjali archana performed with fragrant lotus and bilva offerings at the sanctum sanctorum.',
    requiresDevotee: true, rating: 4.8, reviewCount: 120, popular: true, duration: '25 min',
    maxQuantity: 5,
    availableSlots: ['08:00 AM - Morning Batch', '11:00 AM - Noon Batch'],
    reminder: '🔔 Sanctum priest recites your name and gotra with sacred flowers',
    benefits: ['Divine grace', 'Removal of obstacles', 'Protection'],
  },
  {
    id: 'ananthapura-babia-naivedya', templeId: 'ananthapura', name: 'Babia Sarovara Naivedya & Prasada Seva', price: 351, category: 'special',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    description: 'Sacred jaggery payasam and cooked rice naivedyam offered at the holy lake honoring the guardian crocodile Babia.',
    longDescription: 'A revered midday traditional offering consecrated to Lord Ananthapadmanabha and offered across the serene lake waters for prosperity and guardian blessings.',
    requiresDevotee: true, rating: 4.9, reviewCount: 198, popular: true, duration: '30 min',
    maxQuantity: 5,
    availableSlots: ['11:30 AM - Noon Lake Naivedya', '12:30 PM - Maha Prasada Batch'],
    reminder: '🔔 Sanctum jaggery payasam prasadam and sacred vibhuti dispatched to your home',
    benefits: ['Divine protection', 'Family harmony', 'Guardian blessings'],
  },
  {
    id: 'ananthapura-deepotsava', templeId: 'ananthapura', name: 'Sarovara Deepotsava & Sahasra Deepa', price: 501, category: 'special',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'Lighting of 108 traditional sacred brass earthen lamps illuminating the ancient lake sanctuary.',
    longDescription: 'Devotees gotra and names are recited during the divine Sandhya Deeparadhana as the sacred waters mirror hundreds of glowing ghee lamps reflecting Lord Anantha glory.',
    requiresDevotee: true, rating: 4.9, reviewCount: 235, popular: true, duration: '45 min',
    maxQuantity: 5,
    availableSlots: ['06:00 PM - Sandhya Deepotsava', '07:00 PM - Maha Deeparadhana'],
    reminder: '🔔 Sanctum kumkum, pure ghee lamp wicks and sacred theertham dispatched to your home',
    benefits: ['Dispels negative energies', 'Mental clarity and peace', 'Invites prosperity'],
  },
  {
    id: 'ananthapura-sahasranama', templeId: 'ananthapura', name: 'Sri Vishnu Sahasranama & Tulasi Archana', price: 301, category: 'archana',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'Chanting of 1,008 divine names of Lord Vishnu with fresh green Tulasi leaves and fragrant lotus flowers.',
    longDescription: 'The head archaka chants the complete Vishnu Sahasranama at the lake sanctum sanctorum, dedicating holy tulasi blossoms in your family name and nakshatra.',
    requiresDevotee: true, rating: 4.8, reviewCount: 142, popular: false, duration: '35 min',
    maxQuantity: 5,
    availableSlots: ['08:30 AM - Pratah Sahasranama', '10:00 AM - Madhyahna Archana', '05:30 PM - Sandhya Archana'],
    reminder: '🔔 Blessed Tulasi leaves and pure sandalwood paste sent to your doorstep',
    benefits: ['Spiritual elevation', 'Fulfillment of noble wishes', 'Health and vitality'],
  },
  {
    id: 'ananthapura-ksheera-abhishekam', templeId: 'ananthapura', name: 'Ksheera Dhare & Kalasha Snana', price: 751, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
    description: 'Continuous sacred milk bath accompanied by chanting of Purusha Sukta and ancient Vedic hymns.',
    longDescription: 'Panchagavya and pure cow milk from the sacred goshala is poured continuously over the moola vigraha in the lake shrine to bestow long life, purity and peace.',
    requiresDevotee: true, rating: 5.0, reviewCount: 310, popular: true, duration: '45 min',
    maxQuantity: 5,
    availableSlots: ['07:00 AM - Dawn Ksheera Dhare', '09:30 AM - Morning Kalasha Batch'],
    reminder: '🔔 Consecrated silver kalasha theertham and sacred raksha sootram dispatched',
    benefits: ['Physical well-being', 'Longevity', 'Relief from ailments'],
  },
  {
    id: 'ananthapura-maha-homam', templeId: 'ananthapura', name: 'Sarva Kashta Nivarana Maha Homam', price: 1251, category: 'homam',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    description: 'Powerful Vedic sacrificial fire ritual beside the sacred lake to eradicate karmic obstacles and evil eye.',
    longDescription: 'Conducted at the holy Yagashala of Ananthapura Temple with modaka, pure cow ghee, sacred samidhas, and 108 ahutis invoking Lord Maha Ganapathi and Lord Ananthapadmanabha.',
    requiresDevotee: true, rating: 5.0, reviewCount: 185, popular: true, duration: '60 min',
    maxQuantity: 3,
    availableSlots: ['06:30 AM - Brahma Muhurtha Yajna', '09:00 AM - Navagraha Shanti Batch'],
    reminder: '🔔 Sacred homa bhasma (vibhuti), energized raksha thread and sanctum prasadam dispatched to your home',
    benefits: ['Elimination of graha doshas', 'Career and business breakthroughs', 'Triumph over adversities'],
  },

  /* ── 2. Sri Krishna Temple (Udupi) ── */
  {
    id: 'udupi-tulasi', templeId: 'udupi-krishna', name: 'Vishesha Tulasi Archana', price: 251, category: 'archana',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'Offering of 1,008 sacred green Tulasi leaves to Lord Sri Krishna through the silver window.',
    longDescription: 'The Madhva archakas chant the Vishnu Sahasranama while offering freshly harvested holy tulasi leaves to the infant Krishna.',
    requiresDevotee: true, rating: 5.0, reviewCount: 480, popular: true, duration: '30 min',
    maxQuantity: 5,
    availableSlots: ['07:00 AM - Pratah Tulasi Archana', '10:00 AM - Madhyahna Pooja', '05:30 PM - Sandhya Archana'],
    reminder: '🔔 Sanctum tulasi leaves and divine chandan dispatched to your home',
    benefits: ['Spiritual fulfillment', 'Removal of distress', 'Lord Krishna grace'],
  },
  {
    id: 'udupi-maha-pooja', templeId: 'udupi-krishna', name: 'Maha Pooja & Kanakana Kindi Darshana', price: 1001, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'Grand noon offering with 14 traditional items, bell chimes, and special alankara.',
    longDescription: 'The majestic midday Maha Pooja performed according to the strict ritual traditions instituted by Sri Madhvacharya.',
    requiresDevotee: true, rating: 4.9, reviewCount: 390, popular: true, duration: '60 min',
    maxQuantity: 3,
    availableSlots: ['11:30 AM - Madhyahna Maha Pooja'],
    reminder: '🔔 Blessed Panchamrutha and laddu prasadam packet dispatched via express courier',
    benefits: ['Abundance and peace', 'Prosperity in education and career', 'Divine darshana grace'],
  },
  {
    id: 'udupi-annadana', templeId: 'udupi-krishna', name: 'Sri Krishna Nitya Annadana Seva', price: 501, category: 'special',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=800&q=80',
    description: 'Sponsor pure satvik meals (bhojana) for thousands of visiting devotees and seekers in Udupi.',
    longDescription: 'Udupi is hailed as Annabrahma Kshetra where no pilgrim goes hungry. Support the daily mass feeding of devotees.',
    requiresDevotee: false, rating: 5.0, reviewCount: 520, popular: true, duration: 'Whole Day',
    maxQuantity: 5,
    availableSlots: ['12:00 PM - Annabrahma Bhojanam', '07:30 PM - Ratri Prasada Bhojana'],
    reminder: '🔔 Digital donation receipt and sanctified akshata packet delivered to your address',
    benefits: ['Immeasurable merit (punya)', 'Family well-being', 'Purna phala'],
  },

  /* ── 3. Mangaladevi Temple (Attavar, Mangalore) ── */
  {
    id: 'mangaladevi-kumkumarchana', templeId: 'mangaladevi', name: 'Navaratri Vishesha Kumkumarchana', price: 301, category: 'archana',
    image: '/temple-hero.webp',
    description: 'Sacred vermillion archana invoking Goddess Mangaladevi with Lalitha Sahasranama.',
    longDescription: 'Special vermillion petal offerings placed reverently at the feet of the Mother Mangaladevi in Attavar, Mangalore.',
    requiresDevotee: true, rating: 4.9, reviewCount: 240, popular: true, duration: '30 min',
    maxQuantity: 5,
    availableSlots: ['08:00 AM - Morning Batch', '10:30 AM - Nitya Archana', '06:00 PM - Sandhya Archana'],
    reminder: '🔔 Energized red kumkuma and sari prasadam dispatched to your home',
    benefits: ['Mangala dosha relief', 'Marital happiness', 'Protection of children and home'],
  },
  {
    id: 'mangaladevi-chandika', templeId: 'mangaladevi', name: 'Maha Chandika Homa', price: 2501, originalPrice: 3001, category: 'homam',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    description: 'Grand sacred fire ceremony for victory, negative energy shielding, and prosperity.',
    longDescription: 'Priests chant all 700 verses of the Devi Mahatmyam with 108 herbs, silk cloth, and pure ghee in the consecrated yajna kunda.',
    requiresDevotee: true, rating: 5.0, reviewCount: 185, popular: true, duration: '120 min',
    maxQuantity: 2,
    availableSlots: ['08:30 AM - Chandika Yajna Batch', '11:00 AM - Purna Ahuti'],
    reminder: '🔔 Consecrated silver raksha coin and sacred homa bhasma sent to you',
    benefits: ['Shielding from negative energies', 'Overcomes legal and business obstacles', 'Devi grace'],
  },

  /* ── 4. Kateel Sri Durgaparameshwari Temple (Kateel, Mangalore) ── */
  {
    id: 'kateel-yakshagana', templeId: 'kateel', name: 'Kateel Mela Yakshagana Seva (Aata)', price: 3001, category: 'special',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'The famed night-long traditional Yakshagana prasanga performed by Kateel Sri Durgaparameshwari Mela.',
    longDescription: 'Sponsoring a Harake (vow) Yakshagana theatrical performance depicting divine puranic stories to honor Goddess Kateelamma.',
    requiresDevotee: true, rating: 5.0, reviewCount: 310, popular: true, duration: 'Night Long',
    maxQuantity: 2,
    availableSlots: ['09:00 PM - Harake Aata Evening Session'],
    reminder: '🔔 Personalized sankalpa during the Ranga Pooja of the Yakshagana mela',
    benefits: ['Fulfillment of cherished vows (Harake)', 'Tremendous family prosperity', 'Goddess divine protection'],
  },
  {
    id: 'kateel-panchamritha', templeId: 'kateel', name: 'Panchamritha Abhisheka with Nandini Theertha', price: 501, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
    description: 'Sacred ceremonial bathing with milk, curd, honey, tender coconut, and holy Nandini river waters.',
    longDescription: 'Priests bathe the golden idol of Goddess Durgaparameshwari at the river island sanctum with the 5 sacred nectars.',
    requiresDevotee: true, rating: 4.9, reviewCount: 290, popular: true, duration: '45 min',
    maxQuantity: 4,
    availableSlots: ['07:00 AM - Pratah Abhisheka', '09:30 AM - Vishesha Panchamrutha', '05:30 PM - Sandhya Pooja'],
    reminder: '🔔 Sanctum flowers and consecrated prasad dispatched via express delivery',
    benefits: ['Good health', 'Removes planetary afflictions', 'Spiritual peace'],
  },
  {
    id: 'kateel-annadana', templeId: 'kateel', name: 'Kateel Nitya Annadana Seva', price: 1001, category: 'special',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'Feed thousands of devotees visiting the sacred Nandini river sanctuary of Kateel.',
    longDescription: 'Daily mass satvik bhojana distribution to all pilgrims visiting Mother Durga at Kateel.',
    requiresDevotee: false, rating: 4.9, reviewCount: 410, popular: true, duration: 'Whole Day',
    maxQuantity: 5,
    availableSlots: ['11:30 AM - Anna Santharpana', '07:30 PM - Ratri Bhojana'],
    reminder: '🔔 Official temple blessing receipt and divine kumkum delivered to your home',
    benefits: ['Supreme spiritual merit', 'Removes generational sins', 'Brings peace and joy'],
  },

  /* ── 5. Shree Meenakshi Temple (Madurai) ── */
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
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
    description: 'Offering of 108 illuminated brass ghee lamps at the golden shrine.',
    longDescription: 'The divine corridors and sanctum are illuminated with pure cow ghee lamps symbolising the removal of darkness and ignorance from your home.',
    requiresDevotee: false, rating: 4.6, reviewCount: 156, popular: false, duration: '30 min',
    maxQuantity: 5,
    availableSlots: ['06:00 PM - Sayam Deepotsava', '07:30 PM - Nitya Deeparadhane'],
    reminder: '🔔 High-definition photo of lit lamps sent to your WhatsApp',
    benefits: ['Removes negativity', 'Illumination of life and career', 'Auspicious merit'],
  },
  {
    id: 'meenakshi-pushpanjali', templeId: 'meenakshi', name: 'Sahasranama Archana & Pushpanjali', price: 301, originalPrice: 401, category: 'archana',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=800&q=80',
    description: 'Offering of 1008 fresh jasmine and lotus flowers with Sahasranama chanting.',
    longDescription: 'Mother Meenakshi is adorned with sacred Madurai Malli (jasmine) and fragrant lotuses while archakas recite the 1000 holy names of the Goddess on your behalf.',
    requiresDevotee: true, rating: 4.9, reviewCount: 278, popular: true, duration: '30 min',
    maxQuantity: 5,
    availableSlots: ['08:00 AM - Morning Pushpanjali', '11:30 AM - Madhyahna Archana', '06:30 PM - Sandhya Seva'],
    reminder: '🔔 Fresh flower prasadam and consecrated raksha thread dispatched',
    benefits: ['Fulfillment of noble desires', 'Relief from anxieties', 'Divine grace of Goddess Meenakshi'],
  },
  {
    id: 'meenakshi-chandi-homam', templeId: 'meenakshi', name: 'Chandi Homam & Navakshari Mahayagam', price: 2501, originalPrice: 3001, category: 'homam',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80',
    description: 'Powerful sacred sacrificial fire ritual for health, victory, and overcoming adversity.',
    longDescription: 'Conducted by senior Vedic pandits chanting Durga Saptashati in the temple yagashala to invoke Goddess Meenakshi as the supreme universal protectress.',
    requiresDevotee: true, rating: 5.0, reviewCount: 412, popular: true, duration: '120 min',
    maxQuantity: 2,
    availableSlots: ['07:00 AM - Pratah Mahayagam', '09:30 AM - Purnahuti Batch'],
    reminder: '🔔 Priest video call link & customized sankalpa video recording sent',
    benefits: ['Destruction of negative karmas', 'Triumph over hardships', 'Protection for entire family', 'Sacred Bhasma & Yantra coin'],
  },
  {
    id: 'meenakshi-golden-palanquin', templeId: 'meenakshi', name: 'Thanga Pallakku (Golden Palanquin) Seva', price: 1101, originalPrice: 1351, category: 'special',
    image: '/temple-hero.webp',
    description: 'Ceremonial evening procession of the deities on the grand golden palanquin.',
    longDescription: 'The Utsava murtis of Goddess Meenakshi and Lord Sundareswarar circumambulate the temple prakaram in a magnificent golden palanquin accompanied by nadaswaram.',
    requiresDevotee: true, rating: 4.9, reviewCount: 195, popular: true, duration: '45 min',
    maxQuantity: 3,
    availableSlots: ['07:00 PM - Sandhya Pallakku', '08:30 PM - Rajopachara Procession'],
    reminder: '🔔 Live photo updates of deity adorned in silk and gold',
    benefits: ['Royal honors & blessings', 'Removal of obstacles in career', 'Enduring wealth and peace'],
  },
  {
    id: 'meenakshi-navagraha-pooja', templeId: 'meenakshi', name: 'Nava Graha Shanti Pooja', price: 451, originalPrice: 551, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'Special planetary pacification ritual at the ancient Navagraha mandapam.',
    longDescription: 'Dedicated prayers, grain offerings (Navadhanya), and planetary archanas performed to harmonize celestial energies and alleviate planetary afflictions (doshas).',
    requiresDevotee: true, rating: 4.8, reviewCount: 167, popular: false, duration: '35 min',
    maxQuantity: 4,
    availableSlots: ['08:30 AM - Navagraha Morning Batch', '10:30 AM - Dosha Nivarana Batch', '05:00 PM - Evening Batch'],
    reminder: '🔔 Blessed Navadhanya grains and planetary talisman delivered home',
    benefits: ['Relief from planetary doshas', 'Mental clarity and tranquility', 'Good health and protection'],
  },
  {
    id: 'meenakshi-annadhanam', templeId: 'meenakshi', name: 'Maha Annadhanam Seva', price: 751, originalPrice: 1001, category: 'special',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'Sponsoring sacred prasadam meals for pilgrims and devotees visiting the shrine.',
    longDescription: 'Annadhanam is revered as the highest form of charity. Sponsoring temple meals in your family name serves piping hot satvik sambar rice, sweet pongal, and payasam to devotees.',
    requiresDevotee: false, rating: 5.0, reviewCount: 620, popular: true, duration: 'All Day',
    maxQuantity: 10,
    availableSlots: ['12:00 PM - Madhyahna Mahaprasadam', '07:30 PM - Nitya Annadhanam'],
    reminder: '🔔 Certificate of donation and blessed dry fruits prasadam box delivered',
    benefits: ['Accumulation of supreme punyam (merit)', 'Ancestor blessings (Pitr Shanti)', 'Abundance and food security in household'],
  },

  /* ── 2. Sri Venkateswara Swamy (Tirupati) ── */
  {
    id: 'tirupati-suprabhatam', templeId: 'venkateswara', name: 'Suprabhatha Seva', price: 501, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'First sacred dawn aarti at the golden spire sanctum of Baba Kashi Vishwanath.',
    longDescription: 'Conducted at 3:00 AM before dawn with resonating damru beats, shankha naada, and sacred camphor lamps for the eternal Lord of Kashi.',
    requiresDevotee: false, rating: 4.9, reviewCount: 310, popular: true, duration: '60 min',
    maxQuantity: 4,
    availableSlots: ['03:00 AM - Brahma Muhurtha Mangala Aarti', '04:15 AM - Pratah Darshan'],
    reminder: '🔔 Live audio stream link and early morning wake-up reminder sent',
    benefits: ['Direct darshan merit', 'Liberation from birth cycle', 'Kashi teertha blessings'],
  },
  {
    id: 'kashi-rudrabhisheka', templeId: 'kashi', name: 'Ganga Theertha Rudrabhisheka', price: 1001, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1f0c78d?auto=format&fit=crop&w=800&q=80',
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
    image: '/temple-hero.webp',
    description: 'Sacred adornment of the Jyotirlinga with chandan, flowers, and midday rajbhog.',
    longDescription: 'The sacred Jyotirlinga is embellished with fragrant sandalwood paste, belpatra, and floral crowns followed by the divine royal noon bhog offering.',
    requiresDevotee: false, rating: 4.8, reviewCount: 198, popular: true, duration: '45 min',
    maxQuantity: 4,
    availableSlots: ['11:15 AM - Madhyahna Shringar Bhog', '12:30 PM - Rajbhog Samarpan'],
    reminder: '🔔 Auspicious photo blessing of decorated sanctum delivered to your WhatsApp',
    benefits: ['Abundance and prosperity', 'Fulfillment of genuine prayers', 'Lord Shiva benevolence'],
  },
  {
    id: 'kashi-saptarishi', templeId: 'kashi', name: 'Sapta Rishi Sandhya Aarti', price: 751, category: 'pooja',
    image: 'https://images.unsplash.com/photo-1561361066-609c1586521a?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1561361066-609c1586521a?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
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
