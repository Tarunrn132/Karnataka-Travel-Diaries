import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const kbDestinations = [
  {
    slug: "coorg",
    name: "Coorg (Madikeri)",
    district: "Kodagu",
    categories: ["Hill Stations", "Nature", "Coffee", "Waterfalls", "Photography"],
    recommendedDays: 3,
    distanceFromBangalore: 265,
    latitude: 12.4244,
    longitude: 75.7382,
    image: "images/destinations/coorg.jpg",
    bestSeason: "October to March (Post-monsoon & Winter)",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "The Scotland of India known for misty hills, lush coffee plantations, spice estates and gushing waterfalls.",
    description: "Nestled amidst the Western Ghats, Coorg (Kodagu) is an idyllic hill station renowned for its sprawling coffee estates, aromatic spice plantations, and misty green valleys. Rich in Kodava culture, warrior traditions, and lip-smacking local cuisine like Pandi Curry and Akki Roti, Coorg offers breathtaking viewpoints, serene river retreats, and thrilling trekking trails.",
    attractions: [
      { name: "Abbey Falls", description: "Spectacular cascading waterfall tucked inside dense spice and coffee estates.", latitude: 12.4542, longitude: 75.7177 },
      { name: "Raja's Seat", description: "Historic viewpoint with manicured gardens offering panoramic sunset views across the Western Ghats.", latitude: 12.4194, longitude: 75.7351 },
      { name: "Dubare Elephant Camp", description: "Riverfront camp on the banks of Cauvery where visitors can bathe and interact with elephants.", latitude: 12.3683, longitude: 75.9036 },
      { name: "Talakaveri & Brahmagiri", description: "The revered origin of the holy Cauvery River set high in the Brahmagiri Hills.", latitude: 12.3853, longitude: 75.4925 },
      { name: "Namdroling Monastery (Golden Temple)", description: "Vibrant Tibetan Buddhist monastery in Bylakuppe with 40-foot gilded statues.", latitude: 12.4500, longitude: 75.9600 }
    ],
    activities: ["Coffee Plantation Walk", "River Rafting in Barapole", "Elephant Bathing at Dubare", "Sunset View at Raja's Seat", "Trek to Tadiandamol Peak", "Tibetan Monastery Tour"],
    travelTips: [
      "Book plantation homestays early during monsoon and winter weekends.",
      "Carry light woolens for chilly evenings and rain protection during June-September.",
      "Drive via Mysuru-Hunsur-Kushalnagar for the smoothest road condition."
    ],
    foodSpecialties: ["Kodava Pandi Curry", "Akki Roti with Enne Kathirikai", "Kadambuttu (Steamed rice dumplings)", "Coorg Filter Coffee", "Wild Bamboo Shoot Curry (Baimbale)"],
    culturalHighlights: ["Kodava martial traditions", "Huttari harvest festival", "Kailpodh festival of weapons", "Traditional Kodava Kupya and Chele attire"],
    nearby: [
      { slug: "mysore", distanceKm: 120, name: "Mysore" },
      { slug: "sakleshpur", distanceKm: 110, name: "Sakleshpur" },
      { slug: "nagarhole", distanceKm: 75, name: "Nagarhole National Park" },
      { slug: "chikmagalur", distanceKm: 140, name: "Chikmagalur" }
    ],
    estimatedDailyBudget: { budget: 1800, moderate: 3500, luxury: 7500 }
  },
  {
    slug: "mysore",
    name: "Mysore (Mysuru)",
    district: "Mysuru",
    categories: ["Heritage", "Cities", "Spiritual", "Culture", "Food & Culture"],
    recommendedDays: 2,
    distanceFromBangalore: 145,
    latitude: 12.2958,
    longitude: 76.6394,
    image: "images/destinations/mysore.jpg",
    bestSeason: "September to March (Ideal during Dasara in October)",
    bestMonths: ["September", "October", "November", "December", "January", "February", "March"],
    shortDescription: "The City of Palaces, royal heritage, fragrant sandalwood, rich silk sarees, and majestic Dasara festivities.",
    description: "Mysuru is the cultural heart of Karnataka, celebrated worldwide for its royal grandeur and architectural wonder, the Mysore Palace. Dotted with heritage monuments, the bustling Devaraja market, Chamundi Hill temple, and legendary eateries serving authentic Mysore Masala Dosa and Mysore Pak.",
    attractions: [
      { name: "Mysore Palace (Amba Vilas)", description: "Opulent Indo-Saracenic royal residence illuminated with nearly 100,000 golden bulbs on weekends.", latitude: 12.3052, longitude: 76.6552 },
      { name: "Chamundeshwari Temple", description: "Ancient hilltop shrine overlooking Mysuru city with a legendary monolithic Nandi statue.", latitude: 12.2748, longitude: 76.6717 },
      { name: "Brindavan Gardens", description: "Terraced botanical gardens with illuminated musical dancing fountains at the KRS dam.", latitude: 12.4243, longitude: 76.5732 },
      { name: "Devaraja Market", description: "Century-old heritage market vibrant with flowers, sandalwood, and spices.", latitude: 12.3120, longitude: 76.6500 },
      { name: "St. Philomena's Cathedral", description: "Neo-Gothic cathedral with towering 175-foot spires modeled after Cologne Cathedral.", latitude: 12.3210, longitude: 76.6580 }
    ],
    activities: ["Mysore Palace Illumination Tour", "Climbing 1000 Steps of Chamundi Hill", "Devaraja Spice and Perfume Walk", "Mysore Pak Tasting at Guru Sweets", "Visiting Brindavan Musical Fountain"],
    travelTips: [
      "Bengaluru-Mysuru Expressway reduces travel time to under 90 minutes.",
      "Mysore Palace illumination occurs on Sundays and public holidays from 7:00 PM to 7:45 PM.",
      "Footwear must be deposited outside Mysore Palace and Chamundi Temple."
    ],
    foodSpecialties: ["Authentic Mysore Masala Dosa at Mylari", "Ghee Mysore Pak", "Bisi Bele Bath", "Maddur Vada", "Chiroti with Almond Milk"],
    culturalHighlights: ["10-day world-famous Mysuru Dasara Jamboo Savari", "Mysore Silk Weaving and GI Tagged Mysore Sandal Soap", "Ganjifa playing cards art"],
    nearby: [
      { slug: "srirangapatna", distanceKm: 15, name: "Srirangapatna" },
      { slug: "bandipur", distanceKm: 75, name: "Bandipur National Park" },
      { slug: "coorg", distanceKm: 120, name: "Coorg" },
      { slug: "nagarhole", distanceKm: 85, name: "Nagarhole National Park" }
    ],
    estimatedDailyBudget: { budget: 1500, moderate: 3000, luxury: 6500 }
  },
  {
    slug: "chikmagalur",
    name: "Chikmagalur",
    district: "Chikkamagaluru",
    categories: ["Hill Stations", "Nature", "Coffee", "Adventure", "Photography"],
    recommendedDays: 3,
    distanceFromBangalore: 245,
    latitude: 13.3153,
    longitude: 75.7754,
    image: "images/destinations/chikmagalur.jpg",
    bestSeason: "September to May (Crisp winters and lush post-monsoons)",
    bestMonths: ["September", "October", "November", "December", "January", "February", "March", "April"],
    shortDescription: "The birthplace of Indian coffee, enveloped in emerald hills, misty peaks, and sprawling plantations.",
    description: "Chikmagalur is a paradise for nature lovers and trekkers. Situated in the foothills of the Mullayanagiri range, it was here that Baba Budan first planted coffee seeds smuggled from Yemen. The region features cloud-kissed peaks, roaring waterfalls like Hebbe and Jhari, and cozy plantation homestays.",
    attractions: [
      { name: "Mullayanagiri Peak", description: "The highest peak in Karnataka (1,930 m) offering sweeping views above the clouds.", latitude: 13.3912, longitude: 75.7214 },
      { name: "Baba Budangiri", description: "Historic mountain range sacred to both Hindus and Sufis with mystical caves.", latitude: 13.4357, longitude: 75.7681 },
      { name: "Hebbe Falls", description: "Stunning twin-stream waterfall deep inside coffee estates reached by exciting 4x4 jeep safaris.", latitude: 13.5412, longitude: 75.7891 },
      { name: "Jhari (Buttermilk) Falls", description: "Lush cascade surrounded by tea gardens and wild forest glades.", latitude: 13.4020, longitude: 75.7350 },
      { name: "Z Point (Kemmangundi)", description: "Thrilling cliff edge vantage point overlooking deep Western Ghat gorges.", latitude: 13.5500, longitude: 75.7600 }
    ],
    activities: ["Sunrise Trek to Mullayanagiri", "Jeep Safari to Hebbe Falls", "Plantation Tour & Coffee Brewing Masterclass", "Campfire Nights in Malnad Homestays", "Birdwatching in Bhadra Valley"],
    travelTips: [
      "Start early morning (before 6:30 AM) to summit Mullayanagiri before fog and tourist crowds arrive.",
      "4x4 jeeps are mandatory for Hebbe and Jhari Falls; negotiate prices at the forest checkpoint.",
      "Carry motion sickness medication if prone to winding ghat roads."
    ],
    foodSpecialties: ["Malnad Kadubu with Chutney", "Halasina Hannu (Jackfruit) Curry", "Pathrode (Steamed colocasia rolls)", "Filter Coffee from fresh Arabica roasts", "Bamboo Shoot Curry"],
    culturalHighlights: ["Legend of Baba Budan bringing coffee seeds from Mocha", "Malnad estate culture and traditional tiled Areca homes"],
    nearby: [
      { slug: "belur-halebidu", distanceKm: 40, name: "Belur & Halebidu" },
      { slug: "kudremukh", distanceKm: 90, name: "Kudremukh" },
      { slug: "sringeri", distanceKm: 85, name: "Sringeri" },
      { slug: "sakleshpur", distanceKm: 60, name: "Sakleshpur" }
    ],
    estimatedDailyBudget: { budget: 1700, moderate: 3400, luxury: 7200 }
  },
  {
    slug: "hampi",
    name: "Hampi",
    district: "Vijayanagara",
    categories: ["Heritage", "Spiritual", "Photography", "Culture"],
    recommendedDays: 3,
    distanceFromBangalore: 340,
    latitude: 15.3350,
    longitude: 76.4600,
    image: "images/destinations/hampi.jpg",
    bestSeason: "October to February (Pleasant winter sunshine)",
    bestMonths: ["October", "November", "December", "January", "February"],
    shortDescription: "UNESCO World Heritage site featuring colossal boulder-strewn ruins of the glorious Vijayanagara Empire.",
    description: "Hampi transports travelers back in time to the 14th century capital of the Vijayanagara Empire. Set along the banks of the Tungabhadra River, it is an open-air museum filled with intricately carved stone temples, royal pavilions, monolithic statues, and surreal rust-colored boulder hills.",
    attractions: [
      { name: "Virupaksha Temple", description: "Living ancient Shiva temple standing tall since the 7th century with towering gopuram.", latitude: 15.3352, longitude: 76.4603 },
      { name: "Vijaya Vittala Temple & Stone Chariot", description: "Masterpiece of Dravidian architecture featuring the iconic stone chariot and musical pillars.", latitude: 15.3438, longitude: 76.4764 },
      { name: "Matanga Hill", description: "The ultimate sunrise and sunset vantage point overlooking the endless sea of ruins.", latitude: 15.3331, longitude: 76.4665 },
      { name: "Lotus Mahal & Elephant Stables", description: "Exquisite Indo-Islamic zenana pavilion and grand domed stables for royal elephants.", latitude: 15.3200, longitude: 76.4700 },
      { name: "Coracle Ride on Tungabhadra", description: "Traditional round wicker boat ride passing ancient boulder ghats and hidden river shrines.", latitude: 15.3370, longitude: 76.4620 }
    ],
    activities: ["Sunrise at Matanga Hill", "Renting Bicycles to Explore Sacred Center", "Coracle Boat Ride across Tungabhadra River", "Acoustic exploration of Vittala Musical Pillars", "Bouldering and Rock Climbing on Hippie Island"],
    travelTips: [
      "Rent a bicycle or moped to traverse the 40 sq km heritage zone at your own pace.",
      "Wear comfortable walking shoes with grip for climbing granite boulders.",
      "Summers (March to June) can exceed 40°C; carry ample water, sunscreen, and a broad hat."
    ],
    foodSpecialties: ["North Karnataka Jolada Rotti Oota", "Ennegayi (Stuffed spicy brinjal)", "Shenga Chutney Pudi", "Mango Lassi & Woodfired Pizzas in Sanapur cafes"],
    culturalHighlights: ["Vijayanagara royal architecture and irrigation aqueducts", "Annual Hampi Utsav cultural dance and music festival in November"],
    nearby: [
      { slug: "badami", distanceKm: 135, name: "Badami" },
      { slug: "pattadakal", distanceKm: 130, name: "Pattadakal" }
    ],
    estimatedDailyBudget: { budget: 1400, moderate: 2800, luxury: 6000 }
  },
  {
    slug: "gokarna",
    name: "Gokarna",
    district: "Uttara Kannada",
    categories: ["Beaches", "Spiritual", "Adventure", "Nature", "Photography"],
    recommendedDays: 3,
    distanceFromBangalore: 485,
    latitude: 14.5479,
    longitude: 74.3188,
    image: "images/destinations/gokarna.jpg",
    bestSeason: "October to March (Gentle sea breeze and golden sunsets)",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "Laid-back coastal gem where pristine golden beaches meet sacred temple pilgrimages.",
    description: "Gokarna is where spirituality gracefully meets bohemian coastal charm. Famed for Om Beach (shaped like the sacred Hindu symbol), Kudle Beach, Half Moon Beach, and Paradise Beach, visitors can hike cliff trails between beaches, savor beach shacks, and visit the revered Mahabaleshwar Temple.",
    attractions: [
      { name: "Om Beach", description: "Naturally contoured in the shape of Om, ideal for water sports and evening sunsets.", latitude: 14.5186, longitude: 74.3168 },
      { name: "Kudle Beach", description: "Wide crescent beach dotted with relaxing cafes, yoga centers, and acoustic music circles.", latitude: 14.5294, longitude: 74.3142 },
      { name: "Mahabaleshwar Temple", description: "Sacred 4th-century temple housing the Atmalinga of Lord Shiva.", latitude: 14.5422, longitude: 74.3183 },
      { name: "Paradise Beach & Half Moon Beach", description: "Secluded pristine coves accessible primarily via coastal trekking trails or boat.", latitude: 14.5100, longitude: 74.3250 },
      { name: "Mirjan Fort", description: "Historic 16th-century laterite pepper fort hidden under emerald moss 20 km away.", latitude: 14.4920, longitude: 74.4200 }
    ],
    activities: ["Five-Beach Cliff Trek (Kudle to Paradise)", "Sunset Kayaking and Banana Boat Rides at Om Beach", "Morning Yoga Sessions on Kudle Sands", "Visiting the Sacred Atmalinga at Mahabaleshwar", "Bioluminescence spotting during dark winter new moons"],
    travelTips: [
      "Carry shoes with sturdy tread if attempting the cliff hike between Kudle and Paradise Beach.",
      "Dress conservatively with shoulders covered when entering Mahabaleshwar Temple.",
      "Stay in beach huts or cliffside guest houses for unobstructed sea views."
    ],
    foodSpecialties: ["Karavali Prawn & Fish Curry", "Neer Dosa with spicy fish masala", "Nutella Banana Pancakes in beach cafes", "Fresh Coconut Water & Kokum Sharbat"],
    culturalHighlights: ["Mahashivaratri chariot procession", "Atmalinga legend linked to Ravana", "Traditional Sanskrit Vedic Pathashalas"],
    nearby: [
      { slug: "murudeshwar", distanceKm: 75, name: "Murudeshwar" },
      { slug: "udupi", distanceKm: 175, name: "Udupi" },
      { slug: "dandeli", distanceKm: 155, name: "Dandeli" }
    ],
    estimatedDailyBudget: { budget: 1500, moderate: 3200, luxury: 6800 }
  },
  {
    slug: "udupi",
    name: "Udupi",
    district: "Udupi",
    categories: ["Beaches", "Spiritual", "Food & Culture", "Heritage"],
    recommendedDays: 2,
    distanceFromBangalore: 400,
    latitude: 13.3409,
    longitude: 74.7421,
    image: "images/destinations/udupi.jpg",
    bestSeason: "October to March (Sunny winter coastline)",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "Spiritual sanctuary celebrated for Sri Krishna Temple, delicious cuisine, and pristine Malpe Beach.",
    description: "Udupi is universally famous for its wholesome vegetarian culinary heritage, the historic Sri Krishna Matha founded by Madhvacharya, and tranquil Arabian Sea coastlines. The nearby St. Mary's Island boasts rare columnar basaltic rock formations carved by nature millions of years ago.",
    attractions: [
      { name: "Sri Krishna Temple & Matha", description: "Revered temple where devotees view Lord Krishna through the ornate Kanakana Kindi window.", latitude: 13.3409, longitude: 74.7525 },
      { name: "St. Mary's Island", description: "Geological wonder with hexagonal volcanic basalt rock pillars rising from azure waters.", latitude: 13.3775, longitude: 74.6736 },
      { name: "Malpe Beach & Sea Walk", description: "Lively beach with water sports and a scenic walkway extending into the Arabian Sea.", latitude: 13.3512, longitude: 74.6989 },
      { name: "Kapu (Kaup) Beach & Lighthouse", description: "Golden beach with a century-old black-and-white lighthouse open for panoramic ascents.", latitude: 13.2250, longitude: 74.7380 }
    ],
    activities: ["Ferry ride to St. Mary's Columnar Rocks", "Viewing Krishna through Kanakana Kindi", "Sunset Walk on Malpe Sea Walk Bridge", "Climbing Kapu Lighthouse", "Surfing Lessons at Kodi Bengre Delta"],
    travelTips: [
      "Boats to St. Mary's Island operate from Malpe Beach between October and May, weather permitting.",
      "The temple Annadanam (free community lunch) is an extraordinary cultural dining experience.",
      "Visit Kapu lighthouse between 4:00 PM and 6:00 PM when the tower is open to tourists."
    ],
    foodSpecialties: ["Udupi Masala Dosa", "Goli Baje (Mangalore Bajji)", "Pineapple Menaskai", "Pelakai Gatti (Jackfruit dumplings)", "Authentic Filter Coffee"],
    culturalHighlights: ["Dvaita Vedanta philosophy established by Sri Madhvacharya", "Paryaya festival celebrated every two years", "Yakshagana coastal night folk dance"],
    nearby: [
      { slug: "mangalore", distanceKm: 55, name: "Mangalore" },
      { slug: "murudeshwar", distanceKm: 100, name: "Murudeshwar" },
      { slug: "sringeri", distanceKm: 85, name: "Sringeri" }
    ],
    estimatedDailyBudget: { budget: 1400, moderate: 2800, luxury: 5800 }
  },
  {
    slug: "murudeshwar",
    name: "Murudeshwar",
    district: "Uttara Kannada",
    categories: ["Religious", "Beaches", "Adventure", "Photography"],
    recommendedDays: 2,
    distanceFromBangalore: 489,
    latitude: 14.0940,
    longitude: 74.4899,
    image: "images/destinations/murudeshwar.jpg",
    bestSeason: "October to May (Calm waters for scuba at Netrani)",
    bestMonths: ["October", "November", "December", "January", "February", "March", "April"],
    shortDescription: "Home to the world's second-tallest Shiva statue surrounded on three sides by the Arabian Sea.",
    description: "Murudeshwar is an awe-inspiring seaside town dominated by the colossal 123-foot statue of Lord Shiva and the towering 20-storey Raja Gopuram. With lift access inside the gopuram offering panoramic ocean views and boat rides to Netrani Island for scuba diving.",
    attractions: [
      { name: "Shiva Statue & Raja Gopuram", description: "Mammoth 123-ft coastal Shiva idol alongside a 249-foot modern temple tower with lift observatory.", latitude: 14.0940, longitude: 74.4899 },
      { name: "Netrani Island (Scuba Diving)", description: "Heart-shaped coral reef island famous for scuba diving, manta rays, and clear waters.", latitude: 14.0197, longitude: 74.3275 },
      { name: "Murudeshwar Beach", description: "Curved sandy beach offering jet ski rides, boat rides, and seaside temple views.", latitude: 14.0970, longitude: 74.4880 }
    ],
    activities: ["Raja Gopuram 18th-Floor Elevator View", "PADI Scuba Diving at Netrani Island", "Speedboat rides around the statue cliff", "Evening temple lights photography", "Fresh seafood dining along the promenade"],
    travelTips: [
      "Take the lift to the 18th floor of Raja Gopuram for stunning aerial views of the Shiva statue against the sea.",
      "Scuba diving trips to Netrani must be booked with licensed operators a day in advance.",
      "The temple sanctum gets crowded between 11 AM and 1 PM; morning visits are calmer."
    ],
    foodSpecialties: ["Coastal Fish Thali", "Kane (Ladyfish) Rava Fry", "Neer Dosa with spicy prawn ghee roast", "Kokum juice"],
    culturalHighlights: ["Pranalinga legend connecting Gokarna and Murudeshwar", "Carved stone panels depicting the Ramayana below the statue hill"],
    nearby: [
      { slug: "gokarna", distanceKm: 75, name: "Gokarna" },
      { slug: "jog-falls", distanceKm: 90, name: "Jog Falls" },
      { slug: "udupi", distanceKm: 100, name: "Udupi" }
    ],
    estimatedDailyBudget: { budget: 1500, moderate: 3100, luxury: 6200 }
  },
  {
    slug: "bandipur",
    name: "Bandipur National Park",
    district: "Chamarajanagar",
    categories: ["Wildlife", "Nature", "Photography", "Adventure"],
    recommendedDays: 2,
    distanceFromBangalore: 220,
    latitude: 11.6664,
    longitude: 76.6291,
    image: "images/destinations/bandipur.jpg",
    bestSeason: "October to May (Dry winter & spring optimal for tiger sightings at waterholes)",
    bestMonths: ["October", "November", "December", "January", "February", "March", "April", "May"],
    shortDescription: "Premier tiger reserve in the Nilgiri Biosphere featuring tigers, leopards, and wild elephant herds.",
    description: "Once the private hunting reserve of the Maharajas of Mysore, Bandipur is now one of India's best-managed tiger reserves and part of the UNESCO Nilgiri Biosphere Reserve. Spanning lush deciduous forests and teak woodlands, it shelters tigers, Indian leopards, dholes, and Asian elephants.",
    attractions: [
      { name: "Jungle Wildlife Safari", description: "Early morning and dusk jeep safaris into core tiger territories led by certified naturalists.", latitude: 11.6664, longitude: 76.6291 },
      { name: "Himavad Gopalaswamy Betta", description: "Highest peak in the park with a misty hilltop temple frequented by wild elephants.", latitude: 11.7226, longitude: 76.5925 }
    ],
    activities: ["Morning Open-Top Gypsy Safari", "Dusk Forest Bus Safari", "Birdwatching on nature trails around jungle lodges", "Visiting Gopalaswamy Betta Temple"],
    travelTips: [
      "Forest department safaris book up weeks in advance; book tickets online on the official Karnataka forest portal.",
      "The highway through Bandipur is closed to vehicular traffic between 9:00 PM and 6:00 AM to safeguard wildlife.",
      "Wear earthy colors (khaki, olive green, brown) to avoid startling animals during safari."
    ],
    foodSpecialties: ["Traditional Karnataka buffet in eco-resorts", "Ragi Mudde with Bassaru", "Freshly brewed South Indian filter coffee"],
    culturalHighlights: ["Nilgiri Biosphere tribal heritage (Jenu Kuruba & Soliga tribes)", "Preservation history under Project Tiger since 1973"],
    nearby: [
      { slug: "mysore", distanceKm: 75, name: "Mysore" },
      { slug: "nagarhole", distanceKm: 70, name: "Nagarhole National Park" }
    ],
    estimatedDailyBudget: { budget: 2200, moderate: 4500, luxury: 9500 }
  },
  {
    slug: "nagarhole",
    name: "Nagarhole National Park",
    district: "Kodagu & Mysuru",
    categories: ["Wildlife", "Nature", "Photography"],
    recommendedDays: 2,
    distanceFromBangalore: 220,
    latitude: 12.0314,
    longitude: 76.1207,
    image: "images/destinations/nagarhole.jpg",
    bestSeason: "October to May (Kabini riverbanks attract large herds of elephants)",
    bestMonths: ["October", "November", "December", "January", "February", "March", "April", "May"],
    shortDescription: "Dense Kabini river forests famed for the highest density of Asiatic elephants, leopards, and black panthers.",
    description: "Also known as Rajiv Gandhi National Park, Nagarhole is framed by the serene Kabini River. It has gained international acclaim for frequent sightings of elusive black panthers, majestic tigers, and immense herds of wild elephants congregating on the riverbanks.",
    attractions: [
      { name: "Kabini River Boat Safari", description: "Scenic boat cruise observing marsh crocodiles, otters, and elephants swimming across the river.", latitude: 11.9333, longitude: 76.2667 },
      { name: "Nagarhole Jungle Jeep Safari", description: "Deep forest drive through towering teak and rosewood canopies.", latitude: 12.0314, longitude: 76.1207 }
    ],
    activities: ["Kabini Motorboat Wildlife Safari", "4x4 Open Jeep Tracking Drives", "Stargazing at jungle riverfront resorts", "Photography of wild elephant congregations"],
    travelTips: [
      "Kabini boat safari offers unmatched opportunities for photographing water birds, crocodiles, and swimming elephant herds.",
      "Book accommodations at forest department lodges or certified jungle eco-resorts for guaranteed safari entry slots."
    ],
    foodSpecialties: ["Warm Kodava and Mysuru regional meals", "Herbal infusions and fresh local fruits"],
    culturalHighlights: ["Sanctuary protection of Asian elephant migratory corridors across the Western Ghats"],
    nearby: [
      { slug: "coorg", distanceKm: 75, name: "Coorg" },
      { slug: "bandipur", distanceKm: 70, name: "Bandipur National Park" },
      { slug: "mysore", distanceKm: 85, name: "Mysore" }
    ],
    estimatedDailyBudget: { budget: 2400, moderate: 5000, luxury: 11000 }
  },
  {
    slug: "badami",
    name: "Badami",
    district: "Bagalkot",
    categories: ["Heritage", "Photography", "Spiritual", "Culture"],
    recommendedDays: 2,
    distanceFromBangalore: 450,
    latitude: 15.9187,
    longitude: 75.6766,
    image: "images/destinations/badami.jpg",
    bestSeason: "October to March (Pleasant weather for rock exploration)",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "Dramatic red sandstone rock-cut cave temples of the ancient Chalukyan kingdom around Agastya Lake.",
    description: "Badami, formerly known as Vatapi, was the regal capital of the Badami Chalukyas from 540 to 757 AD. It is celebrated for its four dramatic rock-cut cave temples chiseled into rugged red sandstone cliffs, the serene Agastya Lake, and the picturesque Bhutanatha temple complex.",
    attractions: [
      { name: "Badami Cave Temples", description: "Four intricate rock-hewn caves dedicated to Shiva, Vishnu, and Jain Tirthankaras featuring 18-armed Nataraja.", latitude: 15.9172, longitude: 75.6841 },
      { name: "Bhutanatha Temple & Agastya Lake", description: "Picturesque 7th-century sandstone temple projecting into the calm emerald waters of Agastya lake.", latitude: 15.9208, longitude: 75.6888 },
      { name: "Badami North Fort", description: "Cliff fort with 1,500-year-old granaries, watchtowers, and panoramic views of the red canyon.", latitude: 15.9250, longitude: 75.6860 }
    ],
    activities: ["Cave Temple Architecture Tour", "Sunset by Bhutanatha Temple on Agastya Lake", "Rock Climbing on Red Sandstone Cliffs", "Trek to North Fort Cannon Viewpoint"],
    travelTips: [
      "Combine Badami, Pattadakal, and Aihole into a unified 2-day Chalukyan architectural tour.",
      "The best photography light on the red sandstone caves occurs during late afternoon golden hour."
    ],
    foodSpecialties: ["North Karnataka Jowar (Jolada) Rotti Oota", "Shenga Holige (Sweet peanut flatbread)", "Mirchi Bajji with Mandakki Upkari"],
    culturalHighlights: ["Early Chalukya architecture (Cradle of Indian temple architecture)", "Sanskrit inscriptions of Pulakeshin II"],
    nearby: [
      { slug: "pattadakal", distanceKm: 22, name: "Pattadakal" },
      { slug: "hampi", distanceKm: 135, name: "Hampi" }
    ],
    estimatedDailyBudget: { budget: 1300, moderate: 2600, luxury: 5500 }
  },
  {
    slug: "pattadakal",
    name: "Pattadakal",
    district: "Bagalkot",
    categories: ["Heritage", "Photography", "Culture"],
    recommendedDays: 1,
    distanceFromBangalore: 445,
    latitude: 15.9490,
    longitude: 75.8160,
    image: "images/destinations/pattadakal.jpg",
    bestSeason: "October to March",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "UNESCO World Heritage site demonstrating the pinnacle of early South Indian temple architecture.",
    description: "Pattadakal on the banks of Malaprabha River served as the ceremonial site where Chalukya kings were crowned. It showcases a harmonious blend of North Indian (Nagara) and South Indian (Dravidian) architectural styles across ten 7th and 8th-century stone masterpieces.",
    attractions: [
      { name: "Virupaksha Temple (Pattadakal)", description: "Built by Queen Lokamahadevi in 740 AD to commemorate her husband's victory over the Pallavas.", latitude: 15.9490, longitude: 75.8160 },
      { name: "Mallikarjuna & Sangameshwara Temples", description: "Sister stone shrines decorated with elaborate friezes from the Ramayana, Mahabharata, and Panchatantra.", latitude: 15.9495, longitude: 75.8165 }
    ],
    activities: ["UNESCO Heritage Temple Walk", "Studying Nagara vs Dravidian Vimanas side-by-side", "Exploring stone relief panels of Indian epics"],
    travelTips: [
      "Pattadakal is only 22 km from Badami; hire an auto-rickshaw or taxi to cover Badami, Pattadakal, and Aihole together.",
      "Hire an ASI-certified guide at the entrance gate for detailed storytelling of 8th-century carvings."
    ],
    foodSpecialties: ["Local North Karnataka Jolada Rotti Meals", "Spicy Ranjaka (red chilli chutney)"],
    culturalHighlights: ["Chalukya coronation ground (Pattada-Kisuvolal)", "Fusion of North Indian and South Indian temple design"],
    nearby: [
      { slug: "badami", distanceKm: 22, name: "Badami" },
      { slug: "hampi", distanceKm: 130, name: "Hampi" }
    ],
    estimatedDailyBudget: { budget: 1200, moderate: 2400, luxury: 5000 }
  },
  {
    slug: "belur-halebidu",
    name: "Belur & Halebidu",
    district: "Hassan",
    categories: ["Heritage", "Spiritual", "Photography", "Culture"],
    recommendedDays: 2,
    distanceFromBangalore: 220,
    latitude: 13.1623,
    longitude: 75.8569,
    image: "images/destinations/belur.jpg",
    bestSeason: "October to March (Cool, sunny days)",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "Jewels of Hoysala craftsmanship showcasing star-shaped temple plinths and soapstone relief filigree.",
    description: "The twin temple towns of Belur and Halebidu represent the absolute zenith of Hoysala architecture. The Chennakeshava Temple at Belur and Hoysaleshwara Temple at Halebidu are chiseled from chloritic schist with intricate depictions of dancers, animals, and mythological epics.",
    attractions: [
      { name: "Chennakeshava Temple Belur", description: "Magnificent star-shaped 12th-century temple that took 103 years to complete, celebrated for its 42 bracket figures (Madanikas).", latitude: 13.1623, longitude: 75.8569 },
      { name: "Hoysaleshwara Temple Halebidu", description: "Twin-shrine monument famous for its endless horizontal friezes of battle scenes, makaras, and elephants.", latitude: 13.2139, longitude: 75.9939 }
    ],
    activities: ["Admiring the Madanika bracket figures in Belur", "Inspecting the monolithic Nandi statues at Halebidu", "Exploring Hoysala craftsmanship museum"],
    travelTips: [
      "Carry a flashlight or use your phone torch to inspect the ceilings inside Chennakeshava Temple.",
      "Belur and Halebidu are only 16 km apart; both can be thoroughly experienced in a single full day."
    ],
    foodSpecialties: ["Hassan Akki Roti", "Coconut-based vegetable curries", "Filter Coffee"],
    culturalHighlights: ["UNESCO World Heritage nomination for Sacred Ensembles of the Hoysalas", "Signature carvings of master sculptor Jakanachari"],
    nearby: [
      { slug: "chikmagalur", distanceKm: 40, name: "Chikmagalur" },
      { slug: "sakleshpur", distanceKm: 45, name: "Sakleshpur" },
      { slug: "mysore", distanceKm: 145, name: "Mysore" }
    ],
    estimatedDailyBudget: { budget: 1400, moderate: 2700, luxury: 5800 }
  },
  {
    slug: "mangalore",
    name: "Mangalore (Mangaluru)",
    district: "Dakshina Kannada",
    categories: ["Cities", "Beaches", "Food & Culture", "Spiritual"],
    recommendedDays: 2,
    distanceFromBangalore: 350,
    latitude: 12.9141,
    longitude: 74.8560,
    image: "images/destinations/mangalore.jpg",
    bestSeason: "October to March",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "Coastal port metropolis famed for culinary seafood, St. Aloysius Chapel, and Panambur beach.",
    description: "Mangaluru is Karnataka's major coastal hub, renowned for its diverse cultural tapestry, pristine beaches, and world-famous coastal delicacies such as Neer Dosa, Ghee Roast, Kori Rotti, and Pabbas ice creams. Explore historical tile factories, peaceful port beaches, and ancient Mangaladevi Temple.",
    attractions: [
      { name: "Panambur Beach", description: "Clean golden sand beach hosting international kite festivals with thrilling water sports.", latitude: 12.9468, longitude: 74.8016 },
      { name: "St. Aloysius Chapel", description: "Historic 1880 chapel featuring magnificent Italian frescoes painted by Antony Moscheni.", latitude: 12.8733, longitude: 74.8436 },
      { name: "Kudroli Gokarnanatheshwara Temple", description: "Grand modern temple radiant during Mangalore Dasara celebrations.", latitude: 12.8800, longitude: 74.8350 },
      { name: "Tannirbhavi Beach & Tree Park", description: "Serene pine-fringed coastal haven reached by ferry from Sultan Battery.", latitude: 12.8900, longitude: 74.8100 }
    ],
    activities: ["Gourmet Food Crawl for Ghee Roast and Neer Dosa", "Ferry Ride from Sultan Battery to Tannirbhavi", "Savoring Gadbad Ice Cream at Ideal / Pabbas", "St. Aloysius Fresco Art Tour", "Sunset at Panambur Beach"],
    travelTips: [
      "Pabbas or Ideal Ice Cream is an absolute must-visit for trying the legendary 'Gadbad' ice cream sundae.",
      "Take the picturesque coastal train or drive through Shiradi Ghat to reach Mangaluru."
    ],
    foodSpecialties: ["Chicken / Prawn Ghee Roast at Maharaja", "Kori Rotti with rich chicken gravy", "Neer Dosa", "Anjal (Seer Fish) Tawa Fry", "Gadbad Ice Cream"],
    culturalHighlights: ["Mangalore Dasara tiger dance (Pili Yesa / Huli Vesha)", "Yakshagana night performances", "Tulu Nadu Bhoota Kola rituals"],
    nearby: [
      { slug: "udupi", distanceKm: 55, name: "Udupi" },
      { slug: "coorg", distanceKm: 135, name: "Coorg" },
      { slug: "sakleshpur", distanceKm: 130, name: "Sakleshpur" }
    ],
    estimatedDailyBudget: { budget: 1600, moderate: 3300, luxury: 7000 }
  },
  {
    slug: "srirangapatna",
    name: "Srirangapatna",
    district: "Mandya",
    categories: ["Heritage", "Spiritual", "Culture"],
    recommendedDays: 1,
    distanceFromBangalore: 125,
    latitude: 12.4238,
    longitude: 76.6947,
    image: "images/destinations/srirangapatna.jpg",
    bestSeason: "October to March",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "Island fortress city of Tipu Sultan situated on the Cauvery River, filled with historic monuments.",
    description: "An island town enclosed by the Cauvery River just 15 km from Mysuru, Srirangapatna was the capital of Mysore under Hyder Ali and Tipu Sultan. Famous for the Ranganathaswamy Temple, Dariya Daulat Bagh (Summer Palace), and the Colonel Bailey's Dungeon.",
    attractions: [
      { name: "Dariya Daulat Bagh (Summer Palace)", description: "Teakwood palace surrounded by Mughal gardens adorned with intricate fresco battle murals.", latitude: 12.4186, longitude: 76.7022 },
      { name: "Ranganathaswamy Temple", description: "Revered Vaishnavite temple dating back to the Ganga dynasty in the 9th century.", latitude: 12.4238, longitude: 76.6947 },
      { name: "Gumbaz (Mausoleum of Tipu Sultan)", description: "Towering black basalt dome containing tombs of Hyder Ali, Tipu Sultan, and his mother.", latitude: 12.4120, longitude: 76.7230 },
      { name: "Ranganathittu Bird Sanctuary", description: "Islet bird haven 4 km away harboring painted storks, pelicans, and marsh crocodiles.", latitude: 12.4250, longitude: 76.6550 }
    ],
    activities: ["Boat Safari at Ranganathittu Bird Sanctuary", "Exploring Tipu Sultan's Dariya Daulat Palace", "Visiting Colonel Bailey's Dungeon and Water Gate"],
    travelTips: [
      "Combine Srirangapatna with Mysore or visit as an easy day stop on the Bengaluru-Mysuru highway.",
      "Early morning boat ride at Ranganathittu Bird Sanctuary offers the best bird activity."
    ],
    foodSpecialties: ["Maddur Vada at Shivalli", "Mysore Pak", "Sugarcane juice from Mandya farms"],
    culturalHighlights: ["Tipu Sultan's military resistance against the British East India Company", "First of the three sacred Adi Ranga shrines on the Cauvery River"],
    nearby: [
      { slug: "mysore", distanceKm: 15, name: "Mysore" },
      { slug: "bengaluru", distanceKm: 125, name: "Bengaluru" }
    ],
    estimatedDailyBudget: { budget: 1200, moderate: 2400, luxury: 5000 }
  },
  {
    slug: "sringeri",
    name: "Sringeri",
    district: "Chikkamagaluru",
    categories: ["Religious", "Spiritual", "Nature", "Culture"],
    recommendedDays: 2,
    distanceFromBangalore: 320,
    latitude: 13.4187,
    longitude: 75.2570,
    image: "images/destinations/sringeri.jpg",
    bestSeason: "October to March (Gentle mountain breezes)",
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    shortDescription: "Sacred temple town nestled on the banks of Tunga River, founded by Adi Shankaracharya in the 8th century.",
    description: "Sringeri is a hallowed pilgrim destination in the Sahyadri hills. It is home to the first Sharada Peetham established by Sri Adi Shankaracharya. Visitors are captivated by the Vidyashankara Temple, whose 12 pillars are sculpted so the sun shines on the zodiac sign corresponding to the solar month.",
    attractions: [
      { name: "Vidyashankara Temple", description: "Unique astronomical stone temple with 12 zodiac pillars aligned with the sun.", latitude: 13.4187, longitude: 75.2570 },
      { name: "Sharadamba Temple & Tunga River Ghats", description: "Peaceful riverside temple steps where visitors feed sacred Tor Mahseer fish.", latitude: 13.4185, longitude: 75.2575 },
      { name: "Sirimane Falls", description: "Picturesque 40-foot waterfall cascading inside dense Western Ghat rainforests 14 km away.", latitude: 13.4400, longitude: 75.1800 }
    ],
    activities: ["Feeding sacred Tor Mahseer fish on the Tunga River steps", "Observing the zodiac pillar architecture of Vidyashankara Temple", "Visiting Sirimane Falls in the dense Ghats", "Temple Annadana Prasadam lunch"],
    travelTips: [
      "Strict dress code: men must remove shirts or wear dhotis/shawls to enter inner sanctum.",
      "The temple offers serene free community meals (Bhojana) served twice daily."
    ],
    foodSpecialties: ["Traditional Satvik Malnad temple meals", "Kotte Kadubu", "Tender Coconut"],
    culturalHighlights: ["Dakshinamnaya Sri Sharada Peetham founded in 8th century by Adi Shankaracharya", "Living Vedic scholarship tradition"],
    nearby: [
      { slug: "kudremukh", distanceKm: 45, name: "Kudremukh" },
      { slug: "chikmagalur", distanceKm: 85, name: "Chikmagalur" },
      { slug: "udupi", distanceKm: 85, name: "Udupi" }
    ],
    estimatedDailyBudget: { budget: 1200, moderate: 2400, luxury: 5000 }
  },
  {
    slug: "bengaluru",
    name: "Bengaluru (Bangalore)",
    district: "Bengaluru Urban",
    categories: ["Cities", "Heritage", "Food & Culture", "Nature"],
    recommendedDays: 3,
    distanceFromBangalore: 0,
    latitude: 12.9716,
    longitude: 77.5946,
    image: "images/destinations/bengaluru.jpg",
    bestSeason: "Year-Round (Pleasant plateau climate throughout the year)",
    bestMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortDescription: "The vibrant Garden City and Silicon Valley of India, known for pleasant weather, parks, and craft breweries.",
    description: "Bengaluru blends green botanical gardens, historic palaces, and buzzing cosmopolitan energy. From the centuries-old Lalbagh Botanical Garden and Tipu Sultan's Summer Palace to lively café lanes in Indiranagar and world-class craft breweries, Bengaluru is the gateway to exploring Karnataka.",
    attractions: [
      { name: "Lalbagh Botanical Garden", description: "240-acre botanical garden housing rare tropical plants and a London Crystal Palace replica.", latitude: 12.9507, longitude: 77.5848 },
      { name: "Bangalore Palace", description: "Tudor-style royal castle with fortified towers, wooden carvings, and royal memorabilia.", latitude: 12.9988, longitude: 77.5921 },
      { name: "Cubbon Park", description: "300-acre lush lung of the city adjoining the neo-Dravidian Vidhana Soudha legislature.", latitude: 12.9760, longitude: 77.5920 },
      { name: "National Gallery of Modern Art (NGMA)", description: "Colonial heritage mansion displaying Indian art masterpieces amid century-old trees.", latitude: 12.9890, longitude: 77.5880 }
    ],
    activities: ["Morning walk through Lalbagh Glasshouse", "Craft Brewery Tour in Indiranagar and Koramangala", "Breakfast crawl for crispy Masala Dosa at Vidyarthi Bhavan or CTR", "Shopping for Channapatna wooden toys and Mysore silks on MG Road"],
    travelTips: [
      "Use Namma Metro to avoid peak-hour road traffic across major hubs.",
      "Early mornings (6:00 AM - 9:00 AM) are prime times for visiting Cubbon Park and Lalbagh when vehicles are restricted."
    ],
    foodSpecialties: ["Benne Masala Dosa at CTR / Vidyarthi Bhavan", "Khara Bath & Kesari Bath (Chow Chow Bath)", "Rava Idli at MTR", "Local craft beers and microbrews", "Filter Kaapi"],
    culturalHighlights: ["Kempe Gowda's founding of Bangalore in 1537", "Vidhana Soudha: 'Government's Work is God's Work'"],
    nearby: [
      { slug: "nandi-hills", distanceKm: 60, name: "Nandi Hills" },
      { slug: "srirangapatna", distanceKm: 125, name: "Srirangapatna" },
      { slug: "mysore", distanceKm: 145, name: "Mysore" }
    ],
    estimatedDailyBudget: { budget: 1800, moderate: 3800, luxury: 8500 }
  },
  {
    slug: "dandeli",
    name: "Dandeli",
    district: "Uttara Kannada",
    categories: ["Adventure", "Wildlife", "Nature", "Waterfalls"],
    recommendedDays: 3,
    distanceFromBangalore: 460,
    latitude: 15.2458,
    longitude: 74.6225,
    image: "images/destinations/dandeli.jpg",
    bestSeason: "October to May (Optimal river currents for white water rafting)",
    bestMonths: ["October", "November", "December", "January", "February", "March", "April", "May"],
    shortDescription: "Adventure capital of South India famous for white-water rafting on the Kali River and jungle safaris.",
    description: "Dandeli is the ultimate adventure getaway in Karnataka. Surrounded by dense deciduous forests along the untamed Kali River, thrill-seekers flock here for Grade-III white water rafting, kayaking, natural river jacuzzis, zip lining, and wildlife safaris spotting hornbills and panthers.",
    attractions: [
      { name: "Kali River White Water Rafting", description: "Exhilarating 12 km river rafting expedition through scenic river rapids and gorges.", latitude: 15.2458, longitude: 74.6225 },
      { name: "Syntheri Rocks", description: "Monolithic granite ravine 300 feet high through which the Kanambi river gushes fiercely.", latitude: 15.2150, longitude: 74.5200 },
      { name: "Dandeli Wildlife Sanctuary", description: "Dense forest reserve home to black panthers, Great Pied Hornbills, and barking deer.", latitude: 15.2300, longitude: 74.6000 }
    ],
    activities: ["Grade III White Water Rafting", "Natural Jacuzzi Bath in Kali River", "Kayaking and Coracle rides", "Ziplining through forest canopy", "Hornbill birdwatching in timber reserves"],
    travelTips: [
      "White water rafting is dependent on water discharge from Supa Dam; confirm rafting timings with local guides.",
      "Wear water-friendly clothes and strap-on footwear for all river adventure activities."
    ],
    foodSpecialties: ["North Karnataka style thalis", "Spicy country chicken curry", "Fresh river fish fry"],
    culturalHighlights: ["Anshi National Park biodiversity corridor", "Tribal folklore of Kali River forests"],
    nearby: [
      { slug: "gokarna", distanceKm: 155, name: "Gokarna" },
      { slug: "jog-falls", distanceKm: 145, name: "Jog Falls" }
    ],
    estimatedDailyBudget: { budget: 1800, moderate: 3500, luxury: 7500 }
  },
  {
    slug: "jog-falls",
    name: "Jog Falls",
    district: "Shivamogga",
    categories: ["Waterfalls", "Nature", "Photography"],
    recommendedDays: 2,
    distanceFromBangalore: 410,
    latitude: 14.2285,
    longitude: 74.8124,
    image: "images/destinations/jog-falls.jpg",
    bestSeason: "July to December (Peak monsoon roaring flow & rainbow mist)",
    bestMonths: ["July", "August", "September", "October", "November", "December"],
    shortDescription: "India's second-highest plunge waterfall, dropping 253 meters in four distinct cascades.",
    description: "Jog Falls, created by the Sharavathi River, is one of the most magnificent natural spectacles in India. The cascade plummets 830 feet in four magnificent torrents named Raja, Roarer, Rocket, and Rani. During monsoon months, the valley becomes an amphitheater of thunderous mist and rainbows.",
    attractions: [
      { name: "Sharavathi Valley Viewpoint", description: "Main pavilion viewing area offering full frontal panoramic views of all four waterfalls.", latitude: 14.2285, longitude: 74.8124 },
      { name: "Bottom of the Falls (1400 Steps)", description: "Challenging staircase leading all the way to the mist pool at the base of the gorge.", latitude: 14.2290, longitude: 74.8130 }
    ],
    activities: ["Panoramic Waterfall Viewing from Watkins Platform", "Climbing 1,400 steps to the gorge floor (seasonal)", "Laser light and musical fountain show in the evening", "Photography of rainbows in the morning spray"],
    travelTips: [
      "Monsoon months (July to October) offer the most roaring, thunderous water flow.",
      "During dry summer months (March-May), water volume is significantly reduced due to Linganamakki hydroelectric dam holding."
    ],
    foodSpecialties: ["Malnad Thali", "Akki Roti with bamboo curry", "Kotte Kadubu"],
    culturalHighlights: ["Sharavathi Valley Hydroelectric Project, pioneering renewable energy in Karnataka"],
    nearby: [
      { slug: "murudeshwar", distanceKm: 90, name: "Murudeshwar" },
      { slug: "gokarna", distanceKm: 115, name: "Gokarna" },
      { slug: "sringeri", distanceKm: 110, name: "Sringeri" }
    ],
    estimatedDailyBudget: { budget: 1300, moderate: 2600, luxury: 5400 }
  },
  {
    slug: "sakleshpur",
    name: "Sakleshpur",
    district: "Hassan",
    categories: ["Hill Stations", "Nature", "Adventure", "Coffee", "Photography"],
    recommendedDays: 2,
    distanceFromBangalore: 220,
    latitude: 12.9439,
    longitude: 75.7865,
    image: "images/destinations/sakleshpur.jpg",
    bestSeason: "September to April (Green meadows and cool breezes)",
    bestMonths: ["September", "October", "November", "December", "January", "February", "March", "April"],
    shortDescription: "Charming hill station with aromatic cardamom plantations, star fortresses, and railway bridge treks.",
    description: "Sakleshpur is a tranquil highland retreat nestled in the Western Ghats between Hassan and Mangalore. Celebrated for its cool climate, endless cardamom, pepper, and coffee estates, and historical landmarks like the star-shaped Manjarabad Fort built by Tipu Sultan.",
    attractions: [
      { name: "Manjarabad Fort", description: "Octagonal star-shaped hill fort built in 1792 by Tipu Sultan with stunning 360-degree valley views.", latitude: 12.9238, longitude: 75.7612 },
      { name: "Bisle Ghat Viewpoint", description: "Sensational cliff edge looking over three mountain ranges and evergreen rainforest canopies.", latitude: 12.7214, longitude: 75.7128 },
      { name: "Jenukal Gudda", description: "Second highest peak in Karnataka offering views extending towards the Arabian Sea on crystal clear days.", latitude: 12.8900, longitude: 75.7200 }
    ],
    activities: ["Climbing Manjarabad Octagonal Star Fort", "Bisle Ghat Rainforest Panorama Photography", "Green Route railway track scenic walks", "Estate camping and stream wading"],
    travelTips: [
      "Manjarabad Fort requires climbing approximately 250 steps; best visited in morning or late afternoon.",
      "Bisle Ghat viewpoint is a biodiversity paradise; carry binoculars for birdwatching."
    ],
    foodSpecialties: ["Malnad Akki Roti", "Hassan Cardamom infused tea", "Pandi Curry / Jackfruit curry in homestays"],
    culturalHighlights: ["French military architecture influence in the star fort design commissioned by Tipu Sultan"],
    nearby: [
      { slug: "belur-halebidu", distanceKm: 45, name: "Belur & Halebidu" },
      { slug: "chikmagalur", distanceKm: 60, name: "Chikmagalur" },
      { slug: "coorg", distanceKm: 110, name: "Coorg" }
    ],
    estimatedDailyBudget: { budget: 1600, moderate: 3200, luxury: 6800 }
  },
  {
    slug: "kudremukh",
    name: "Kudremukh",
    district: "Chikkamagaluru",
    categories: ["Nature", "Hill Stations", "Adventure", "Photography", "Wildlife"],
    recommendedDays: 2,
    distanceFromBangalore: 330,
    latitude: 13.2185,
    longitude: 75.2530,
    image: "images/destinations/kudremukh.jpg",
    bestSeason: "June to February (Rolling emerald grasslands during monsoon and winter)",
    bestMonths: ["June", "July", "August", "September", "October", "November", "December", "January", "February"],
    shortDescription: "Rolling emerald shola grasslands and horse-face shaped mountain peaks protected inside a National Park.",
    description: "Named after its distinctive mountain peak resembling a horse's face ('Kudre-mukha' in Kannada), Kudremukh is a UNESCO World Heritage biodiversity hotspot. Known for rolling emerald meadows, misty ridges, and pristine shola forest ecosystems that receive some of the highest rainfall in Karnataka.",
    attractions: [
      { name: "Kudremukh Peak Trek", description: "Thrilling 22-km day trek across green shola grasslands, streams, and rolling high-altitude hills.", latitude: 13.2185, longitude: 75.2530 },
      { name: "Hanuman Gundi Falls", description: "Cascading 100-foot waterfall inside the national park surrounded by deep greenery.", latitude: 13.2500, longitude: 75.2700 }
    ],
    activities: ["Kudremukh Peak 22-km Day Trek", "Hanuman Gundi Waterfall Dip", "Nature Walks through Shola Grasslands", "Birdwatching in Western Ghats Biosphere"],
    travelTips: [
      "Kudremukh Peak trek strictly requires a prior permit from Karnataka Forest Department (limited to 50 trekkers/day).",
      "Camping inside the national park is forbidden; stay in nearby Samse or Kalasa homestays."
    ],
    foodSpecialties: ["Malnad Vegetarian Oota", "Neer Dosa", "Filter Coffee"],
    culturalHighlights: ["Shola-grassland unique ecosystem conservation", "Mining rehabilitation into protected biodiversity zone"],
    nearby: [
      { slug: "sringeri", distanceKm: 45, name: "Sringeri" },
      { slug: "chikmagalur", distanceKm: 90, name: "Chikmagalur" },
      { slug: "udupi", distanceKm: 95, name: "Udupi" }
    ],
    estimatedDailyBudget: { budget: 1600, moderate: 3200, luxury: 6500 }
  },
  {
    slug: "nandi-hills",
    name: "Nandi Hills",
    district: "Chikkaballapur",
    categories: ["Hill Stations", "Nature", "Hidden Gems", "Photography"],
    recommendedDays: 1,
    distanceFromBangalore: 60,
    latitude: 13.3702,
    longitude: 77.6835,
    image: "images/destinations/nandi-hills.jpg",
    bestSeason: "Year-Round (Misty mornings and sea of clouds in winter)",
    bestMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortDescription: "Popular weekend sunrise getaway perched 1,478 meters above sea level with sea-of-clouds panoramas.",
    description: "Located just 60 km from Bengaluru, Nandi Hills is the ultimate sunrise haven. Visitors arrive early to witness rolling clouds beneath the cliffs, visit the ancient Yoga Nandeeshwara temple, and explore Tipu's Drop and summer residence.",
    attractions: [
      { name: "Tipu's Drop", description: "Dramatic 600-meter cliff overhang offering heart-racing vertical views of the plains below.", latitude: 13.3702, longitude: 77.6835 },
      { name: "Yoga Nandeeshwara Temple", description: "Chola-period hilltop stone temple guarded by an intricately carved brass bull Nandi.", latitude: 13.3680, longitude: 77.6820 },
      { name: "Amruth Sarovar", description: "Historic stone-stepped water reservoir surrounded by manicured hilltop gardens.", latitude: 13.3710, longitude: 77.6850 }
    ],
    activities: ["Sunrise viewing above the sea of clouds", "Cycling or motorbiking up the 40 winding hairpin bends", "Heritage walk through Tipu's Summer Lodge and Fort Walls", "Trek up via the ancient Sultanpet stone steps"],
    travelTips: [
      "The hill entry gates open at 6:00 AM; arrive by 5:30 AM on weekends to avoid vehicle queues.",
      "Weekend parking can fill quickly; weekdays provide a peaceful, uncrowded mountain retreat."
    ],
    foodSpecialties: ["Hot Masala Tea and roasted corn on the cob", "Crispy Mirchi Bhajji", "South Indian Dosa at foothill eateries"],
    culturalHighlights: ["Nandi bull origin legend of South Pennar, Palar and Arkavathi rivers", "Tipu Sultan's fortified summer retreat"],
    nearby: [
      { slug: "bengaluru", distanceKm: 60, name: "Bengaluru" }
    ],
    estimatedDailyBudget: { budget: 800, moderate: 1800, luxury: 4500 }
  }
];

