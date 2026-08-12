// Samyati The World - Destinations & Packages Data Store (7 Domestic + 7 International = 14 Destinations, 56 Packages)

export const DESTINATIONS = [
  // --- DOMESTIC DESTINATIONS (7) ---
  {
    id: 'kashmir',
    name: 'Kashmir',
    category: 'Domestic',
    tagline: 'Paradise on Earth',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    description: 'Srinagar shikara rides, Gulmarg snow slopes, and Pahalgam valley river treks.',
    packagesCount: 4
  },
  {
    id: 'himachal',
    name: 'Himachal Pradesh',
    category: 'Domestic',
    tagline: 'Valley of Gods',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'Manali adventure passes, Solang snow sports, Kasol river trails, and Dharamshala peace.',
    packagesCount: 4
  },
  {
    id: 'kerala',
    name: 'Kerala',
    category: 'Domestic',
    tagline: "God's Own Country",
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: 'Munnar mist-covered tea gardens, Alleppey backwater houseboats, and Kovalam beaches.',
    packagesCount: 4
  },
  {
    id: 'goa',
    name: 'Goa',
    category: 'Domestic',
    tagline: 'Sun, Sand & Vibes',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'North Goa beach shacks, Dudhsagar waterfall safari, and private luxury catamarans.',
    packagesCount: 4
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    category: 'Domestic',
    tagline: 'Land of Royal Heritage',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    description: 'Jaipur pink fort palaces, Udaipur lake romance, and Jaisalmer desert stargazing.',
    packagesCount: 4
  },
  {
    id: 'andaman',
    name: 'Andaman Islands',
    category: 'Domestic',
    tagline: 'Emerald Turquoise Island Escape',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    description: 'Havelock Radhanagar beach, scuba diving in coral reefs, and limestone cave exploration.',
    packagesCount: 4
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    category: 'Domestic',
    tagline: 'Land of High Mountain Passes',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    description: 'Pangong Tso blue lake, Khardung La motorbiking, and Nubra Valley double-hump camel safari.',
    packagesCount: 4
  },

  // --- INTERNATIONAL DESTINATIONS (7) ---
  {
    id: 'bali',
    name: 'Bali',
    category: 'International',
    tagline: 'Island of Gods & Tranquility',
    flag: '🇮🇩',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Ubud tropical rice terraces, Nusa Penida cliff swings, and Seminyak luxury pool villas.',
    packagesCount: 4
  },
  {
    id: 'dubai',
    name: 'Dubai',
    category: 'International',
    tagline: 'City of Gold & Futuristic Marvels',
    flag: '🇦🇪',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    description: 'Burj Khalifa observation deck, desert 4x4 dune bashing, and Palm Jumeirah luxury yachting.',
    packagesCount: 4
  },
  {
    id: 'thailand',
    name: 'Thailand',
    category: 'International',
    tagline: 'Land of Smiles & Tropical Bays',
    flag: '🇹🇭',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    description: 'Phuket Phi Phi island speedboats, Bangkok grand palaces, and Krabi sunset rock climbing.',
    packagesCount: 4
  },
  {
    id: 'switzerland',
    name: 'Switzerland & Alps',
    category: 'International',
    tagline: 'Alpine Wonder & Crystal Lakes',
    flag: '🇨🇭',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    description: 'Jungfraujoch Top of Europe, Lucerne wooden bridge, and Glacier Express panorama trains.',
    packagesCount: 4
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    category: 'International',
    tagline: 'Heritage, Dragons & Emerald Waters',
    flag: '🇻🇳',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    description: 'Ha Long Bay overnight luxury junk boat cruise, Hoi An lantern streets, and Da Nang Golden Bridge.',
    packagesCount: 4
  },
  {
    id: 'maldives',
    name: 'Maldives',
    category: 'International',
    tagline: 'Ultimate Overwater Villa Luxury',
    flag: '🇲🇻',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    description: 'Private overwater bungalows, coral reef sea turtle snorkeling, and candlelit beach dinners.',
    packagesCount: 4
  },
  {
    id: 'singapore',
    name: 'Singapore & Malaysia',
    category: 'International',
    tagline: 'Modern Metropolis & Rainforests',
    flag: '🇸🇬',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    description: 'Marina Bay Sands light show, Universal Studios Sentosa, and Kuala Lumpur Twin Towers.',
    packagesCount: 4
  }
];

