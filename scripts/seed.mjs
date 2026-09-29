try {
  process.loadEnvFile();
} catch (e) {}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const destinations = [
  {
    name: "Coorg (Madikeri)",
    slug: "coorg",
    district: "Kodagu",
    category: "Hill Stations",
    shortDescription: "The Scotland of India known for misty hills, lush coffee plantations, spice estates and gushing waterfalls.",
    description: "Nestled amidst the Western Ghats, Coorg (Kodagu) is an idyllic hill station renowned for its sprawling coffee estates, aromatic spice plantations, and misty green valleys. Rich in Kodava culture, warrior traditions, and lip-smacking local cuisine like Pandi Curry and Akki Roti, Coorg offers breathtaking viewpoints, serene river retreats, and thrilling trekking trails.",
    image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 12.4244,
    longitude: 75.7382,
    bestTimeToVisit: "October to March",
    recommendedDays: "2–3 Days",
    distanceFromBangalore: 265,
    averageRating: 4.9,
    reviewCount: 142,
    featured: true,
    attractions: [
      {
        name: "Abbey Falls",
        description: "Spectacular cascading waterfall tucked inside dense spice and coffee estates.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        latitude: 12.4542,
        longitude: 75.7177
      },
      {
        name: "Raja's Seat",
        description: "Historic viewpoint with manicured gardens offering panoramic sunset views across the Western Ghats.",
        image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800&auto=format&fit=crop",
        latitude: 12.4194,
        longitude: 75.7351
      },
      {
        name: "Dubare Elephant Camp",
        description: "Riverfront camp on the banks of Cauvery where visitors can bathe and interact with elephants.",
        image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=800&auto=format&fit=crop",
        latitude: 12.3683,
        longitude: 75.9036
      },
      {
        name: "Talakaveri & Brahmagiri",
        description: "The revered origin of the holy Cauvery River set high in the Brahmagiri Hills.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
        latitude: 12.3853,
        longitude: 75.4925
      }
    ]
  },
  {
    name: "Mysore (Mysuru)",
    slug: "mysore",
    district: "Mysuru",
    category: "Heritage",
    shortDescription: "The City of Palaces, royal heritage, fragrant sandalwood, rich silk sarees, and majestic Dasara festivities.",
    description: "Mysuru is the cultural heart of Karnataka, celebrated worldwide for its royal grandeur and architectural wonder, the Mysore Palace. Dotted with heritage monuments, the bustling Devaraja market, Chamundi Hill temple, and legendary eateries serving authentic Mysore Masala Dosa and Mysore Pak.",
    image: "https://images.unsplash.com/photo-1600100397608-f010f443bbf6?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1600100397608-f010f443bbf6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 12.2958,
    longitude: 76.6394,
    bestTimeToVisit: "September to March",
    recommendedDays: "2 Days",
    distanceFromBangalore: 145,
    averageRating: 4.8,
    reviewCount: 230,
    featured: true,
    attractions: [
      {
        name: "Mysore Palace (Amba Vilas)",
        description: "Opulent Indo-Saracenic royal residence illuminated with nearly 100,000 golden bulbs on weekends.",
        image: "https://images.unsplash.com/photo-1600100397608-f010f443bbf6?q=80&w=800&auto=format&fit=crop",
        latitude: 12.3052,
        longitude: 76.6552
      },
      {
        name: "Chamundeshwari Temple",
        description: "Ancient hilltop shrine overlooking Mysuru city with a legendary monolithic Nandi statue.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 12.2748,
        longitude: 76.6717
      },
      {
        name: "Brindavan Gardens",
        description: "Terraced botanical gardens with illuminated musical dancing fountains at the KRS dam.",
        image: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=800&auto=format&fit=crop",
        latitude: 12.4243,
        longitude: 76.5732
      }
    ]
  },
  {
    name: "Chikmagalur",
    slug: "chikmagalur",
    district: "Chikkamagaluru",
    category: "Hill Stations",
    shortDescription: "The birthplace of Indian coffee, enveloped in emerald hills, misty peaks, and sprawling plantations.",
    description: "Chikmagalur is a paradise for nature lovers and trekkers. Situated in the foothills of the Mullayanagiri range, it was here that Baba Budan first planted coffee seeds smuggled from Yemen. The region features cloud-kissed peaks, roaring waterfalls like Hebbe and Jhari, and cozy plantation homestays.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 13.3153,
    longitude: 75.7754,
    bestTimeToVisit: "September to May",
    recommendedDays: "2–3 Days",
    distanceFromBangalore: 245,
    averageRating: 4.9,
    reviewCount: 168,
    featured: true,
    attractions: [
      {
        name: "Mullayanagiri Peak",
        description: "The highest peak in Karnataka (1,930 m) offering sweeping views above the clouds.",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop",
        latitude: 13.3912,
        longitude: 75.7214
      },
      {
        name: "Baba Budangiri",
        description: "Historic mountain range sacred to both Hindus and Sufis with mystical caves.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        latitude: 13.4357,
        longitude: 75.7681
      },
      {
        name: "Hebbe Falls",
        description: "Stunning twin-stream waterfall deep inside coffee estates reached by exciting jeep safaris.",
        image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=800&auto=format&fit=crop",
        latitude: 13.5412,
        longitude: 75.7891
      }
    ]
  },
  {
    name: "Hampi",
    slug: "hampi",
    district: "Vijayanagara",
    category: "Heritage",
    shortDescription: "UNESCO World Heritage site featuring colossal boulder-strewn ruins of the glorious Vijayanagara Empire.",
    description: "Hampi transports travelers back in time to the 14th century capital of the Vijayanagara Empire. Set along the banks of the Tungabhadra River, it is an open-air museum filled with intricately carved stone temples, royal pavilions, monolithic statues, and surreal rust-colored boulder hills.",
    image: "https://images.unsplash.com/photo-1600100397937-cabb79c30c4c?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1600100397937-cabb79c30c4c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 15.3350,
    longitude: 76.4600,
    bestTimeToVisit: "October to February",
    recommendedDays: "3 Days",
    distanceFromBangalore: 340,
    averageRating: 5.0,
    reviewCount: 310,
    featured: true,
    attractions: [
      {
        name: "Virupaksha Temple",
        description: "Living ancient Shiva temple standing tall since the 7th century with towering gopuram.",
        image: "https://images.unsplash.com/photo-1600100397937-cabb79c30c4c?q=80&w=800&auto=format&fit=crop",
        latitude: 15.3352,
        longitude: 76.4603
      },
      {
        name: "Vijaya Vittala Temple & Stone Chariot",
        description: "Masterpiece of Dravidian architecture featuring the iconic stone chariot and musical pillars.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 15.3438,
        longitude: 76.4764
      },
      {
        name: "Matanga Hill",
        description: "The ultimate sunrise and sunset vantage point overlooking the endless sea of ruins.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        latitude: 15.3331,
        longitude: 76.4665
      }
    ]
  },
  {
    name: "Gokarna",
    slug: "gokarna",
    district: "Uttara Kannada",
    category: "Beaches",
    shortDescription: "Laid-back coastal gem where pristine golden beaches meet sacred temple pilgrimages.",
    description: "Gokarna is where spirituality gracefully meets bohemian coastal charm. Famed for Om Beach (shaped like the sacred Hindu symbol), Kudle Beach, Half Moon Beach, and Paradise Beach, visitors can hike cliff trails between beaches, savor beach shacks, and visit the revered Mahabaleshwar Temple.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 14.5479,
    longitude: 74.3188,
    bestTimeToVisit: "October to March",
    recommendedDays: "2–3 Days",
    distanceFromBangalore: 485,
    averageRating: 4.8,
    reviewCount: 195,
    featured: true,
    attractions: [
      {
        name: "Om Beach",
        description: "Naturally contoured in the shape of Om, ideal for water sports and evening sunsets.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        latitude: 14.5186,
        longitude: 74.3168
      },
      {
        name: "Kudle Beach",
        description: "Wide crescent beach dotted with relaxing cafes, yoga centers, and acoustic music circles.",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
        latitude: 14.5294,
        longitude: 74.3142
      },
      {
        name: "Mahabaleshwar Temple",
        description: "Sacred 4th-century temple housing the Atmalinga of Lord Shiva.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 14.5422,
        longitude: 74.3183
      }
    ]
  },
  {
    name: "Udupi",
    slug: "udupi",
    district: "Udupi",
    category: "Beaches",
    shortDescription: "Spiritual sanctuary celebrated for Sri Krishna Temple, delicious cuisine, and pristine Malpe Beach.",
    description: "Udupi is universally famous for its wholesome vegetarian culinary heritage, the historic Sri Krishna Matha founded by Madhvacharya, and tranquil Arabian Sea coastlines. The nearby St. Mary's Island boasts rare columnar basaltic rock formations carved by nature millions of years ago.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 13.3409,
    longitude: 74.7421,
    bestTimeToVisit: "October to March",
    recommendedDays: "2 Days",
    distanceFromBangalore: 400,
    averageRating: 4.7,
    reviewCount: 175,
    featured: true,
    attractions: [
      {
        name: "Sri Krishna Temple",
        description: "Revered temple where devotees view Lord Krishna through the ornate Kanakana Kindi window.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 13.3409,
        longitude: 74.7525
      },
      {
        name: "St. Mary's Island",
        description: "Geological wonder with hexagonal volcanic basalt rock pillars rising from azure waters.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        latitude: 13.3775,
        longitude: 74.6736
      },
      {
        name: "Malpe Beach & Sea Walk",
        description: "Lively beach with water sports and a scenic walkway extending into the Arabian Sea.",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
        latitude: 13.3512,
        longitude: 74.6989
      }
    ]
  },
  {
    name: "Murudeshwar",
    slug: "murudeshwar",
    district: "Uttara Kannada",
    category: "Religious",
    shortDescription: "Home to the world's second-tallest Shiva statue surrounded on three sides by the Arabian Sea.",
    description: "Murudeshwar is an awe-inspiring seaside town dominated by the colossal 123-foot statue of Lord Shiva and the towering 20-storey Raja Gopuram. With lift access inside the gopuram offering panoramic ocean views and boat rides to Netrani Island for scuba diving.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 14.0940,
    longitude: 74.4899,
    bestTimeToVisit: "October to May",
    recommendedDays: "1–2 Days",
    distanceFromBangalore: 489,
    averageRating: 4.8,
    reviewCount: 154,
    featured: true,
    attractions: [
      {
        name: "Shiva Statue & Raja Gopuram",
        description: "Mammoth 123-ft coastal Shiva idol alongside a 249-foot modern temple tower.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 14.0940,
        longitude: 74.4899
      },
      {
        name: "Netrani Island (Scuba Diving)",
        description: "Heart-shaped coral reef island famous for scuba diving, manta rays, and clear waters.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        latitude: 14.0197,
        longitude: 74.3275
      }
    ]
  },
  {
    name: "Bandipur National Park",
    slug: "bandipur",
    district: "Chamarajanagar",
    category: "Wildlife",
    shortDescription: "Premier tiger reserve in the Nilgiri Biosphere featuring tigers, leopards, and wild elephant herds.",
    description: "Once the private hunting reserve of the Maharajas of Mysore, Bandipur is now one of India's best-managed tiger reserves and part of the UNESCO Nilgiri Biosphere Reserve. Spanning lush deciduous forests and teak woodlands, it shelters tigers, Indian leopards, dholes, and Asian elephants.",
    image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 11.6664,
    longitude: 76.6291,
    bestTimeToVisit: "October to May",
    recommendedDays: "2 Days",
    distanceFromBangalore: 220,
    averageRating: 4.7,
    reviewCount: 112,
    featured: true,
    attractions: [
      {
        name: "Jungle Wildlife Safari",
        description: "Early morning and dusk jeep safaris into core tiger territories.",
        image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=800&auto=format&fit=crop",
        latitude: 11.6664,
        longitude: 76.6291
      },
      {
        name: "Himavad Gopalaswamy Betta",
        description: "Highest peak in the park with a misty hilltop temple frequented by wild elephants.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
        latitude: 11.7226,
        longitude: 76.5925
      }
    ]
  },
  {
    name: "Nagarhole National Park",
    slug: "nagarhole",
    district: "Kodagu & Mysuru",
    category: "Wildlife",
    shortDescription: "Dense Kabini river forests famed for the highest density of Asiatic elephants, leopards, and black panthers.",
    description: "Also known as Rajiv Gandhi National Park, Nagarhole is framed by the serene Kabini River. It has gained international acclaim for frequent sightings of elusive black panthers, majestic tigers, and immense herds of wild elephants congregating on the riverbanks.",
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 12.0314,
    longitude: 76.1207,
    bestTimeToVisit: "October to May",
    recommendedDays: "2 Days",
    distanceFromBangalore: 220,
    averageRating: 4.8,
    reviewCount: 98,
    featured: false,
    attractions: [
      {
        name: "Kabini River Boat Safari",
        description: "Scenic boat cruise observing marsh crocodiles, otters, and elephants swimming across the river.",
        image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=800&auto=format&fit=crop",
        latitude: 11.9333,
        longitude: 76.2667
      }
    ]
  },
  {
    name: "Badami",
    slug: "badami",
    district: "Bagalkot",
    category: "Heritage",
    shortDescription: "Dramatic red sandstone rock-cut cave temples of the ancient Chalukyan kingdom around Agastya Lake.",
    description: "Badami, formerly known as Vatapi, was the regal capital of the Badami Chalukyas from 540 to 757 AD. It is celebrated for its four dramatic rock-cut cave temples chiseled into rugged red sandstone cliffs, the serene Agastya Lake, and the picturesque Bhutanatha temple complex.",
    image: "https://images.unsplash.com/photo-1600100397937-cabb79c30c4c?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1600100397937-cabb79c30c4c?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 15.9187,
    longitude: 75.6766,
    bestTimeToVisit: "October to March",
    recommendedDays: "2 Days",
    distanceFromBangalore: 450,
    averageRating: 4.8,
    reviewCount: 135,
    featured: false,
    attractions: [
      {
        name: "Badami Cave Temples",
        description: "Four intricate rock-hewn caves dedicated to Shiva, Vishnu, and Jain Tirthankaras.",
        image: "https://images.unsplash.com/photo-1600100397937-cabb79c30c4c?q=80&w=800&auto=format&fit=crop",
        latitude: 15.9172,
        longitude: 75.6841
      },
      {
        name: "Bhutanatha Temple & Agastya Lake",
        description: "Picturesque 7th-century sandstone temple projecting into the calm emerald waters of Agastya lake.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 15.9208,
        longitude: 75.6888
      }
    ]
  },
  {
    name: "Pattadakal",
    slug: "pattadakal",
    district: "Bagalkot",
    category: "Heritage",
    shortDescription: "UNESCO World Heritage site demonstrating the pinnacle of early South Indian temple architecture.",
    description: "Pattadakal on the banks of Malaprabha River served as the ceremonial site where Chalukya kings were crowned. It showcases a harmonious blend of North Indian (Nagara) and South Indian (Dravidian) architectural styles across ten 7th and 8th-century stone masterpieces.",
    image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 15.9490,
    longitude: 75.8160,
    bestTimeToVisit: "October to March",
    recommendedDays: "1 Day",
    distanceFromBangalore: 445,
    averageRating: 4.7,
    reviewCount: 88,
    featured: false,
    attractions: [
      {
        name: "Virupaksha Temple (Pattadakal)",
        description: "Built by Queen Lokamahadevi in 740 AD to commemorate her husband's victory over the Pallavas.",
        image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=800&auto=format&fit=crop",
        latitude: 15.9490,
        longitude: 75.8160
      }
    ]
  },
  {
    name: "Belur & Halebidu",
    slug: "belur-halebidu",
    district: "Hassan",
    category: "Heritage",
    shortDescription: "Jewels of Hoysala craftsmanship showcasing star-shaped temple plinths and soapstone relief filigree.",
    description: "The twin temple towns of Belur and Halebidu represent the absolute zenith of Hoysala architecture. The Chennakeshava Temple at Belur and Hoysaleshwara Temple at Halebidu are chiseled from chloritic schist with intricate depictions of dancers, animals, and mythological epics.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 13.1623,
    longitude: 75.8569,
    bestTimeToVisit: "October to March",
    recommendedDays: "1–2 Days",
    distanceFromBangalore: 220,
    averageRating: 4.8,
    reviewCount: 120,
    featured: false,
    attractions: [
      {
        name: "Chennakeshava Temple Belur",
        description: "Magnificent star-shaped 12th-century temple that took 103 years to complete.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 13.1623,
        longitude: 75.8569
      },
      {
        name: "Hoysaleshwara Temple Halebidu",
        description: "Twin-shrine monument famous for its endless horizontal friezes of battle scenes and elephants.",
        image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=800&auto=format&fit=crop",
        latitude: 13.2139,
        longitude: 75.9939
      }
    ]
  },
  {
    name: "Mangalore (Mangaluru)",
    slug: "mangalore",
    district: "Dakshina Kannada",
    category: "Cities",
    shortDescription: "Coastal port metropolis famed for culinary seafood, St. Aloysius Chapel, and Panambur beach.",
    description: "Mangaluru is Karnataka's major coastal hub, renowned for its diverse cultural tapestry, pristine beaches, and world-famous coastal delicacies such as Neer Dosa, Ghee Roast, Kori Rotti, and Pabbas ice creams. Explore historical tile factories, peaceful port beaches, and ancient Mangaladevi Temple.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 12.9141,
    longitude: 74.8560,
    bestTimeToVisit: "October to March",
    recommendedDays: "2 Days",
    distanceFromBangalore: 350,
    averageRating: 4.6,
    reviewCount: 140,
    featured: false,
    attractions: [
      {
        name: "Panambur Beach",
        description: "Clean golden sand beach hosting international kite festivals with thrilling water sports.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
        latitude: 12.9468,
        longitude: 74.8016
      },
      {
        name: "St. Aloysius Chapel",
        description: "Historic 1880 chapel featuring magnificent Italian frescoes painted by Antony Moscheni.",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
        latitude: 12.8733,
        longitude: 74.8436
      }
    ]
  },
  {
    name: "Srirangapatna",
    slug: "srirangapatna",
    district: "Mandya",
    category: "Heritage",
    shortDescription: "Island fortress city of Tipu Sultan situated on the Cauvery River, filled with historic monuments.",
    description: "An island town enclosed by the Cauvery River just 15 km from Mysuru, Srirangapatna was the capital of Mysore under Hyder Ali and Tipu Sultan. Famous for the Ranganathaswamy Temple, Dariya Daulat Bagh (Summer Palace), and the Colonel Bailey's Dungeon.",
    image: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 12.4238,
    longitude: 76.6947,
    bestTimeToVisit: "October to March",
    recommendedDays: "1 Day",
    distanceFromBangalore: 125,
    averageRating: 4.6,
    reviewCount: 92,
    featured: false,
    attractions: [
      {
        name: "Dariya Daulat Bagh (Summer Palace)",
        description: "Teakwood palace surrounded by Mughal gardens adorned with intricate fresco battle murals.",
        image: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=800&auto=format&fit=crop",
        latitude: 12.4186,
        longitude: 76.7022
      },
      {
        name: "Ranganathaswamy Temple",
        description: "Revered Vaishnavite temple dating back to the Ganga dynasty in the 9th century.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 12.4238,
        longitude: 76.6947
      }
    ]
  },
  {
    name: "Sringeri",
    slug: "sringeri",
    district: "Chikkamagaluru",
    category: "Religious",
    shortDescription: "Sacred temple town nestled on the banks of Tunga River, founded by Adi Shankaracharya in the 8th century.",
    description: "Sringeri is a hallowed pilgrim destination in the Sahyadri hills. It is home to the first Sharada Peetham established by Sri Adi Shankaracharya. Visitors are captivated by the Vidyashankara Temple, whose 12 pillars are sculpted so the sun shines on the zodiac sign corresponding to the solar month.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 13.4187,
    longitude: 75.2570,
    bestTimeToVisit: "October to March",
    recommendedDays: "1–2 Days",
    distanceFromBangalore: 320,
    averageRating: 4.8,
    reviewCount: 95,
    featured: false,
    attractions: [
      {
        name: "Vidyashankara Temple",
        description: "Unique astronomical stone temple with 12 zodiac pillars aligned with the sun.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
        latitude: 13.4187,
        longitude: 75.2570
      },
      {
        name: "Sharadamba Temple & Tunga River Ghats",
        description: "Peaceful riverside temple steps where visitors feed sacred Tor Mahseer fish.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        latitude: 13.4185,
        longitude: 75.2575
      }
    ]
  },
  {
    name: "Bengaluru (Bangalore)",
    slug: "bengaluru",
    district: "Bengaluru Urban",
    category: "Cities",
    shortDescription: "The vibrant Garden City and Silicon Valley of India, known for pleasant weather, parks, and craft breweries.",
    description: "Bengaluru blends green botanical gardens, historic palaces, and buzzing cosmopolitan energy. From the centuries-old Lalbagh Botanical Garden and Tipu Sultan's Summer Palace to lively café lanes in Indiranagar and world-class craft breweries, Bengaluru is the gateway to exploring Karnataka.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 12.9716,
    longitude: 77.5946,
    bestTimeToVisit: "Year-Round",
    recommendedDays: "2–3 Days",
    distanceFromBangalore: 0,
    averageRating: 4.7,
    reviewCount: 420,
    featured: true,
    attractions: [
      {
        name: "Lalbagh Botanical Garden",
        description: "240-acre botanical garden housing rare tropical plants and a London Crystal Palace replica.",
        image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop",
        latitude: 12.9507,
        longitude: 77.5848
      },
      {
        name: "Bangalore Palace",
        description: "Tudor-style royal castle with fortified towers, wooden carvings, and royal memorabilia.",
        image: "https://images.unsplash.com/photo-1600100397608-f010f443bbf6?q=80&w=800&auto=format&fit=crop",
        latitude: 12.9988,
        longitude: 77.5921
      }
    ]
  },
  {
    name: "Dandeli",
    slug: "dandeli",
    district: "Uttara Kannada",
    category: "Adventure",
    shortDescription: "Adventure capital of South India famous for white-water rafting on the Kali River and jungle safaris.",
    description: "Dandeli is the ultimate adventure getaway in Karnataka. Surrounded by dense deciduous forests along the untamed Kali River, thrill-seekers flock here for Grade-III white water rafting, kayaking, natural river jacuzzis, zip lining, and wildlife safaris spotting hornbills and panthers.",
    image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 15.2458,
    longitude: 74.6225,
    bestTimeToVisit: "October to May",
    recommendedDays: "2–3 Days",
    distanceFromBangalore: 460,
    averageRating: 4.8,
    reviewCount: 160,
    featured: true,
    attractions: [
      {
        name: "Kali River White Water Rafting",
        description: "Exhilarating 12 km river rafting expedition through scenic river rapids and gorges.",
        image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=800&auto=format&fit=crop",
        latitude: 15.2458,
        longitude: 74.6225
      },
      {
        name: "Syntheri Rocks",
        description: "Monolithic granite ravine 300 feet high through which the Kanambi river gushes fiercely.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        latitude: 15.2150,
        longitude: 74.5200
      }
    ]
  },
  {
    name: "Jog Falls",
    slug: "jog-falls",
    district: "Shivamogga",
    category: "Waterfalls",
    shortDescription: "India's second-highest plunge waterfall, dropping 253 meters in four distinct cascades.",
    description: "Jog Falls, created by the Sharavathi River, is one of the most magnificent natural spectacles in India. The cascade plummets 830 feet in four magnificent torrents named Raja, Roarer, Rocket, and Rani. During monsoon months, the valley becomes an amphitheater of thunderous mist and rainbows.",
    image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 14.2285,
    longitude: 74.8124,
    bestTimeToVisit: "July to December",
    recommendedDays: "1–2 Days",
    distanceFromBangalore: 410,
    averageRating: 4.8,
    reviewCount: 180,
    featured: false,
    attractions: [
      {
        name: "Sharavathi Valley Viewpoint",
        description: "Main pavilion viewing area offering full frontal panoramic views of all four waterfalls.",
        image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=800&auto=format&fit=crop",
        latitude: 14.2285,
        longitude: 74.8124
      }
    ]
  },
  {
    name: "Sakleshpur",
    slug: "sakleshpur",
    district: "Hassan",
    category: "Hill Stations",
    shortDescription: "Charming hill station with aromatic cardamon plantations, star fortresses, and railway bridge treks.",
    description: "Sakleshpur is a tranquil highland retreat nestled in the Western Ghats between Hassan and Mangalore. Celebrated for its cool climate, endless cardamom, pepper, and coffee estates, and historical landmarks like the star-shaped Manjarabad Fort built by Tipu Sultan.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 12.9439,
    longitude: 75.7865,
    bestTimeToVisit: "September to April",
    recommendedDays: "2 Days",
    distanceFromBangalore: 220,
    averageRating: 4.7,
    reviewCount: 110,
    featured: false,
    attractions: [
      {
        name: "Manjarabad Fort",
        description: "Octagonal star-shaped hill fort built in 1792 by Tipu Sultan with stunning 360-degree valley views.",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop",
        latitude: 12.9238,
        longitude: 75.7612
      },
      {
        name: "Bisle Ghat Viewpoint",
        description: "Sensational cliff edge looking over three mountain ranges and evergreen rainforest canopies.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        latitude: 12.7214,
        longitude: 75.7128
      }
    ]
  },
  {
    name: "Kudremukh",
    slug: "kudremukh",
    district: "Chikkamagaluru",
    category: "Nature",
    shortDescription: "Rolling emerald shola grasslands and horse-face shaped mountain peaks protected inside a National Park.",
    description: "Named after its distinctive mountain peak resembling a horse's face ('Kudre-mukha' in Kannada), Kudremukh is a UNESCO World Heritage biodiversity hotspot. Known for rolling emerald meadows, misty ridges, and pristine shola forest ecosystems that receive some of the highest rainfall in Karnataka.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 13.2185,
    longitude: 75.2530,
    bestTimeToVisit: "June to February",
    recommendedDays: "2 Days",
    distanceFromBangalore: 330,
    averageRating: 4.9,
    reviewCount: 125,
    featured: false,
    attractions: [
      {
        name: "Kudremukh Peak Trek",
        description: "Thrilling 22-km day trek across green shola grasslands, streams, and rolling high-altitude hills.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
        latitude: 13.2185,
        longitude: 75.2530
      },
      {
        name: "Hanuman Gundi Falls",
        description: "Cascading 100-foot waterfall inside the national park surrounded by deep greenery.",
        image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=800&auto=format&fit=crop",
        latitude: 13.2500,
        longitude: 75.2700
      }
    ]
  },
  {
    name: "Nandi Hills",
    slug: "nandi-hills",
    district: "Chikkaballapur",
    category: "Hidden Gems",
    shortDescription: "Popular weekend sunrise getaway perched 1,478 meters above sea level with sea-of-clouds panoramas.",
    description: "Located just 60 km from Bengaluru, Nandi Hills is the ultimate sunrise haven. Visitors arrive early to witness rolling clouds beneath the cliffs, visit the ancient Yoga Nandeeshwara temple, and explore Tipu's Drop and summer residence.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
    ]),
    latitude: 13.3702,
    longitude: 77.6835,
    bestTimeToVisit: "Year-Round",
    recommendedDays: "1 Day",
    distanceFromBangalore: 60,
    averageRating: 4.6,
    reviewCount: 310,
    featured: true,
    attractions: [
      {
        name: "Tipu's Drop",
        description: "Dramatic 600-meter cliff overhang offering heart-racing vertical views of the plains below.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        latitude: 13.3702,
        longitude: 77.6835
      }
    ]
  }
];