const tripTemplates = [
  {
    id: "western-ghats-coffee-hills",
    title: "Western Ghats Coffee & Peaks Trail",
    durationDays: 4,
    startingPoint: "Bengaluru",
    destinations: ["chikmagalur", "sakleshpur", "coorg"],
    estimatedDistanceKm: 720,
    estimatedBudgetPerPerson: 9500,
    tags: ["Coffee", "Hills", "Nature", "Waterfalls"],
    description: "A misty journey through Karnataka's premier coffee highlands, highest peaks, and roaring waterfalls."
  },
  {
    id: "royal-heritage-circuit",
    title: "Royal Mysore & UNESCO Heritage Trail",
    durationDays: 5,
    startingPoint: "Bengaluru",
    destinations: ["srirangapatna", "mysore", "belur-halebidu", "hampi"],
    estimatedDistanceKm: 880,
    estimatedBudgetPerPerson: 11000,
    tags: ["Heritage", "UNESCO", "Royalty", "Temples"],
    description: "Trace centuries of royal glory from Tipu Sultan's island fortress to the Vijayanagara stone chariot."
  },
  {
    id: "karavali-coastal-odyssey",
    title: "Karavali Coastal Beaches & Temples",
    durationDays: 4,
    startingPoint: "Mangalore",
    destinations: ["mangalore", "udupi", "murudeshwar", "gokarna"],
    estimatedDistanceKm: 260,
    estimatedBudgetPerPerson: 8500,
    tags: ["Beaches", "Spiritual", "Coastal Food", "Adventure"],
    description: "Sun-kissed Arabian Sea beaches, volcanic basalt islands, towering coastal temples, and fresh Karavali seafood."
  },
  {
    id: "wildlife-safari-expedition",
    title: "Southern Karnataka Tiger & Elephant Safari",
    durationDays: 3,
    startingPoint: "Bengaluru",
    destinations: ["mysore", "bandipur", "nagarhole"],
    estimatedDistanceKm: 540,
    estimatedBudgetPerPerson: 10500,
    tags: ["Wildlife", "Safaris", "Elephants", "Tigers"],
    description: "Incredible wildlife safaris through the Nilgiri Biosphere tracking tigers, black panthers, and elephant herds."
  },
  {
    id: "north-karnataka-caves-ruins",
    title: "Ancient Chalukya & Vijayanagara Wonder Trail",
    durationDays: 4,
    startingPoint: "Bengaluru",
    destinations: ["hampi", "badami", "pattadakal"],
    estimatedDistanceKm: 960,
    estimatedBudgetPerPerson: 9000,
    tags: ["Heritage", "Caves", "UNESCO", "Rock Architecture"],
    description: "Explore the cradle of South Indian stone architecture in Badami sandstone caves and Hampi boulder ruins."
  }
];

const kbData = {
  version: "1.0",
  lastUpdated: new Date().toISOString(),
  destinations: kbDestinations,
  tripTemplates: tripTemplates,
  districts: [
    "Kodagu", "Mysuru", "Chikkamagaluru", "Vijayanagara", "Uttara Kannada",
    "Udupi", "Chamarajanagar", "Bagalkot", "Hassan", "Dakshina Kannada",
    "Mandya", "Bengaluru Urban", "Shivamogga", "Chikkaballapur"
  ],
  categories: [
    "Hill Stations", "Beaches", "Heritage", "Wildlife", "Waterfalls",
    "Religious", "Spiritual", "Adventure", "Nature", "Cities", "Hidden Gems", "Coffee", "Food & Culture"
  ]
};

const outputDir = path.join(__dirname, '../data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'knowledge-base.json');
fs.writeFileSync(outputPath, JSON.stringify(kbData, null, 2), 'utf-8');
console.log(`✅ Successfully generated Karnataka Knowledge Base with ${kbDestinations.length} destinations and ${tripTemplates.length} templates at: ${outputPath}`);
