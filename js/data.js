/**
 * Karnataka Travel Diaries - Centralized Destination Data Store
 * Unified single source of truth for destinations, clusters, and geographic hierarchy
 */

const karnatakaClusters = [
  {
    "slug": "coastal-karnataka",
    "name": "Coastal Karnataka",
    "region": "Coastal Karnataka (Karavali)",
    "description": "Sun-drenched Arabian Sea coastline, pristine Blue Flag beaches, ancient coastal Shiva & Shakti temples, river backwaters, and legendary Karavali seafood.",
    "destinations": [
      "dharmasthala",
      "kukke-subrahmanya",
      "mangalore",
      "udupi",
      "murudeshwar",
      "honnavar",
      "gokarna",
      "karwar"
    ],
    "corridor": [
      "dharmasthala",
      "kukke-subrahmanya",
      "mangalore",
      "udupi",
      "murudeshwar",
      "honnavar",
      "gokarna",
      "karwar"
    ],
    "scenicHighways": [
      "NH-66 Coastal Highway",
      "Charmadi Ghat",
      "Shiradi Ghat"
    ]
  },
  {
    "slug": "malnad",
    "name": "Malnad & Western Ghats",
    "region": "Malnad (Central Western Ghats)",
    "description": "Misty mountain passes, lush coffee and cardamom estates, biodiversity hotspots, roaring waterfalls, and sacred river origin shrines.",
    "destinations": [
      "chikmagalur",
      "sakleshpur",
      "kudremukh",
      "sringeri",
      "jog-falls"
    ],
    "corridor": [
      "sakleshpur",
      "chikmagalur",
      "kudremukh",
      "sringeri",
      "jog-falls"
    ],
    "scenicHighways": [
      "Chikmagalur-Sringeri Ghat Road",
      "Bisle Ghat Scenic Route"
    ]
  },
  {
    "slug": "mysore-southern",
    "name": "Mysore / Southern Karnataka",
    "region": "Southern Karnataka",
    "description": "Royal palaces, historical island forts, rich silk and sandalwood heritage, misty Kodava coffee highlands, and premier tiger reserves.",
    "destinations": [
      "bengaluru",
      "srirangapatna",
      "mysore",
      "coorg",
      "bandipur",
      "nagarhole",
      "belur-halebidu"
    ],
    "corridor": [
      "bengaluru",
      "srirangapatna",
      "mysore",
      "nagarhole",
      "bandipur",
      "coorg",
      "belur-halebidu"
    ],
    "scenicHighways": [
      "Bengaluru-Mysuru Expressway",
      "Mysuru-Madikeri Road"
    ]
  },
  {
    "slug": "bengaluru-region",
    "name": "Bengaluru Region",
    "region": "Bengaluru & Surrounds",
    "description": "Cosmopolitan garden city, cloud-kissed sunrise peaks, prehistoric monolithic hills, silk cocoon markets, and vineyard retreats.",
    "destinations": [
      "bengaluru",
      "nandi-hills"
    ],
    "corridor": [
      "bengaluru",
      "nandi-hills"
    ],
    "scenicHighways": [
      "Bellary Road / Airport Highway"
    ]
  },
  {
    "slug": "hampi-north",
    "name": "Hampi / North Karnataka Heritage",
    "region": "North-Central Karnataka",
    "description": "UNESCO World Heritage boulder ruins of Vijayanagara, 6th-century Chalukyan red sandstone caves, and the cradle of South Indian stone architecture.",
    "destinations": [
      "hampi",
      "badami",
      "pattadakal"
    ],
    "corridor": [
      "hampi",
      "pattadakal",
      "badami"
    ],
    "scenicHighways": [
      "NH-50 Heritage Highway",
      "Malaprabha River Valley Corridor"
    ]
  },
  {
    "slug": "belagavi-north",
    "name": "Belagavi / Northern Karnataka",
    "region": "Northern Western Ghats & Deccan",
    "description": "Dense teak jungle river rafting, dramatic hill forts, cascading sandstone falls, and ancient northern temple complexes.",
    "destinations": [
      "belagavi",
      "dandeli",
      "badami",
      "pattadakal"
    ],
    "corridor": [
      "dandeli",
      "badami",
      "pattadakal"
    ],
    "scenicHighways": [
      "Kali River Valley Corridor",
      "Belagavi-Bagalkot Highway"
    ]
  }
];