async function seed() {
  console.log("🌱 Starting Karnataka Travel Diaries seeding...");

  // Clear existing records to ensure fresh seed
  await prisma.destinationCluster.deleteMany();
  await prisma.review.deleteMany();
  await prisma.travelDiary.deleteMany();
  await prisma.tripDestination.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const seedPassword = process.env.SEED_DEFAULT_PASSWORD;
  if (!seedPassword) {
    throw new Error("FATAL: SEED_DEFAULT_PASSWORD environment variable is missing. Set SEED_DEFAULT_PASSWORD in your .env before seeding.");
  }
  const passwordHash = await bcrypt.hash(seedPassword, 10);

  const traveler = await prisma.user.create({
    data: {
      name: "Tarun Naik",
      email: "traveler@karnatakadiaries.com",
      passwordHash: passwordHash,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      role: "USER"
    }
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin Karnataka",
      email: "admin@karnatakadiaries.com",
      passwordHash: passwordHash,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      role: "ADMIN"
    }
  });

  console.log(`👤 Created Demo Traveler (${traveler.email}) and Admin (${admin.email})`);

  // Load from knowledge-base.json to seed all destinations & clusters
  let allDestinationsToSeed = destinations;
  try {
    const fs = await import('fs');
    const path = await import('path');
    const kbPath = path.join(process.cwd(), 'data/knowledge-base.json');
    if (fs.existsSync(kbPath)) {
      const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
      if (kb.clusters && kb.clusters.length > 0) {
        for (const c of kb.clusters) {
          await prisma.destinationCluster.create({
            data: {
              slug: c.slug,
              name: c.name,
              region: c.region,
              description: c.description,
              destinations: JSON.stringify(c.destinations),
              corridor: JSON.stringify(c.corridor || c.destinations)
            }
          });
        }
        console.log(`🗺️ Created ${kb.clusters.length} Destination Clusters`);
      }

      // Merge any destinations from knowledge base
      const existingSlugs = new Set(destinations.map(d => d.slug));
      for (const kbDest of (kb.destinations || [])) {
        if (!existingSlugs.has(kbDest.slug)) {
          allDestinationsToSeed.push({
            name: kbDest.name,
            slug: kbDest.slug,
            district: kbDest.district,
            category: kbDest.categories?.[0] || kbDest.category || "Heritage",
            shortDescription: kbDest.shortDescription,
            description: kbDest.description,
            image: kbDest.image,
            gallery: JSON.stringify(kbDest.gallery || [kbDest.image]),
            latitude: kbDest.latitude,
            longitude: kbDest.longitude,
            bestTimeToVisit: kbDest.bestSeason || "October to March",
            recommendedDays: `${kbDest.recommendedDays || 2} Days`,
            distanceFromBangalore: kbDest.distanceFromBangalore || 250,
            averageRating: kbDest.averageRating || 4.8,
            reviewCount: kbDest.reviewCount || 120,
            featured: !!kbDest.featured,
            attractions: (kbDest.attractions || []).map(a => ({
              name: a.name,
              description: a.description || `${a.name} in ${kbDest.name}`,
              image: a.image || kbDest.image || "images/hero/karnataka-hero.jpg",
              latitude: a.latitude || kbDest.latitude,
              longitude: a.longitude || kbDest.longitude
            }))
          });
        }
      }
    }
  } catch (err) {
    console.warn("Could not load knowledge-base.json for extra seeds:", err.message);
  }

  // Create Destinations & Attractions
  const createdDestinations = [];
  for (const dest of allDestinationsToSeed) {
    const { attractions, ...destData } = dest;
    const created = await prisma.destination.create({
      data: {
        ...destData,
        attractions: {
          create: attractions
        }
      }
    });
    createdDestinations.push(created);
  }

  console.log(`📍 Created ${createdDestinations.length} Karnataka Destinations with Attractions`);

  // Add Favorites for Demo Traveler
  const coorg = createdDestinations.find(d => d.slug === "coorg");
  const hampi = createdDestinations.find(d => d.slug === "hampi");
  const gokarna = createdDestinations.find(d => d.slug === "gokarna");

  if (coorg) {
    await prisma.favorite.create({
      data: {
        userId: traveler.id,
        destinationId: coorg.id
      }
    });
  }
  if (hampi) {
    await prisma.favorite.create({
      data: {
        userId: traveler.id,
        destinationId: hampi.id
      }
    });
  }

  // Create a Sample Trip
  if (coorg && createdDestinations.find(d => d.slug === "mysore")) {
    const mysore = createdDestinations.find(d => d.slug === "mysore");
    const trip = await prisma.trip.create({
      data: {
        userId: traveler.id,
        name: "Royal Heritage & Coffee Hills",
        description: "A 4-day escape starting from Bengaluru, through royal Mysuru palaces and ending in misty Coorg coffee plantations.",
        startDate: new Date("2026-10-10"),
        endDate: new Date("2026-10-14"),
        destinations: {
          create: [
            { destinationId: mysore.id, visitOrder: 1, notes: "Day 1: Mysore Palace lightings & Chamundi hill sunset" },
            { destinationId: coorg.id, visitOrder: 2, notes: "Day 2-4: Coffee plantation homestay, Abbey falls & Raja's seat" }
          ]
        }
      }
    });
    console.log(`🗺️ Created Demo Trip: "${trip.name}"`);
  }

  // Create a Sample Travel Diary Entry
  if (coorg) {
    await prisma.travelDiary.create({
      data: {
        userId: traveler.id,
        destinationId: coorg.id,
        title: "Monsoon Whispers in the Coffee Valleys of Coorg",
        content: "Waking up to the aroma of freshly roasted Arabica beans and rain drumming gently against the plantation roof was unforgettable. We took an early morning walk to Abbey Falls where the roaring torrent sent mist all the way to our faces. The evening was spent watching the sunset from Raja's Seat with hot filter coffee and Kodava Akki Roti.",
        visitDate: new Date("2026-08-15"),
        rating: 5,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop"
        ])
      }
    });
    console.log("📖 Created Demo Travel Diary Entry");
  }

  // Create Sample Reviews
  if (coorg) {
    await prisma.review.create({
      data: {
        userId: traveler.id,
        destinationId: coorg.id,
        rating: 5,
        comment: "Coorg exceeded all our expectations! The coffee tour in Madikeri and the elephant interaction at Dubare were once-in-a-lifetime experiences. Highly recommended for couples and families alike."
      }
    });
  }

  if (hampi) {
    await prisma.review.create({
      data: {
        userId: traveler.id,
        destinationId: hampi.id,
        rating: 5,
        comment: "Hampi is simply magical. Renting a bicycle and cycling past the stone chariot and Vijaya Vittala temple during sunrise will stay etched in my memory forever."
      }
    });
  }

  console.log("✅ Seeding successfully completed!");
}

seed()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