// --- 56 PACKAGES (4 PER DESTINATION) ---
export const PACKAGES = [
  // --- KASHMIR PACKAGES (4) ---
  {
    id: 'kash-1',
    destinationId: 'kashmir',
    destinationName: 'Kashmir',
    category: 'Domestic',
    title: 'Kashmir Valley Enchantment & Shikara Dreams',
    duration: '5D / 4N',
    price: '₹18,500',
    originalPrice: '₹24,000',
    rating: '4.9',
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    description: 'Experience Dal Lake luxury houseboats, Mughal gardens of Srinagar, and snow slopes of Gulmarg with private driver support.',
    itinerary: [
      { day: 1, title: 'Arrival in Srinagar & Dal Lake Shikara Ride', details: 'Welcome at Srinagar Airport. Transfer to luxury Dal Lake houseboat. Evening romantic Shikara ride during golden hour.' },
      { day: 2, title: 'Srinagar to Gulmarg Gondola Experience', details: 'Drive to Gulmarg. Ride Asia’s highest Gondola cable car up to Phase 2 snow peak. Try skiing or snow sledding.' },
      { day: 3, title: 'Gulmarg to Pahalgam Valley of Shepherds', details: 'Scenic drive to Pahalgam along saffron fields & Lidder River. Visit Betaab Valley and Chandanwari.' },
      { day: 4, title: 'Pahalgam Pony Trek to Baisaran Valley', details: 'Explore "Mini Switzerland" Baisaran on pony. Return to Srinagar for Mughal Garden tour (Nishat & Shalimar).' },
      { day: 5, title: 'Souvenir Shopping & Departure', details: 'Shop for Kashmiri Pashmina shawls, saffron, and dry fruits. Airport drop with lifelong memories.' }
    ],
    inclusions: ['Luxury Houseboat (1N) + 4-Star Hotels (3N)', 'Daily Breakfast & Buffet Dinner', 'Private Airport Transfers & All Sightseeing (Cab)', 'Shikara Ride on Dal Lake (1 Hour)', '24/7 Samyati Human Support'],
    exclusions: ['Gondola Tickets / Pony Rides', 'Airfare / Train tickets', 'Personal laundry & tips']
  },
  {
    id: 'kash-2',
    destinationId: 'kashmir',
    destinationName: 'Kashmir',
    category: 'Domestic',
    title: 'Gulmarg Powder Snow Ski & Gondola Special',
    duration: '6D / 5N',
    price: '₹24,900',
    originalPrice: '₹32,000',
    rating: '5.0',
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'An extended snow adventure in Gulmarg with Phase 1 & 2 Gondola tickets, Pahalgam Lidder rafting, and Sonmarg glaciers.',
    itinerary: [
      { day: 1, title: 'Srinagar Arrival & Houseboat Stay', details: 'Check-in to luxury houseboat. Relax with hot Kashmiri Kahwa tea.' },
      { day: 2, title: 'Full Day Gulmarg Phase 2 Cable Car Peak', details: 'High-altitude snow panorama and ski coaching.' },
      { day: 3, title: 'Gulmarg to Sonmarg Meadow of Gold', details: 'Explore Thajiwas Glacier on horse riding.' },
      { day: 4, title: 'Sonmarg to Pahalgam River Rafting', details: 'Lidder river white water adventure and evening riverside bonfire.' },
      { day: 5, title: 'Pahalgam to Srinagar Heritage Tour', details: 'Visit Hazratbal Shrine and Jama Masjid.' },
      { day: 6, title: 'Departure from Srinagar', details: 'Transfer to Srinagar Airport.' }
    ],
    inclusions: ['5 Nights Hotel & Houseboat Accommodation', 'Breakfast & Dinner', 'Private Cab for all days', 'Gondola Phase 1 Included'],
    exclusions: ['Airfare', 'Camera fees', 'Personal expenses']
  },
  {
    id: 'kash-3',
    destinationId: 'kashmir',
    destinationName: 'Kashmir',
    category: 'Domestic',
    title: 'Sonmarg Glaciers & Pahalgam Romance Special',
    duration: '4D / 3N',
    price: '₹14,990',
    originalPrice: '₹19,500',
    rating: '4.85',
    reviewsCount: 86,
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
    description: 'Quick romantic getaway covering Dal Lake houseboats, Sonmarg Thajiwas glacier, and Pahalgam Lidder riverbank walks.',
    itinerary: [
      { day: 1, title: 'Srinagar Arrival & Sunset Shikara', details: 'Check-in to Nigeen Lake premium houseboat.' },
      { day: 2, title: 'Sonmarg Glacier Day Excursion', details: 'Drive to Sonmarg, visit Sindh river & snow points.' },
      { day: 3, title: 'Pahalgam Valley & Betaab Valley Excursion', details: 'Visit Aru Valley and Lidder river.' },
      { day: 4, title: 'Srinagar Gardens & Airport Drop', details: 'Chashme Shahi garden & transfer to airport.' }
    ],
    inclusions: ['3 Nights Stay with Meal Plan (MAP)', 'All Private Car Transfers', 'Shikara Ride'],
    exclusions: ['Flight fare', 'Pony charges']
  },
  {
    id: 'kash-4',
    destinationId: 'kashmir',
    destinationName: 'Kashmir',
    category: 'Domestic',
    title: 'Grand Kashmir & Ladakh High Pass Overland Trail',
    duration: '8D / 7N',
    price: '₹34,500',
    originalPrice: '₹45,000',
    rating: '4.95',
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'Ultimate overland adventure connecting Srinagar, Kargil War Memorial, Leh, Pangong Tso, and Nubra Valley.',
    itinerary: [
      { day: 1, title: 'Srinagar Arrival', details: 'Houseboat stay in Srinagar.' },
      { day: 2, title: 'Srinagar to Kargil via Zoji La Pass', details: 'Cross Drass (2nd coldest inhabited place) & Kargil War Memorial.' },
      { day: 3, title: 'Kargil to Leh via Lamayuru Monastery', details: 'Visit Moonland & Magnetic Hill.' },
      { day: 4, title: 'Leh to Nubra Valley via Khardung La', details: 'World’s highest motorable pass ride & Hunder Sand Dunes.' },
      { day: 5, title: 'Nubra to Pangong Tso Blue Lake', details: 'Overnight lakefront tent camping.' },
      { day: 6, title: 'Pangong Tso back to Leh', details: 'Cross Chang La pass & Shey Palace.' },
      { day: 7, title: 'Leh Monastery & Local Market', details: 'Shanti Stupa & shopping.' },
      { day: 8, title: 'Departure from Leh Airport', details: 'Fly home with memories.' }
    ],
    inclusions: ['7 Nights Deluxe Hotels & Tents', 'Breakfast & Dinner', 'Inland SUV / Tempo Traveler', 'Inner Line Permits'],
    exclusions: ['Airfare', 'Monastery entry fees']
  },

  // --- HIMACHAL PACKAGES (4) ---
  {
    id: 'him-1',
    destinationId: 'himachal',
    destinationName: 'Himachal Pradesh',
    category: 'Domestic',
    title: 'Manali Snow Thrills & Solang Valley Adventure',
    duration: '5D / 4N',
    price: '₹12,800',
    originalPrice: '₹17,000',
    rating: '4.88',
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'Explore Hadimba Temple, Solang Valley paragliding, Atal Tunnel, and Kasol Manikaran Sahib.',
    itinerary: [
      { day: 1, title: 'Arrival in Manali & Local Sightseeing', details: 'Check-in hotel. Visit Hadimba Temple, Vashisht Hot Springs, and Mall Road.' },
      { day: 2, title: 'Solang Valley & Atal Tunnel Adventure', details: 'Zipline, quad biking, paragliding in Solang Valley. Drive through engineering marvel Atal Tunnel.' },
      { day: 3, title: 'Kasol & Manikaran Sahib Day Trip', details: 'Parvati river walk, cafe hopping in Kasol, hot springs at Manikaran Sahib.' },
      { day: 4, title: 'Naggar Castle & River Rafting in Kullu', details: 'Explore Naggar Castle art gallery & white water rafting in Beas River.' },
      { day: 5, title: 'Departure from Manali', details: 'Shopping at Mall Road & transfer to Volvo/Private cab.' }
    ],
    inclusions: ['4 Nights Hotel Stay', 'Breakfast & Dinner', 'Private Cab for Sightseeing', 'Kullu Rafting Voucher'],
    exclusions: ['Paragliding/Adventure sports costs', 'Personal expenses']
  },
  {
    id: 'him-2',
    destinationId: 'himachal',
    destinationName: 'Himachal Pradesh',
    category: 'Domestic',
    title: 'Kasol, Tosh & Parvati Valley Backpacking Trail',
    duration: '4D / 3N',
    price: '₹9,990',
    originalPrice: '₹14,000',
    rating: '4.92',
    reviewsCount: 178,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    description: 'Youthful trek & cafe retreat in Kasol, Tosh wooden villages, Manikaran, and Riverside camping.',
    itinerary: [
      { day: 1, title: 'Arrival in Kasol & Parvati River Camp', details: 'Riverside wooden stay & Israeli cafe lunch.' },
      { day: 2, title: 'Tosh Village Waterfall Hike', details: 'Trek up to Tosh waterfall & enjoy mountain sunset.' },
      { day: 3, title: 'Chalal Village Walk & Manikaran Sahib', details: 'Pine forest walk to Chalal and hot spring bath.' },
      { day: 4, title: 'Departure from Kasol', details: 'Souvenir shopping and evening return.' }
    ],
    inclusions: ['3 Nights Stays in Riverside Camps & Cafes', 'Breakfast & Dinner', 'Guide for Tosh Hike'],
    exclusions: ['Travel to Kasol', 'Beverages & personal tips']
  },
  {
    id: 'him-3',
    destinationId: 'himachal',
    destinationName: 'Himachal Pradesh',
    category: 'Domestic',
    title: 'Shimla & Manali Romantic Pine Retreat',
    duration: '6D / 5N',
    price: '₹16,500',
    originalPrice: '₹22,000',
    rating: '4.87',
    reviewsCount: 154,
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
    description: 'Classic honeymoon circuit covering Shimla Ridge, Kufri yak rides, Kullu Valley, and Manali snow points.',
    itinerary: [
      { day: 1, title: 'Arrival in Shimla', details: 'Mall Road strolling & Christ Church Visit.' },
      { day: 2, title: 'Kufri Snow Point Excursion', details: 'Horse riding, adventure park & Himalayan Zoo.' },
      { day: 3, title: 'Shimla to Manali via Kullu Valley', details: 'Visit Pandoh Dam & Kullu shawl factory.' },
      { day: 4, title: 'Manali Local Sightseeing', details: 'Hadimba temple, Club House, Vashisht.' },
      { day: 5, title: 'Solang Valley Snow Trip', details: 'Snow games & cable car.' },
      { day: 6, title: 'Departure from Manali', details: 'Transfer for onward journey.' }
    ],
    inclusions: ['5 Nights Hotel Stay', 'Breakfast & Dinner', 'Private Taxi for all 6 days'],
    exclusions: ['Airfare', 'Horse ride charges']
  },
  {
    id: 'him-4',
    destinationId: 'himachal',
    destinationName: 'Himachal Pradesh',
    category: 'Domestic',
    title: 'Dharamshala, Dalhousie & Khajjiar Mini-Switzerland',
    duration: '6D / 5N',
    price: '₹17,900',
    originalPrice: '₹24,500',
    rating: '4.91',
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1588096344356-78b7b2ef42fa?auto=format&fit=crop&w=800&q=80',
    description: 'Explore Dalai Lama Monastery in Mcleodganj, tea gardens, Dalhousie heritage, and Khajjiar pine meadows.',
    itinerary: [
      { day: 1, title: 'Arrival in Dharamshala / Mcleodganj', details: 'Visit Namgyal Monastery & St. John Church.' },
      { day: 2, title: 'Mcleodganj Local & Bhagsu Waterfall', details: 'Bhagsunag temple, waterfall trek & local Tibetan market.' },
      { day: 3, title: 'Dharamshala to Dalhousie Drive', details: 'Scenic mountain drive via Jot.' },
      { day: 4, title: 'Khajjiar Mini Switzerland Day Trip', details: 'Zorbing, pine forest walks, and lake picnics.' },
      { day: 5, title: 'Dalhousie Local & Dainkund Peak', details: 'Panjpulla stream & Dainkund peak trek.' },
      { day: 6, title: 'Departure from Pathankot / Chakki Bank', details: 'Drop at railway station/airport.' }
    ],
    inclusions: ['5 Nights Deluxe Hotel Stays', 'Breakfast & Dinner', 'Dedicated SUV/Sedan cab'],
    exclusions: ['Train/Airfare', 'Adventure activity charges']
  },

  // --- KERALA PACKAGES (4) ---
  {
    id: 'ker-1',
    destinationId: 'kerala',
    destinationName: 'Kerala',
    category: 'Domestic',
    title: 'Munnar Mist, Alleppey Houseboat & Cochin Heritage',
    duration: '5D / 4N',
    price: '₹15,400',
    originalPrice: '₹20,500',
    rating: '4.94',
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: 'Walk through Munnar tea gardens, Eravikulam Nilgiri Tahr sanctuary, and private Alleppey backwater houseboat cruise.',
    itinerary: [
      { day: 1, title: 'Cochin Arrival & Drive to Munnar', details: 'Enroute Cheeyappara & Valara waterfalls.' },
      { day: 2, title: 'Munnar Tea Estate & Mattupetty Dam', details: 'Visit Eravikulam National Park, Echo Point & Tea Museum.' },
      { day: 3, title: 'Munnar to Thekkady Spice Plantation', details: 'Periyar wildlife elephant sanctuary & spice plantation walk.' },
      { day: 4, title: 'Thekkady to Alleppey Houseboat Overnight', details: 'Board private luxury houseboat with traditional Kerala meals.' },
      { day: 5, title: 'Cochin Sightseeing & Departure', details: 'Chinese Fishing Nets, Fort Kochi & airport drop.' }
    ],
    inclusions: ['Private Houseboat (1N) + 4-Star Resort (3N)', 'All Meals on Houseboat + Breakfast/Dinner at Resorts', 'Private AC Cab for 5 Days'],
    exclusions: ['Flight tickets', 'Elephant ride charges']
  },
  {
    id: 'ker-2',
    destinationId: 'kerala',
    destinationName: 'Kerala',
    category: 'Domestic',
    title: 'Kovalam Beach, Varkala Cliff & Poovar Island Escape',
    duration: '4D / 3N',
    price: '₹13,800',
    originalPrice: '₹18,000',
    rating: '4.89',
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80',
    description: 'Chill on Varkala cliff cafes, Kovalam lighthouse beach, and Poovar Golden Sand backwater mangrove boating.',
    itinerary: [
      { day: 1, title: 'Trivandrum Arrival & Kovalam Beach', details: 'Check-in beach resort & sunset at Lighthouse beach.' },
      { day: 2, title: 'Poovar Island Backwater Boat Safari', details: 'Mangrove forest boat safari to Golden Sand beach where river meets sea.' },
      { day: 3, title: 'Varkala Cliff & Black Sand Beach Day Trip', details: 'Cliff cafe hopping, Janardhana Swami temple.' },
      { day: 4, title: 'Trivandrum City Tour & Departure', details: 'Padmanabhaswamy Temple & drop at airport.' }
    ],
    inclusions: ['3 Nights Beach Resort Accommodation', 'Breakfast & Dinner', 'Private AC Sedan'],
    exclusions: ['Airfare', 'Boating entry tickets']
  },
  {
    id: 'ker-3',
    destinationId: 'kerala',
    destinationName: 'Kerala',
    category: 'Domestic',
    title: 'Wayanad Rainforest & Waterfalls Expedition',
    duration: '4D / 3N',
    price: '₹12,900',
    originalPrice: '₹16,800',
    rating: '4.86',
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    description: 'Chembra heart-shaped lake trek, Banasura Sagar dam zip-line, Edakkal caves, and rainforest treehouse stay.',
    itinerary: [
      { day: 1, title: 'Calicut Arrival & Drive to Wayanad', details: 'Check-in rainforest eco-resort.' },
      { day: 2, title: 'Chembra Peak & Edakkal Caves', details: 'Trek to heart lake & ancient rock carvings.' },
      { day: 3, title: 'Banasura Sagar Dam & Soochipara Falls', details: 'Speedboating & natural waterfall splash.' },
      { day: 4, title: 'Wayanad Spice Tour & Departure', details: 'Tea factory visit & Calicut drop.' }
    ],
    inclusions: ['3 Nights Rainforest Resort', 'Breakfast & Dinner', 'Private Cab'],
    exclusions: ['Trek permit fees', 'Personal expenses']
  },
  {
    id: 'ker-4',
    destinationId: 'kerala',
    destinationName: 'Kerala',
    category: 'Domestic',
    title: 'Complete Kerala Grand Circuit (Munnar, Thekkady, Alleppey, Kovalam)',
    duration: '7D / 6N',
    price: '₹22,500',
    originalPrice: '₹29,000',
    rating: '4.97',
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive 7-day tour from mist-covered tea hills down to tropical backwaters and southern beaches.',
    itinerary: [
      { day: 1, title: 'Cochin to Munnar', details: 'Waterfalls & tea valley drive.' },
      { day: 2, title: 'Munnar Full Day', details: 'National park & dam.' },
      { day: 3, title: 'Munnar to Thekkady', details: 'Spice tour & boat safari.' },
      { day: 4, title: 'Thekkady to Alleppey Houseboat', details: 'Backwater luxury stay.' },
      { day: 5, title: 'Alleppey to Kovalam', details: 'Kovalam beach sunset.' },
      { day: 6, title: 'Trivandrum & Kanyakumari Excursion', details: 'Vivekananda Rock Memorial.' },
      { day: 7, title: 'Departure from Trivandrum', details: 'Airport drop.' }
    ],
    inclusions: ['6 Nights Deluxe Accommodation including Houseboat', 'Daily Breakfast & Dinner', 'Private AC Vehicle'],
    exclusions: ['Airfare', 'Entry tickets']
  },

  // --- GOA PACKAGES (4) ---
  {
    id: 'goa-1',
    destinationId: 'goa',
    destinationName: 'Goa',
    category: 'Domestic',
    title: 'Goa Sun, Beach Shacks & Private Yacht Sunset',
    duration: '4D / 3N',
    price: '₹10,500',
    originalPrice: '₹14,500',
    rating: '4.91',
    reviewsCount: 260,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Baga & Calangute beach vibes, Dudhsagar Jeep safari, Fontainhas French quarter, and Mandovi sunset catamaran.',
    itinerary: [
      { day: 1, title: 'Goa Arrival & Baga Beach Vibe', details: 'Check-in resort. Evening Tito’s lane & beach shacks.' },
      { day: 2, title: 'North Goa Beaches & Water Sports', details: 'Calangute, Anjuna cliff, Vagator fort & jet skiing.' },
      { day: 3, title: 'South Goa Heritage & Mandovi River Cruise', details: 'Basilica of Bom Jesus, Panjim Fontainhas & sunset cruise.' },
      { day: 4, title: 'Shopping & Departure', details: 'Fleamarket souvenir shopping & airport drop.' }
    ],
    inclusions: ['3 Nights Resort with Swimming Pool', 'Daily Breakfast', 'Mandovi River Sunset Cruise Ticket', 'Private Transfers'],
    exclusions: ['Water sports activities', 'Lunch/Dinner & Drinks']
  },
  {
    id: 'goa-2',
    destinationId: 'goa',
    destinationName: 'Goa',
    category: 'Domestic',
    title: 'Dudhsagar Waterfall Jeep Safari & Spice Plantation',
    duration: '5D / 4N',
    price: '₹13,900',
    originalPrice: '₹18,500',
    rating: '4.88',
    reviewsCount: 140,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Off-road 4x4 jungle jeep safari to Dudhsagar Waterfalls, spice plantation buffet lunch, and South Goa serene beaches.',
    itinerary: [
      { day: 1, title: 'Arrival & Poolside Chill', details: 'Resort check-in & evening beach walk.' },
      { day: 2, title: 'Dudhsagar 4x4 Jeep Safari & Spice Farm', details: 'Jungle jeep drive, natural waterfall bath & buffet lunch.' },
      { day: 3, title: 'Palolem & Agonda South Goa Beaches', details: 'Silent noise party & serene coconut grove beaches.' },
      { day: 4, title: 'Fort Aguada & Chapora Dil Chahta Hai Fort', details: 'Iconic movie fort vistas & sunset.' },
      { day: 5, title: 'Departure', details: 'Airport/Railway drop.' }
    ],
    inclusions: ['4 Nights Hotel Stay', 'Breakfast & Spice Farm Lunch', 'Jeep Safari Permits', 'Private Cab'],
    exclusions: ['Airfare', 'Alcoholic beverages']
  },
  {
    id: 'goa-3',
    destinationId: 'goa',
    destinationName: 'Goa',
    category: 'Domestic',
    title: 'Luxury Private Villa & Yacht Romance Special',
    duration: '4D / 3N',
    price: '₹19,500',
    originalPrice: '₹26,000',
    rating: '4.96',
    reviewsCount: 115,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: 'Private pool villa stay, candlelit beach dinner, private 2-hour luxury yacht sailing, and couple spa session.',
    itinerary: [
      { day: 1, title: 'Private Pool Villa Check-In', details: 'Welcome sparkling wine & relaxation.' },
      { day: 2, title: 'Private Yacht Cruise in Chapora River', details: 'Sailing with complimentary champagne & snacks.' },
      { day: 3, title: 'Morjim & Ashwem Quiet Beaches', details: 'Romantic beach setup & couple dinner.' },
      { day: 4, title: 'Check-out & Airport Drop', details: 'Private luxury car transfer.' }
    ],
    inclusions: ['3 Nights Private Pool Villa', 'Daily Breakfast', '2-Hour Private Yacht Charter', 'Candlelit Dinner Setup'],
    exclusions: ['Airfare', 'Personal shopping']
  },
  {
    id: 'goa-4',
    destinationId: 'goa',
    destinationName: 'Goa',
    category: 'Domestic',
    title: 'Grand Goa Workation & Coastal Exploration',
    duration: '7D / 6N',
    price: '₹18,000',
    originalPrice: '₹25,000',
    rating: '4.92',
    reviewsCount: 190,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'The ultimate week-long Goa getaway mixing co-working cafes, secluded beaches, scuba diving, and heritage walks.',
    itinerary: [
      { day: 1, title: 'Arrival & North Goa Setup', details: 'Check-in boutique hotel.' },
      { day: 2, title: 'Grand Island Scuba Diving', details: 'Boat trip, underwater diving with video.' },
      { day: 3, title: 'Fontainhas Heritage Walk', details: 'Latin quarter photo tour.' },
      { day: 4, title: 'Arambol Sweet Water Lake', details: 'Drum circle sunset at Arambol.' },
      { day: 5, title: 'Cabo de Rama Fort', details: 'Cliff views of South Goa.' },
      { day: 6, title: 'Spice Plantation & Casino Night', details: 'Offshore casino entry.' },
      { day: 7, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['6 Nights Boutique Resort', 'Breakfast', 'Grand Island Scuba Package', 'Casino Entry Ticket'],
    exclusions: ['Airfare', 'Personal expenses']
  },

  // --- RAJASTHAN PACKAGES (4) ---
  {
    id: 'raj-1',
    destinationId: 'rajasthan',
    destinationName: 'Rajasthan',
    category: 'Domestic',
    title: 'Jaipur, Jodhpur & Udaipur Royal Forts Trail',
    duration: '6D / 5N',
    price: '₹19,800',
    originalPrice: '₹26,500',
    rating: '4.93',
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    description: 'Amber Fort elephant ride, Jaipur Hawa Mahal, Jodhpur Mehrangarh Fort, and Udaipur Lake Pichola boat cruise.',
    itinerary: [
      { day: 1, title: 'Jaipur Pink City Arrival', details: 'Visit City Palace, Jantar Mantar, and Hawa Mahal.' },
      { day: 2, title: 'Amer Fort & Nahargarh Sunset', details: 'Amer Fort elephant/jeep ride & Nahargarh fort city view.' },
      { day: 3, title: 'Jaipur to Jodhpur Blue City', details: 'Visit Mehrangarh Fort and Jaswant Thada.' },
      { day: 4, title: 'Jodhpur to Udaipur City of Lakes', details: 'Enroute Ranakpur Jain Temple.' },
      { day: 5, title: 'Udaipur City Palace & Lake Pichola Boat Ride', details: 'Boat ride past Lake Palace & Jagmandir.' },
      { day: 6, title: 'Departure from Udaipur', details: 'Drop at Udaipur airport/station.' }
    ],
    inclusions: ['5 Nights Heritage Hotel Stay', 'Breakfast & Dinner', 'Private AC SUV/Sedan', 'Lake Pichola Boat Cruise Ticket'],
    exclusions: ['Airfare', 'Monument entry fees']
  },
  {
    id: 'raj-2',
    destinationId: 'rajasthan',
    destinationName: 'Rajasthan',
    category: 'Domestic',
    title: 'Jaisalmer Golden Fort & Sam Sand Dunes Safari',
    duration: '4D / 3N',
    price: '₹13,500',
    originalPrice: '₹18,000',
    rating: '4.95',
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    description: 'Stay inside Golden Fort, 4x4 desert dune bashing, camel safari, and Kalbeliya folk dance around desert campfire.',
    itinerary: [
      { day: 1, title: 'Jaisalmer Arrival & Haveli Tour', details: 'Patwon ki Haveli & Nathmal ki Haveli.' },
      { day: 2, title: 'Jaisalmer Fort & Drive to Desert Camp', details: 'Explore living fort & check-in luxury desert camp.' },
      { day: 3, title: 'Camel Safari & Dune Bashing', details: 'Thar desert sunset camel ride & Rajasthani cultural show.' },
      { day: 4, title: 'Kuldhara Ghost Village & Departure', details: 'Abandoned village walk & airport drop.' }
    ],
    inclusions: ['2N Hotel + 1N Desert Tented Camp', 'Breakfast & Rajasthani Buffet Dinner', 'Camel Safari & Cultural Show', 'Private Cab'],
    exclusions: ['Flight fare', 'Dune bashing extra charges']
  },
  {
    id: 'raj-3',
    destinationId: 'rajasthan',
    destinationName: 'Rajasthan',
    category: 'Domestic',
    title: 'Udaipur Lake Romance & Mount Abu Hill Station',
    duration: '5D / 4N',
    price: '₹16,200',
    originalPrice: '₹21,000',
    rating: '4.89',
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
    description: 'Romantic Lake Pichola boating in Udaipur paired with Nakki Lake and Dilwara Jain Temples in Mount Abu.',
    itinerary: [
      { day: 1, title: 'Udaipur Arrival & Saheliyon ki Bari', details: 'Check-in lakeview resort.' },
      { day: 2, title: 'Udaipur Palace & Sunset Cruise', details: 'City Palace tour & boat ride.' },
      { day: 3, title: 'Udaipur to Mount Abu Drive', details: 'Visit Sunset point & Nakki Lake boating.' },
      { day: 4, title: 'Dilwara Temples & Guru Shikhar', details: 'Marble carved temples & highest peak.' },
      { day: 5, title: 'Departure from Udaipur', details: 'Transfer to Udaipur airport.' }
    ],
    inclusions: ['4 Nights Resort Accommodation', 'Breakfast & Dinner', 'Private Cab'],
    exclusions: ['Airfare', 'Boating charges']
  },
  {
    id: 'raj-4',
    destinationId: 'rajasthan',
    destinationName: 'Rajasthan',
    category: 'Domestic',
    title: 'Ranthambore Tiger Safari & Jaipur Royal Heritage',
    duration: '5D / 4N',
    price: '₹17,500',
    originalPrice: '₹23,000',
    rating: '4.90',
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    description: 'Open-top 4x4 Jeep tiger safari in Ranthambore National Park combined with Pink City Jaipur forts.',
    itinerary: [
      { day: 1, title: 'Jaipur Arrival', details: 'Shopping at Johari bazaar.' },
      { day: 2, title: 'Jaipur Forts & Palaces', details: 'Amer Fort & Hawa Mahal.' },
      { day: 3, title: 'Jaipur to Ranthambore', details: 'Check-in jungle resort near park.' },
      { day: 4, title: 'Morning & Afternoon Tiger Safari', details: 'Jeep jungle safari in Zone 1-5.' },
      { day: 5, title: 'Departure', details: 'Drop at Jaipur airport.' }
    ],
    inclusions: ['4 Nights Stay', 'Breakfast & Dinner', '1 Ranthambore Jungle Safari Permit', 'Private Taxi'],
    exclusions: ['Airfare', 'Camera permits']
  },

  // --- ANDAMAN PACKAGES (4) ---
  {
    id: 'and-1',
    destinationId: 'andaman',
    destinationName: 'Andaman Islands',
    category: 'Domestic',
    title: 'Havelock Scuba, Radhanagar Beach & Neil Island Escape',
    duration: '6D / 5N',
    price: '₹24,500',
    originalPrice: '₹32,000',
    rating: '4.96',
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    description: 'Private catamaran cruise to Havelock Island, Radhanagar Beach sunset, Elephant beach snorkeling, and Neil Island coral bridge.',
    itinerary: [
      { day: 1, title: 'Port Blair Arrival & Cellular Jail Light Show', details: 'Cellular Jail museum tour & evening light and sound show.' },
      { day: 2, title: 'Port Blair to Havelock Cruise & Radhanagar Beach', details: 'AC Ferry cruise to Havelock. Sunset at Asia’s best Radhanagar beach.' },
      { day: 3, title: 'Elephant Beach Boat Trip & Underwater Scuba', details: 'Speedboat to Elephant Beach. Scuba diving with underwater photographer.' },
      { day: 4, title: 'Havelock to Neil Island (Laxmanpur & Bharatpur)', details: 'Ferry to Neil Island. Visit Natural Coral Rock Bridge.' },
      { day: 5, title: 'Neil Island to Port Blair Return', details: 'Return ferry to Port Blair. Chidiyatapu sunset point.' },
      { day: 6, title: 'Departure from Port Blair', details: 'Airport drop.' }
    ],
    inclusions: ['5 Nights Beach Resort Stay', 'Breakfast & Dinner', 'Makruzz / Green Ocean Cruise Tickets', 'Scuba Diving Trial with Video', 'Private AC Cab'],
    exclusions: ['Airfare', 'Personal watersports extra']
  },
  {
    id: 'and-2',
    destinationId: 'andaman',
    destinationName: 'Andaman Islands',
    category: 'Domestic',
    title: 'Baratang Limestone Caves & Mud Volcano Safari',
    duration: '5D / 4N',
    price: '₹19,800',
    originalPrice: '₹26,000',
    rating: '4.87',
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Mangrove boat safari through Jarawa tribal reserve to Baratang limestone caves and Havelock turquoise lagoons.',
    itinerary: [
      { day: 1, title: 'Port Blair Arrival', details: 'Corbyn’s Cove beach.' },
      { day: 2, title: 'Baratang Island Day Trip', details: 'Jarawa tribal reserve forest drive, boat safari through mangrove creek to limestone caves.' },
      { day: 3, title: 'Port Blair to Havelock Island', details: 'Radhanagar beach.' },
      { day: 4, title: 'Kalapathar Beach & Return to Port Blair', details: 'Black rock beach & return ferry.' },
      { day: 5, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['4 Nights Hotel/Resort', 'Breakfast & Dinner', 'Baratang Boat & Forest Convoy Permits', 'Inter-island Ferry Tickets'],
    exclusions: ['Airfare', 'Personal tips']
  },
  {
    id: 'and-3',
    destinationId: 'andaman',
    destinationName: 'Andaman Islands',
    category: 'Domestic',
    title: 'Andaman Honeymoon Lagoon & Candlelit Beach Special',
    duration: '5D / 4N',
    price: '₹22,900',
    originalPrice: '₹29,500',
    rating: '4.98',
    reviewsCount: 140,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury beachfront resort stay in Havelock, private candlelit seafood dinner on the sand, bed decoration, and couple photo shoot.',
    itinerary: [
      { day: 1, title: 'Port Blair Arrival & Sunset', details: 'Resort check-in.' },
      { day: 2, title: 'Catamaran to Havelock & Private Beach Dinner', details: 'Beachfront resort & candlelit setup.' },
      { day: 3, title: 'Elephant Beach Couple Snorkeling', details: 'Coral reef excursion.' },
      { day: 4, title: 'Havelock to Port Blair & Shopping', details: 'Return cruise & Pearl shopping.' },
      { day: 5, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['4 Nights Premium Beach Resorts', 'Breakfast & Candlelit Dinner', 'High-speed Cruise Tickets', 'Honeymoon Inclusions (Cake, Flower Bed)'],
    exclusions: ['Airfare', 'Extra water sports']
  },
  {
    id: 'and-4',
    destinationId: 'andaman',
    destinationName: 'Andaman Islands',
    category: 'Domestic',
    title: 'Ross & Smith Twin Island Explorer Circuit',
    duration: '7D / 6N',
    price: '₹29,900',
    originalPrice: '₹39,000',
    rating: '4.93',
    reviewsCount: 85,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Travel up to Diglipur in North Andaman to walk across the sandbar connecting Ross & Smith twin islands.',
    itinerary: [
      { day: 1, title: 'Port Blair Arrival', details: 'Cellular jail.' },
      { day: 2, title: 'Port Blair to Rangat / Mayabunder', details: 'Amkunj beach & Dhaninallah mangrove walkway.' },
      { day: 3, title: 'Diglipur Ross & Smith Island Boat', details: 'Natural sandbar joining two islands.' },
      { day: 4, title: 'Return to Port Blair via Baratang', details: 'Limestone caves.' },
      { day: 5, title: 'Port Blair to Havelock', details: 'Radhanagar beach.' },
      { day: 6, title: 'Havelock to Port Blair', details: 'Shopping.' },
      { day: 7, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['6 Nights Resort Accommodation', 'Breakfast & Dinner', 'All Island Ferry & Forest Permits', 'Private Vehicle'],
    exclusions: ['Airfare', 'Personal expenses']
  },

  // --- LADAKH PACKAGES (4) ---
  {
    id: 'lad-1',
    destinationId: 'ladakh',
    destinationName: 'Ladakh',
    category: 'Domestic',
    title: 'Pangong Lake, Khardung La & Nubra Camel Expedition',
    duration: '6D / 5N',
    price: '₹21,500',
    originalPrice: '₹28,000',
    rating: '4.95',
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    description: 'Cross Khardung La pass (17,982 ft), sleep in Nubra sand dunes, marvel at 3-Idiots Pangong Tso blue lake, and Magnetic Hill.',
    itinerary: [
      { day: 1, title: 'Leh Airport Arrival & Acclimatization Day', details: 'Check-in hotel. Complete rest for high-altitude acclimatization.' },
      { day: 2, title: 'Leh Local Sightseeing & Magnetic Hill', details: 'Hall of Fame, Magnetic Hill, Confluence of Indus & Zanskar rivers, Shanti Stupa.' },
      { day: 3, title: 'Leh to Nubra Valley via Khardung La', details: 'Cross Khardung La pass. Visit Diskit Monastery & double-hump camel ride at Hunder sand dunes.' },
      { day: 4, title: 'Nubra Valley to Pangong Lake via Shyok', details: 'Drive along Shyok River to Pangong Tso. Check-in lakeside luxury camp.' },
      { day: 5, title: 'Pangong Tso to Leh via Chang La Pass', details: 'Sunrise at Pangong Lake. Cross Chang La (17,590 ft) & visit Thiksey Monastery.' },
      { day: 6, title: 'Departure from Leh Airport', details: 'Early morning transfer to Leh airport.' }
    ],
    inclusions: ['5 Nights Hotel & Lakeside Tented Camp', 'Breakfast & Dinner', 'Inner Line Permits & Wildlife Fees', 'Oxygen Cylinder in SUV', 'Private Non-AC SUV (Innova/Xylo)'],
    exclusions: ['Airfare', 'Camel ride charges']
  },
  {
    id: 'lad-2',
    destinationId: 'ladakh',
    destinationName: 'Ladakh',
    category: 'Domestic',
    title: 'Hanle Dark Sky Reserve & Tso Moriri Lake Safari',
    duration: '7D / 6N',
    price: '₹26,800',
    originalPrice: '₹34,500',
    rating: '4.98',
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Stargazing at India’s 1st Dark Sky Reserve in Hanle, Umling La pass (world’s highest pass 19,024 ft), and Tso Moriri lake.',
    itinerary: [
      { day: 1, title: 'Leh Arrival & Rest', details: 'Acclimatization.' },
      { day: 2, title: 'Leh to Nubra Valley', details: 'Khardung La pass & Hunder dunes.' },
      { day: 3, title: 'Nubra to Pangong Tso', details: 'Shyok route & lakeside night.' },
      { day: 4, title: 'Pangong to Hanle via Chushul', details: 'Rezang La war memorial & Hanle Indian Astronomical Observatory.' },
      { day: 5, title: 'Hanle to Umling La Pass (19,024 ft) & Tso Moriri', details: 'Touch the highest pass in the world & reach Tso Moriri.' },
      { day: 6, title: 'Tso Moriri to Leh via Chumathang', details: 'Hot springs at Chumathang.' },
      { day: 7, title: 'Departure', details: 'Leh airport drop.' }
    ],
    inclusions: ['6 Nights Accommodation', 'Breakfast & Dinner', 'Hanle & Umling La Special Protected Area Permits', 'Oxygen Cylinder'],
    exclusions: ['Airfare', 'Personal gear']
  },
  {
    id: 'lad-3',
    destinationId: 'ladakh',
    destinationName: 'Ladakh',
    category: 'Domestic',
    title: 'Ladakh Royal Himalayan Motorbike Expedition',
    duration: '7D / 6N',
    price: '₹29,500',
    originalPrice: '₹38,000',
    rating: '4.91',
    reviewsCount: 135,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    description: 'Ride Royal Enfield Himalayan bikes through Khardung La, Nubra Valley sand dunes, and Pangong Tso with backup mechanic vehicle.',
    itinerary: [
      { day: 1, title: 'Arrival in Leh & Bike Allocation', details: 'Rest & bike test ride in Leh market.' },
      { day: 2, title: 'Leh Local Ride & Sham Valley', details: 'Magnetic Hill & Confluence ride.' },
      { day: 3, title: 'Ride Leh to Nubra via Khardung La', details: 'Mountain pass ride.' },
      { day: 4, title: 'Ride Nubra to Pangong Tso', details: 'Offroad Shyok river trail.' },
      { day: 5, title: 'Ride Pangong to Leh via Chang La', details: 'Pass crossing & return.' },
      { day: 6, title: 'Leh Free Day', details: 'Rest & souvenir shopping.' },
      { day: 7, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['Royal Enfield Himalayan 411cc Bike Fuel Included', 'Backup Vehicle + Mechanic + Road Captain', 'Helmets & Riding Gear', '5 Nights Stay + Meals'],
    exclusions: ['Flight fare', 'Security deposit for bike']
  },
  {
    id: 'lad-4',
    destinationId: 'ladakh',
    destinationName: 'Ladakh',
    category: 'Domestic',
    title: 'Zanskar Valley & Phugtal Cave Monastery Trail',
    duration: '8D / 7N',
    price: '₹32,000',
    originalPrice: '₹42,000',
    rating: '4.96',
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    description: 'Unexplored Zanskar valley trek to cliffside Phugtal monastery, Gonbo Rangjon sacred peak, and Padum valley.',
    itinerary: [
      { day: 1, title: 'Leh Arrival', details: 'Acclimatization.' },
      { day: 2, title: 'Leh to Kargil', details: 'Lamayuru monastery.' },
      { day: 3, title: 'Kargil to Padum (Zanskar)', details: 'Cross Penzi La pass & Drang Drung glacier.' },
      { day: 4, title: 'Padum to Purney & Phugtal Monastery Hike', details: 'Trek to honeycomb cliff monastery.' },
      { day: 5, title: 'Padum to Gonbo Rangjon Sacred Mountain', details: 'Stay near monolithic rock peak.' },
      { day: 6, title: 'Zanskar to Leh via Shinku La', details: 'High pass drive.' },
      { day: 7, title: 'Leh Sightseeing', details: 'Thiksey monastery.' },
      { day: 8, title: 'Departure', details: 'Leh airport drop.' }
    ],
    inclusions: ['7 Nights Homestays & Camps', 'All Meals', '4x4 Expedition Vehicle', 'Trek Guide'],
    exclusions: ['Airfare', 'Personal tips']
  },

  // --- BALI PACKAGES (4) ---
  {
    id: 'bali-1',
    destinationId: 'bali',
    destinationName: 'Bali',
    category: 'International',
    title: 'Ubud Rice Terraces, Nusa Penida & Seminyak Luxury',
    duration: '6D / 5N',
    price: '₹28,500',
    originalPrice: '₹36,000',
    rating: '4.95',
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Tegalalang rice terrace swing, Kintamani volcano view, fast boat to Nusa Penida Kelingking T-Rex beach, and Uluwatu Kecak fire dance.',
    itinerary: [
      { day: 1, title: 'Denpasar Arrival & Ubud Villa Check-In', details: 'Welcome flower garland & transfer to private pool villa in Ubud.' },
      { day: 2, title: 'Ubud Swing, Rice Terrace & Waterfall', details: 'Visit Tegalalang rice fields, jungle swing, and Tegenungan Waterfall.' },
      { day: 3, title: 'Kintamani Batur Volcano & Coffee Plantation', details: 'Mount Batur view lunch, Luwak coffee tasting, and Holy Water Temple Tirta Empul.' },
      { day: 4, title: 'Nusa Penida Island Speedboat Day Tour', details: 'Fast boat to Nusa Penida. Visit Kelingking T-Rex Beach, Broken Beach & Angel Billabong.' },
      { day: 5, title: 'Uluwatu Cliff Temple & Kecak Fire Dance', details: 'Cliffside ocean temple view, Kecak dance at sunset & Jimbaran seafood dinner.' },
      { day: 6, title: 'Shopping at Kuta & Departure', details: 'Souvenir shopping & drop at Bali airport.' }
    ],
    inclusions: ['Private Pool Villa (2N) + 4-Star Resort (3N)', 'Daily Breakfast & Jimbaran Candlelight Seafood Dinner', 'Nusa Penida Fast Boat Tickets & Private Island Tour', 'Private AC Car with English Speaking Driver Guide'],
    exclusions: ['Airfare (Available on Request)', 'Visa on Arrival ($35)', 'Personal sports']
  },
  {
    id: 'bali-2',
    destinationId: 'bali',
    destinationName: 'Bali',
    category: 'International',
    title: 'Bali Honeymoon Private Pool Villa & Floating Breakfast',
    duration: '5D / 4N',
    price: '₹32,000',
    originalPrice: '₹42,000',
    rating: '4.98',
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
    description: 'Romantic floating pool breakfast, couple flower spa bath, Tanah Lot sunset temple, and private catamaran cruise.',
    itinerary: [
      { day: 1, title: 'Bali Arrival & Villa Welcome', details: 'Honeymoon bed flower setup.' },
      { day: 2, title: 'Floating Breakfast & 2-Hour Balinese Massage', details: 'Luxury pool floating tray breakfast & spa.' },
      { day: 3, title: 'Tanah Lot Sunset Temple Tour', details: 'Ocean rock temple vistas.' },
      { day: 4, title: 'Nusa Dua Water Sports & Dinner Cruise', details: 'Banana boat & sunset buffet cruise.' },
      { day: 5, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['4 Nights Luxury Private Pool Villa', 'Floating Breakfast (1 Morning)', '2-Hour Couple Spa Session', 'Private AC Vehicle'],
    exclusions: ['Airfare', 'Personal shopping']
  },
  {
    id: 'bali-3',
    destinationId: 'bali',
    destinationName: 'Bali',
    category: 'International',
    title: 'Gili Trawangan Island Hop & Coral Snorkel Trail',
    duration: '7D / 6N',
    price: '₹34,900',
    originalPrice: '₹45,000',
    rating: '4.92',
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    description: 'Combine Bali highlights with 2 nights in Gili Trawangan (car-free paradise island with sea turtle snorkeling & ocean swings).',
    itinerary: [
      { day: 1, title: 'Bali Arrival & Seminyak Stay', details: 'Beach club evening.' },
      { day: 2, title: 'Fast Boat to Gili Trawangan', details: 'Bicycle explore around Gili island.' },
      { day: 3, title: 'Gili Meno & Air Snorkeling Boat Trip', details: 'Swim with sea turtles & underwater statues.' },
      { day: 4, title: 'Gili Trawangan to Ubud Return', details: 'Ubud monkey forest.' },
      { day: 5, title: 'Ubud Swing & Waterfalls', details: 'Tegalalang.' },
      { day: 6, title: 'Tanah Lot & Canggu Beach Clubs', details: 'Sunset at Finns Beach Club.' },
      { day: 7, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['6 Nights Resorts (Ubud, Seminyak & Gili T)', 'Breakfast', 'Fast Boat Round Trip Tickets', 'Snorkeling Equipment'],
    exclusions: ['Airfare', 'Gili Eco Tax']
  },
  {
    id: 'bali-4',
    destinationId: 'bali',
    destinationName: 'Bali',
    category: 'International',
    title: 'Mount Batur Sunrise Volcano Trek & Hot Springs',
    duration: '5D / 4N',
    price: '₹24,900',
    originalPrice: '₹31,000',
    rating: '4.89',
    reviewsCount: 140,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Early morning 4x4 Jeep/trek up Mount Batur volcano crater for sunrise, natural volcanic hot springs, and ATV quad bike adventure.',
    itinerary: [
      { day: 1, title: 'Bali Arrival', details: 'Ubud hotel check-in.' },
      { day: 2, title: 'Mount Batur Sunrise Jeep & Hot Spring', details: '4 AM volcano summit sunrise & volcanic bath.' },
      { day: 3, title: 'ATV Quad Biking & Ayung River Rafting', details: 'Jungle mud trail riding & white water rafting.' },
      { day: 4, title: 'Uluwatu Sunset & Beach Club', details: 'Cliff temple.' },
      { day: 5, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['4 Nights Hotel', 'Breakfast', 'Mount Batur 4x4 Jeep Safari Permit', 'ATV & Rafting Package with Lunch'],
    exclusions: ['Airfare', 'Personal expenses']
  },

  // --- DUBAI PACKAGES (4) ---
  {
    id: 'dub-1',
    destinationId: 'dubai',
    destinationName: 'Dubai',
    category: 'International',
    title: 'Burj Khalifa, Desert Safari & Marina Cruise',
    duration: '5D / 4N',
    price: '₹38,500',
    originalPrice: '₹48,000',
    rating: '4.93',
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    description: 'Burj Khalifa 124th floor view, 4x4 Land Cruiser desert dune bashing with belly dance BBQ dinner, and Marina Dhow cruise.',
    itinerary: [
      { day: 1, title: 'Dubai Arrival & Luxury Marina Dhow Cruise', details: 'Airport pickup in private cab. Evening Marina Dhow Cruise with international buffet dinner.' },
      { day: 2, title: 'Dubai City Tour & Burj Khalifa 124th Floor', details: 'Dubai Frame, Museum of the Future photo stop, Dubai Mall & Burj Khalifa observation deck at sunset.' },
      { day: 3, title: 'Desert Safari 4x4 Dune Bashing & BBQ Night', details: 'Red dune 4x4 bashing, camel ride, sandboarding, henna painting, and live BBQ show.' },
      { day: 4, title: 'Abu Dhabi Grand Mosque & Louvre Day Trip', details: 'Visit Sheikh Zayed Grand Mosque and Louvre Abu Dhabi museum.' },
      { day: 5, title: 'Gold Souk Shopping & Departure', details: 'Traditional Deira Gold & Spice Souk shopping, airport drop.' }
    ],
    inclusions: ['4-Star Hotel Accommodation (4N)', 'Daily Breakfast & 2 Dinners (Dhow & Desert Safari)', 'Burj Khalifa 124/125 Floor Entry Ticket', 'Desert Safari 4x4 Pickup', 'UAE Visa & Insurance Included'],
    exclusions: ['Airfare (Available on Request)', 'Tourism Dirham Fee ($4/night)', 'Personal shopping']
  },
  {
    id: 'dub-2',
    destinationId: 'dubai',
    destinationName: 'Dubai',
    category: 'International',
    title: 'Dubai Luxury Yacht Charter & Palm Jumeirah Helicopter',
    duration: '6D / 5N',
    price: '₹54,000',
    originalPrice: '₹68,000',
    rating: '4.97',
    reviewsCount: 155,
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    description: '12-minute helicopter flight over Palm Jumeirah, 2-hour private yacht cruise, Atlantis Aquaventure waterpark, and VIP desert safari.',
    itinerary: [
      { day: 1, title: 'Dubai Arrival & Private Limousine Transfer', details: 'Check-in 5-star hotel.' },
      { day: 2, title: 'Helicopter Tour & Dubai Mall Shopping', details: 'Sky view over Palm Jumeirah & Atlantis.' },
      { day: 3, title: 'Atlantis Aquaventure & Lost Chambers Aquarium', details: 'Full day access to world’s largest waterpark.' },
      { day: 4, title: '2-Hour Private Yacht Cruise from Marina', details: 'Sailing along Burj Al Arab.' },
      { day: 5, title: 'VIP Desert Safari with Quad Bike', details: 'Private AC tent.' },
      { day: 6, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['5 Nights 5-Star Hotel Stay', 'Breakfast', 'Helicopter Flight Ticket', 'Aquaventure Waterpark Ticket', 'UAE Visa'],
    exclusions: ['Airfare', 'Tourism Dirham']
  },
  {
    id: 'dub-3',
    destinationId: 'dubai',
    destinationName: 'Dubai',
    category: 'International',
    title: 'Abu Dhabi Ferrari World & Warner Bros Theme Park Special',
    duration: '5D / 4N',
    price: '₹42,000',
    originalPrice: '₹52,000',
    rating: '4.91',
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    description: 'Ride Formula Rossa (world’s fastest roller coaster) at Ferrari World Abu Dhabi & explore Warner Bros Theme Park.',
    itinerary: [
      { day: 1, title: 'Dubai Arrival', details: 'Dhow cruise evening.' },
      { day: 2, title: 'Dubai City Tour & Burj Khalifa', details: '124th floor ticket.' },
      { day: 3, title: 'Abu Dhabi Ferrari World Day Trip', details: 'Formula Rossa roller coaster & Formula 1 simulator.' },
      { day: 4, title: 'Desert Safari 4x4', details: 'Dune bashing & BBQ.' },
      { day: 5, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['4 Nights Hotel', 'Breakfast', 'Ferrari World Entry Ticket', 'Burj Khalifa Ticket', 'UAE Visa'],
    exclusions: ['Airfare', 'Personal expenses']
  },
  {
    id: 'dub-4',
    destinationId: 'dubai',
    destinationName: 'Dubai',
    category: 'International',
    title: 'Dubai Shopping Festival & Global Village Special',
    duration: '4D / 3N',
    price: '₹32,500',
    originalPrice: '₹40,000',
    rating: '4.88',
    reviewsCount: 170,
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&w=800&q=80',
    description: 'Visit Global Village multicultural pavilion, Miracle Garden flower installation, and Gold Souk shopping spree.',
    itinerary: [
      { day: 1, title: 'Dubai Arrival', details: 'Hotel check-in.' },
      { day: 2, title: 'Dubai Miracle Garden & Global Village', details: 'World’s largest natural flower garden & cultural stalls.' },
      { day: 3, title: 'Burj Khalifa & Desert Safari', details: 'Dune bashing & BBQ show.' },
      { day: 4, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['3 Nights Hotel', 'Breakfast', 'Miracle Garden & Global Village Entry Tickets', 'Desert Safari', 'UAE Visa'],
    exclusions: ['Airfare', 'Personal shopping']
  },

  // --- THAILAND PACKAGES (4) ---
  {
    id: 'thai-1',
    destinationId: 'thailand',
    destinationName: 'Thailand',
    category: 'International',
    title: 'Phuket Speedboat, Phi Phi Island & Bangkok Temples',
    duration: '6D / 5N',
    price: '₹22,900',
    originalPrice: '₹31,000',
    rating: '4.92',
    reviewsCount: 340,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    description: 'Phuket James Bond island, Maya Bay speedboat snorkeling, Big Buddha, and Bangkok Golden Buddha temple tour.',
    itinerary: [
      { day: 1, title: 'Phuket Arrival & Patong Beach Nightlife', details: 'Airport pickup. Check-in resort. Evening Bangla Road vibe.' },
      { day: 2, title: 'Phi Phi Island & Maya Bay Speedboat Tour', details: 'Full day luxury speedboat excursion to Maya Bay (The Beach movie site), Monkey Beach & snorkeling with lunch.' },
      { day: 3, title: 'James Bond Island & Phang Nga Bay Kayaking', details: 'Canoeing through limestone caves & James Bond Island needle rock.' },
      { day: 4, title: 'Fly Phuket to Bangkok & Chao Phraya Cruise', details: 'Fly to Bangkok. Check-in hotel. Evening Chao Phraya Princess Dinner Cruise.' },
      { day: 5, title: 'Bangkok City & Temple Tour', details: 'Visit Reclining Buddha (Wat Pho) and Marble Temple (Wat Benchamabophit).' },
      { day: 6, title: 'Shopping at Platinum Mall & Departure', details: 'Souvenir shopping & airport drop.' }
    ],
    inclusions: ['5 Nights Hotel Stay (3N Phuket + 2N Bangkok)', 'Daily Breakfast & 2 Buffet Lunches', 'Phi Phi Island Speedboat Package with Snorkeling Gear', 'Chao Phraya Dinner Cruise Ticket', 'Private Airport Transfers'],
    exclusions: ['Airfare (Internal flights optional)', 'National Park Fee (~400 THB)', 'Visa Fees (Visa on Arrival Free/Nominal)']
  },
  {
    id: 'thai-2',
    destinationId: 'thailand',
    destinationName: 'Thailand',
    category: 'International',
    title: 'Krabi 4-Islands Speedboat & Emerald Pool Jungle Safari',
    duration: '5D / 4N',
    price: '₹19,500',
    originalPrice: '₹26,000',
    rating: '4.90',
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Krabi 4 Islands (Phra Nang, Tup, Chicken, Poda), Tiger Cave Temple, Emerald Pool hot springs, and Ao Nang beach.',
    itinerary: [
      { day: 1, title: 'Krabi Arrival & Ao Nang Beach', details: 'Check-in beach resort.' },
      { day: 2, title: 'Krabi 4 Islands Speedboat Tour', details: 'Snorkeling at Chicken Island & walking on sandbar between Tup and Mor islands.' },
      { day: 3, title: 'Emerald Pool & Blue Lagoon Hot Springs', details: 'Jungle trek to natural thermal crystal pools.' },
      { day: 4, title: 'Hong Island Catamaran Tour', details: 'Lagoon kayaking & white sand beaches.' },
      { day: 5, title: 'Departure', details: 'Krabi airport drop.' }
    ],
    inclusions: ['4 Nights Beach Resort', 'Breakfast & 2 Lunches', '4 Islands Speedboat Package', 'Private Transfers'],
    exclusions: ['Airfare', 'National park fee']
  },
  {
    id: 'thai-3',
    destinationId: 'thailand',
    destinationName: 'Thailand',
    category: 'International',
    title: 'Chiang Mai Elephant Sanctuary & White Temple Safari',
    duration: '5D / 4N',
    price: '₹24,000',
    originalPrice: '₹32,000',
    rating: '4.96',
    reviewsCount: 125,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    description: 'Bathe & feed elephants at ethical Chiang Mai sanctuary, visit Chiang Rai White Temple (Wat Rong Khun), and night markets.',
    itinerary: [
      { day: 1, title: 'Chiang Mai Arrival', details: 'Night bazaar explore.' },
      { day: 2, title: 'Ethical Elephant Rescue Sanctuary', details: 'Feed, walk, and river bath with elephants.' },
      { day: 3, title: 'Chiang Rai White Temple & Golden Triangle', details: 'Wat Rong Khun & Mekong river border view.' },
      { day: 4, title: 'Doi Suthep Mountain Temple', details: 'Cable car & panoramic city view.' },
      { day: 5, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['4 Nights Boutique Hotel', 'Breakfast & 2 Lunches', 'Elephant Sanctuary Pass', 'Private Transfers'],
    exclusions: ['Airfare', 'Personal tips']
  },
  {
    id: 'thai-4',
    destinationId: 'thailand',
    destinationName: 'Thailand',
    category: 'International',
    title: 'Pattaya Coral Island & Sanctuary of Truth Special',
    duration: '5D / 4N',
    price: '₹17,800',
    originalPrice: '₹24,000',
    rating: '4.86',
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Pattaya Coral Island speedboat parasailing, Sanctuary of Truth wooden temple, Alcazar cabaret show, and Bangkok shopping.',
    itinerary: [
      { day: 1, title: 'Bangkok Airport to Pattaya Drive', details: 'Check-in hotel. Evening Alcazar Cabaret Show.' },
      { day: 2, title: 'Coral Island Speedboat with Lunch', details: 'Parasailing, sea walking & Indian buffet lunch.' },
      { day: 3, title: 'Sanctuary of Truth & Nong Nooch Garden', details: 'All-wooden temple architecture & botanical park.' },
      { day: 4, title: 'Pattaya to Bangkok Transfer & Safari World', details: 'Open zoo drive.' },
      { day: 5, title: 'Departure', details: 'Bangkok airport drop.' }
    ],
    inclusions: ['4 Nights Hotel Stay (2N Pattaya + 2N Bangkok)', 'Breakfast & Lunch', 'Coral Island Speedboat', 'Alcazar Show Ticket'],
    exclusions: ['Airfare', 'Personal sports']
  },

  // --- SWITZERLAND PACKAGES (4) ---
  {
    id: 'swiss-1',
    destinationId: 'switzerland',
    destinationName: 'Switzerland & Alps',
    category: 'International',
    title: 'Jungfraujoch Top of Europe & Glacier Express Trail',
    duration: '7D / 6N',
    price: '₹1,25,000',
    originalPrice: '₹1,55,000',
    rating: '4.98',
    reviewsCount: 160,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    description: 'Eiger Express cogwheel train to Jungfraujoch (3,454m snow peak), Lucerne Chapel Bridge, Interlaken lake cruise, and Swiss Pass access.',
    itinerary: [
      { day: 1, title: 'Zurich Arrival & Lake Zurich Cruise', details: 'Airport pickup. Check-in hotel. Evening Bahnhofstrasse luxury street walk.' },
      { day: 2, title: 'Zurich to Lucerne & Mount Titlis Cable Car', details: 'Lucerne Chapel Bridge, Lion Monument & Mount Titlis Revolving Rotair Cable Car.' },
      { day: 3, title: 'Lucerne to Interlaken via GoldenPass Express', details: 'Panoramic train ride through Swiss countryside lakes & chalets.' },
      { day: 4, title: 'Jungfraujoch — Top of Europe Snow Peak', details: 'Eiger Express cable car to Ice Palace & Sphinx Observatory (3,454m).' },
      { day: 5, title: 'Interlaken Lake Brienz Cruise & Lauterbrunnen', details: 'Boat cruise on turquoise Lake Brienz & 72 waterfalls valley Lauterbrunnen.' },
      { day: 6, title: 'Interlaken to Zermatt & Matterhorn View', details: 'Gornergrat rack railway ride to view iconic Matterhorn peak.' },
      { day: 7, title: 'Geneva / Zurich Departure', details: 'Airport drop.' }
    ],
    inclusions: ['6 Nights 4-Star Hotel Accommodation', 'Swiss Travel Pass (8 Days Consecutive - Unlimited Trains/Buses)', 'Jungfraujoch Mountain Cogwheel Ticket', 'Mount Titlis Cable Car Ticket', 'Daily Swiss Buffet Breakfast'],
    exclusions: ['International Airfare', 'Lunch/Dinner', 'Swiss Visa']
  },
  {
    id: 'swiss-2',
    destinationId: 'switzerland',
    destinationName: 'Switzerland & Alps',
    category: 'International',
    title: 'Swiss Alps Romance & Paris Eiffel Tower Special',
    duration: '8D / 7N',
    price: '₹1,45,000',
    originalPrice: '₹1,80,000',
    rating: '4.96',
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'Combine Swiss alpine vistas in Interlaken with romantic Paris Eiffel Tower summit, Seine river cruise, and Louvre museum.',
    itinerary: [
      { day: 1, title: 'Paris Arrival & Seine River Cruise', details: 'Illuminated evening boat cruise.' },
      { day: 2, title: 'Eiffel Tower 2nd Level & Louvre Museum', details: 'Monuement tour.' },
      { day: 3, title: 'Paris to Basel / Interlaken TGV High-Speed Train', details: 'Cross into Switzerland.' },
      { day: 4, title: 'Jungfraujoch Top of Europe', details: 'Snow peak.' },
      { day: 5, title: 'Lucerne & Mount Titlis', details: 'Revolving cable car.' },
      { day: 6, title: 'Zurich City Tour & Lindt Chocolate Home', details: 'Chocolate fountain tour.' },
      { day: 7, title: 'Rhine Falls Day Trip', details: 'Europe’s biggest waterfall boat ride.' },
      { day: 8, title: 'Zurich Departure', details: 'Airport drop.' }
    ],
    inclusions: ['7 Nights Hotels (3N Paris + 4N Swiss)', 'Breakfast', 'TGV Train Paris to Swiss', 'Eiffel Tower & Jungfrau Tickets'],
    exclusions: ['Airfare', 'Schengen Visa']
  },
  {
    id: 'swiss-3',
    destinationId: 'switzerland',
    destinationName: 'Switzerland & Alps',
    category: 'International',
    title: 'Grand European 4-Country Circuit (Swiss, France, Italy, Austria)',
    duration: '10D / 9N',
    price: '₹1,85,000',
    originalPrice: '₹2,30,000',
    rating: '4.97',
    reviewsCount: 105,
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    description: 'Paris Eiffel Tower, Swiss Alps Interlaken, Venice Gondola cruise, Rome Colosseum, and Florence Renaissance tour.',
    itinerary: [
      { day: 1, title: 'Paris Arrival', details: 'Hotel check-in.' },
      { day: 2, title: 'Paris Sightseeing & Eiffel', details: 'City tour.' },
      { day: 3, title: 'Paris to Interlaken', details: 'Swiss Alps.' },
      { day: 4, title: 'Jungfraujoch Snow Peak', details: 'Cogwheel train.' },
      { day: 5, title: 'Interlaken to Venice', details: 'Canal city arrival.' },
      { day: 6, title: 'Venice Gondola Ride & St. Mark Square', details: 'Private gondola ride.' },
      { day: 7, title: 'Venice to Florence & Leaning Tower of Pisa', details: 'Tuscany countryside.' },
      { day: 8, title: 'Florence to Rome & Colosseum', details: 'Ancient Rome.' },
      { day: 9, title: 'Vatican City & St. Peter Basilica', details: 'Vatican museum.' },
      { day: 10, title: 'Departure from Rome', details: 'Airport drop.' }
    ],
    inclusions: ['9 Nights 4-Star Hotels', 'Daily Breakfast', 'Venice Gondola Ride', 'Inter-country Rail/Coach', 'Schengen Guidance'],
    exclusions: ['Airfare', 'Schengen Visa fee']
  },
  {
    id: 'swiss-4',
    destinationId: 'switzerland',
    destinationName: 'Switzerland & Alps',
    category: 'International',
    title: 'Matterhorn Zermatt Glacier & Lake Geneva Trail',
    duration: '6D / 5N',
    price: '₹1,10,000',
    originalPrice: '₹1,40,000',
    rating: '4.92',
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    description: 'Car-free Zermatt village under Matterhorn peak, Montreux Chillon castle, and Geneva jet d’eau fountain.',
    itinerary: [
      { day: 1, title: 'Geneva Arrival & Lake Geneva Promenade', details: 'Jet d’eau & UN headquarters.' },
      { day: 2, title: 'Geneva to Montreux & Chillon Castle', details: 'Lakefront promenade & castle entry.' },
      { day: 3, title: 'Montreux to Zermatt (Car-Free Village)', details: 'Matterhorn viewing point.' },
      { day: 4, title: 'Gornergrat Railway Ride', details: 'Panoramic platform at 3,089m.' },
      { day: 5, title: 'Zermatt to Zurich', details: 'Old town walking tour.' },
      { day: 6, title: 'Departure', details: 'Zurich airport drop.' }
    ],
    inclusions: ['5 Nights Hotel Accommodation', 'Swiss Travel Pass', 'Gornergrat Railway Ticket', 'Daily Breakfast'],
    exclusions: ['Airfare', 'Schengen Visa']
  },

  // --- VIETNAM PACKAGES (4) ---
  {
    id: 'viet-1',
    destinationId: 'vietnam',
    destinationName: 'Vietnam',
    category: 'International',
    title: 'Ha Long Bay Junk Cruise, Hanoi & Hoi An Lanterns',
    duration: '6D / 5N',
    price: '₹26,900',
    originalPrice: '₹35,000',
    rating: '4.94',
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    description: 'Overnight 5-star Ha Long Bay luxury cruise with cave kayaking, Ninh Binh bamboo boat, Da Nang Golden Hands Bridge, and Hoi An lanterns.',
    itinerary: [
      { day: 1, title: 'Hanoi Arrival & Old Quarter Street Food Tour', details: 'Airport pickup. Egg coffee tasting & cyclo ride through 36 guild streets.' },
      { day: 2, title: 'Hanoi to Ha Long Bay 5-Star Luxury Cruise Boarding', details: 'Board cruise, kayak through Sung Sot Cave, sunset party on deck & squid fishing.' },
      { day: 3, title: 'Ha Long Bay Tai Chi & Drive to Ninh Binh (Trang An)', details: 'Morning Tai Chi on deck, bamboo boat row through Trang An karst caves.' },
      { day: 4, title: 'Fly Hanoi to Da Nang & Golden Hands Bridge (Ba Na Hills)', details: 'Cable car up Ba Na Hills to giant Golden Hands Bridge.' },
      { day: 5, title: 'Hoi An Ancient Town & Lantern Night Market', details: 'Japanese Covered Bridge, tailor shops & floating lantern boat ride.' },
      { day: 6, title: 'Departure from Da Nang / Hanoi', details: 'Souvenir shopping & airport drop.' }
    ],
    inclusions: ['5-Star Ha Long Bay Cruise (1N) + 4-Star Hotels (4N)', 'All Meals on Cruise + Daily Hotel Breakfast', 'Trang An Bamboo Boat & Ba Na Hills Cable Car Pass', 'Private Airport & Intercity Transfers'],
    exclusions: ['Airfare (Internal flight optional)', 'E-Visa fee ($25)', 'Personal tips']
  },
  {
    id: 'viet-2',
    destinationId: 'vietnam',
    destinationName: 'Vietnam',
    category: 'International',
    title: 'Phu Quoc Tropical Beach Island & Sun World Cable Car',
    duration: '5D / 4N',
    price: '₹29,800',
    originalPrice: '₹38,000',
    rating: '4.91',
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'World’s longest non-stop 3-wire cable car to Sun World Hon Thom island, starfish beach, and Phu Quoc night market.',
    itinerary: [
      { day: 1, title: 'Phu Quoc Arrival & Sunset Sanato', details: 'Check-in beach resort.' },
      { day: 2, title: '3-Islands Speedboat & Coral Reef Snorkeling', details: 'Gam Ghi, May Rut, Fingernail island hopping.' },
      { day: 3, title: 'Hon Thom Cable Car & Waterpark', details: 'Over-sea cable car trip.' },
      { day: 4, title: 'Grand World Phu Quoc Venice Water Show', details: 'Venetian gondola ride.' },
      { day: 5, title: 'Departure', details: 'Phu Quoc airport drop.' }
    ],
    inclusions: ['4 Nights Beach Resort', 'Breakfast & 1 Island Lunch', 'Hon Thom Cable Car Ticket', 'Private Transfers'],
    exclusions: ['Airfare', 'E-Visa']
  },
  {
    id: 'viet-3',
    destinationId: 'vietnam',
    destinationName: 'Vietnam',
    category: 'International',
    title: 'Ho Chi Minh Cu Chi Tunnels & Mekong Delta Sampan Tour',
    duration: '5D / 4N',
    price: '₹24,500',
    originalPrice: '₹32,000',
    rating: '4.88',
    reviewsCount: 160,
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    description: 'Explore subterranean Cu Chi tunnels from Vietnam War, coconut candy farms in Mekong Delta sampan boats, and Saigon Notre Dame.',
    itinerary: [
      { day: 1, title: 'Ho Chi Minh City Arrival', details: 'Ben Thanh market.' },
      { day: 2, title: 'Cu Chi Tunnels Underground Safari', details: 'Crawl through war bunkers & AK47 shooting range option.' },
      { day: 3, title: 'Mekong Delta My Tho Sampan Rowing', details: 'Traditional boat row through coconut channels & tropical fruit tasting.' },
      { day: 4, title: 'Saigon French Architecture & War Remnants Museum', details: 'Post Office & Palace.' },
      { day: 5, title: 'Departure', details: 'Ho Chi Minh airport drop.' }
    ],
    inclusions: ['4 Nights Hotel Stay', 'Breakfast & 2 Lunches', 'Cu Chi Tunnels & Mekong Delta Passes', 'Private Cab'],
    exclusions: ['Airfare', 'E-Visa']
  },
  {
    id: 'viet-4',
    destinationId: 'vietnam',
    destinationName: 'Vietnam',
    category: 'International',
    title: 'Complete Vietnam North to South Grand Heritage',
    duration: '8D / 7N',
    price: '₹39,500',
    originalPrice: '₹51,000',
    rating: '4.96',
    reviewsCount: 185,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive 8-day tour covering Hanoi, Ha Long Bay overnight cruise, Da Nang Golden Bridge, Hoi An, and Ho Chi Minh.',
    itinerary: [
      { day: 1, title: 'Hanoi Arrival', details: 'Old Quarter.' },
      { day: 2, title: 'Ha Long Bay Cruise Boarding', details: 'Overnight luxury cruise.' },
      { day: 3, title: 'Ha Long to Hanoi & Fly to Da Nang', details: 'Flight to Central Vietnam.' },
      { day: 4, title: 'Ba Na Hills Golden Bridge', details: 'Cable car.' },
      { day: 5, title: 'Hoi An Lantern Town', details: 'Boat ride.' },
      { day: 6, title: 'Fly to Ho Chi Minh City', details: 'City tour.' },
      { day: 7, title: 'Mekong Delta Day Trip', details: 'Sampan boat.' },
      { day: 8, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['7 Nights Hotels including Cruise', 'Breakfast & 3 Lunches', 'All Sightseeing Passes', 'Private Transfers'],
    exclusions: ['Airfare', 'E-Visa']
  },

  // --- MALDIVES PACKAGES (4) ---
  {
    id: 'mald-1',
    destinationId: 'maldives',
    destinationName: 'Maldives',
    category: 'International',
    title: 'Overwater Pool Villa Escape & Sunset Dolphin Cruise',
    duration: '4D / 3N',
    price: '₹62,000',
    originalPrice: '₹82,000',
    rating: '4.98',
    reviewsCount: 240,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    description: 'Stay in a luxury 5-star private overwater villa with direct ocean access, speedboat transfer, all-inclusive meals, and dolphin cruise.',
    itinerary: [
      { day: 1, title: 'Male Arrival & Speedboat Transfer to Resort', details: 'Welcome drinks at private island resort. Check-in Overwater Pool Villa.' },
      { day: 2, title: 'Coral Reef Snorkeling & Sunset Dolphin Safari', details: 'Guided snorkeling with sea turtles & evening speed catamaran dolphin cruise.' },
      { day: 3, title: 'Spa Wellness & Candlelit Beachfront Dinner', details: 'Relaxing Balinese massage & romantic candlelit 3-course dinner on private sandbank.' },
      { day: 4, title: 'Speedboat Transfer & Departure', details: 'Buffet breakfast & speedboat drop to Male International Airport.' }
    ],
    inclusions: ['3 Nights Overwater Villa with Private Pool', 'All-Inclusive Meal Plan (Breakfast, Lunch, Dinner & Drinks)', 'Roundtrip Speedboat Transfers from Male Airport', 'Sunset Dolphin Cruise Ticket', 'Complimentary Snorkeling Equipment'],
    exclusions: ['Airfare (Available on Request)', 'Green Tax ($6/person/night included or extra)', 'Personal shopping']
  },
  {
    id: 'mald-2',
    destinationId: 'maldives',
    destinationName: 'Maldives',
    category: 'International',
    title: 'Maldives All-Inclusive Beach Villa & Seaplane Flight',
    duration: '5D / 4N',
    price: '₹78,000',
    originalPrice: '₹98,000',
    rating: '4.96',
    reviewsCount: 150,
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
    description: 'Panoramic seaplane flight over turquoise atolls, 2 nights Beach Villa + 2 nights Water Villa with unlimited cocktails.',
    itinerary: [
      { day: 1, title: 'Seaplane Flight from Male to Resort', details: 'Bird-eye view over coral atolls.' },
      { day: 2, title: 'Beach Villa Tropical Relax', details: 'Direct white sand beach access.' },
      { day: 3, title: 'Villa Switch to Overwater Lagoon Villa', details: 'Ocean glass floor view.' },
      { day: 4, title: 'Underwater Dining & Water Sports', details: 'Paddleboarding & windsurfing.' },
      { day: 5, title: 'Seaplane Transfer & Departure', details: 'Return seaplane to Male airport.' }
    ],
    inclusions: ['4 Nights Split Stay (2N Beach Villa + 2N Water Villa)', 'All-Inclusive Dine Around Meals & Drinks', 'Roundtrip Seaplane Transfers', 'Non-motorized Water Sports'],
    exclusions: ['Airfare', 'Motorized sports']
  },
  {
    id: 'mald-3',
    destinationId: 'maldives',
    destinationName: 'Maldives',
    category: 'International',
    title: 'Budget Paradise Island Guesthouse & Nurse Shark Swim',
    duration: '5D / 4N',
    price: '₹34,500',
    originalPrice: '₹45,000',
    rating: '4.91',
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Stay on Maafushi/Fulidhoo local island, swim with nurse sharks & stingrays at Vaavu atoll, sandbank picnic.',
    itinerary: [
      { day: 1, title: 'Speedboat to Maafushi Island', details: 'Check-in beachfront hotel.' },
      { day: 2, title: 'Full Day Nurse Shark & Shipwreck Snorkeling', details: 'Swim with friendly nurse sharks & underwater photos.' },
      { day: 3, title: 'Private Sandbank Picnic & Dolphin Watching', details: 'Uninhabited island beach picnic.' },
      { day: 4, title: 'Luxury 5-Star Resort Day Pass Option', details: 'Access overwater bar & pool.' },
      { day: 5, title: 'Departure', details: 'Speedboat to Male airport.' }
    ],
    inclusions: ['4 Nights Beachfront Hotel', 'Breakfast & Lunch on Tours', 'Nurse Shark Snorkeling Excursion with Drone Photos', 'Speedboat Transfers'],
    exclusions: ['Airfare', 'Dinner']
  },
  {
    id: 'mald-4',
    destinationId: 'maldives',
    destinationName: 'Maldives',
    category: 'International',
    title: 'Maldives Honeymoon Extravaganza & Floating Breakfast',
    duration: '4D / 3N',
    price: '₹68,500',
    originalPrice: '₹89,000',
    rating: '4.99',
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    description: 'Honeymoon special overwater villa stay with floating breakfast, bed decoration, sunset wine toast, and couple spa.',
    itinerary: [
      { day: 1, title: 'Speedboat Arrival & Honeymoon Setup', details: 'Bed flower arrangement & champagne.' },
      { day: 2, title: 'Floating Pool Breakfast & Snorkel', details: 'Morning floating tray.' },
      { day: 3, title: 'Couple Spa Session & Candlelit Dinner', details: 'Sunset beach setup.' },
      { day: 4, title: 'Departure', details: 'Speedboat to Male.' }
    ],
    inclusions: ['3 Nights Overwater Villa', 'Full Board Meals (Breakfast, Lunch, Dinner)', 'Floating Breakfast In-Villa', 'Speedboat Transfers', 'Honeymoon Inclusions'],
    exclusions: ['Airfare', 'Personal tips']
  },

  // --- SINGAPORE PACKAGES (4) ---
  {
    id: 'sing-1',
    destinationId: 'singapore',
    destinationName: 'Singapore & Malaysia',
    category: 'International',
    title: 'Marina Bay Sands, Universal Studios & Sentosa Fun',
    duration: '5D / 4N',
    price: '₹42,500',
    originalPrice: '₹54,000',
    rating: '4.93',
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    description: 'Gardens by the Bay Light Show, Skypark Observation Deck, Sentosa Cable Car, Universal Studios rides, and Night Safari.',
    itinerary: [
      { day: 1, title: 'Singapore Arrival & Gardens by the Bay Light Show', details: 'Airport pickup. Visit Supertree Grove & Rhapsody light show.' },
      { day: 2, title: 'Universal Studios Sentosa Island Full Day', details: 'Transformers 3D ride, Battlestar Galactica coaster, Revenge of the Mummy.' },
      { day: 3, title: 'Sentosa Cable Car, Wings of Time & S.E.A. Aquarium', details: 'Cable car ride over harbor & evening ocean laser show.' },
      { day: 4, title: 'Singapore City Tour & Night Safari', details: 'Merlion Park, Chinatown, Little India, & world’s 1st Night Safari tram.' },
      { day: 5, title: 'Jewel Changi Rain Vortex & Departure', details: 'Visit 40m indoor waterfall Rain Vortex at Changi & flight home.' }
    ],
    inclusions: ['4-Star Hotel Accommodation (4N)', 'Daily Breakfast', 'Universal Studios Express/Standard Ticket', 'Night Safari & Gardens by the Bay Tickets', 'Private Airport & Sightseeing Transfers'],
    exclusions: ['Airfare', 'Singapore Visa ($30)', 'Personal expenses']
  },
  {
    id: 'sing-2',
    destinationId: 'singapore',
    destinationName: 'Singapore & Malaysia',
    category: 'International',
    title: 'Singapore & Kuala Lumpur Twin City Express',
    duration: '6D / 5N',
    price: '₹49,900',
    originalPrice: '₹62,000',
    rating: '4.91',
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    description: 'Combine Singapore modern attractions with Kuala Lumpur Petronas Twin Towers, Batu Caves golden statue, and Genting Highlands.',
    itinerary: [
      { day: 1, title: 'Singapore Arrival & Merlion Park', details: 'City tour.' },
      { day: 2, title: 'Universal Studios Sentosa', details: 'Full day rides.' },
      { day: 3, title: 'Luxury Coach Singapore to Kuala Lumpur', details: 'Cross Causeway border into Malaysia.' },
      { day: 4, title: 'KL City Tour & Petronas Twin Towers', details: 'Skybridge entry & KL Tower.' },
      { day: 5, title: 'Batu Caves & Genting Highlands Cable Car', details: '272 rainbow steps & casino resort.' },
      { day: 6, title: 'Departure from KLIA Airport', details: 'Airport drop.' }
    ],
    inclusions: ['5 Nights Hotel (3N Singapore + 2N KL)', 'Daily Breakfast', 'Intercity Coach Ticket', 'Theme Park Passes'],
    exclusions: ['Airfare', 'Visas (Singapore & Malaysia)']
  },
  {
    id: 'sing-3',
    destinationId: 'singapore',
    destinationName: 'Singapore & Malaysia',
    category: 'International',
    title: 'Langkawi Island SkyBridge & Mangrove Kayak Safari',
    duration: '5D / 4N',
    price: '₹28,900',
    originalPrice: '₹37,000',
    rating: '4.88',
    reviewsCount: 140,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Duty-free Langkawi island, cable car ride to curved SkyBridge suspension over rainforest, Kilim karst mangrove boat safari.',
    itinerary: [
      { day: 1, title: 'Langkawi Arrival & Cenang Beach Walk', details: 'Resort check-in.' },
      { day: 2, title: 'Langkawi Cable Car & SkyBridge', details: 'Highest cable car & 3D art museum.' },
      { day: 3, title: 'Kilim Karst Geoforest Mangrove Safari', details: 'Eagle feeding & bat cave boat tour.' },
      { day: 4, title: 'Island Hopping Speedboat Tour', details: 'Pregnant Maiden island & freshwater lake.' },
      { day: 5, title: 'Duty-Free Shopping & Departure', details: 'Airport drop.' }
    ],
    inclusions: ['4 Nights Beach Resort', 'Breakfast', 'Cable Car & SkyBridge Ticket', 'Mangrove Boat Pass'],
    exclusions: ['Airfare', 'Malaysia Tourism Tax']
  },
  {
    id: 'sing-4',
    destinationId: 'singapore',
    destinationName: 'Singapore & Malaysia',
    category: 'International',
    title: 'Singapore Cruise & Royal Caribbean Ocean Getaway',
    duration: '6D / 5N',
    price: '₹58,000',
    originalPrice: '₹74,000',
    rating: '4.95',
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1548574505-5e2386903b87?auto=format&fit=crop&w=800&q=80',
    description: '2 nights Singapore hotel + 3 nights Royal Caribbean / Genting Dream luxury ocean cruise with unlimited dining & Broadway shows.',
    itinerary: [
      { day: 1, title: 'Singapore Arrival & Gardens by the Bay', details: 'Hotel check-in.' },
      { day: 2, title: 'City Tour & Cruise Terminal Boarding', details: 'Board cruise ship in evening.' },
      { day: 3, title: 'Cruising High Seas — Water Slides & Shows', details: 'Casino, theater & pool deck.' },
      { day: 4, title: 'Port of Call Excursion (Penang / Phuket)', details: 'Disembark for shore tour.' },
      { day: 5, title: 'Disembark Cruise & Sentosa Island', details: 'Resort stay in Singapore.' },
      { day: 6, title: 'Departure', details: 'Airport drop.' }
    ],
    inclusions: ['3 Nights Royal Caribbean Cruise Cabin + 2 Nights Singapore Hotel', 'All Meals on Cruise', 'Cruise Taxes & Gratuities', 'Private Airport Transfers'],
    exclusions: ['Airfare', 'Singapore Visa']
  }
];

// Founder & Brand Info
export const BRAND_INFO = {
  name: 'Samyati World Private Limited',
  tagline: 'Rediscover Yourself With Every Journey',
  founders: [
    { name: 'Aniket Shrivastava', role: 'Marketing & Growth' },
    { name: 'Shardul Vikram Singh', role: 'Operations & Finance' },
    { name: 'Gourav Dixit', role: 'Sales & Contracting' }
  ],
  story: `Samyati The World began long before it became a company—with three college friends, a shared love for travel, and a dream of creating journeys that truly mean something.

After gaining hands-on experience across the travel industry, Aniket Shrivastava, Shardul Vikram Singh, and Gourav Dixit came together again—this time combining their strengths in marketing and growth, operations and finance, and sales and contracting. But Samyati was never meant to be just another travel company.

It was created with a simple belief: people don’t merely travel to see new places; they travel to feel alive, create stories, and sometimes, rediscover a part of themselves they had forgotten.

That belief inspires every journey we design. By listening to each traveller and understanding their dreams, preferences, and budget, Samyati transforms travel plans into deeply personal experiences—thoughtfully curated and carefully managed from the first conversation to the journey home.

Because with Samyati The World, every destination is more than a place—it is an invitation to Rediscover Yourself With Every Journey.`,
  mission: 'Our mission is to make travel personal, transparent, and meaningful by creating thoughtfully curated journeys that inspire every traveller to rediscover themselves.',
  vision: "Our vision is to become India’s most trusted travel brand, known for creating personalized journeys that turn every trip into a meaningful and memorable experience.",
  phone: '9589110765',
  email: 'sales@samyatitheworld.in',
  instagram: 'https://www.instagram.com/samyatitheworld?igsh=OHpyMm9uNGNoMTg=',
  linkedin: 'https://www.linkedin.com/company/samyati-the-world/'
};