const karnatakaDestinations = [
  {
    "id": "coorg",
    "slug": "coorg",
    "name": "Coorg (Madikeri)",
    "district": "Kodagu",
    "category": "Hill Stations",
    "categories": [
      "Hill Stations",
      "Nature",
      "Coffee",
      "Waterfalls",
      "Photography"
    ],
    "clusters": [
      "mysore-southern",
      "malnad"
    ],
    "tags": "Hill Stations • Nature • Coffee",
    "image": "images/destinations/coorg.jpg",
    "gallery": [
      "images/destinations/coorg.jpg"
    ],
    "alt": "Scenic sights and landscape of Coorg (Madikeri), Karnataka",
    "shortDescription": "The Scotland of India known for misty hills, lush coffee plantations, spice estates and gushing waterfalls.",
    "description": "Nestled amidst the Western Ghats, Coorg (Kodagu) is an idyllic hill station renowned for its sprawling coffee estates, aromatic spice plantations, and misty green valleys. Rich in Kodava culture, warrior traditions, and lip-smacking local cuisine like Pandi Curry and Akki Roti, Coorg offers breathtaking viewpoints, serene river retreats, and thrilling trekking trails.",
    "whyVisit": "The Scotland of India known for misty hills, lush coffee plantations, spice estates and gushing waterfalls.",
    "famousFor": [
      "Coffee plantations",
      "Abbey Falls",
      "Raja's Seat",
      "Kodava Culture & Cuisine",
      "Talacauvery River Origin"
    ],
    "latitude": 12.4244,
    "longitude": 75.7382,
    "bestTimeToVisit": "October to March (Post-monsoon & Winter)",
    "recommendedDays": "3 Days",
    "distanceFromBangalore": 265,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": true,
    "attractions": [
      {
        "name": "Madikeri Fort & Palace",
        "category": "Historical / Heritage",
        "description": "17th-century palace fort renovated by Tipu Sultan with panoramic Madikeri town vistas.",
        "visitingHours": "9:00 AM – 5:30 PM",
        "image": "https://images.unsplash.com/photo-1600100397608-f010f443bbf6?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.4244,
        "longitude": 75.7382
      },
      {
        "name": "Raja's Seat",
        "category": "Nature / Viewpoint",
        "description": "Historic viewpoint with manicured gardens offering panoramic sunset views across the Western Ghats.",
        "visitingHours": "6:00 AM – 8:00 PM",
        "image": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.4194,
        "longitude": 75.7351
      },
      {
        "name": "Omkareshwara Temple",
        "category": "Spiritual / Shiva Temple",
        "description": "Historic 1820 Shiva temple in Madikeri built in a rare blend of Gothic and Islamic architecture with central pond.",
        "visitingHours": "6:30 AM – 12:00 PM, 5:00 PM – 8:00 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.423,
        "longitude": 75.739
      },
      {
        "name": "Abbey Falls",
        "category": "Nature / Waterfalls",
        "description": "Spectacular cascading waterfall tucked inside dense spice and coffee estates.",
        "visitingHours": "9:00 AM – 5:00 PM",
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.4542,
        "longitude": 75.7177
      },
      {
        "name": "Coffee Plantation Experience",
        "category": "Nature / Coffee",
        "description": "Guided walking tour through aromatic Arabica and Robusta estates learning berry picking and roasting.",
        "visitingHours": "9:00 AM – 4:30 PM",
        "image": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.43,
        "longitude": 75.74
      },
      {
        "name": "Talakaveri & Brahmagiri",
        "category": "Spiritual / Nature",
        "description": "The revered origin of the holy Cauvery River set high in the Brahmagiri Hills.",
        "visitingHours": "6:00 AM – 6:00 PM",
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.3853,
        "longitude": 75.4925
      },
      {
        "name": "Bhagamandala (Triveni Sangama)",
        "category": "Spiritual / Confluence",
        "description": "Sacred confluence of Cauvery, Kannike and mythical Sujyoti rivers with Bhagandeshwara temple.",
        "visitingHours": "6:00 AM – 6:30 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.389,
        "longitude": 75.529
      },
      {
        "name": "Dubare Elephant Camp",
        "category": "Wildlife / Nature",
        "description": "Riverfront camp on the banks of Cauvery where visitors can bathe and interact with elephants.",
        "visitingHours": "9:00 AM – 11:00 AM, 4:30 PM – 5:30 PM",
        "image": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.3683,
        "longitude": 75.9036
      },
      {
        "name": "Kaveri Nisargadhama",
        "category": "Nature / River Island",
        "description": "Scenic 64-acre river island covered in dense bamboo groves, hanging bridge, and deer park.",
        "visitingHours": "9:00 AM – 5:00 PM",
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.454,
        "longitude": 75.938
      },
      {
        "name": "Namdroling Monastery (Golden Temple)",
        "category": "Culture / Spiritual",
        "description": "Vibrant Tibetan Buddhist monastery in Bylakuppe with 40-foot gilded statues.",
        "visitingHours": "9:00 AM – 6:00 PM",
        "image": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.45,
        "longitude": 75.96
      }
    ],
    "activities": [
      "Coffee Plantation Walk",
      "River Rafting in Barapole",
      "Elephant Bathing at Dubare",
      "Sunset View at Raja's Seat",
      "Trek to Tadiandamol Peak",
      "Tibetan Monastery Tour"
    ],
    "travelTips": [
      "Book plantation homestays early during monsoon and winter weekends.",
      "Carry light woolens for chilly evenings and rain protection during June-September.",
      "Drive via Mysuru-Hunsur-Kushalnagar for the smoothest road condition."
    ],
    "foodSpecialties": [
      "Kodava Pandi Curry",
      "Akki Roti with Enne Kathirikai",
      "Kadambuttu (Steamed rice dumplings)",
      "Coorg Filter Coffee",
      "Wild Bamboo Shoot Curry (Baimbale)"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Talakaveri & Bhagamandala",
        "distance": "45 km",
        "description": "Origin of Cauvery River in Brahmagiri mountain range."
      },
      {
        "name": "Dubare Elephant Camp",
        "distance": "32 km",
        "description": "Elephant bathing and Cauvery river crossing."
      },
      {
        "name": "Namdroling Monastery",
        "distance": "34 km",
        "description": "Golden Tibetan monastery in Bylakuppe."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Raja's Seat",
        "Abbey Falls",
        "Coffee plantation experience",
        "Talakaveri",
        "Dubare Elephant Camp"
      ],
      "templesSpiritual": [
        "Omkareshwara Temple",
        "Talakaveri Shrine",
        "Bhagandeshwara Temple",
        "Namdroling Golden Temple"
      ],
      "natureBeaches": [
        "Abbey Falls",
        "Raja's Seat Sunset Viewpoint",
        "Mandalpatti Peak",
        "Iruppu Falls"
      ],
      "historicalPlaces": [
        "Madikeri Fort & Palace",
        "Gaddige (Raja's Tomb)"
      ],
      "foodExperiences": [
        "Authentic Kodava Pandi Curry",
        "Akki Roti with Enne Kathirikai",
        "Kadambuttu",
        "Fresh Estate Coffee"
      ],
      "hiddenGems": [
        "Mandalpatti 4x4 Jeep Trail",
        "Chiklihole Reservoir"
      ],
      "familyFriendly": [
        "Dubare Elephant Interaction",
        "Kaveri Nisargadhama Island",
        "Golden Temple Bylakuppe"
      ],
      "adventureActivities": [
        "Tadiandamol Peak Trek",
        "Barapole River White Water Rafting"
      ]
    },
    "taluk": "Madikeri",
    "talukId": "madikeri",
    "districtId": "kodagu"
  },
  {
    "id": "mysore",
    "slug": "mysore",
    "name": "Mysore (Mysuru)",
    "district": "Mysuru",
    "category": "Heritage",
    "categories": [
      "Heritage",
      "Cities",
      "Spiritual",
      "Culture",
      "Food & Culture"
    ],
    "clusters": [
      "mysore-southern"
    ],
    "tags": "Heritage • Cities • Spiritual",
    "image": "images/destinations/mysore.jpg",
    "gallery": [
      "images/destinations/mysore.jpg"
    ],
    "alt": "Scenic sights and landscape of Mysore (Mysuru), Karnataka",
    "shortDescription": "The City of Palaces, royal heritage, fragrant sandalwood, rich silk sarees, and majestic Dasara festivities.",
    "description": "Mysuru is the cultural heart of Karnataka, celebrated worldwide for its royal grandeur and architectural wonder, the Mysore Palace. Dotted with heritage monuments, the bustling Devaraja market, Chamundi Hill temple, and legendary eateries serving authentic Mysore Masala Dosa and Mysore Pak.",
    "whyVisit": "Cultural capital of Karnataka, celebrated for Mysore Palace, Chamundi Hill, royal Dasara heritage, and authentic Mysore Pak.",
    "famousFor": [
      "Mysore Palace",
      "Chamundi Hill",
      "Brindavan Gardens",
      "Mysore Pak & Silk Sarees",
      "Devaraja Market"
    ],
    "latitude": 12.2958,
    "longitude": 76.6394,
    "bestTimeToVisit": "September to March (Ideal during Dasara in October)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 145,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": true,
    "attractions": [
      {
        "name": "Mysore Palace (Amba Vilas)",
        "category": "Historical / Palace",
        "description": "Opulent Indo-Saracenic royal residence illuminated with nearly 100,000 golden bulbs on weekends.",
        "visitingHours": "10:00 AM – 5:30 PM (Illumination Sundays/Holidays 7:00 PM – 7:45 PM)",
        "image": "https://images.unsplash.com/photo-1600100397608-f010f443bbf6?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.3052,
        "longitude": 76.6552
      },
      {
        "name": "Chamundeshwari Temple",
        "category": "Spiritual / Shakti Temple",
        "description": "Ancient hilltop shrine overlooking Mysuru city with a legendary monolithic Nandi statue.",
        "visitingHours": "7:30 AM – 2:00 PM, 3:30 PM – 6:00 PM, 7:30 PM – 9:00 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.2748,
        "longitude": 76.6717
      },
      {
        "name": "Brindavan Gardens",
        "category": "Nature / Gardens",
        "description": "Terraced botanical gardens with illuminated musical dancing fountains at the KRS dam.",
        "visitingHours": "6:30 AM – 9:00 PM (Fountain show 6:30 PM – 7:30 PM)",
        "image": "https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.4243,
        "longitude": 76.5732
      },
      {
        "name": "Devaraja Heritage Market",
        "category": "Culture / Market",
        "description": "Vibrant 130-year-old traditional bazaar bursting with fragrances of incense, sandalwood, and fresh flowers.",
        "visitingHours": "6:00 AM – 9:00 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.311,
        "longitude": 76.651
      }
    ],
    "activities": [
      "Mysore Palace Illumination Tour",
      "Climbing 1000 Steps of Chamundi Hill",
      "Devaraja Spice and Perfume Walk",
      "Mysore Pak Tasting at Guru Sweets",
      "Visiting Brindavan Musical Fountain"
    ],
    "travelTips": [
      "Bengaluru-Mysuru Expressway reduces travel time to under 90 minutes.",
      "Mysore Palace illumination occurs on Sundays and public holidays from 7:00 PM to 7:45 PM.",
      "Footwear must be deposited outside Mysore Palace and Chamundi Temple."
    ],
    "foodSpecialties": [
      "Authentic Mysore Masala Dosa at Mylari",
      "Ghee Mysore Pak",
      "Bisi Bele Bath",
      "Maddur Vada",
      "Chiroti with Almond Milk"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Srirangapatna Island Fortress",
        "distance": "15 km",
        "description": "Tipu Sultan's capital on the Cauvery River."
      },
      {
        "name": "Ranganathittu Bird Sanctuary",
        "distance": "18 km",
        "description": "Boat rides amongst painted storks and marsh crocodiles."
      },
      {
        "name": "Somnathpur Chennakeshava Temple",
        "distance": "35 km",
        "description": "Triple-shrine Hoysala marvel carved from soapstone."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Mysore Palace",
        "Chamundeshwari Temple",
        "Brindavan Gardens"
      ],
      "templesSpiritual": [
        "Chamundeshwari Temple",
        "Nandi Monolith",
        "Sri Venugopala Swamy Temple KRS"
      ],
      "natureBeaches": [
        "Karanji Lake & Nature Park",
        "Chamundi Hill Viewpoint",
        "Brindavan Gardens"
      ],
      "historicalPlaces": [
        "Mysore Palace",
        "Jaganmohan Palace Art Gallery",
        "St. Philomena's Cathedral"
      ],
      "foodExperiences": [
        "Authentic Mysore Masala Dosa at Mylari",
        "Original Mysore Pak at Guru Sweet Mart",
        "Royal South Indian Meals"
      ],
      "hiddenGems": [
        "Somnathpur Hoysala Temple",
        "Lingambudhi Lake Bird Walk"
      ],
      "familyFriendly": [
        "Sri Chamarajendra Zoological Gardens (Mysore Zoo)",
        "Brindavan Musical Fountains"
      ],
      "adventureActivities": [
        "Chamundi Hill 1,008 Steps Climb",
        "Micro-light flying at Mysore Airport"
      ]
    },
    "taluk": "Mysuru",
    "talukId": "mysuru",
    "districtId": "mysuru"
  },
  {
    "id": "chikmagalur",
    "slug": "chikmagalur",
    "name": "Chikmagalur",
    "district": "Chikkamagaluru",
    "category": "Hill Stations",
    "categories": [
      "Hill Stations",
      "Nature",
      "Coffee",
      "Adventure",
      "Photography"
    ],
    "clusters": [
      "malnad"
    ],
    "tags": "Hill Stations • Nature • Coffee",
    "image": "images/destinations/chikmagalur.jpg",
    "gallery": [
      "images/destinations/chikmagalur.jpg"
    ],
    "alt": "Scenic sights and landscape of Chikmagalur, Karnataka",
    "shortDescription": "The birthplace of Indian coffee, enveloped in emerald hills, misty peaks, and sprawling plantations.",
    "description": "Chikmagalur is a paradise for nature lovers and trekkers. Situated in the foothills of the Mullayanagiri range, it was here that Baba Budan first planted coffee seeds smuggled from Yemen. The region features cloud-kissed peaks, roaring waterfalls like Hebbe and Jhari, and cozy plantation homestays.",
    "whyVisit": "The birthplace of Indian coffee, enveloped in emerald hills, misty peaks, and sprawling plantations.",
    "famousFor": [
      "Coffee plantations",
      "Mullayanagiri Peak",
      "Baba Budangiri",
      "Hebbe Falls",
      "Homestays"
    ],
    "latitude": 13.3153,
    "longitude": 75.7754,
    "bestTimeToVisit": "September to May (Crisp winters and lush post-monsoons)",
    "recommendedDays": "3 Days",
    "distanceFromBangalore": 245,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": true,
    "attractions": [
      {
        "name": "Mullayanagiri Peak",
        "category": "Attraction",
        "description": "The highest peak in Karnataka (1,930 m) offering sweeping views above the clouds.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/chikmagalur.jpg",
        "latitude": 13.3912,
        "longitude": 75.7214
      },
      {
        "name": "Baba Budangiri",
        "category": "Attraction",
        "description": "Historic mountain range sacred to both Hindus and Sufis with mystical caves.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/chikmagalur.jpg",
        "latitude": 13.4357,
        "longitude": 75.7681
      },
      {
        "name": "Hebbe Falls",
        "category": "Attraction",
        "description": "Stunning twin-stream waterfall deep inside coffee estates reached by exciting 4x4 jeep safaris.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/chikmagalur.jpg",
        "latitude": 13.5412,
        "longitude": 75.7891
      },
      {
        "name": "Jhari (Buttermilk) Falls",
        "category": "Attraction",
        "description": "Lush cascade surrounded by tea gardens and wild forest glades.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/chikmagalur.jpg",
        "latitude": 13.402,
        "longitude": 75.735
      },
      {
        "name": "Z Point (Kemmangundi)",
        "category": "Attraction",
        "description": "Thrilling cliff edge vantage point overlooking deep Western Ghat gorges.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/chikmagalur.jpg",
        "latitude": 13.55,
        "longitude": 75.76
      }
    ],
    "activities": [
      "Sunrise Trek to Mullayanagiri",
      "Jeep Safari to Hebbe Falls",
      "Plantation Tour & Coffee Brewing Masterclass",
      "Campfire Nights in Malnad Homestays",
      "Birdwatching in Bhadra Valley"
    ],
    "travelTips": [
      "Start early morning (before 6:30 AM) to summit Mullayanagiri before fog and tourist crowds arrive.",
      "4x4 jeeps are mandatory for Hebbe and Jhari Falls; negotiate prices at the forest checkpoint.",
      "Carry motion sickness medication if prone to winding ghat roads."
    ],
    "foodSpecialties": [
      "Malnad Kadubu with Chutney",
      "Halasina Hannu (Jackfruit) Curry",
      "Pathrode (Steamed colocasia rolls)",
      "Filter Coffee from fresh Arabica roasts",
      "Bamboo Shoot Curry"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Belur & Halebidu",
        "distance": "40 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      },
      {
        "name": "Kudremukh",
        "distance": "90 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      },
      {
        "name": "Sringeri",
        "distance": "85 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Mullayanagiri Peak",
        "Baba Budangiri",
        "Hebbe Falls",
        "Coffee Estate Tour"
      ],
      "templesSpiritual": [
        "Baba Budangiri Dargah & Caves",
        "Hirekolale Temple",
        "Sringeri Sharadamba (nearby)"
      ],
      "natureBeaches": [
        "Mullayanagiri Peak",
        "Hebbe Falls",
        "Jhari (Buttermilk) Falls",
        "Hirekolale Lake"
      ],
      "historicalPlaces": [
        "Baba Budan Historic Coffee Shrine",
        "Belur Hoysala Temples (nearby)"
      ],
      "foodExperiences": [
        "Authentic Malnad Akki Roti",
        "Fresh Roasted Filter Coffee",
        "Bamboo Shoot & Jackfruit Delicacies"
      ],
      "hiddenGems": [
        "Hirekolale Lake at Sunset",
        "Kyathanamakki 4x4 Viewpoint"
      ],
      "familyFriendly": [
        "Coffee Museum",
        "Hirekolale Lake Walk"
      ],
      "adventureActivities": [
        "Mullayanagiri Peak Trek",
        "Jeep Safari to Jhari & Hebbe Falls"
      ]
    },
    "taluk": "Chikkamagaluru",
    "talukId": "chikkamagaluru",
    "districtId": "chikkamagaluru"
  },
  {
    "id": "hampi",
    "slug": "hampi",
    "name": "Hampi",
    "district": "Vijayanagara",
    "category": "Heritage",
    "categories": [
      "Heritage",
      "Spiritual",
      "Photography",
      "Culture"
    ],
    "clusters": [
      "hampi-north"
    ],
    "tags": "Heritage • Spiritual • Photography",
    "image": "images/destinations/hampi.jpg",
    "gallery": [
      "images/destinations/hampi.jpg"
    ],
    "alt": "Scenic sights and landscape of Hampi, Karnataka",
    "shortDescription": "UNESCO World Heritage site featuring colossal boulder-strewn ruins of the glorious Vijayanagara Empire.",
    "description": "Hampi transports travelers back in time to the 14th century capital of the Vijayanagara Empire. Set along the banks of the Tungabhadra River, it is an open-air museum filled with intricately carved stone temples, royal pavilions, monolithic statues, and surreal rust-colored boulder hills.",
    "whyVisit": "UNESCO World Heritage site featuring colossal boulder-strewn ruins of the glorious Vijayanagara Empire.",
    "famousFor": [
      "Vijaya Vittala Stone Chariot",
      "Virupaksha Temple",
      "Matanga Hill Sunrise",
      "Tungabhadra River Coracles"
    ],
    "latitude": 15.335,
    "longitude": 76.46,
    "bestTimeToVisit": "October to February (Pleasant winter sunshine)",
    "recommendedDays": "3 Days",
    "distanceFromBangalore": 340,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": true,
    "attractions": [
      {
        "name": "Virupaksha Temple",
        "category": "Attraction",
        "description": "Living ancient Shiva temple standing tall since the 7th century with towering gopuram.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/hampi.jpg",
        "latitude": 15.3352,
        "longitude": 76.4603
      },
      {
        "name": "Vijaya Vittala Temple & Stone Chariot",
        "category": "Attraction",
        "description": "Masterpiece of Dravidian architecture featuring the iconic stone chariot and musical pillars.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/hampi.jpg",
        "latitude": 15.3438,
        "longitude": 76.4764
      },
      {
        "name": "Matanga Hill",
        "category": "Attraction",
        "description": "The ultimate sunrise and sunset vantage point overlooking the endless sea of ruins.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/hampi.jpg",
        "latitude": 15.3331,
        "longitude": 76.4665
      },
      {
        "name": "Lotus Mahal & Elephant Stables",
        "category": "Attraction",
        "description": "Exquisite Indo-Islamic zenana pavilion and grand domed stables for royal elephants.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/hampi.jpg",
        "latitude": 15.32,
        "longitude": 76.47
      },
      {
        "name": "Coracle Ride on Tungabhadra",
        "category": "Attraction",
        "description": "Traditional round wicker boat ride passing ancient boulder ghats and hidden river shrines.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/hampi.jpg",
        "latitude": 15.337,
        "longitude": 76.462
      }
    ],
    "activities": [
      "Sunrise at Matanga Hill",
      "Renting Bicycles to Explore Sacred Center",
      "Coracle Boat Ride across Tungabhadra River",
      "Acoustic exploration of Vittala Musical Pillars",
      "Bouldering and Rock Climbing on Hippie Island"
    ],
    "travelTips": [
      "Rent a bicycle or moped to traverse the 40 sq km heritage zone at your own pace.",
      "Wear comfortable walking shoes with grip for climbing granite boulders.",
      "Summers (March to June) can exceed 40°C; carry ample water, sunscreen, and a broad hat."
    ],
    "foodSpecialties": [
      "North Karnataka Jolada Rotti Oota",
      "Ennegayi (Stuffed spicy brinjal)",
      "Shenga Chutney Pudi",
      "Mango Lassi & Woodfired Pizzas in Sanapur cafes"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Badami",
        "distance": "135 km",
        "description": "Scenic neighboring destination in Vijayanagara corridor."
      },
      {
        "name": "Pattadakal",
        "distance": "130 km",
        "description": "Scenic neighboring destination in Vijayanagara corridor."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Virupaksha Temple",
        "Vijaya Vittala Temple & Stone Chariot",
        "Lotus Mahal & Elephant Stables",
        "Matanga Hill"
      ],
      "templesSpiritual": [
        "Virupaksha Temple",
        "Vijaya Vittala Temple",
        "Hazara Rama Temple",
        "Achyutaraya Temple",
        "Badavilinga"
      ],
      "natureBeaches": [
        "Matanga Hill Panoramic Viewpoint",
        "Tungabhadra River Boulder Banks",
        "Sanapur Lake"
      ],
      "historicalPlaces": [
        "Stone Chariot",
        "Queen's Bath",
        "Lotus Mahal",
        "Elephant Stables",
        "King's Balance"
      ],
      "foodExperiences": [
        "Mango Tree Restaurant Thali",
        "South Indian Banana Leaf Breakfast",
        "Wood-fired Pizzas in Hampi"
      ],
      "hiddenGems": [
        "Sanapur Lake Cliff Jumping",
        "Anegundi Ancient Monkey Kingdom",
        "Sunset at Hemakuta Hill"
      ],
      "familyFriendly": [
        "Electric Golf Cart Tour in Vittala",
        "Coracle Boat Ride on Tungabhadra"
      ],
      "adventureActivities": [
        "Bouldering on Granite Rocks",
        "Sunrise Hike to Matanga Hill",
        "Bicycle Ruins Tour"
      ]
    },
    "taluk": "Hosapete",
    "talukId": "hosapete",
    "districtId": "vijayanagara"
  },
  {
    "id": "gokarna",
    "slug": "gokarna",
    "name": "Gokarna",
    "district": "Uttara Kannada",
    "category": "Beaches",
    "categories": [
      "Beaches",
      "Spiritual",
      "Adventure",
      "Nature",
      "Photography"
    ],
    "clusters": [
      "coastal-karnataka"
    ],
    "tags": "Beaches • Spiritual • Adventure",
    "image": "images/destinations/gokarna.jpg",
    "gallery": [
      "images/destinations/gokarna.jpg"
    ],
    "alt": "Scenic sights and landscape of Gokarna, Karnataka",
    "shortDescription": "Laid-back coastal gem where pristine golden beaches meet sacred temple pilgrimages.",
    "description": "Gokarna is where spirituality gracefully meets bohemian coastal charm. Famed for Om Beach (shaped like the sacred Hindu symbol), Kudle Beach, Half Moon Beach, and Paradise Beach, visitors can hike cliff trails between beaches, savor beach shacks, and visit the revered Mahabaleshwar Temple.",
    "whyVisit": "Sacred Atmalinga temple, legendary beaches shaped by nature, and peaceful coastal cliff treks.",
    "famousFor": [
      "Mahabaleshwar Temple",
      "Om Beach",
      "Kudle Beach",
      "Atmalinga tradition",
      "Beach trekking"
    ],
    "latitude": 14.5479,
    "longitude": 74.3188,
    "bestTimeToVisit": "October to March (Gentle sea breeze and golden sunsets)",
    "recommendedDays": "3 Days",
    "distanceFromBangalore": 485,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": true,
    "attractions": [
      {
        "name": "Gokarna Mahabaleshwar Temple",
        "category": "Spiritual / Shiva Temple",
        "description": "A major Shiva pilgrimage destination associated with the Atma Linga tradition and one of Karnataka's most important pilgrimage centres.",
        "visitingHours": "6:00 AM – 12:30 PM, 5:00 PM – 8:00 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.5422,
        "longitude": 74.3183
      },
      {
        "name": "Om Beach",
        "category": "Nature / Beaches",
        "description": "Naturally contoured in the shape of Om, ideal for water sports and evening sunsets.",
        "visitingHours": "Open all day",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.5186,
        "longitude": 74.3168
      },
      {
        "name": "Kudle Beach",
        "category": "Nature / Beaches",
        "description": "Wide crescent beach dotted with relaxing cafes, yoga centers, and acoustic music circles.",
        "visitingHours": "Open all day",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.5294,
        "longitude": 74.3142
      },
      {
        "name": "Half Moon Beach & Paradise Beach",
        "category": "Adventure / Nature",
        "description": "Secluded pristine coves accessed via scenic cliffside trails or local boats.",
        "visitingHours": "7:00 AM – 6:00 PM",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.509,
        "longitude": 74.321
      },
      {
        "name": "Kotiteertha Sacred Tank",
        "category": "Spiritual / Sacred Tank",
        "description": "Rectangular holy temple tank enclosed by colorful shrines where pilgrims perform rituals.",
        "visitingHours": "6:00 AM – 7:30 PM",
        "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.545,
        "longitude": 74.321
      }
    ],
    "activities": [
      "Five-Beach Cliff Trek (Kudle to Paradise)",
      "Sunset Kayaking and Banana Boat Rides at Om Beach",
      "Morning Yoga Sessions on Kudle Sands",
      "Visiting the Sacred Atmalinga at Mahabaleshwar",
      "Bioluminescence spotting during dark winter new moons"
    ],
    "travelTips": [
      "Carry shoes with sturdy tread if attempting the cliff hike between Kudle and Paradise Beach.",
      "Dress conservatively with shoulders covered when entering Mahabaleshwar Temple.",
      "Stay in beach huts or cliffside guest houses for unobstructed sea views."
    ],
    "foodSpecialties": [
      "Karavali Prawn & Fish Curry",
      "Neer Dosa with spicy fish masala",
      "Nutella Banana Pancakes in beach cafes",
      "Fresh Coconut Water & Kokum Sharbat"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Mirjan Fort",
        "distance": "22 km",
        "description": "16th-century fortress surrounded by emerald greenery."
      },
      {
        "name": "Yana Caves",
        "distance": "52 km",
        "description": "Towering monolithic black karst rock formations in rainforest."
      },
      {
        "name": "Honnavar Mangrove Boardwalk",
        "distance": "48 km",
        "description": "Backwater river boat tours and eco walkway."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Gokarna Mahabaleshwar Temple",
        "Om Beach",
        "Kudle Beach",
        "Half Moon Beach"
      ],
      "templesSpiritual": [
        "Gokarna Mahabaleshwar Temple",
        "Maha Ganapati Temple",
        "Kotiteertha",
        "Bhadrakali Temple"
      ],
      "natureBeaches": [
        "Om Beach",
        "Kudle Beach",
        "Half Moon Beach",
        "Paradise Beach",
        "Gokarna Main Beach"
      ],
      "historicalPlaces": [
        "Mahabaleshwar Temple Sanctum",
        "Mirjan Fort (nearby)"
      ],
      "foodExperiences": [
        "Seaside Cafe Breakfast",
        "Nutella Pancakes & Israeli Platters",
        "Fresh Fish Thali at Main Town"
      ],
      "hiddenGems": [
        "Paradise Beach Cliff Trail",
        "Labyrinth Sunset Point"
      ],
      "familyFriendly": [
        "Gokarna Main Beach",
        "Om Beach Boat rides"
      ],
      "adventureActivities": [
        "5-Beach Cliff Trekking",
        "Sea Kayaking & Banana Rides at Om Beach"
      ]
    },
    "taluk": "Kumta",
    "talukId": "kumta",
    "districtId": "uttara-kannada"
  },
  {
    "id": "udupi",
    "slug": "udupi",
    "name": "Udupi",
    "district": "Udupi",
    "category": "Beaches",
    "categories": [
      "Beaches",
      "Spiritual",
      "Food & Culture",
      "Heritage"
    ],
    "clusters": [
      "coastal-karnataka"
    ],
    "tags": "Beaches • Spiritual • Food & Culture",
    "image": "images/destinations/udupi.jpg",
    "gallery": [
      "images/destinations/udupi.jpg"
    ],
    "alt": "Scenic sights and landscape of Udupi, Karnataka",
    "shortDescription": "Spiritual sanctuary celebrated for Sri Krishna Temple, delicious cuisine, and pristine Malpe Beach.",
    "description": "Udupi is universally famous for its wholesome vegetarian culinary heritage, the historic Sri Krishna Matha founded by Madhvacharya, and tranquil Arabian Sea coastlines. The nearby St. Mary's Island boasts rare columnar basaltic rock formations carved by nature millions of years ago.",
    "whyVisit": "World-famous Krishna Matha, pristine beaches, geological island marvels, and authentic vegetarian culinary heritage.",
    "famousFor": [
      "Sri Krishna Matha",
      "Malpe Sea Walk",
      "St. Mary's Island",
      "Kaup Lighthouse",
      "Udupi Cuisine"
    ],
    "latitude": 13.3409,
    "longitude": 74.7421,
    "bestTimeToVisit": "October to March (Sunny winter coastline)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 400,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": true,
    "attractions": [
      {
        "name": "Udupi Sri Krishna Temple",
        "category": "Spiritual / Vaishnavite Temple",
        "description": "A historic Krishna temple associated with Madhva's Dvaita tradition and famous for worship through the Kanakana Kindi window.",
        "visitingHours": "5:00 AM – 2:00 PM, 4:00 PM – 9:00 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 13.3409,
        "longitude": 74.7525
      },
      {
        "name": "St. Mary's Island",
        "category": "Nature / Geological Wonder",
        "description": "Geological wonder with hexagonal volcanic basalt rock pillars rising from azure waters.",
        "visitingHours": "9:30 AM – 5:30 PM (Ferry operates October to May)",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        "latitude": 13.3775,
        "longitude": 74.6736
      },
      {
        "name": "Malpe Beach & Sea Walk",
        "category": "Nature / Beaches",
        "description": "Lively beach with water sports and a scenic walkway extending into the Arabian Sea.",
        "visitingHours": "6:00 AM – 8:00 PM",
        "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
        "latitude": 13.3512,
        "longitude": 74.6989
      },
      {
        "name": "Kaup (Kapu) Beach & Lighthouse",
        "category": "Nature / Beaches",
        "description": "Rocky beach with an active 1901 British lighthouse offering 360-degree ocean views.",
        "visitingHours": "Beach all day; Lighthouse entry 4:00 PM – 6:00 PM",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        "latitude": 13.2244,
        "longitude": 74.7364
      },
      {
        "name": "Anantheshwara & Chandramouleshwara Temples",
        "category": "Spiritual / Shiva Temple",
        "description": "Ancient stone shrines adjacent to Car Street where Acharya Madhva's guru meditated, predating the Krishna matha.",
        "visitingHours": "6:00 AM – 1:00 PM, 5:00 PM – 8:30 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 13.3412,
        "longitude": 74.7518
      }
    ],
    "activities": [
      "Ferry ride to St. Mary's Columnar Rocks",
      "Viewing Krishna through Kanakana Kindi",
      "Sunset Walk on Malpe Sea Walk Bridge",
      "Climbing Kapu Lighthouse",
      "Surfing Lessons at Kodi Bengre Delta"
    ],
    "travelTips": [
      "Boats to St. Mary's Island operate from Malpe Beach between October and May, weather permitting.",
      "The temple Annadanam (free community lunch) is an extraordinary cultural dining experience.",
      "Visit Kapu lighthouse between 4:00 PM and 6:00 PM when the tower is open to tourists."
    ],
    "foodSpecialties": [
      "Udupi Masala Dosa",
      "Goli Baje (Mangalore Bajji)",
      "Pineapple Menaskai",
      "Pelakai Gatti (Jackfruit dumplings)",
      "Authentic Filter Coffee"
    ],
    "bestNearbyPlaces": [
      {
        "name": "St. Mary's Island",
        "distance": "6 km boat ride",
        "description": "Columnar hexagonal basalt rock formations in azure sea."
      },
      {
        "name": "Kaup Lighthouse & Beach",
        "distance": "14 km",
        "description": "Panoramic lighthouse sunset atop coastal rocks."
      },
      {
        "name": "Anegudde Vinayaka Temple",
        "distance": "30 km",
        "description": "Famous hilltop Siddhi Vinayaka shrine."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Udupi Sri Krishna Temple",
        "Malpe Beach & Sea Walk",
        "St. Mary's Island",
        "Kaup Lighthouse"
      ],
      "templesSpiritual": [
        "Udupi Sri Krishna Temple",
        "Anantheshwara Temple",
        "Chandramouleshwara Temple",
        "Pajaka Kshetra"
      ],
      "natureBeaches": [
        "Malpe Beach",
        "St. Mary's Island",
        "Kaup Beach",
        "Padubidri Blue Flag Beach",
        "Delta Beach Kodi Bengre"
      ],
      "historicalPlaces": [
        "Historic Krishna Matha Complex",
        "Kanakana Kindi",
        "1901 Kaup Lighthouse"
      ],
      "foodExperiences": [
        "Temple Maha Annadana",
        "Mitra Samaj Goli Baje & Masala Dosa",
        "Mattu Gulla Curry",
        "Diana Cutlet"
      ],
      "hiddenGems": [
        "Delta Beach Estuary",
        "Mattu Beach Bio-luminescence",
        "Varanga Jain Lake Temple (nearby)"
      ],
      "familyFriendly": [
        "Malpe Sea Walk",
        "St. Mary's Ferry Tour",
        "Krishna Matha Chariot Procession"
      ],
      "adventureActivities": [
        "Malpe Parasailing & Jet Skiing",
        "Kayaking in Kodi Bengre backwaters"
      ]
    },
    "taluk": "Udupi",
    "talukId": "udupi",
    "districtId": "udupi"
  },
  {
    "id": "murudeshwar",
    "slug": "murudeshwar",
    "name": "Murudeshwar",
    "district": "Uttara Kannada",
    "category": "Religious",
    "categories": [
      "Religious",
      "Beaches",
      "Adventure",
      "Photography"
    ],
    "clusters": [
      "coastal-karnataka"
    ],
    "tags": "Religious • Beaches • Adventure",
    "image": "images/destinations/murudeshwar.jpg",
    "gallery": [
      "images/destinations/murudeshwar.jpg"
    ],
    "alt": "Scenic sights and landscape of Murudeshwar, Karnataka",
    "shortDescription": "Home to the world's second-tallest Shiva statue surrounded on three sides by the Arabian Sea.",
    "description": "Murudeshwar is an awe-inspiring seaside town dominated by the colossal 123-foot statue of Lord Shiva and the towering 20-storey Raja Gopuram. With lift access inside the gopuram offering panoramic ocean views and boat rides to Netrani Island for scuba diving.",
    "whyVisit": "Colossal oceanfront Shiva statue, spiritual significance, panoramic Arabian Sea views, and scuba diving.",
    "famousFor": [
      "123-ft Shiva Statue",
      "Raja Gopuram lift",
      "Coastal temple",
      "Netrani Scuba Diving"
    ],
    "latitude": 14.094,
    "longitude": 74.4899,
    "bestTimeToVisit": "October to May (Calm waters for scuba at Netrani)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 489,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": true,
    "attractions": [
      {
        "name": "Murdeshwar Temple",
        "category": "Spiritual / Shiva Temple",
        "description": "A famous coastal Shiva temple known for its enormous Shiva statue, temple complex and sea views.",
        "visitingHours": "6:00 AM – 1:00 PM, 3:00 PM – 8:15 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.094,
        "longitude": 74.4899
      },
      {
        "name": "Shiva Statue & 20-Storey Raja Gopuram",
        "category": "Spiritual / Monument",
        "description": "World's second tallest Shiva statue perched on Kanduka hill surrounded by Arabian sea with high-speed lift inside gopuram.",
        "visitingHours": "6:00 AM – 1:00 PM, 3:00 PM – 8:00 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.0945,
        "longitude": 74.4895
      },
      {
        "name": "Murdeshwar Beach",
        "category": "Nature / Beaches",
        "description": "Crescent beach offering water sports and sunset ocean vistas framed by the giant Shiva monument.",
        "visitingHours": "6:00 AM – 8:00 PM",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.0965,
        "longitude": 74.487
      },
      {
        "name": "Netrani Island (Scuba Diving)",
        "category": "Adventure / Water Sports",
        "description": "Heart-shaped coral reef island famous for scuba diving, manta rays, and clear waters.",
        "visitingHours": "7:30 AM – 3:30 PM (Seasonal Oct-May)",
        "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.0197,
        "longitude": 74.3275
      }
    ],
    "activities": [
      "Raja Gopuram 18th-Floor Elevator View",
      "PADI Scuba Diving at Netrani Island",
      "Speedboat rides around the statue cliff",
      "Evening temple lights photography",
      "Fresh seafood dining along the promenade"
    ],
    "travelTips": [
      "Take the lift to the 18th floor of Raja Gopuram for stunning aerial views of the Shiva statue against the sea.",
      "Scuba diving trips to Netrani must be booked with licensed operators a day in advance.",
      "The temple sanctum gets crowded between 11 AM and 1 PM; morning visits are calmer."
    ],
    "foodSpecialties": [
      "Coastal Fish Thali",
      "Kane (Ladyfish) Rava Fry",
      "Neer Dosa with spicy prawn ghee roast",
      "Kokum juice"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Netrani Island",
        "distance": "19 km boat ride",
        "description": "Top scuba diving coral reef in Karnataka."
      },
      {
        "name": "Honnavar Mangrove Boardwalk",
        "distance": "28 km",
        "description": "Wooden walkway through mangrove forests & river cruises."
      },
      {
        "name": "Idagunji Ganapathi Temple",
        "distance": "20 km",
        "description": "Ancient 1500-year-old standing Ganesha shrine."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Murdeshwar Temple",
        "123-ft Shiva Statue",
        "Raja Gopuram Observation Deck"
      ],
      "templesSpiritual": [
        "Murdeshwar Temple",
        "Idagunji Mahaganapathi Temple (nearby)",
        "Kanduka Hill Shrines"
      ],
      "natureBeaches": [
        "Murdeshwar Beach",
        "Bhatkal Beach",
        "Netrani Island"
      ],
      "historicalPlaces": [
        "Murudeshwar Fort Ruins",
        "Raja Gopuram"
      ],
      "foodExperiences": [
        "Coastal Karavali Fish Curry Meals",
        "Beachfront Vegetarian Thali"
      ],
      "hiddenGems": [
        "Sunset behind Shiva Idol at Kanduka Hill",
        "Bhatkal Lighthouse"
      ],
      "familyFriendly": [
        "Raja Gopuram Elevator Ride",
        "Beach Camel and Horse rides"
      ],
      "adventureActivities": [
        "Netrani Island Scuba Diving",
        "Speedboating & Jet Ski"
      ]
    },
    "taluk": "Bhatkal",
    "talukId": "bhatkal",
    "districtId": "uttara-kannada"
  },
  {
    "id": "bandipur",
    "slug": "bandipur",
    "name": "Bandipur National Park",
    "district": "Chamarajanagar",
    "category": "Wildlife",
    "categories": [
      "Wildlife",
      "Nature",
      "Photography",
      "Adventure"
    ],
    "clusters": [
      "mysore-southern"
    ],
    "tags": "Wildlife • Nature • Photography",
    "image": "images/destinations/bandipur.jpg",
    "gallery": [
      "images/destinations/bandipur.jpg"
    ],
    "alt": "Scenic sights and landscape of Bandipur National Park, Karnataka",
    "shortDescription": "Premier tiger reserve in the Nilgiri Biosphere featuring tigers, leopards, and wild elephant herds.",
    "description": "Once the private hunting reserve of the Maharajas of Mysore, Bandipur is now one of India's best-managed tiger reserves and part of the UNESCO Nilgiri Biosphere Reserve. Spanning lush deciduous forests and teak woodlands, it shelters tigers, Indian leopards, dholes, and Asian elephants.",
    "whyVisit": "Premier tiger reserve in the Nilgiri Biosphere featuring tigers, leopards, and wild elephant herds.",
    "famousFor": [
      "Wildlife",
      "Nature",
      "Photography",
      "Adventure",
      "Morning Open-Top Gypsy Safari",
      "Dusk Forest Bus Safari",
      "Birdwatching on nature trails around jungle lodges"
    ],
    "latitude": 11.6664,
    "longitude": 76.6291,
    "bestTimeToVisit": "October to May (Dry winter & spring optimal for tiger sightings at waterholes)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 220,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Jungle Wildlife Safari",
        "category": "Attraction",
        "description": "Early morning and dusk jeep safaris into core tiger territories led by certified naturalists.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/bandipur.jpg",
        "latitude": 11.6664,
        "longitude": 76.6291
      },
      {
        "name": "Himavad Gopalaswamy Betta",
        "category": "Attraction",
        "description": "Highest peak in the park with a misty hilltop temple frequented by wild elephants.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/bandipur.jpg",
        "latitude": 11.7226,
        "longitude": 76.5925
      }
    ],
    "activities": [
      "Morning Open-Top Gypsy Safari",
      "Dusk Forest Bus Safari",
      "Birdwatching on nature trails around jungle lodges",
      "Visiting Gopalaswamy Betta Temple"
    ],
    "travelTips": [
      "Forest department safaris book up weeks in advance; book tickets online on the official Karnataka forest portal.",
      "The highway through Bandipur is closed to vehicular traffic between 9:00 PM and 6:00 AM to safeguard wildlife.",
      "Wear earthy colors (khaki, olive green, brown) to avoid startling animals during safari."
    ],
    "foodSpecialties": [
      "Traditional Karnataka buffet in eco-resorts",
      "Ragi Mudde with Bassaru",
      "Freshly brewed South Indian filter coffee"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Mysore",
        "distance": "75 km",
        "description": "Scenic neighboring destination in Chamarajanagar corridor."
      },
      {
        "name": "Nagarhole National Park",
        "distance": "70 km",
        "description": "Scenic neighboring destination in Chamarajanagar corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Gundlupet",
    "talukId": "gundlupet",
    "districtId": "chamarajanagar"
  },
  {
    "id": "nagarhole",
    "slug": "nagarhole",
    "name": "Nagarhole National Park",
    "district": "Kodagu & Mysuru",
    "category": "Wildlife",
    "categories": [
      "Wildlife",
      "Nature",
      "Photography"
    ],
    "clusters": [
      "mysore-southern"
    ],
    "tags": "Wildlife • Nature • Photography",
    "image": "images/destinations/nagarhole.jpg",
    "gallery": [
      "images/destinations/nagarhole.jpg"
    ],
    "alt": "Scenic sights and landscape of Nagarhole National Park, Karnataka",
    "shortDescription": "Dense Kabini river forests famed for the highest density of Asiatic elephants, leopards, and black panthers.",
    "description": "Also known as Rajiv Gandhi National Park, Nagarhole is framed by the serene Kabini River. It has gained international acclaim for frequent sightings of elusive black panthers, majestic tigers, and immense herds of wild elephants congregating on the riverbanks.",
    "whyVisit": "Dense Kabini river forests famed for the highest density of Asiatic elephants, leopards, and black panthers.",
    "famousFor": [
      "Wildlife",
      "Nature",
      "Photography",
      "Kabini Motorboat Wildlife Safari",
      "4x4 Open Jeep Tracking Drives",
      "Stargazing at jungle riverfront resorts"
    ],
    "latitude": 12.0314,
    "longitude": 76.1207,
    "bestTimeToVisit": "October to May (Kabini riverbanks attract large herds of elephants)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 220,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Kabini River Boat Safari",
        "category": "Attraction",
        "description": "Scenic boat cruise observing marsh crocodiles, otters, and elephants swimming across the river.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/nagarhole.jpg",
        "latitude": 11.9333,
        "longitude": 76.2667
      },
      {
        "name": "Nagarhole Jungle Jeep Safari",
        "category": "Attraction",
        "description": "Deep forest drive through towering teak and rosewood canopies.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/nagarhole.jpg",
        "latitude": 12.0314,
        "longitude": 76.1207
      }
    ],
    "activities": [
      "Kabini Motorboat Wildlife Safari",
      "4x4 Open Jeep Tracking Drives",
      "Stargazing at jungle riverfront resorts",
      "Photography of wild elephant congregations"
    ],
    "travelTips": [
      "Kabini boat safari offers unmatched opportunities for photographing water birds, crocodiles, and swimming elephant herds.",
      "Book accommodations at forest department lodges or certified jungle eco-resorts for guaranteed safari entry slots."
    ],
    "foodSpecialties": [
      "Warm Kodava and Mysuru regional meals",
      "Herbal infusions and fresh local fruits"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Coorg",
        "distance": "75 km",
        "description": "Scenic neighboring destination in Kodagu & Mysuru corridor."
      },
      {
        "name": "Bandipur National Park",
        "distance": "70 km",
        "description": "Scenic neighboring destination in Kodagu & Mysuru corridor."
      },
      {
        "name": "Mysore",
        "distance": "85 km",
        "description": "Scenic neighboring destination in Kodagu & Mysuru corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Heggadadevankote",
    "talukId": "heggadadevankote",
    "districtId": "mysuru"
  },
  {
    "id": "badami",
    "slug": "badami",
    "name": "Badami",
    "district": "Bagalkot",
    "category": "Heritage",
    "categories": [
      "Heritage",
      "Photography",
      "Spiritual",
      "Culture"
    ],
    "clusters": [
      "hampi-north"
    ],
    "tags": "Heritage • Photography • Spiritual",
    "image": "images/destinations/badami.jpg",
    "gallery": [
      "images/destinations/badami.jpg"
    ],
    "alt": "Scenic sights and landscape of Badami, Karnataka",
    "shortDescription": "Dramatic red sandstone rock-cut cave temples of the ancient Chalukyan kingdom around Agastya Lake.",
    "description": "Badami, formerly known as Vatapi, was the regal capital of the Badami Chalukyas from 540 to 757 AD. It is celebrated for its four dramatic rock-cut cave temples chiseled into rugged red sandstone cliffs, the serene Agastya Lake, and the picturesque Bhutanatha temple complex.",
    "whyVisit": "Dramatic red sandstone rock-cut cave temples of the ancient Chalukyan kingdom around Agastya Lake.",
    "famousFor": [
      "Heritage",
      "Photography",
      "Spiritual",
      "Culture",
      "Cave Temple Architecture Tour",
      "Sunset by Bhutanatha Temple on Agastya Lake",
      "Rock Climbing on Red Sandstone Cliffs"
    ],
    "latitude": 15.9187,
    "longitude": 75.6766,
    "bestTimeToVisit": "October to March (Pleasant weather for rock exploration)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 450,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": true,
    "attractions": [
      {
        "name": "Badami Cave Temples",
        "category": "Attraction",
        "description": "Four intricate rock-hewn caves dedicated to Shiva, Vishnu, and Jain Tirthankaras featuring 18-armed Nataraja.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/badami.jpg",
        "latitude": 15.9172,
        "longitude": 75.6841
      },
      {
        "name": "Bhutanatha Temple & Agastya Lake",
        "category": "Attraction",
        "description": "Picturesque 7th-century sandstone temple projecting into the calm emerald waters of Agastya lake.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/badami.jpg",
        "latitude": 15.9208,
        "longitude": 75.6888
      },
      {
        "name": "Badami North Fort",
        "category": "Attraction",
        "description": "Cliff fort with 1,500-year-old granaries, watchtowers, and panoramic views of the red canyon.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/badami.jpg",
        "latitude": 15.925,
        "longitude": 75.686
      }
    ],
    "activities": [
      "Cave Temple Architecture Tour",
      "Sunset by Bhutanatha Temple on Agastya Lake",
      "Rock Climbing on Red Sandstone Cliffs",
      "Trek to North Fort Cannon Viewpoint"
    ],
    "travelTips": [
      "Combine Badami, Pattadakal, and Aihole into a unified 2-day Chalukyan architectural tour.",
      "The best photography light on the red sandstone caves occurs during late afternoon golden hour."
    ],
    "foodSpecialties": [
      "North Karnataka Jowar (Jolada) Rotti Oota",
      "Shenga Holige (Sweet peanut flatbread)",
      "Mirchi Bajji with Mandakki Upkari"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Pattadakal",
        "distance": "22 km",
        "description": "Scenic neighboring destination in Bagalkot corridor."
      },
      {
        "name": "Hampi",
        "distance": "135 km",
        "description": "Scenic neighboring destination in Bagalkot corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Badami",
    "talukId": "badami",
    "districtId": "bagalkote"
  },
  {
    "id": "pattadakal",
    "slug": "pattadakal",
    "name": "Pattadakal",
    "district": "Bagalkot",
    "category": "Heritage",
    "categories": [
      "Heritage",
      "Photography",
      "Culture"
    ],
    "clusters": [
      "hampi-north"
    ],
    "tags": "Heritage • Photography • Culture",
    "image": "images/destinations/pattadakal.jpg",
    "gallery": [
      "images/destinations/pattadakal.jpg"
    ],
    "alt": "Scenic sights and landscape of Pattadakal, Karnataka",
    "shortDescription": "UNESCO World Heritage site demonstrating the pinnacle of early South Indian temple architecture.",
    "description": "Pattadakal on the banks of Malaprabha River served as the ceremonial site where Chalukya kings were crowned. It showcases a harmonious blend of North Indian (Nagara) and South Indian (Dravidian) architectural styles across ten 7th and 8th-century stone masterpieces.",
    "whyVisit": "UNESCO World Heritage site demonstrating the pinnacle of early South Indian temple architecture.",
    "famousFor": [
      "Heritage",
      "Photography",
      "Culture",
      "UNESCO Heritage Temple Walk",
      "Studying Nagara vs Dravidian Vimanas side-by-side",
      "Exploring stone relief panels of Indian epics"
    ],
    "latitude": 15.949,
    "longitude": 75.816,
    "bestTimeToVisit": "October to March",
    "recommendedDays": "1 Days",
    "distanceFromBangalore": 445,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Virupaksha Temple (Pattadakal)",
        "category": "Attraction",
        "description": "Built by Queen Lokamahadevi in 740 AD to commemorate her husband's victory over the Pallavas.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/pattadakal.jpg",
        "latitude": 15.949,
        "longitude": 75.816
      },
      {
        "name": "Mallikarjuna & Sangameshwara Temples",
        "category": "Attraction",
        "description": "Sister stone shrines decorated with elaborate friezes from the Ramayana, Mahabharata, and Panchatantra.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/pattadakal.jpg",
        "latitude": 15.9495,
        "longitude": 75.8165
      }
    ],
    "activities": [
      "UNESCO Heritage Temple Walk",
      "Studying Nagara vs Dravidian Vimanas side-by-side",
      "Exploring stone relief panels of Indian epics"
    ],
    "travelTips": [
      "Pattadakal is only 22 km from Badami; hire an auto-rickshaw or taxi to cover Badami, Pattadakal, and Aihole together.",
      "Hire an ASI-certified guide at the entrance gate for detailed storytelling of 8th-century carvings."
    ],
    "foodSpecialties": [
      "Local North Karnataka Jolada Rotti Meals",
      "Spicy Ranjaka (red chilli chutney)"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Badami",
        "distance": "22 km",
        "description": "Scenic neighboring destination in Bagalkot corridor."
      },
      {
        "name": "Hampi",
        "distance": "130 km",
        "description": "Scenic neighboring destination in Bagalkot corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Badami",
    "talukId": "badami",
    "districtId": "bagalkote"
  },
  {
    "id": "belur-halebidu",
    "slug": "belur-halebidu",
    "name": "Belur & Halebidu",
    "district": "Hassan",
    "category": "Heritage",
    "categories": [
      "Heritage",
      "Spiritual",
      "Photography",
      "Culture"
    ],
    "clusters": [
      "mysore-southern"
    ],
    "tags": "Heritage • Spiritual • Photography",
    "image": "images/destinations/belur.jpg",
    "gallery": [
      "images/destinations/belur.jpg"
    ],
    "alt": "Scenic sights and landscape of Belur & Halebidu, Karnataka",
    "shortDescription": "Jewels of Hoysala craftsmanship showcasing star-shaped temple plinths and soapstone relief filigree.",
    "description": "The twin temple towns of Belur and Halebidu represent the absolute zenith of Hoysala architecture. The Chennakeshava Temple at Belur and Hoysaleshwara Temple at Halebidu are chiseled from chloritic schist with intricate depictions of dancers, animals, and mythological epics.",
    "whyVisit": "Jewels of Hoysala craftsmanship showcasing star-shaped temple plinths and soapstone relief filigree.",
    "famousFor": [
      "Heritage",
      "Spiritual",
      "Photography",
      "Culture",
      "Admiring the Madanika bracket figures in Belur",
      "Inspecting the monolithic Nandi statues at Halebidu",
      "Exploring Hoysala craftsmanship museum"
    ],
    "latitude": 13.1623,
    "longitude": 75.8569,
    "bestTimeToVisit": "October to March (Cool, sunny days)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 220,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Chennakeshava Temple Belur",
        "category": "Attraction",
        "description": "Magnificent star-shaped 12th-century temple that took 103 years to complete, celebrated for its 42 bracket figures (Madanikas).",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/belur.jpg",
        "latitude": 13.1623,
        "longitude": 75.8569
      },
      {
        "name": "Hoysaleshwara Temple Halebidu",
        "category": "Attraction",
        "description": "Twin-shrine monument famous for its endless horizontal friezes of battle scenes, makaras, and elephants.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/belur.jpg",
        "latitude": 13.2139,
        "longitude": 75.9939
      }
    ],
    "activities": [
      "Admiring the Madanika bracket figures in Belur",
      "Inspecting the monolithic Nandi statues at Halebidu",
      "Exploring Hoysala craftsmanship museum"
    ],
    "travelTips": [
      "Carry a flashlight or use your phone torch to inspect the ceilings inside Chennakeshava Temple.",
      "Belur and Halebidu are only 16 km apart; both can be thoroughly experienced in a single full day."
    ],
    "foodSpecialties": [
      "Hassan Akki Roti",
      "Coconut-based vegetable curries",
      "Filter Coffee"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Chikmagalur",
        "distance": "40 km",
        "description": "Scenic neighboring destination in Hassan corridor."
      },
      {
        "name": "Sakleshpur",
        "distance": "45 km",
        "description": "Scenic neighboring destination in Hassan corridor."
      },
      {
        "name": "Mysore",
        "distance": "145 km",
        "description": "Scenic neighboring destination in Hassan corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Belur",
    "talukId": "belur",
    "districtId": "hassan"
  },
  {
    "id": "mangalore",
    "slug": "mangalore",
    "name": "Mangalore (Mangaluru)",
    "district": "Dakshina Kannada",
    "category": "Cities",
    "categories": [
      "Cities",
      "Beaches",
      "Food & Culture",
      "Spiritual"
    ],
    "clusters": [
      "coastal-karnataka"
    ],
    "tags": "Cities • Beaches • Food & Culture",
    "image": "images/destinations/mangalore.jpg",
    "gallery": [
      "images/destinations/mangalore.jpg"
    ],
    "alt": "Scenic sights and landscape of Mangalore (Mangaluru), Karnataka",
    "shortDescription": "Coastal port metropolis famed for culinary seafood, St. Aloysius Chapel, and Panambur beach.",
    "description": "Mangaluru is Karnataka's major coastal hub, renowned for its diverse cultural tapestry, pristine beaches, and world-famous coastal delicacies such as Neer Dosa, Ghee Roast, Kori Rotti, and Pabbas ice creams. Explore historical tile factories, peaceful port beaches, and ancient Mangaladevi Temple.",
    "whyVisit": "Known for coastal scenery, historic temples, beaches, local cuisine and cultural heritage.",
    "famousFor": [
      "Coastal beaches",
      "Historic temples",
      "Seafood & local cuisine",
      "Port city heritage",
      "Religious sites"
    ],
    "latitude": 12.9141,
    "longitude": 74.856,
    "bestTimeToVisit": "October to March",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 350,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Kadri Manjunatha Temple",
        "category": "Spiritual / Shiva Temple",
        "description": "An ancient temple dedicated to Lord Manjunatha, known for its historic architecture and religious significance.",
        "visitingHours": "6:00 AM – 1:00 PM, 4:00 PM – 8:30 PM",
        "image": "images/attractions/kadri-manjunatha-temple.jpg",
        "latitude": 12.8931,
        "longitude": 74.8569
      },
      {
        "name": "Kateel Durgaparameshwari Temple",
        "category": "Spiritual / Shakti Temple",
        "description": "A major Devi temple located on an island formed by the Nandini River and an important pilgrimage destination in coastal Karnataka.",
        "visitingHours": "6:00 AM – 2:00 PM, 4:30 PM – 9:00 PM",
        "image": "images/attractions/kateel-durgaparameshwari-temple.jpg",
        "latitude": 12.9839,
        "longitude": 74.8532
      },
      {
        "name": "Mangaladevi Temple",
        "category": "Spiritual / Shakti Temple",
        "description": "9th-century temple built by King Kundavarma of the Alupa dynasty, from which the city of Mangaluru took its name.",
        "visitingHours": "6:00 AM – 1:00 PM, 4:00 PM – 8:30 PM",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.8533,
        "longitude": 74.8475
      },
      {
        "name": "Panambur Beach",
        "category": "Nature / Beaches",
        "description": "Clean golden sand beach hosting international kite festivals with thrilling water sports.",
        "visitingHours": "6:00 AM – 7:30 PM",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.9468,
        "longitude": 74.8016
      },
      {
        "name": "St. Aloysius Chapel",
        "category": "Historical / Heritage",
        "description": "Historic 1880 chapel featuring magnificent Italian frescoes painted by Antony Moscheni.",
        "visitingHours": "9:00 AM – 5:00 PM",
        "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.8733,
        "longitude": 74.8436
      },
      {
        "name": "Sultan Battery",
        "category": "Historical / Watchtower",
        "description": "Black-stone mini fortress and watchtower built by Tipu Sultan in 1784 guarding the river mouth.",
        "visitingHours": "9:00 AM – 6:30 PM",
        "image": "https://images.unsplash.com/photo-1600100397608-f010f443bbf6?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.8988,
        "longitude": 74.829
      }
    ],
    "activities": [
      "Gourmet Food Crawl for Ghee Roast and Neer Dosa",
      "Ferry Ride from Sultan Battery to Tannirbhavi",
      "Savoring Gadbad Ice Cream at Ideal / Pabbas",
      "St. Aloysius Fresco Art Tour",
      "Sunset at Panambur Beach"
    ],
    "travelTips": [
      "Pabbas or Ideal Ice Cream is an absolute must-visit for trying the legendary 'Gadbad' ice cream sundae.",
      "Take the picturesque coastal train or drive through Shiradi Ghat to reach Mangaluru."
    ],
    "foodSpecialties": [
      "Chicken / Prawn Ghee Roast at Maharaja",
      "Kori Rotti with rich chicken gravy",
      "Neer Dosa",
      "Anjal (Seer Fish) Tawa Fry",
      "Gadbad Ice Cream"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Kateel Durgaparameshwari Temple",
        "distance": "26 km",
        "description": "Island river temple dedicated to Goddess Durga."
      },
      {
        "name": "Pilikula Nisargadhama",
        "distance": "12 km",
        "description": "Integrated eco-park with biological reserve, lake, and heritage village."
      },
      {
        "name": "Ullal Beach & Queen Abbakka Fort",
        "distance": "14 km",
        "description": "Historic beach honoring warrior queen Rani Abbakka."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Kadri Manjunatha Temple",
        "Panambur Beach",
        "Kateel Durgaparameshwari Temple",
        "St. Aloysius Chapel"
      ],
      "templesSpiritual": [
        "Kadri Manjunatha Temple",
        "Kateel Durgaparameshwari Temple",
        "Mangaladevi Temple",
        "Kudroli Gokarnanatha Temple"
      ],
      "natureBeaches": [
        "Panambur Beach",
        "Tannirbhavi Beach",
        "Someshwara Beach",
        "Sasihithlu Beach"
      ],
      "historicalPlaces": [
        "St. Aloysius Chapel",
        "Sultan Battery",
        "Mangalore Tile Works"
      ],
      "foodExperiences": [
        "Mangalorean Fish Curry & Anjal Fry",
        "Kori Rotti & Chicken Ghee Roast",
        "Pabbas Famous Gadbad Ice Cream",
        "Neer Dosa"
      ],
      "hiddenGems": [
        "Tannirbhavi Tree Park",
        "Sultan Battery Ferry Ride",
        "Pilikula Artisan Village"
      ],
      "familyFriendly": [
        "Pilikula Biological Park",
        "Panambur Beach Walkway",
        "Pabbas Ice Cream"
      ],
      "adventureActivities": [
        "Jet Skiing & Surfing at Sasihithlu",
        "Panambur Parasailing"
      ]
    },
    "taluk": "Mangaluru",
    "talukId": "mangaluru",
    "districtId": "dakshina-kannada"
  },
  {
    "id": "srirangapatna",
    "slug": "srirangapatna",
    "name": "Srirangapatna",
    "district": "Mandya",
    "category": "Heritage",
    "categories": [
      "Heritage",
      "Spiritual",
      "Culture"
    ],
    "clusters": [
      "mysore-southern"
    ],
    "tags": "Heritage • Spiritual • Culture",
    "image": "images/destinations/srirangapatna.jpg",
    "gallery": [
      "images/destinations/srirangapatna.jpg"
    ],
    "alt": "Scenic sights and landscape of Srirangapatna, Karnataka",
    "shortDescription": "Island fortress city of Tipu Sultan situated on the Cauvery River, filled with historic monuments.",
    "description": "An island town enclosed by the Cauvery River just 15 km from Mysuru, Srirangapatna was the capital of Mysore under Hyder Ali and Tipu Sultan. Famous for the Ranganathaswamy Temple, Dariya Daulat Bagh (Summer Palace), and the Colonel Bailey's Dungeon.",
    "whyVisit": "Island fortress city of Tipu Sultan situated on the Cauvery River, filled with historic monuments.",
    "famousFor": [
      "Heritage",
      "Spiritual",
      "Culture",
      "Boat Safari at Ranganathittu Bird Sanctuary",
      "Exploring Tipu Sultan's Dariya Daulat Palace",
      "Visiting Colonel Bailey's Dungeon and Water Gate"
    ],
    "latitude": 12.4238,
    "longitude": 76.6947,
    "bestTimeToVisit": "October to March",
    "recommendedDays": "1 Days",
    "distanceFromBangalore": 125,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Dariya Daulat Bagh (Summer Palace)",
        "category": "Attraction",
        "description": "Teakwood palace surrounded by Mughal gardens adorned with intricate fresco battle murals.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/srirangapatna.jpg",
        "latitude": 12.4186,
        "longitude": 76.7022
      },
      {
        "name": "Ranganathaswamy Temple",
        "category": "Attraction",
        "description": "Revered Vaishnavite temple dating back to the Ganga dynasty in the 9th century.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/srirangapatna.jpg",
        "latitude": 12.4238,
        "longitude": 76.6947
      },
      {
        "name": "Gumbaz (Mausoleum of Tipu Sultan)",
        "category": "Attraction",
        "description": "Towering black basalt dome containing tombs of Hyder Ali, Tipu Sultan, and his mother.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/srirangapatna.jpg",
        "latitude": 12.412,
        "longitude": 76.723
      },
      {
        "name": "Ranganathittu Bird Sanctuary",
        "category": "Attraction",
        "description": "Islet bird haven 4 km away harboring painted storks, pelicans, and marsh crocodiles.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/srirangapatna.jpg",
        "latitude": 12.425,
        "longitude": 76.655
      }
    ],
    "activities": [
      "Boat Safari at Ranganathittu Bird Sanctuary",
      "Exploring Tipu Sultan's Dariya Daulat Palace",
      "Visiting Colonel Bailey's Dungeon and Water Gate"
    ],
    "travelTips": [
      "Combine Srirangapatna with Mysore or visit as an easy day stop on the Bengaluru-Mysuru highway.",
      "Early morning boat ride at Ranganathittu Bird Sanctuary offers the best bird activity."
    ],
    "foodSpecialties": [
      "Maddur Vada at Shivalli",
      "Mysore Pak",
      "Sugarcane juice from Mandya farms"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Mysore",
        "distance": "15 km",
        "description": "Scenic neighboring destination in Mandya corridor."
      },
      {
        "name": "Bengaluru",
        "distance": "125 km",
        "description": "Scenic neighboring destination in Mandya corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Srirangapatna",
    "talukId": "srirangapatna",
    "districtId": "mandya"
  },
  {
    "id": "sringeri",
    "slug": "sringeri",
    "name": "Sringeri",
    "district": "Chikkamagaluru",
    "category": "Religious",
    "categories": [
      "Religious",
      "Spiritual",
      "Nature",
      "Culture"
    ],
    "clusters": [
      "malnad"
    ],
    "tags": "Religious • Spiritual • Nature",
    "image": "images/destinations/sringeri.jpg",
    "gallery": [
      "images/destinations/sringeri.jpg"
    ],
    "alt": "Scenic sights and landscape of Sringeri, Karnataka",
    "shortDescription": "Sacred temple town nestled on the banks of Tunga River, founded by Adi Shankaracharya in the 8th century.",
    "description": "Sringeri is a hallowed pilgrim destination in the Sahyadri hills. It is home to the first Sharada Peetham established by Sri Adi Shankaracharya. Visitors are captivated by the Vidyashankara Temple, whose 12 pillars are sculpted so the sun shines on the zodiac sign corresponding to the solar month.",
    "whyVisit": "Sacred temple town nestled on the banks of Tunga River, founded by Adi Shankaracharya in the 8th century.",
    "famousFor": [
      "Religious",
      "Spiritual",
      "Nature",
      "Culture",
      "Feeding sacred Tor Mahseer fish on the Tunga River steps",
      "Observing the zodiac pillar architecture of Vidyashankara Temple",
      "Visiting Sirimane Falls in the dense Ghats"
    ],
    "latitude": 13.4187,
    "longitude": 75.257,
    "bestTimeToVisit": "October to March (Gentle mountain breezes)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 320,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Vidyashankara Temple",
        "category": "Attraction",
        "description": "Unique astronomical stone temple with 12 zodiac pillars aligned with the sun.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/sringeri.jpg",
        "latitude": 13.4187,
        "longitude": 75.257
      },
      {
        "name": "Sharadamba Temple & Tunga River Ghats",
        "category": "Attraction",
        "description": "Peaceful riverside temple steps where visitors feed sacred Tor Mahseer fish.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/sringeri.jpg",
        "latitude": 13.4185,
        "longitude": 75.2575
      },
      {
        "name": "Sirimane Falls",
        "category": "Attraction",
        "description": "Picturesque 40-foot waterfall cascading inside dense Western Ghat rainforests 14 km away.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/sringeri.jpg",
        "latitude": 13.44,
        "longitude": 75.18
      }
    ],
    "activities": [
      "Feeding sacred Tor Mahseer fish on the Tunga River steps",
      "Observing the zodiac pillar architecture of Vidyashankara Temple",
      "Visiting Sirimane Falls in the dense Ghats",
      "Temple Annadana Prasadam lunch"
    ],
    "travelTips": [
      "Strict dress code: men must remove shirts or wear dhotis/shawls to enter inner sanctum.",
      "The temple offers serene free community meals (Bhojana) served twice daily."
    ],
    "foodSpecialties": [
      "Traditional Satvik Malnad temple meals",
      "Kotte Kadubu",
      "Tender Coconut"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Kudremukh",
        "distance": "45 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      },
      {
        "name": "Chikmagalur",
        "distance": "85 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      },
      {
        "name": "Udupi",
        "distance": "85 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Sringeri",
    "talukId": "sringeri",
    "districtId": "chikkamagaluru"
  },
  {
    "id": "bengaluru",
    "slug": "bengaluru",
    "name": "Bengaluru (Bangalore)",
    "district": "Bengaluru Urban",
    "category": "Cities",
    "categories": [
      "Cities",
      "Heritage",
      "Food & Culture",
      "Nature"
    ],
    "clusters": [
      "bengaluru-region"
    ],
    "tags": "Cities • Heritage • Food & Culture",
    "image": "images/destinations/bengaluru.jpg",
    "gallery": [
      "images/destinations/bengaluru.jpg"
    ],
    "alt": "Scenic sights and landscape of Bengaluru (Bangalore), Karnataka",
    "shortDescription": "The vibrant Garden City and Silicon Valley of India, known for pleasant weather, parks, and craft breweries.",
    "description": "Bengaluru blends green botanical gardens, historic palaces, and buzzing cosmopolitan energy. From the centuries-old Lalbagh Botanical Garden and Tipu Sultan's Summer Palace to lively café lanes in Indiranagar and world-class craft breweries, Bengaluru is the gateway to exploring Karnataka.",
    "whyVisit": "The vibrant Garden City and Silicon Valley of India, known for pleasant weather, parks, and craft breweries.",
    "famousFor": [
      "Cities",
      "Heritage",
      "Food & Culture",
      "Nature",
      "Morning walk through Lalbagh Glasshouse",
      "Craft Brewery Tour in Indiranagar and Koramangala",
      "Breakfast crawl for crispy Masala Dosa at Vidyarthi Bhavan or CTR"
    ],
    "latitude": 12.9716,
    "longitude": 77.5946,
    "bestTimeToVisit": "Year-Round (Pleasant plateau climate throughout the year)",
    "recommendedDays": "3 Days",
    "distanceFromBangalore": 0,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Lalbagh Botanical Garden",
        "category": "Attraction",
        "description": "240-acre botanical garden housing rare tropical plants and a London Crystal Palace replica.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/bengaluru.jpg",
        "latitude": 12.9507,
        "longitude": 77.5848
      },
      {
        "name": "Bangalore Palace",
        "category": "Attraction",
        "description": "Tudor-style royal castle with fortified towers, wooden carvings, and royal memorabilia.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/bengaluru.jpg",
        "latitude": 12.9988,
        "longitude": 77.5921
      },
      {
        "name": "Cubbon Park",
        "category": "Attraction",
        "description": "300-acre lush lung of the city adjoining the neo-Dravidian Vidhana Soudha legislature.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/bengaluru.jpg",
        "latitude": 12.976,
        "longitude": 77.592
      },
      {
        "name": "National Gallery of Modern Art (NGMA)",
        "category": "Attraction",
        "description": "Colonial heritage mansion displaying Indian art masterpieces amid century-old trees.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/bengaluru.jpg",
        "latitude": 12.989,
        "longitude": 77.588
      }
    ],
    "activities": [
      "Morning walk through Lalbagh Glasshouse",
      "Craft Brewery Tour in Indiranagar and Koramangala",
      "Breakfast crawl for crispy Masala Dosa at Vidyarthi Bhavan or CTR",
      "Shopping for Channapatna wooden toys and Mysore silks on MG Road"
    ],
    "travelTips": [
      "Use Namma Metro to avoid peak-hour road traffic across major hubs.",
      "Early mornings (6:00 AM - 9:00 AM) are prime times for visiting Cubbon Park and Lalbagh when vehicles are restricted."
    ],
    "foodSpecialties": [
      "Benne Masala Dosa at CTR / Vidyarthi Bhavan",
      "Khara Bath & Kesari Bath (Chow Chow Bath)",
      "Rava Idli at MTR",
      "Local craft beers and microbrews",
      "Filter Kaapi"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Nandi Hills",
        "distance": "60 km",
        "description": "Scenic neighboring destination in Bengaluru Urban corridor."
      },
      {
        "name": "Srirangapatna",
        "distance": "125 km",
        "description": "Scenic neighboring destination in Bengaluru Urban corridor."
      },
      {
        "name": "Mysore",
        "distance": "145 km",
        "description": "Scenic neighboring destination in Bengaluru Urban corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Bengaluru North",
    "talukId": "bengaluru-north",
    "districtId": "bengaluru-urban"
  },
  {
    "id": "dandeli",
    "slug": "dandeli",
    "name": "Dandeli",
    "district": "Uttara Kannada",
    "category": "Adventure",
    "categories": [
      "Adventure",
      "Wildlife",
      "Nature",
      "Waterfalls"
    ],
    "clusters": [
      "belagavi-north"
    ],
    "tags": "Adventure • Wildlife • Nature",
    "image": "images/destinations/dandeli.jpg",
    "gallery": [
      "images/destinations/dandeli.jpg"
    ],
    "alt": "Scenic sights and landscape of Dandeli, Karnataka",
    "shortDescription": "Adventure capital of South India famous for white-water rafting on the Kali River and jungle safaris.",
    "description": "Dandeli is the ultimate adventure getaway in Karnataka. Surrounded by dense deciduous forests along the untamed Kali River, thrill-seekers flock here for Grade-III white water rafting, kayaking, natural river jacuzzis, zip lining, and wildlife safaris spotting hornbills and panthers.",
    "whyVisit": "Adventure capital of South India famous for white-water rafting on the Kali River and jungle safaris.",
    "famousFor": [
      "Adventure",
      "Wildlife",
      "Nature",
      "Waterfalls",
      "Grade III White Water Rafting",
      "Natural Jacuzzi Bath in Kali River",
      "Kayaking and Coracle rides"
    ],
    "latitude": 15.2458,
    "longitude": 74.6225,
    "bestTimeToVisit": "October to May (Optimal river currents for white water rafting)",
    "recommendedDays": "3 Days",
    "distanceFromBangalore": 460,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Kali River White Water Rafting",
        "category": "Attraction",
        "description": "Exhilarating 12 km river rafting expedition through scenic river rapids and gorges.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/dandeli.jpg",
        "latitude": 15.2458,
        "longitude": 74.6225
      },
      {
        "name": "Syntheri Rocks",
        "category": "Attraction",
        "description": "Monolithic granite ravine 300 feet high through which the Kanambi river gushes fiercely.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/dandeli.jpg",
        "latitude": 15.215,
        "longitude": 74.52
      },
      {
        "name": "Dandeli Wildlife Sanctuary",
        "category": "Attraction",
        "description": "Dense forest reserve home to black panthers, Great Pied Hornbills, and barking deer.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/dandeli.jpg",
        "latitude": 15.23,
        "longitude": 74.6
      }
    ],
    "activities": [
      "Grade III White Water Rafting",
      "Natural Jacuzzi Bath in Kali River",
      "Kayaking and Coracle rides",
      "Ziplining through forest canopy",
      "Hornbill birdwatching in timber reserves"
    ],
    "travelTips": [
      "White water rafting is dependent on water discharge from Supa Dam; confirm rafting timings with local guides.",
      "Wear water-friendly clothes and strap-on footwear for all river adventure activities."
    ],
    "foodSpecialties": [
      "North Karnataka style thalis",
      "Spicy country chicken curry",
      "Fresh river fish fry"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Gokarna",
        "distance": "155 km",
        "description": "Scenic neighboring destination in Uttara Kannada corridor."
      },
      {
        "name": "Jog Falls",
        "distance": "145 km",
        "description": "Scenic neighboring destination in Uttara Kannada corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Dandeli",
    "talukId": "dandeli",
    "districtId": "uttara-kannada"
  },
  {
    "id": "jog-falls",
    "slug": "jog-falls",
    "name": "Jog Falls",
    "district": "Shivamogga",
    "category": "Waterfalls",
    "categories": [
      "Waterfalls",
      "Nature",
      "Photography"
    ],
    "clusters": [
      "malnad"
    ],
    "tags": "Waterfalls • Nature • Photography",
    "image": "images/destinations/jog-falls.jpg",
    "gallery": [
      "images/destinations/jog-falls.jpg"
    ],
    "alt": "Scenic sights and landscape of Jog Falls, Karnataka",
    "shortDescription": "India's second-highest plunge waterfall, dropping 253 meters in four distinct cascades.",
    "description": "Jog Falls, created by the Sharavathi River, is one of the most magnificent natural spectacles in India. The cascade plummets 830 feet in four magnificent torrents named Raja, Roarer, Rocket, and Rani. During monsoon months, the valley becomes an amphitheater of thunderous mist and rainbows.",
    "whyVisit": "India's second-highest plunge waterfall, dropping 253 meters in four distinct cascades.",
    "famousFor": [
      "Waterfalls",
      "Nature",
      "Photography",
      "Panoramic Waterfall Viewing from Watkins Platform",
      "Climbing 1,400 steps to the gorge floor (seasonal)",
      "Laser light and musical fountain show in the evening"
    ],
    "latitude": 14.2285,
    "longitude": 74.8124,
    "bestTimeToVisit": "July to December (Peak monsoon roaring flow & rainbow mist)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 410,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Sharavathi Valley Viewpoint",
        "category": "Attraction",
        "description": "Main pavilion viewing area offering full frontal panoramic views of all four waterfalls.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/jog-falls.jpg",
        "latitude": 14.2285,
        "longitude": 74.8124
      },
      {
        "name": "Bottom of the Falls (1400 Steps)",
        "category": "Attraction",
        "description": "Challenging staircase leading all the way to the mist pool at the base of the gorge.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/jog-falls.jpg",
        "latitude": 14.229,
        "longitude": 74.813
      }
    ],
    "activities": [
      "Panoramic Waterfall Viewing from Watkins Platform",
      "Climbing 1,400 steps to the gorge floor (seasonal)",
      "Laser light and musical fountain show in the evening",
      "Photography of rainbows in the morning spray"
    ],
    "travelTips": [
      "Monsoon months (July to October) offer the most roaring, thunderous water flow.",
      "During dry summer months (March-May), water volume is significantly reduced due to Linganamakki hydroelectric dam holding."
    ],
    "foodSpecialties": [
      "Malnad Thali",
      "Akki Roti with bamboo curry",
      "Kotte Kadubu"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Murudeshwar",
        "distance": "90 km",
        "description": "Scenic neighboring destination in Shivamogga corridor."
      },
      {
        "name": "Gokarna",
        "distance": "115 km",
        "description": "Scenic neighboring destination in Shivamogga corridor."
      },
      {
        "name": "Sringeri",
        "distance": "110 km",
        "description": "Scenic neighboring destination in Shivamogga corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Sagara",
    "talukId": "sagara",
    "districtId": "shivamogga"
  },
  {
    "id": "sakleshpur",
    "slug": "sakleshpur",
    "name": "Sakleshpur",
    "district": "Hassan",
    "category": "Hill Stations",
    "categories": [
      "Hill Stations",
      "Nature",
      "Adventure",
      "Coffee",
      "Photography"
    ],
    "clusters": [
      "malnad"
    ],
    "tags": "Hill Stations • Nature • Adventure",
    "image": "images/destinations/sakleshpur.jpg",
    "gallery": [
      "images/destinations/sakleshpur.jpg"
    ],
    "alt": "Scenic sights and landscape of Sakleshpur, Karnataka",
    "shortDescription": "Charming hill station with aromatic cardamom plantations, star fortresses, and railway bridge treks.",
    "description": "Sakleshpur is a tranquil highland retreat nestled in the Western Ghats between Hassan and Mangalore. Celebrated for its cool climate, endless cardamom, pepper, and coffee estates, and historical landmarks like the star-shaped Manjarabad Fort built by Tipu Sultan.",
    "whyVisit": "Charming hill station with aromatic cardamom plantations, star fortresses, and railway bridge treks.",
    "famousFor": [
      "Hill Stations",
      "Nature",
      "Adventure",
      "Coffee",
      "Photography",
      "Climbing Manjarabad Octagonal Star Fort",
      "Bisle Ghat Rainforest Panorama Photography",
      "Green Route railway track scenic walks"
    ],
    "latitude": 12.9439,
    "longitude": 75.7865,
    "bestTimeToVisit": "September to April (Green meadows and cool breezes)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 220,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Manjarabad Fort",
        "category": "Attraction",
        "description": "Octagonal star-shaped hill fort built in 1792 by Tipu Sultan with stunning 360-degree valley views.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/sakleshpur.jpg",
        "latitude": 12.9238,
        "longitude": 75.7612
      },
      {
        "name": "Bisle Ghat Viewpoint",
        "category": "Attraction",
        "description": "Sensational cliff edge looking over three mountain ranges and evergreen rainforest canopies.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/sakleshpur.jpg",
        "latitude": 12.7214,
        "longitude": 75.7128
      },
      {
        "name": "Jenukal Gudda",
        "category": "Attraction",
        "description": "Second highest peak in Karnataka offering views extending towards the Arabian Sea on crystal clear days.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/sakleshpur.jpg",
        "latitude": 12.89,
        "longitude": 75.72
      }
    ],
    "activities": [
      "Climbing Manjarabad Octagonal Star Fort",
      "Bisle Ghat Rainforest Panorama Photography",
      "Green Route railway track scenic walks",
      "Estate camping and stream wading"
    ],
    "travelTips": [
      "Manjarabad Fort requires climbing approximately 250 steps; best visited in morning or late afternoon.",
      "Bisle Ghat viewpoint is a biodiversity paradise; carry binoculars for birdwatching."
    ],
    "foodSpecialties": [
      "Malnad Akki Roti",
      "Hassan Cardamom infused tea",
      "Pandi Curry / Jackfruit curry in homestays"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Belur & Halebidu",
        "distance": "45 km",
        "description": "Scenic neighboring destination in Hassan corridor."
      },
      {
        "name": "Chikmagalur",
        "distance": "60 km",
        "description": "Scenic neighboring destination in Hassan corridor."
      },
      {
        "name": "Coorg",
        "distance": "110 km",
        "description": "Scenic neighboring destination in Hassan corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Sakleshpur",
    "talukId": "sakleshpur",
    "districtId": "hassan"
  },
  {
    "id": "kudremukh",
    "slug": "kudremukh",
    "name": "Kudremukh",
    "district": "Chikkamagaluru",
    "category": "Nature",
    "categories": [
      "Nature",
      "Hill Stations",
      "Adventure",
      "Photography",
      "Wildlife"
    ],
    "clusters": [
      "malnad"
    ],
    "tags": "Nature • Hill Stations • Adventure",
    "image": "images/destinations/kudremukh.jpg",
    "gallery": [
      "images/destinations/kudremukh.jpg"
    ],
    "alt": "Scenic sights and landscape of Kudremukh, Karnataka",
    "shortDescription": "Rolling emerald shola grasslands and horse-face shaped mountain peaks protected inside a National Park.",
    "description": "Named after its distinctive mountain peak resembling a horse's face ('Kudre-mukha' in Kannada), Kudremukh is a UNESCO World Heritage biodiversity hotspot. Known for rolling emerald meadows, misty ridges, and pristine shola forest ecosystems that receive some of the highest rainfall in Karnataka.",
    "whyVisit": "Rolling emerald shola grasslands and horse-face shaped mountain peaks protected inside a National Park.",
    "famousFor": [
      "Nature",
      "Hill Stations",
      "Adventure",
      "Photography",
      "Wildlife",
      "Kudremukh Peak 22-km Day Trek",
      "Hanuman Gundi Waterfall Dip",
      "Nature Walks through Shola Grasslands"
    ],
    "latitude": 13.2185,
    "longitude": 75.253,
    "bestTimeToVisit": "June to February (Rolling emerald grasslands during monsoon and winter)",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 330,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Kudremukh Peak Trek",
        "category": "Attraction",
        "description": "Thrilling 22-km day trek across green shola grasslands, streams, and rolling high-altitude hills.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/kudremukh.jpg",
        "latitude": 13.2185,
        "longitude": 75.253
      },
      {
        "name": "Hanuman Gundi Falls",
        "category": "Attraction",
        "description": "Cascading 100-foot waterfall inside the national park surrounded by deep greenery.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/kudremukh.jpg",
        "latitude": 13.25,
        "longitude": 75.27
      }
    ],
    "activities": [
      "Kudremukh Peak 22-km Day Trek",
      "Hanuman Gundi Waterfall Dip",
      "Nature Walks through Shola Grasslands",
      "Birdwatching in Western Ghats Biosphere"
    ],
    "travelTips": [
      "Kudremukh Peak trek strictly requires a prior permit from Karnataka Forest Department (limited to 50 trekkers/day).",
      "Camping inside the national park is forbidden; stay in nearby Samse or Kalasa homestays."
    ],
    "foodSpecialties": [
      "Malnad Vegetarian Oota",
      "Neer Dosa",
      "Filter Coffee"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Sringeri",
        "distance": "45 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      },
      {
        "name": "Chikmagalur",
        "distance": "90 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      },
      {
        "name": "Udupi",
        "distance": "95 km",
        "description": "Scenic neighboring destination in Chikkamagaluru corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Kalasa",
    "talukId": "kalasa",
    "districtId": "chikkamagaluru"
  },
  {
    "id": "nandi-hills",
    "slug": "nandi-hills",
    "name": "Nandi Hills",
    "district": "Chikkaballapur",
    "category": "Hill Stations",
    "categories": [
      "Hill Stations",
      "Nature",
      "Hidden Gems",
      "Photography"
    ],
    "clusters": [
      "bengaluru-region"
    ],
    "tags": "Hill Stations • Nature • Hidden Gems",
    "image": "images/destinations/nandi-hills.jpg",
    "gallery": [
      "images/destinations/nandi-hills.jpg"
    ],
    "alt": "Scenic sights and landscape of Nandi Hills, Karnataka",
    "shortDescription": "Popular weekend sunrise getaway perched 1,478 meters above sea level with sea-of-clouds panoramas.",
    "description": "Located just 60 km from Bengaluru, Nandi Hills is the ultimate sunrise haven. Visitors arrive early to witness rolling clouds beneath the cliffs, visit the ancient Yoga Nandeeshwara temple, and explore Tipu's Drop and summer residence.",
    "whyVisit": "Popular weekend sunrise getaway perched 1,478 meters above sea level with sea-of-clouds panoramas.",
    "famousFor": [
      "Hill Stations",
      "Nature",
      "Hidden Gems",
      "Photography",
      "Sunrise viewing above the sea of clouds",
      "Cycling or motorbiking up the 40 winding hairpin bends",
      "Heritage walk through Tipu's Summer Lodge and Fort Walls"
    ],
    "latitude": 13.3702,
    "longitude": 77.6835,
    "bestTimeToVisit": "Year-Round (Misty mornings and sea of clouds in winter)",
    "recommendedDays": "1 Days",
    "distanceFromBangalore": 60,
    "averageRating": 4.8,
    "reviewCount": 120,
    "featured": false,
    "attractions": [
      {
        "name": "Tipu's Drop",
        "category": "Attraction",
        "description": "Dramatic 600-meter cliff overhang offering heart-racing vertical views of the plains below.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/nandi-hills.jpg",
        "latitude": 13.3702,
        "longitude": 77.6835
      },
      {
        "name": "Yoga Nandeeshwara Temple",
        "category": "Attraction",
        "description": "Chola-period hilltop stone temple guarded by an intricately carved brass bull Nandi.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/nandi-hills.jpg",
        "latitude": 13.368,
        "longitude": 77.682
      },
      {
        "name": "Amruth Sarovar",
        "category": "Attraction",
        "description": "Historic stone-stepped water reservoir surrounded by manicured hilltop gardens.",
        "visitingHours": "Open regular hours",
        "image": "images/destinations/nandi-hills.jpg",
        "latitude": 13.371,
        "longitude": 77.685
      }
    ],
    "activities": [
      "Sunrise viewing above the sea of clouds",
      "Cycling or motorbiking up the 40 winding hairpin bends",
      "Heritage walk through Tipu's Summer Lodge and Fort Walls",
      "Trek up via the ancient Sultanpet stone steps"
    ],
    "travelTips": [
      "The hill entry gates open at 6:00 AM; arrive by 5:30 AM on weekends to avoid vehicle queues.",
      "Weekend parking can fill quickly; weekdays provide a peaceful, uncrowded mountain retreat."
    ],
    "foodSpecialties": [
      "Hot Masala Tea and roasted corn on the cob",
      "Crispy Mirchi Bhajji",
      "South Indian Dosa at foothill eateries"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Bengaluru",
        "distance": "60 km",
        "description": "Scenic neighboring destination in Chikkaballapur corridor."
      }
    ],
    "categorizedPlaces": {},
    "taluk": "Chikkaballapura",
    "talukId": "chikkaballapura",
    "districtId": "chikkaballapura"
  },
  {
    "id": "dharmasthala",
    "slug": "dharmasthala",
    "name": "Dharmasthala",
    "district": "Dakshina Kannada",
    "category": "Religious",
    "categories": [
      "Religious",
      "Spiritual",
      "Heritage",
      "Culture"
    ],
    "clusters": [
      "coastal-karnataka",
      "mysore-southern"
    ],
    "tags": "Religious • Spiritual • Heritage",
    "image": "images/destinations/dharmasthala.jpg",
    "gallery": [
      "images/destinations/dharmasthala.jpg",
      "images/attractions/dharmasthala-manjunatha-temple.jpg"
    ],
    "alt": "Scenic sights and landscape of Dharmasthala, Karnataka",
    "shortDescription": "Revered temple sanctuary on the banks of Netravati river, celebrated for Sri Manjunatha Swamy Temple and noble Annadana tradition.",
    "description": "Dharmasthala is an extraordinary spiritual sanctuary where Lord Shiva is worshipped as Manjunatha. Built on eight centuries of tradition under the Pergade family, it represents a remarkable harmony of Shaiva, Vaishnava, and Jain heritage. Tens of thousands of pilgrims partake in the legendary free Annadana (sacred dining) daily.",
    "whyVisit": "A historic Shiva temple associated with the unique coexistence of Shaiva and Jain traditions, peaceful river ghats, and spiritual benevolence.",
    "famousFor": [
      "Manjunatha Swamy Temple",
      "Mass Annadana tradition",
      "Bahubali Monolith",
      "Vintage Car Museum",
      "Lakshadeepa Festival"
    ],
    "latitude": 12.9554,
    "longitude": 75.3783,
    "bestTimeToVisit": "September to March",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 300,
    "averageRating": 4.9,
    "reviewCount": 380,
    "featured": true,
    "attractions": [
      {
        "name": "Dharmasthala Manjunatha Temple",
        "category": "Spiritual / Shiva Temple",
        "description": "A historic Shiva temple associated with the unique coexistence of Shaiva and Jain traditions and the long-standing administration of the Pergade family.",
        "visitingHours": "6:30 AM – 2:00 PM, 5:00 PM – 8:30 PM",
        "image": "images/attractions/dharmasthala-manjunatha-temple.jpg",
        "latitude": 12.9554,
        "longitude": 75.3783
      },
      {
        "name": "Bahubali Monolithic Statue",
        "category": "Heritage / Spiritual",
        "description": "Majestic 39-foot monolithic statue of Lord Bahubali carved from a single granite boulder on Ratnagiri hill.",
        "visitingHours": "8:00 AM – 6:30 PM",
        "image": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.9602,
        "longitude": 75.3812
      },
      {
        "name": "Manjusha Museum & Vintage Car Collection",
        "category": "Heritage / Culture",
        "description": "Remarkable museum showcasing ancient palm-leaf manuscripts, antique temple chariots, and rare vintage automobiles.",
        "visitingHours": "9:00 AM – 1:00 PM, 4:00 PM – 8:00 PM",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.9535,
        "longitude": 75.377
      },
      {
        "name": "Netravati River Snana Ghatta",
        "category": "Nature / Spiritual",
        "description": "Sacred river steps where pilgrims take a purifying holy dip before entering the temple sanctum.",
        "visitingHours": "5:30 AM – 6:30 PM",
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.9501,
        "longitude": 75.3725
      }
    ],
    "activities": [
      "Darshan at Manjunatha Swamy Temple",
      "Partake in the Sacred Annadana meal",
      "Climb Ratnagiri Hill for Bahubali views",
      "Tour the Vintage Car Collection at Manjusha Museum",
      "Holy dip in the pristine Netravati River"
    ],
    "travelTips": [
      "Traditional South Indian dress code (Dhoti/Saree) is respected during Sanctum Sanctorum darshan.",
      "Arrive early morning for quicker darshan queues during weekends and festival days.",
      "Stay in KSTDC or temple guest houses booked directly in advance."
    ],
    "foodSpecialties": [
      "Dharmasthala Temple Mahaprasada",
      "Authentic South Indian Vegetarian Thali",
      "Mangalore Buns",
      "Neer Dosa with Chutney"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Kukke Subrahmanya Temple",
        "distance": "55 km",
        "description": "Western Ghats snake pilgrimage centre with sacred Kumaradhara river."
      },
      {
        "name": "Southadka Maha Ganapathi Temple",
        "distance": "16 km",
        "description": "Unique open-air Ganapati temple without a shrine roof."
      },
      {
        "name": "Jamalabad Fort (Narasimha Gada)",
        "distance": "28 km",
        "description": "Monolithic rock fort built by Tipu Sultan with challenging steps."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Dharmasthala Manjunatha Temple",
        "Bahubali Monolithic Statue"
      ],
      "templesSpiritual": [
        "Dharmasthala Manjunatha Temple",
        "Southadka Ganapathi Temple",
        "Ratnagiri Bahubali"
      ],
      "natureBeaches": [
        "Netravati River Ghats",
        "Charmadi Ghat Viewpoint (nearby)"
      ],
      "historicalPlaces": [
        "Manjusha Museum",
        "Jamalabad Fort"
      ],
      "foodExperiences": [
        "Temple Annadana Mahaprasada",
        "Annapoorna Dining Hall"
      ],
      "hiddenGems": [
        "Manjusha Vintage Cars",
        "Didupe Waterfalls (nearby)"
      ],
      "familyFriendly": [
        "Temple Complex & Gardens",
        "Manjusha Museum"
      ],
      "adventureActivities": [
        "Jamalabad Fort Trek",
        "Charmadi Ghat drive"
      ]
    },
    "taluk": "Belthangady",
    "talukId": "belathangadi",
    "districtId": "dakshina-kannada"
  },
  {
    "id": "kukke-subrahmanya",
    "slug": "kukke-subrahmanya",
    "name": "Kukke Subrahmanya",
    "district": "Dakshina Kannada",
    "category": "Religious",
    "categories": [
      "Religious",
      "Spiritual",
      "Nature",
      "Heritage"
    ],
    "clusters": [
      "coastal-karnataka",
      "mysore-southern"
    ],
    "tags": "Religious • Spiritual • Nature",
    "image": "images/destinations/kukke-subrahmanya.jpg",
    "gallery": [
      "images/destinations/kukke-subrahmanya.jpg",
      "images/attractions/kukke-subrahmanya-temple.jpg"
    ],
    "alt": "Scenic sights and landscape of Kukke Subrahmanya, Karnataka",
    "shortDescription": "A major pilgrimage centre in the Western Ghats associated with serpent worship and traditional Sarpa Dosha-related rituals.",
    "description": "Framed by the dramatic backdrop of Kumara Parvatha in the Western Ghats, Kukke Subrahmanya is one of the most hallowed pilgrimage destinations in South India. Revered for serpent worship and rituals like Ashlesha Bali and Sarpa Samskara, the temple is bordered by the pristine Kumaradhara River.",
    "whyVisit": "Major pilgrimage centre in Western Ghats associated with serpent worship, sacred river ghats, and pristine mountain backdrop.",
    "famousFor": [
      "Kukke Subrahmanya Temple",
      "Sarpa Dosha Poojas",
      "Kumara Parvatha trek",
      "Kumaradhara River holy baths"
    ],
    "latitude": 12.6787,
    "longitude": 75.6148,
    "bestTimeToVisit": "September to March",
    "recommendedDays": "2 Days",
    "distanceFromBangalore": 280,
    "averageRating": 4.9,
    "reviewCount": 295,
    "featured": true,
    "attractions": [
      {
        "name": "Kukke Subrahmanya Temple",
        "category": "Spiritual / Subrahmanya Temple",
        "description": "A major pilgrimage centre in the Western Ghats associated with serpent worship and traditional Sarpa Dosha-related rituals.",
        "visitingHours": "6:00 AM – 1:30 PM, 3:30 PM – 8:00 PM",
        "image": "images/attractions/kukke-subrahmanya-temple.jpg",
        "latitude": 12.6787,
        "longitude": 75.6148
      },
      {
        "name": "Adi Subrahmanya Temple",
        "category": "Spiritual / Subrahmanya Temple",
        "description": "The ancient original shrine located close to the main temple complex, surrounded by sacred anthills.",
        "visitingHours": "6:30 AM – 1:00 PM, 4:00 PM – 7:30 PM",
        "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.682,
        "longitude": 75.616
      },
      {
        "name": "Kumaradhara River Bathing Ghat",
        "category": "Nature / Spiritual",
        "description": "Sacred river waters carrying the medicinal essence of Western Ghats herbs where devotees take purifying baths.",
        "visitingHours": "5:30 AM – 6:30 PM",
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.672,
        "longitude": 75.609
      },
      {
        "name": "Biladwara Cave",
        "category": "Heritage / Spiritual",
        "description": "Natural cave in the forest where serpent king Vasuki is believed to have taken refuge from Garuda.",
        "visitingHours": "7:00 AM – 6:00 PM",
        "image": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop",
        "latitude": 12.675,
        "longitude": 75.612
      }
    ],
    "activities": [
      "Perform Ashlesha Bali or Sarpa Samskara sevas",
      "Holy dip in sacred Kumaradhara river",
      "Visit the ancient anthills at Adi Subrahmanya",
      "Explore Biladwara cave",
      "Kumara Parvatha base nature walk"
    ],
    "travelTips": [
      "Men must remove their shirts before entering the inner sanctum as per temple custom.",
      "Seva bookings (Ashlesha Bali) must be booked online well in advance via official temple portal."
    ],
    "foodSpecialties": [
      "Temple Mahaprasada",
      "Halasina Kadubu (Steamed Jackfruit dumpling)",
      "Traditional Brahmin Meals",
      "South Indian Filter Coffee"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Dharmasthala Manjunatha Temple",
        "distance": "55 km",
        "description": "Revered Shiva temple and historic Pergade administration."
      },
      {
        "name": "Kumara Parvatha Peak",
        "distance": "13 km trek",
        "description": "Second highest peak in Coorg/DK Western Ghats border."
      },
      {
        "name": "Bisle Ghat Viewpoint",
        "distance": "45 km",
        "description": "Breathtaking cliff overlooking Western Ghats mountain ranges."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Kukke Subrahmanya Temple",
        "Adi Subrahmanya",
        "Kumaradhara River Ghat"
      ],
      "templesSpiritual": [
        "Kukke Subrahmanya Temple",
        "Adi Subrahmanya Temple",
        "Biladwara Cave"
      ],
      "natureBeaches": [
        "Kumaradhara River",
        "Kumara Parvatha Foothills",
        "Matsya Theertha"
      ],
      "historicalPlaces": [
        "Ancient Biladwara Cave",
        "Adi Subrahmanya Anthill"
      ],
      "foodExperiences": [
        "Temple Prasada Bhojana",
        "Local Kadubu & Chutney"
      ],
      "hiddenGems": [
        "Biladwara Forest Cave",
        "Vanadurga Temple"
      ],
      "familyFriendly": [
        "Kumaradhara Snana Ghatta",
        "Temple Car Street"
      ],
      "adventureActivities": [
        "Kumara Parvatha Trek (Pushpagiri)",
        "Rainforest Birding"
      ]
    },
    "taluk": "Kadaba",
    "talukId": "kadaba",
    "districtId": "dakshina-kannada"
  },
  {
    "id": "honnavar",
    "slug": "honnavar",
    "name": "Honnavar",
    "district": "Uttara Kannada",
    "category": "Nature",
    "categories": [
      "Nature",
      "Beaches",
      "Waterfalls",
      "Photography"
    ],
    "clusters": [
      "coastal-karnataka"
    ],
    "tags": "Nature • Beaches • Waterfalls",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
    ],
    "alt": "Scenic sights and landscape of Honnavar, Karnataka",
    "shortDescription": "Serene coastal haven famous for Sharavathi backwater boating, mangrove boardwalks, and Apsarakonda waterfalls.",
    "description": "Located where the Sharavathi River meets the Arabian Sea, Honnavar is an unspoiled coastal jewel in Uttara Kannada. It offers mesmerizing boat rides through lush mangrove forests on Kandla Van boardwalk, golden sunset panoramas at Kasarkod Eco Beach, and hill streams at Apsarakonda.",
    "whyVisit": "Unspoiled mangrove boardwalks, tranquil backwaters, and pristine eco-beaches without tourist crowds.",
    "famousFor": [
      "Mangrove boardwalk (Kandla Van)",
      "Sharavathi backwater boating",
      "Kasarkod Blue Flag Beach",
      "Apsarakonda Falls"
    ],
    "latitude": 14.2798,
    "longitude": 74.4439,
    "bestTimeToVisit": "October to March",
    "recommendedDays": "1 Days",
    "distanceFromBangalore": 460,
    "averageRating": 4.8,
    "reviewCount": 145,
    "featured": false,
    "attractions": [
      {
        "name": "Sharavathi River Backwaters & Mangrove Boardwalk (Kandla Van)",
        "category": "Nature / Eco-Tourism",
        "description": "Scenic wooden boardwalk winding through dense mangrove forest ecosystems alongside quiet backwater boat rides.",
        "visitingHours": "8:30 AM – 6:30 PM",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.2812,
        "longitude": 74.441
      },
      {
        "name": "Kasarkod Eco Beach (Blue Flag Beach)",
        "category": "Nature / Beaches",
        "description": "Pristine, certified Blue Flag eco-beach with golden sands, clean waters, and casuarina groves.",
        "visitingHours": "6:00 AM – 7:00 PM",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.262,
        "longitude": 74.431
      },
      {
        "name": "Apsarakonda Falls & Hilltop Viewpoint",
        "category": "Nature / Waterfalls",
        "description": "Charming freshwater cascade flowing into a natural pond with mythology claiming apsaras (angels) bathed here.",
        "visitingHours": "7:00 AM – 6:00 PM",
        "image": "https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.238,
        "longitude": 74.453
      }
    ],
    "activities": [
      "Stroll the Kandla Van Mangrove Boardwalk",
      "Sharavathi river backwater motorboat cruise",
      "Sunset photography at Kasarkod Blue Flag beach",
      "Swim in the calm waters of Apsarakonda pool",
      "Visit Colonel Hill monument and lighthouse"
    ],
    "travelTips": [
      "Take the 45-minute backwater boat ride during high tide for optimal mangrove canopy views.",
      "Kasarkod beach has excellent changing rooms and eco-facilities."
    ],
    "foodSpecialties": [
      "Honnavar Fish Thali",
      "Banana Halwa",
      "Crab Sukka",
      "Neer Dosa with spicy fish curry"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Murdeshwar Temple & Shiva Statue",
        "distance": "28 km",
        "description": "Massive coastal Shiva idol with 20-storey gopuram."
      },
      {
        "name": "Jog Falls",
        "distance": "60 km",
        "description": "India's renowned plunge waterfalls on the Sharavathi river."
      },
      {
        "name": "Mirjan Fort",
        "distance": "32 km",
        "description": "16th-century laterite pepper-queen fortress."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "Sharavathi Mangrove Boardwalk",
        "Kasarkod Eco Beach",
        "Apsarakonda Falls"
      ],
      "templesSpiritual": [
        "Apsarakonda Hilltop Temple",
        "Ramateertha Temple"
      ],
      "natureBeaches": [
        "Kasarkod Blue Flag Beach",
        "Sharavathi Estuary",
        "Kandla Van Mangroves"
      ],
      "historicalPlaces": [
        "Colonel Hill Pillar",
        "Mirjan Fort (nearby)"
      ],
      "foodExperiences": [
        "Authentic Uttara Kannada Fish Meals",
        "Local Halwa"
      ],
      "hiddenGems": [
        "Mavinkurve River Island",
        "Apsarakonda Cliff Sunset"
      ],
      "familyFriendly": [
        "Mangrove Eco Boardwalk",
        "Kasarkod Children's Park"
      ],
      "adventureActivities": [
        "Backwater Kayaking",
        "River Boating"
      ]
    },
    "taluk": "Honnavar",
    "talukId": "honnavar",
    "districtId": "uttara-kannada"
  },
  {
    "id": "karwar",
    "slug": "karwar",
    "name": "Karwar",
    "district": "Uttara Kannada",
    "category": "Beaches",
    "categories": [
      "Beaches",
      "Nature",
      "Historical",
      "Adventure"
    ],
    "clusters": [
      "coastal-karnataka"
    ],
    "tags": "Beaches • Nature • Historical",
    "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop"
    ],
    "alt": "Scenic sights and landscape of Karwar, Karnataka",
    "shortDescription": "Idyllic coastal frontier city where the Kali River meets the Arabian Sea, inspiring Rabindranath Tagore.",
    "description": "Karwar sits on Karnataka's northern coastline, surrounded by rolling Western Ghats hills and quiet sea bays. It was here that Rabindranath Tagore was inspired to write his first play. Visitors can explore the Warship Museum INS Chapal, take boat cruises on the Kali River estuary, and relax on Devbagh beach.",
    "whyVisit": "Quiet coastal frontier beauty, naval warship museum, Kali river cruises, and pristine secluded beaches.",
    "famousFor": [
      "Tagore Beach",
      "INS Chapal warship museum",
      "Kali River bridge views",
      "Devbagh peninsula",
      "Karwar Seafood"
    ],
    "latitude": 14.8185,
    "longitude": 74.135,
    "bestTimeToVisit": "October to March",
    "recommendedDays": "1 Days",
    "distanceFromBangalore": 520,
    "averageRating": 4.7,
    "reviewCount": 160,
    "featured": false,
    "attractions": [
      {
        "name": "Rabindranath Tagore Beach & INS Chapal Warship Museum",
        "category": "Historical / Culture",
        "description": "Expansive city beach featuring a decommissioned missile warship converted into an informative naval museum.",
        "visitingHours": "9:00 AM – 7:00 PM",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.811,
        "longitude": 74.124
      },
      {
        "name": "Kali River Estuary & Kali Bridge Viewpoint",
        "category": "Nature / Scenic Viewpoint",
        "description": "Breathtaking bridge viewpoint overlooking the wide river mouth where the turquoise river merges with the Arabian Sea.",
        "visitingHours": "Open 24 hours (best sunset)",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.839,
        "longitude": 74.132
      },
      {
        "name": "Devbagh Beach & Kurumgad Island",
        "category": "Adventure / Beaches",
        "description": "Secluded golden sand peninsula surrounded by casuarina groves and dolphin-spotting boat excursions.",
        "visitingHours": "Boat access 8:30 AM – 5:30 PM",
        "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
        "latitude": 14.848,
        "longitude": 74.116
      }
    ],
    "activities": [
      "Tour INS Chapal warship museum",
      "Stroll and watch sunsets at Tagore Beach",
      "Kali river estuary boat safari",
      "Dolphin spotting cruise to Kurumgad Island",
      "Visit Sadashivgad Hill Fort ruins"
    ],
    "travelTips": [
      "Karwar is the gateway to Goa (Goa border is just 15 km away).",
      "Try authentic Karwari fish curry at local eateries near the harbor."
    ],
    "foodSpecialties": [
      "Karwar Fish Curry (Ambat)",
      "Crab Sukka",
      "Tisrya Masala (Clams)",
      "Sol Kadi"
    ],
    "bestNearbyPlaces": [
      {
        "name": "Sadashivgad Hill Fort",
        "distance": "6 km",
        "description": "Historic hilltop fort guarding the Kali river mouth."
      },
      {
        "name": "Gokarna Beaches & Temple",
        "distance": "60 km",
        "description": "Famous sacred temple and scenic beach coves."
      },
      {
        "name": "Anshi National Park",
        "distance": "55 km",
        "description": "Dense tiger and black panther reserve in Western Ghats."
      }
    ],
    "categorizedPlaces": {
      "mustVisit": [
        "INS Chapal Warship Museum",
        "Tagore Beach",
        "Kali River Estuary"
      ],
      "templesSpiritual": [
        "Narasimha Temple Sadashivgad",
        "Dhareshwar Temple (nearby)"
      ],
      "natureBeaches": [
        "Tagore Beach",
        "Devbagh Beach",
        "Binaga Beach"
      ],
      "historicalPlaces": [
        "INS Chapal Museum",
        "Sadashivgad Fort"
      ],
      "foodExperiences": [
        "Ambat Fish Curry",
        "Seafood Beach Shacks"
      ],
      "hiddenGems": [
        "Kurumgad Tortoise-shaped Island",
        "Oyster Rocks Lighthouse"
      ],
      "familyFriendly": [
        "Warship Museum",
        "Tagore Beach Children's Train"
      ],
      "adventureActivities": [
        "Dolphin Cruise",
        "Kali River Water Sports"
      ]
    },
    "taluk": "Karwar",
    "talukId": "karwar",
    "districtId": "uttara-kannada"
  }
];

// Attach universally to window and globalThis
if (typeof window !== "undefined") {
  window.karnatakaDestinations = karnatakaDestinations;
  window.karnatakaClusters = karnatakaClusters;
}
if (typeof globalThis !== "undefined") {
  globalThis.karnatakaDestinations = karnatakaDestinations;
  globalThis.karnatakaClusters = karnatakaClusters;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { karnatakaDestinations, karnatakaClusters };
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TravelDistance  – shared client-side distance utility
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for distance display across:
 *   • Explore page destination cards (destinations.js)
 *   • Recommendations cards (recommendations.js)
 *   • Destination detail page (destination.html)
 *   • Any other component that shows "X km from BLR"
 *
 * Rules:
 *   1. Never use || 200 as a fallback — 0 km is a valid, correct value.
 *   2. When origin and destination resolve to the same normalised key → 0 km.
 *   3. Normalise well-known alias groups before comparing names.
 *   4. For all other destinations the stored distanceFromBangalore is used
 *      (those values are verified road distances from Bengaluru).
 * ─────────────────────────────────────────────────────────────────────────────
 */
const TravelDistance = (function () {

  /**
   * Normalise a city / location name to a canonical lowercase key.
   * Handles common Karnataka city aliases so that "Bangalore", "Bengaluru",
   * "BLR", "Bengaluru (Bangalore)", and "Bengaluru Urban" all resolve to
   * "bengaluru"; "Mysore" and "Mysuru" both resolve to "mysuru"; etc.
   */
  function normalizeCity(name) {
    if (!name || typeof name !== 'string') return '';
    const s = name.toLowerCase()
      .replace(/\(.*?\)/g, '')          // strip parenthetical aliases
      .replace(/[,\-_.]/g, ' ')
      .replace(/\b(district|taluk|taluka|city|town|urban|rural|karnataka|blr)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Alias groups – order matters (more-specific first)
    if (/bangalor|bengaluru/.test(s)) return 'bengaluru';
    if (/mangalor|mangaluru/.test(s)) return 'mangaluru';
    if (/mysore|mysuru/.test(s))      return 'mysuru';
    if (/udupi/.test(s))              return 'udupi';
    if (/dharmasthala/.test(s))       return 'dharmasthala';
    if (/kukke|subrahmanya/.test(s))  return 'kukke';
    if (/murudeshwar|murdeshwar/.test(s)) return 'murudeshwar';
    if (/honnavar/.test(s))           return 'honnavar';
    if (/gokarna/.test(s))            return 'gokarna';
    if (/hampi|hosapete/.test(s))     return 'hosapete';
    if (/badami/.test(s))             return 'badami';
    if (/pattadakal/.test(s))         return 'pattadakal';
    if (/srirangapatna|srirangapatnam/.test(s)) return 'srirangapatna';
    if (/belur/.test(s))              return 'belur';
    if (/halebidu|halebid/.test(s))   return 'halebidu';
    if (/chikmagalur|chikkamagaluru/.test(s)) return 'chikkamagaluru';
    if (/coorg|kodagu|madikeri/.test(s)) return 'madikeri';
    if (/belagavi|belgaum/.test(s))   return 'belagavi';
    if (/hubballi|hubli/.test(s))     return 'hubballi';
    if (/dharwad/.test(s))            return 'dharwad';
    if (/shivamogga|shimoga/.test(s)) return 'shivamogga';
    if (/hassan/.test(s))             return 'hassan';
    if (/karwar/.test(s))             return 'karwar';
    if (/dandeli/.test(s))            return 'dandeli';
    if (/sringeri/.test(s))           return 'sringeri';
    if (/sakleshpur/.test(s))         return 'sakleshpur';
    if (/kudremukh/.test(s))          return 'kudremukh';
    if (/nandi/.test(s))              return 'nandihills';
    if (/bandipur/.test(s))           return 'bandipur';
    if (/nagarhole/.test(s))          return 'nagarhole';
    if (/jog.?falls|sagara/.test(s))  return 'sagara';
    if (/kateel/.test(s))             return 'kateel';
    return s;
  }

  /**
   * Returns true when origin and destination are the same location
   * (handles all alias combinations, e.g. "Bangalore" === "Bengaluru").
   */
  function isSameLocation(originName, destName) {
    const o = normalizeCity(originName);
    const d = normalizeCity(destName);
    return o !== '' && d !== '' && o === d;
  }

  /**
   * Returns the display distance (in km, as a number) from the reference
   * origin to the destination.
   *
   * @param {object} dest        - A destination object from karnatakaDestinations
   * @param {string} [originName] - Origin city name; defaults to "Bengaluru"
   * @returns {number}           - Distance in km (0 for same-location)
   */
  function getDisplayDistance(dest, originName) {
    const origin = originName || 'Bengaluru';

    // ── Same-location guard ──────────────────────────────────────────────
    // Check against the destination's name and its known slug/aliases.
    const destName = dest.name || dest.slug || '';
    if (isSameLocation(origin, destName)) return 0;

    // Also check against taluk / district labels stored on the dest object
    if (dest.taluk && isSameLocation(origin, dest.taluk)) return 0;
    if (dest.district && isSameLocation(origin, dest.district)) return 0;

    // ── Use stored distanceFromBangalore as the authoritative road distance
    // Use Number.isFinite() — NOT truthiness — so that 0 is preserved.
    const stored = dest.distanceFromBangalore;
    if (Number.isFinite(stored)) return stored;

    // Ultimate fallback: calculate a straight-line estimate (never returns 200)
    if (Number.isFinite(dest.latitude) && Number.isFinite(dest.longitude)) {
      // Bengaluru coords: 12.9716°N 77.5946°E
      const R = 6371;
      const lat1 = 12.9716 * Math.PI / 180;
      const lat2 = dest.latitude * Math.PI / 180;
      const dLat = (dest.latitude - 12.9716) * Math.PI / 180;
      const dLon = (dest.longitude - 77.5946) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      const straightLine = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
      // Road distance is typically 1.3× straight-line for Karnataka highways
      return Math.round(straightLine * 1.3);
    }

    return 0; // last resort — never return 200
  }

  return { normalizeCity, isSameLocation, getDisplayDistance };
})();

// Expose globally for use in destinations.js, recommendations.js, destination.html
if (typeof window !== 'undefined') window.TravelDistance = TravelDistance;
if (typeof globalThis !== 'undefined') globalThis.TravelDistance = TravelDistance;
if (typeof module !== 'undefined' && module.exports) {
  module.exports.TravelDistance = TravelDistance;
}

