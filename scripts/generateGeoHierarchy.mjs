import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// =========================================================================
// 1. REGIONS OF KARNATAKA
// =========================================================================
const regions = [
  {
    id: "coastal-karnataka",
    name: "Coastal Karnataka (Karavali)",
    description: "Sun-drenched Arabian Sea coastline, Blue Flag beaches, ancient coastal Shiva & Shakti temples, and river estuaries.",
    districts: ["dakshina-kannada", "udupi", "uttara-kannada"],
    corridor: ["mangaluru", "udupi", "kundapura", "bhatkal", "honnavar", "kumta", "karwar"]
  },
  {
    id: "malnad-region",
    name: "Malnad & Western Ghats",
    description: "Biodiversity hotspot with misty peaks, lush coffee estates, wildlife reserves, cascading waterfalls, and sacred shrines.",
    districts: ["chikkamagaluru", "shivamogga", "kodagu", "hassan"],
    corridor: ["madikeri", "sakleshpur", "chikkamagaluru", "kalasa", "sringeri", "sagara"]
  },
  {
    id: "mysuru-region",
    name: "Mysuru & Southern Karnataka",
    description: "Heritage palaces, silk and sandalwood capital, historic island forts, tiger reserves, and fertile river basins.",
    districts: ["mysuru", "mandya", "chamarajanagar", "kodagu", "hassan"],
    corridor: ["bengaluru-north", "srirangapatna", "mysuru", "gundlupet", "madikeri"]
  },
  {
    id: "bengaluru-region",
    name: "Bengaluru Region",
    description: "Cosmopolitan tech hub, garden city, sunrise hills, monolithic rock forts, silk towns, and vineyard retreats.",
    districts: ["bengaluru-urban", "bengaluru-rural", "ramanagara", "chikkaballapura", "kolar", "tumakuru"],
    corridor: ["bengaluru-north", "chikkaballapura", "ramanagara"]
  },
  {
    id: "heritage-circuit",
    name: "Heritage Circuit / North Karnataka",
    description: "UNESCO World Heritage boulder ruins of Vijayanagara, Chalukyan rock-cut sandstone caves, and temple architectures.",
    districts: ["vijayanagara", "bagalkote", "ballari"],
    corridor: ["hosapete", "badami"]
  },
  {
    id: "north-karnataka",
    name: "North Karnataka (Belagavi / Deccan)",
    description: "Dense teak jungle river rafting, historic river hill-forts, and Deccan plateau culture.",
    districts: ["belagavi", "dharwad", "gadag", "bagalkote", "vijayapura"],
    corridor: ["belagavi", "dharwad", "badami", "vijayapura"]
  },
  {
    id: "kalyana-karnataka",
    name: "Kalyana Karnataka (Hyderabad-Karnataka)",
    description: "Historic Bahmani sultanate forts, Sufi shrines, ancient university ruins, and fertile Krishna/Bhima river plains.",
    districts: ["kalaburagi", "bidar", "raichur", "koppal", "yadgir", "ballari"],
    corridor: ["ballari", "koppal", "raichur", "kalaburagi", "bidar"]
  },
  {
    id: "central-karnataka",
    name: "Central Karnataka",
    description: "The heartland of Karnataka connecting plains and hills, historic forts, textile hubs, and agricultural centers.",
    districts: ["davanagere", "chitradurga", "haveri", "tumakuru"],
    corridor: ["tumakuru", "chitradurga", "davanagere", "haveri"]
  }
];

// =========================================================================
// 2. ALL 31 DISTRICTS OF KARNATAKA WITH COORDINATES & NEIGHBOURS
// =========================================================================
const districts = [
  {
    id: "dakshina-kannada",
    name: "Dakshina Kannada",
    normalizedName: "dakshina kannada",
    region: "coastal-karnataka",
    latitude: 12.8703,
    longitude: 74.8806,
    neighbouringDistricts: ["udupi", "kodagu", "hassan", "chikkamagaluru"]
  },
  {
    id: "udupi",
    name: "Udupi",
    normalizedName: "udupi",
    region: "coastal-karnataka",
    latitude: 13.3409,
    longitude: 74.7421,
    neighbouringDistricts: ["dakshina-kannada", "uttara-kannada", "chikkamagaluru", "shivamogga"]
  },
  {
    id: "uttara-kannada",
    name: "Uttara Kannada",
    normalizedName: "uttara kannada",
    region: "coastal-karnataka",
    latitude: 14.8136,
    longitude: 74.1297,
    neighbouringDistricts: ["udupi", "shivamogga", "haveri", "dharwad", "belagavi"]
  },
  {
    id: "kodagu",
    name: "Kodagu (Coorg)",
    normalizedName: "kodagu",
    region: "malnad-region",
    latitude: 12.4244,
    longitude: 75.7382,
    neighbouringDistricts: ["dakshina-kannada", "hassan", "mysuru"]
  },
  {
    id: "chikkamagaluru",
    name: "Chikkamagaluru",
    normalizedName: "chikkamagaluru",
    region: "malnad-region",
    latitude: 13.3153,
    longitude: 75.7754,
    neighbouringDistricts: ["dakshina-kannada", "udupi", "shivamogga", "hassan", "chitradurga"]
  },
  {
    id: "shivamogga",
    name: "Shivamogga (Shimoga)",
    normalizedName: "shivamogga",
    region: "malnad-region",
    latitude: 13.9299,
    longitude: 75.5681,
    neighbouringDistricts: ["uttara-kannada", "udupi", "chikkamagaluru", "davanagere", "haveri"]
  },
  {
    id: "hassan",
    name: "Hassan",
    normalizedName: "hassan",
    region: "malnad-region",
    latitude: 13.0033,
    longitude: 76.1004,
    neighbouringDistricts: ["dakshina-kannada", "kodagu", "chikkamagaluru", "mysuru", "mandya", "tumakuru"]
  },
  {
    id: "mysuru",
    name: "Mysuru (Mysore)",
    normalizedName: "mysuru",
    region: "mysuru-region",
    latitude: 12.2958,
    longitude: 76.6394,
    neighbouringDistricts: ["mandya", "chamarajanagar", "kodagu", "hassan"]
  },
  {
    id: "mandya",
    name: "Mandya",
    normalizedName: "mandya",
    region: "mysuru-region",
    latitude: 12.5218,
    longitude: 76.8951,
    neighbouringDistricts: ["mysuru", "ramanagara", "tumakuru", "hassan"]
  },
  {
    id: "chamarajanagar",
    name: "Chamarajanagar",
    normalizedName: "chamarajanagar",
    region: "mysuru-region",
    latitude: 11.9261,
    longitude: 76.9437,
    neighbouringDistricts: ["mysuru", "mandya", "ramanagara"]
  },
  {
    id: "bengaluru-urban",
    name: "Bengaluru Urban",
    normalizedName: "bengaluru urban",
    region: "bengaluru-region",
    latitude: 12.9716,
    longitude: 77.5946,
    neighbouringDistricts: ["bengaluru-rural", "ramanagara"]
  },
  {
    id: "bengaluru-rural",
    name: "Bengaluru Rural",
    normalizedName: "bengaluru rural",
    region: "bengaluru-region",
    latitude: 13.2847,
    longitude: 77.5336,
    neighbouringDistricts: ["bengaluru-urban", "chikkaballapura", "kolar", "ramanagara", "tumakuru"]
  },
  {
    id: "ramanagara",
    name: "Ramanagara",
    normalizedName: "ramanagara",
    region: "bengaluru-region",
    latitude: 12.7209,
    longitude: 77.2799,
    neighbouringDistricts: ["bengaluru-urban", "bengaluru-rural", "mandya", "tumakuru", "chamarajanagar"]
  },
  {
    id: "chikkaballapura",
    name: "Chikkaballapura",
    normalizedName: "chikkaballapura",
    region: "bengaluru-region",
    latitude: 13.4325,
    longitude: 77.7275,
    neighbouringDistricts: ["bengaluru-rural", "kolar", "tumakuru"]
  },
  {
    id: "kolar",
    name: "Kolar",
    normalizedName: "kolar",
    region: "bengaluru-region",
    latitude: 13.1378,
    longitude: 78.1292,
    neighbouringDistricts: ["bengaluru-rural", "chikkaballapura"]
  },
  {
    id: "tumakuru",
    name: "Tumakuru (Tumkur)",
    normalizedName: "tumakuru",
    region: "central-karnataka",
    latitude: 13.3400,
    longitude: 77.1000,
    neighbouringDistricts: ["bengaluru-rural", "ramanagara", "mandya", "hassan", "chikkamagaluru", "chitradurga"]
  },
  {
    id: "chitradurga",
    name: "Chitradurga",
    normalizedName: "chitradurga",
    region: "central-karnataka",
    latitude: 14.2251,
    longitude: 76.4019,
    neighbouringDistricts: ["tumakuru", "chikkamagaluru", "davanagere", "ballari", "vijayanagara"]
  },
  {
    id: "davanagere",
    name: "Davanagere",
    normalizedName: "davanagere",
    region: "central-karnataka",
    latitude: 14.4644,
    longitude: 75.9218,
    neighbouringDistricts: ["chitradurga", "shivamogga", "haveri", "vijayanagara"]
  },
  {
    id: "haveri",
    name: "Haveri",
    normalizedName: "haveri",
    region: "central-karnataka",
    latitude: 14.7977,
    longitude: 75.4026,
    neighbouringDistricts: ["davanagere", "shivamogga", "uttara-kannada", "dharwad", "gadag", "vijayanagara"]
  },
  {
    id: "vijayanagara",
    name: "Vijayanagara",
    normalizedName: "vijayanagara",
    region: "heritage-circuit",
    latitude: 15.2689,
    longitude: 76.3909,
    neighbouringDistricts: ["ballari", "koppal", "gadag", "haveri", "davanagere", "chitradurga"]
  },
  {
    id: "ballari",
    name: "Ballari (Bellary)",
    normalizedName: "ballari",
    region: "kalyana-karnataka",
    latitude: 15.1394,
    longitude: 76.9214,
    neighbouringDistricts: ["vijayanagara", "koppal", "raichur", "chitradurga"]
  },
  {
    id: "bagalkote",
    name: "Bagalkote",
    normalizedName: "bagalkote",
    region: "north-karnataka",
    latitude: 16.1691,
    longitude: 75.6615,
    neighbouringDistricts: ["belagavi", "gadag", "koppal", "vijayapura", "raichur"]
  },
  {
    id: "belagavi",
    name: "Belagavi (Belgaum)",
    normalizedName: "belagavi",
    region: "north-karnataka",
    latitude: 15.8497,
    longitude: 74.4977,
    neighbouringDistricts: ["uttara-kannada", "dharwad", "bagalkote", "vijayapura"]
  },
  {
    id: "dharwad",
    name: "Dharwad (Hubballi-Dharwad)",
    normalizedName: "dharwad",
    region: "north-karnataka",
    latitude: 15.4589,
    longitude: 75.0078,
    neighbouringDistricts: ["belagavi", "uttara-kannada", "haveri", "gadag"]
  },
  {
    id: "gadag",
    name: "Gadag",
    normalizedName: "gadag",
    region: "north-karnataka",
    latitude: 15.4319,
    longitude: 75.6358,
    neighbouringDistricts: ["dharwad", "belagavi", "bagalkote", "koppal", "haveri", "vijayanagara"]
  },
  {
    id: "vijayapura",
    name: "Vijayapura (Bijapur)",
    normalizedName: "vijayapura",
    region: "north-karnataka",
    latitude: 16.8302,
    longitude: 75.7100,
    neighbouringDistricts: ["belagavi", "bagalkote", "kalaburagi", "yadgir"]
  },
  {
    id: "kalaburagi",
    name: "Kalaburagi (Gulbarga)",
    normalizedName: "kalaburagi",
    region: "kalyana-karnataka",
    latitude: 17.3297,
    longitude: 76.8343,
    neighbouringDistricts: ["bidar", "yadgir", "vijayapura"]
  },
  {
    id: "bidar",
    name: "Bidar",
    normalizedName: "bidar",
    region: "kalyana-karnataka",
    latitude: 17.9104,
    longitude: 77.5199,
    neighbouringDistricts: ["kalaburagi"]
  },
  {
    id: "raichur",
    name: "Raichur",
    normalizedName: "raichur",
    region: "kalyana-karnataka",
    latitude: 16.2076,
    longitude: 77.3463,
    neighbouringDistricts: ["yadgir", "koppal", "ballari", "bagalkote"]
  },
  {
    id: "koppal",
    name: "Koppal",
    normalizedName: "koppal",
    region: "kalyana-karnataka",
    latitude: 15.3463,
    longitude: 76.1558,
    neighbouringDistricts: ["gadag", "bagalkote", "raichur", "ballari", "vijayanagara"]
  },
  {
    id: "yadgir",
    name: "Yadgir",
    normalizedName: "yadgir",
    region: "kalyana-karnataka",
    latitude: 16.7644,
    longitude: 77.1378,
    neighbouringDistricts: ["kalaburagi", "raichur", "vijayapura"]
  }
];

// =========================================================================
// 3. COMPREHENSIVE TALUKS FOR ALL 31 DISTRICTS
// =========================================================================
const taluks = [
  // --- DAKSHINA KANNADA (Coastal) ---
  { id: "mangaluru", name: "Mangaluru", normalizedName: "mangaluru", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 10, latitude: 12.9141, longitude: 74.8560, neighbouringTaluks: ["ullal", "mulki", "bantwala", "moodbidri"], neighbouringDistricts: ["udupi"], nearbyTaluks: ["kapu", "belathangadi"] },
  { id: "ullal", name: "Ullal", normalizedName: "ullal", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 6, latitude: 12.8056, longitude: 74.8532, neighbouringTaluks: ["mangaluru", "bantwala"], neighbouringDistricts: [], nearbyTaluks: ["putturu"] },
  { id: "mulki", name: "Mulki", normalizedName: "mulki", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 7, latitude: 13.0905, longitude: 74.7932, neighbouringTaluks: ["mangaluru", "moodbidri"], neighbouringDistricts: ["udupi"], nearbyTaluks: ["kapu", "karkala"] },
  { id: "moodbidri", name: "Moodbidri", normalizedName: "moodbidri", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 13.0694, longitude: 74.9961, neighbouringTaluks: ["mangaluru", "mulki", "bantwala", "belathangadi"], neighbouringDistricts: ["udupi"], nearbyTaluks: ["karkala"] },
  { id: "bantwala", name: "Bantwala", normalizedName: "bantwala", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 12.8942, longitude: 75.0354, neighbouringTaluks: ["mangaluru", "ullal", "moodbidri", "belathangadi", "putturu"], neighbouringDistricts: [], nearbyTaluks: ["kadaba"] },
  { id: "belathangadi", name: "Belathangadi", normalizedName: "belathangadi", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "ghat", priorityForTravelClustering: 10, latitude: 12.9912, longitude: 75.2934, neighbouringTaluks: ["bantwala", "moodbidri", "putturu", "kadaba"], neighbouringDistricts: ["chikkamagaluru", "hassan"], nearbyTaluks: ["mangaluru", "karkala"] },
  { id: "putturu", name: "Putturu", normalizedName: "putturu", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.7667, longitude: 75.2000, neighbouringTaluks: ["bantwala", "belathangadi", "sulya", "kadaba"], neighbouringDistricts: ["kodagu"], nearbyTaluks: ["mangaluru"] },
  { id: "sulya", name: "Sulya", normalizedName: "sulya", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "ghat", priorityForTravelClustering: 8, latitude: 12.5606, longitude: 75.3883, neighbouringTaluks: ["putturu", "kadaba"], neighbouringDistricts: ["kodagu"], nearbyTaluks: ["madikeri"] },
  { id: "kadaba", name: "Kadaba", normalizedName: "kadaba", districtId: "dakshina-kannada", region: "coastal-karnataka", coastalOrInland: "ghat", priorityForTravelClustering: 10, latitude: 12.7183, longitude: 75.4667, neighbouringTaluks: ["sulya", "putturu", "belathangadi"], neighbouringDistricts: ["hassan", "kodagu"], nearbyTaluks: ["sakleshpur"] },

  // --- UDUPI (Coastal) ---
  { id: "udupi", name: "Udupi", normalizedName: "udupi", districtId: "udupi", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 10, latitude: 13.3409, longitude: 74.7421, neighbouringTaluks: ["kapu", "brahmavara"], neighbouringDistricts: [], nearbyTaluks: ["karkala", "kundapura", "mangaluru"] },
  { id: "kapu", name: "Kapu", normalizedName: "kapu", districtId: "udupi", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 8, latitude: 13.2208, longitude: 74.7416, neighbouringTaluks: ["udupi", "karkala"], neighbouringDistricts: ["dakshina-kannada"], nearbyTaluks: ["mulki", "mangaluru"] },
  { id: "brahmavara", name: "Brahmavara", normalizedName: "brahmavara", districtId: "udupi", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 6, latitude: 13.4358, longitude: 74.7505, neighbouringTaluks: ["udupi", "kundapura", "hebri"], neighbouringDistricts: [], nearbyTaluks: ["karkala"] },
  { id: "kundapura", name: "Kundapura", normalizedName: "kundapura", districtId: "udupi", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 9, latitude: 13.6291, longitude: 74.6908, neighbouringTaluks: ["brahmavara", "bynduru", "hebri"], neighbouringDistricts: ["shivamogga"], nearbyTaluks: ["bhatkal", "udupi"] },
  { id: "bynduru", name: "Bynduru", normalizedName: "bynduru", districtId: "udupi", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 8, latitude: 13.8687, longitude: 74.6297, neighbouringTaluks: ["kundapura"], neighbouringDistricts: ["uttara-kannada", "shivamogga"], nearbyTaluks: ["bhatkal"] },
  { id: "karkala", name: "Karkala", normalizedName: "karkala", districtId: "udupi", region: "coastal-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 13.2144, longitude: 74.9981, neighbouringTaluks: ["kapu", "hebri"], neighbouringDistricts: ["dakshina-kannada", "chikkamagaluru"], nearbyTaluks: ["moodbidri", "sringeri", "udupi"] },
  { id: "hebri", name: "Hebri", normalizedName: "hebri", districtId: "udupi", region: "coastal-karnataka", coastalOrInland: "ghat", priorityForTravelClustering: 7, latitude: 13.3486, longitude: 74.9961, neighbouringTaluks: ["karkala", "brahmavara", "kundapura"], neighbouringDistricts: ["shivamogga", "chikkamagaluru"], nearbyTaluks: ["thirthahalli", "agumbe"] },

  // --- UTTARA KANNADA (Coastal / Malnad) ---
  { id: "bhatkal", name: "Bhatkal", normalizedName: "bhatkal", districtId: "uttara-kannada", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 10, latitude: 13.9787, longitude: 74.5558, neighbouringTaluks: ["honnavar"], neighbouringDistricts: ["udupi", "shivamogga"], nearbyTaluks: ["bynduru", "kumta"] },
  { id: "honnavar", name: "Honnavar", normalizedName: "honnavar", districtId: "uttara-kannada", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 9, latitude: 14.2800, longitude: 74.4442, neighbouringTaluks: ["bhatkal", "kumta", "siddapura"], neighbouringDistricts: ["shivamogga"], nearbyTaluks: ["gokarna", "sagara"] },
  { id: "kumta", name: "Kumta", normalizedName: "kumta", districtId: "uttara-kannada", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 10, latitude: 14.4258, longitude: 74.4172, neighbouringTaluks: ["honnavar", "ankola", "sirsi"], neighbouringDistricts: [], nearbyTaluks: ["karwar", "bhatkal"] },
  { id: "ankola", name: "Ankola", normalizedName: "ankola", districtId: "uttara-kannada", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 7, latitude: 14.6644, longitude: 74.3000, neighbouringTaluks: ["kumta", "karwar", "yellapura"], neighbouringDistricts: [], nearbyTaluks: ["gokarna"] },
  { id: "karwar", name: "Karwar", normalizedName: "karwar", districtId: "uttara-kannada", region: "coastal-karnataka", coastalOrInland: "coastal", priorityForTravelClustering: 9, latitude: 14.8136, longitude: 74.1297, neighbouringTaluks: ["ankola", "joida"], neighbouringDistricts: ["goa"], nearbyTaluks: ["kumta"] },
  { id: "dandeli", name: "Dandeli", normalizedName: "dandeli", districtId: "uttara-kannada", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 9, latitude: 15.2361, longitude: 74.6173, neighbouringTaluks: ["haliyal", "joida"], neighbouringDistricts: ["belagavi", "dharwad"], nearbyTaluks: ["alnavar"] },
  { id: "joida", name: "Joida", normalizedName: "joida", districtId: "uttara-kannada", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 6, latitude: 15.1558, longitude: 74.4842, neighbouringTaluks: ["karwar", "dandeli", "yellapura"], neighbouringDistricts: ["belagavi"], nearbyTaluks: ["khanapur"] },
  { id: "haliyal", name: "Haliyal", normalizedName: "haliyal", districtId: "uttara-kannada", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.3300, longitude: 74.7600, neighbouringTaluks: ["dandeli", "yellapura"], neighbouringDistricts: ["dharwad", "belagavi"], nearbyTaluks: ["dharwad"] },
  { id: "sirsi", name: "Sirsi", normalizedName: "sirsi", districtId: "uttara-kannada", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 8, latitude: 14.6192, longitude: 74.8354, neighbouringTaluks: ["kumta", "siddapura", "yellapura"], neighbouringDistricts: ["haveri", "shivamogga"], nearbyTaluks: ["honnavar", "sagara"] },
  { id: "siddapura", name: "Siddapura", normalizedName: "siddapura", districtId: "uttara-kannada", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 7, latitude: 14.3361, longitude: 74.8872, neighbouringTaluks: ["sirsi", "honnavar"], neighbouringDistricts: ["shivamogga"], nearbyTaluks: ["jog-falls", "sagara"] },
  { id: "yellapura", name: "Yellapura", normalizedName: "yellapura", districtId: "uttara-kannada", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 7, latitude: 14.9644, longitude: 74.7125, neighbouringTaluks: ["ankola", "sirsi", "haliyal", "joida"], neighbouringDistricts: ["dharwad", "haveri"], nearbyTaluks: ["mundagodu"] },
  { id: "mundagodu", name: "Mundagodu", normalizedName: "mundagodu", districtId: "uttara-kannada", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 14.9667, longitude: 75.0333, neighbouringTaluks: ["sirsi", "yellapura"], neighbouringDistricts: ["haveri"], nearbyTaluks: ["hangal"] },

  // --- KODAGU (Malnad) ---
  { id: "madikeri", name: "Madikeri", normalizedName: "madikeri", districtId: "kodagu", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 10, latitude: 12.4244, longitude: 75.7382, neighbouringTaluks: ["somwarpet", "virajpet", "kushalnagar"], neighbouringDistricts: ["dakshina-kannada", "hassan", "mysuru"], nearbyTaluks: ["sulya", "sakleshpur"] },
  { id: "somwarpet", name: "Somwarpet", normalizedName: "somwarpet", districtId: "kodagu", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 7, latitude: 12.5972, longitude: 75.8661, neighbouringTaluks: ["madikeri", "kushalnagar"], neighbouringDistricts: ["hassan"], nearbyTaluks: ["sakleshpur", "arkalgud"] },
  { id: "virajpet", name: "Virajpet", normalizedName: "virajpet", districtId: "kodagu", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 8, latitude: 12.2000, longitude: 75.8000, neighbouringTaluks: ["madikeri", "ponnampet"], neighbouringDistricts: ["mysuru"], nearbyTaluks: ["hunsur", "heggadadevankote"] },
  { id: "kushalnagar", name: "Kushalnagar", normalizedName: "kushalnagar", districtId: "kodagu", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 12.4633, longitude: 75.9611, neighbouringTaluks: ["madikeri", "somwarpet", "ponnampet"], neighbouringDistricts: ["mysuru", "hassan"], nearbyTaluks: ["piriyapatna", "arkalgud"] },
  { id: "ponnampet", name: "Ponnampet", normalizedName: "ponnampet", districtId: "kodagu", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.1467, longitude: 75.9417, neighbouringTaluks: ["virajpet", "kushalnagar"], neighbouringDistricts: ["mysuru"], nearbyTaluks: ["hunsur"] },

  // --- CHIKKAMAGALURU (Malnad) ---
  { id: "chikkamagaluru", name: "Chikkamagaluru", normalizedName: "chikkamagaluru", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 10, latitude: 13.3153, longitude: 75.7754, neighbouringTaluks: ["mudigere", "tarikere", "kadur"], neighbouringDistricts: ["hassan", "shivamogga"], nearbyTaluks: ["belur", "sakleshpur"] },
  { id: "mudigere", name: "Mudigere", normalizedName: "mudigere", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 8, latitude: 13.1367, longitude: 75.6417, neighbouringTaluks: ["chikkamagaluru", "kalasa"], neighbouringDistricts: ["dakshina-kannada", "hassan"], nearbyTaluks: ["belathangadi", "sakleshpur"] },
  { id: "kalasa", name: "Kalasa", normalizedName: "kalasa", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 9, latitude: 13.2389, longitude: 75.3678, neighbouringTaluks: ["mudigere", "sringeri", "koppa"], neighbouringDistricts: ["dakshina-kannada", "udupi"], nearbyTaluks: ["karkala", "belathangadi"] },
  { id: "sringeri", name: "Sringeri", normalizedName: "sringeri", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 10, latitude: 13.4199, longitude: 75.2565, neighbouringTaluks: ["kalasa", "koppa", "narasimharajapura"], neighbouringDistricts: ["udupi", "shivamogga"], nearbyTaluks: ["karkala", "thirthahalli", "agumbe"] },
  { id: "koppa", name: "Koppa", normalizedName: "koppa", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 7, latitude: 13.5300, longitude: 75.3600, neighbouringTaluks: ["sringeri", "kalasa", "narasimharajapura"], neighbouringDistricts: ["shivamogga"], nearbyTaluks: ["thirthahalli"] },
  { id: "narasimharajapura", name: "Narasimharajapura", normalizedName: "narasimharajapura", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 6, latitude: 13.6231, longitude: 75.5200, neighbouringTaluks: ["koppa", "tarikere"], neighbouringDistricts: ["shivamogga"], nearbyTaluks: ["bhadravati"] },
  { id: "tarikere", name: "Tarikere", normalizedName: "tarikere", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.7114, longitude: 75.8144, neighbouringTaluks: ["chikkamagaluru", "kadur", "ajjampura"], neighbouringDistricts: ["shivamogga", "chitradurga"], nearbyTaluks: ["bhadravati"] },
  { id: "kadur", name: "Kadur", normalizedName: "kadur", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.5500, longitude: 76.0100, neighbouringTaluks: ["chikkamagaluru", "tarikere", "ajjampura"], neighbouringDistricts: ["hassan", "chitradurga"], nearbyTaluks: ["arsikere"] },
  { id: "ajjampura", name: "Ajjampura", normalizedName: "ajjampura", districtId: "chikkamagaluru", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.7300, longitude: 76.0200, neighbouringTaluks: ["tarikere", "kadur"], neighbouringDistricts: ["chitradurga", "davanagere"], nearbyTaluks: ["hosadurga"] },

  // --- HASSAN (Malnad / Mysore) ---
  { id: "hassan", name: "Hassan", normalizedName: "hassan", districtId: "hassan", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 13.0033, longitude: 76.1004, neighbouringTaluks: ["belur", "alur", "channarayapatna", "holenarasipura", "arsikere"], neighbouringDistricts: [], nearbyTaluks: ["sakleshpur"] },
  { id: "belur", name: "Belur", normalizedName: "belur", districtId: "hassan", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 13.1633, longitude: 75.8617, neighbouringTaluks: ["hassan", "alur"], neighbouringDistricts: ["chikkamagaluru"], nearbyTaluks: ["chikkamagaluru", "halebidu"] },
  { id: "sakleshpur", name: "Sakleshpur", normalizedName: "sakleshpur", districtId: "hassan", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 10, latitude: 12.9439, longitude: 75.7878, neighbouringTaluks: ["alur"], neighbouringDistricts: ["dakshina-kannada", "kodagu", "chikkamagaluru"], nearbyTaluks: ["belathangadi", "kadaba", "somwarpet"] },
  { id: "alur", name: "Alur", normalizedName: "alur", districtId: "hassan", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 12.9833, longitude: 75.9833, neighbouringTaluks: ["hassan", "sakleshpur", "belur", "arkalgud"], neighbouringDistricts: [], nearbyTaluks: ["hassan"] },
  { id: "arkalgud", name: "Arkalgud", normalizedName: "arkalgud", districtId: "hassan", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 12.7667, longitude: 76.0500, neighbouringTaluks: ["alur", "holenarasipura"], neighbouringDistricts: ["kodagu", "mysuru"], nearbyTaluks: ["kushalnagar"] },
  { id: "arsikere", name: "Arsikere", normalizedName: "arsikere", districtId: "hassan", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.3167, longitude: 76.2500, neighbouringTaluks: ["hassan", "channarayapatna"], neighbouringDistricts: ["chikkamagaluru", "tumakuru"], nearbyTaluks: ["kadur", "tiptur"] },
  { id: "channarayapatna", name: "Channarayapatna", normalizedName: "channarayapatna", districtId: "hassan", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 12.9000, longitude: 76.3833, neighbouringTaluks: ["hassan", "holenarasipura", "arsikere"], neighbouringDistricts: ["mandya", "tumakuru"], nearbyTaluks: ["shravanabelagola"] },
  { id: "holenarasipura", name: "Holenarasipura", normalizedName: "holenarasipura", districtId: "hassan", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 12.7833, longitude: 76.2500, neighbouringTaluks: ["hassan", "arkalgud", "channarayapatna"], neighbouringDistricts: ["mysuru", "mandya"], nearbyTaluks: ["krishnarajanagara"] },

  // --- SHIVAMOGGA (Malnad) ---
  { id: "shivamogga", name: "Shivamogga", normalizedName: "shivamogga", districtId: "shivamogga", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 13.9299, longitude: 75.5681, neighbouringTaluks: ["bhadravati", "thirthahalli", "sagara", "shikaripura"], neighbouringDistricts: ["davanagere", "chikkamagaluru"], nearbyTaluks: ["tarikere"] },
  { id: "bhadravati", name: "Bhadravati", normalizedName: "bhadravati", districtId: "shivamogga", region: "malnad-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.8400, longitude: 75.7000, neighbouringTaluks: ["shivamogga"], neighbouringDistricts: ["chikkamagaluru", "davanagere"], nearbyTaluks: ["tarikere"] },
  { id: "thirthahalli", name: "Thirthahalli", normalizedName: "thirthahalli", districtId: "shivamogga", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 9, latitude: 13.6936, longitude: 75.2417, neighbouringTaluks: ["shivamogga", "hosanagara"], neighbouringDistricts: ["udupi", "chikkamagaluru"], nearbyTaluks: ["sringeri", "agumbe", "hebri"] },
  { id: "sagara", name: "Sagara", normalizedName: "sagara", districtId: "shivamogga", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 10, latitude: 14.1667, longitude: 75.0333, neighbouringTaluks: ["hosanagara", "soraba", "shivamogga"], neighbouringDistricts: ["uttara-kannada"], nearbyTaluks: ["siddapura", "jog-falls", "honnavar"] },
  { id: "hosanagara", name: "Hosanagara", normalizedName: "hosanagara", districtId: "shivamogga", region: "malnad-region", coastalOrInland: "ghat", priorityForTravelClustering: 7, latitude: 13.9167, longitude: 75.0667, neighbouringTaluks: ["sagara", "thirthahalli"], neighbouringDistricts: ["udupi", "uttara-kannada"], nearbyTaluks: ["kundapura"] },
  { id: "shikaripura", name: "Shikaripura", normalizedName: "shikaripura", districtId: "shivamogga", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 14.2667, longitude: 75.3500, neighbouringTaluks: ["shivamogga", "soraba"], neighbouringDistricts: ["haveri"], nearbyTaluks: ["hirekerur"] },
  { id: "soraba", name: "Soraba", normalizedName: "soraba", districtId: "shivamogga", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.3833, longitude: 75.1000, neighbouringTaluks: ["sagara", "shikaripura"], neighbouringDistricts: ["uttara-kannada", "haveri"], nearbyTaluks: ["sirsi", "hangal"] },

  // --- MYSURU (Southern) ---
  { id: "mysuru", name: "Mysuru", normalizedName: "mysuru", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 12.2958, longitude: 76.6394, neighbouringTaluks: ["nanjangud", "hunsur", "tirumakudalu-narasipura", "krishnarajanagara"], neighbouringDistricts: ["mandya"], nearbyTaluks: ["srirangapatna"] },
  { id: "nanjangud", name: "Nanjangud", normalizedName: "nanjangud", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 12.1197, longitude: 76.6806, neighbouringTaluks: ["mysuru", "tirumakudalu-narasipura", "saragur"], neighbouringDistricts: ["chamarajanagar"], nearbyTaluks: ["gundlupet"] },
  { id: "hunsur", name: "Hunsur", normalizedName: "hunsur", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.3100, longitude: 76.2900, neighbouringTaluks: ["mysuru", "piriyapatna", "heggadadevankote"], neighbouringDistricts: ["kodagu"], nearbyTaluks: ["virajpet", "kushalnagar"] },
  { id: "piriyapatna", name: "Piriyapatna", normalizedName: "piriyapatna", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.3333, longitude: 76.1000, neighbouringTaluks: ["hunsur"], neighbouringDistricts: ["kodagu", "hassan"], nearbyTaluks: ["kushalnagar"] },
  { id: "heggadadevankote", name: "Heggadadevankote", normalizedName: "heggadadevankote", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 11.9167, longitude: 76.3167, neighbouringTaluks: ["hunsur", "saragur"], neighbouringDistricts: ["kodagu", "chamarajanagar"], nearbyTaluks: ["nagarhole", "bandipur"] },
  { id: "saragur", name: "Saragur", normalizedName: "saragur", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 11.9667, longitude: 76.4000, neighbouringTaluks: ["heggadadevankote", "nanjangud"], neighbouringDistricts: ["chamarajanagar"], nearbyTaluks: ["bandipur"] },
  { id: "krishnarajanagara", name: "Krishnarajanagara", normalizedName: "krishnarajanagara", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 12.5833, longitude: 76.3833, neighbouringTaluks: ["mysuru", "saligrama"], neighbouringDistricts: ["mandya", "hassan"], nearbyTaluks: ["krishnarajapet"] },
  { id: "saligrama", name: "Saligrama", normalizedName: "saligrama", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 12.6000, longitude: 76.2833, neighbouringTaluks: ["krishnarajanagara"], neighbouringDistricts: ["hassan"], nearbyTaluks: ["holenarasipura"] },
  { id: "tirumakudalu-narasipura", name: "Tirumakudalu Narasipura", normalizedName: "tirumakudalu narasipura", districtId: "mysuru", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 12.2167, longitude: 76.9000, neighbouringTaluks: ["mysuru", "nanjangud"], neighbouringDistricts: ["mandya", "chamarajanagar"], nearbyTaluks: ["malavalli", "kollegal"] },

  // --- MANDYA (Southern) ---
  { id: "srirangapatna", name: "Srirangapatna", normalizedName: "srirangapatna", districtId: "mandya", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 12.4237, longitude: 76.6946, neighbouringTaluks: ["mandya", "pandavapura"], neighbouringDistricts: ["mysuru"], nearbyTaluks: ["mysuru"] },
  { id: "mandya", name: "Mandya", normalizedName: "mandya", districtId: "mandya", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 12.5218, longitude: 76.8951, neighbouringTaluks: ["srirangapatna", "maddur", "malavalli", "pandavapura"], neighbouringDistricts: [], nearbyTaluks: ["mysuru", "channapatna"] },
  { id: "maddur", name: "Maddur", normalizedName: "maddur", districtId: "mandya", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.5833, longitude: 77.0500, neighbouringTaluks: ["mandya", "malavalli"], neighbouringDistricts: ["ramanagara"], nearbyTaluks: ["channapatna"] },
  { id: "malavalli", name: "Malavalli", normalizedName: "malavalli", districtId: "mandya", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 12.3833, longitude: 77.0500, neighbouringTaluks: ["mandya", "maddur"], neighbouringDistricts: ["chamarajanagar", "ramanagara"], nearbyTaluks: ["kollegal", "kanakapura"] },
  { id: "pandavapura", name: "Pandavapura", normalizedName: "pandavapura", districtId: "mandya", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.5000, longitude: 76.6667, neighbouringTaluks: ["srirangapatna", "mandya", "krishnarajapet", "nagamangala"], neighbouringDistricts: [], nearbyTaluks: ["mysuru"] },
  { id: "krishnarajapet", name: "Krishnarajapet", normalizedName: "krishnarajapet", districtId: "mandya", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 12.6667, longitude: 76.4833, neighbouringTaluks: ["pandavapura", "nagamangala"], neighbouringDistricts: ["hassan", "mysuru"], nearbyTaluks: ["holenarasipura"] },
  { id: "nagamangala", name: "Nagamangala", normalizedName: "nagamangala", districtId: "mandya", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.8167, longitude: 76.7500, neighbouringTaluks: ["pandavapura", "krishnarajapet", "mandya"], neighbouringDistricts: ["tumakuru", "hassan"], nearbyTaluks: ["bellur-cross"] },

  // --- CHAMARAJANAGAR (Southern) ---
  { id: "chamarajanagar", name: "Chamarajanagar", normalizedName: "chamarajanagar", districtId: "chamarajanagar", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 11.9261, longitude: 76.9437, neighbouringTaluks: ["gundlupet", "yelandur", "kollegal"], neighbouringDistricts: ["mysuru"], nearbyTaluks: ["nanjangud"] },
  { id: "gundlupet", name: "Gundlupet", normalizedName: "gundlupet", districtId: "chamarajanagar", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 11.8000, longitude: 76.6833, neighbouringTaluks: ["chamarajanagar"], neighbouringDistricts: ["mysuru"], nearbyTaluks: ["bandipur", "nanjangud"] },
  { id: "kollegal", name: "Kollegal", normalizedName: "kollegal", districtId: "chamarajanagar", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 12.1500, longitude: 77.1167, neighbouringTaluks: ["chamarajanagar", "yelandur", "hanur"], neighbouringDistricts: ["mandya", "ramanagara"], nearbyTaluks: ["malavalli"] },
  { id: "yelandur", name: "Yelandur", normalizedName: "yelandur", districtId: "chamarajanagar", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.0667, longitude: 77.0333, neighbouringTaluks: ["chamarajanagar", "kollegal"], neighbouringDistricts: [], nearbyTaluks: ["br-hills"] },
  { id: "hanur", name: "Hanur", normalizedName: "hanur", districtId: "chamarajanagar", region: "mysuru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.0833, longitude: 77.3000, neighbouringTaluks: ["kollegal"], neighbouringDistricts: ["ramanagara"], nearbyTaluks: ["male-mahadeshwara-hills"] },

  // --- BENGALURU URBAN (Bengaluru Region) ---
  { id: "bengaluru-north", name: "Bengaluru North", normalizedName: "bengaluru north", districtId: "bengaluru-urban", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 12.9716, longitude: 77.5946, neighbouringTaluks: ["bengaluru-south", "bengaluru-east", "yelahanka"], neighbouringDistricts: ["bengaluru-rural"], nearbyTaluks: ["devanahalli", "ramanagara"] },
  { id: "bengaluru-south", name: "Bengaluru South", normalizedName: "bengaluru south", districtId: "bengaluru-urban", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 12.9100, longitude: 77.5700, neighbouringTaluks: ["bengaluru-north", "anekal"], neighbouringDistricts: ["ramanagara"], nearbyTaluks: ["kanakapura"] },
  { id: "bengaluru-east", name: "Bengaluru East", normalizedName: "bengaluru east", districtId: "bengaluru-urban", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 12.9800, longitude: 77.6800, neighbouringTaluks: ["bengaluru-north", "yelahanka"], neighbouringDistricts: ["bengaluru-rural"], nearbyTaluks: ["hosakote"] },
  { id: "yelahanka", name: "Yelahanka", normalizedName: "yelahanka", districtId: "bengaluru-urban", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 13.1007, longitude: 77.5963, neighbouringTaluks: ["bengaluru-north", "bengaluru-east"], neighbouringDistricts: ["bengaluru-rural"], nearbyTaluks: ["devanahalli"] },
  { id: "anekal", name: "Anekal", normalizedName: "anekal", districtId: "bengaluru-urban", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 12.7100, longitude: 77.7000, neighbouringTaluks: ["bengaluru-south"], neighbouringDistricts: ["ramanagara"], nearbyTaluks: ["bannerghatta"] },

  // --- BENGALURU RURAL (Bengaluru Region) ---
  { id: "devanahalli", name: "Devanahalli", normalizedName: "devanahalli", districtId: "bengaluru-rural", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 13.2483, longitude: 77.7125, neighbouringTaluks: ["doddaballapura", "hosakote"], neighbouringDistricts: ["bengaluru-urban", "chikkaballapura"], nearbyTaluks: ["nandi-hills"] },
  { id: "doddaballapura", name: "Doddaballapura", normalizedName: "doddaballapura", districtId: "bengaluru-rural", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 13.2928, longitude: 77.5431, neighbouringTaluks: ["devanahalli", "nelamangala"], neighbouringDistricts: ["chikkaballapura", "tumakuru"], nearbyTaluks: ["chikkaballapura"] },
  { id: "hosakote", name: "Hosakote", normalizedName: "hosakote", districtId: "bengaluru-rural", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.0700, longitude: 77.8000, neighbouringTaluks: ["devanahalli"], neighbouringDistricts: ["bengaluru-urban", "kolar"], nearbyTaluks: ["kolar"] },
  { id: "nelamangala", name: "Nelamangala", normalizedName: "nelamangala", districtId: "bengaluru-rural", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 13.0989, longitude: 77.3917, neighbouringTaluks: ["doddaballapura"], neighbouringDistricts: ["bengaluru-urban", "tumakuru", "ramanagara"], nearbyTaluks: ["tumakuru", "magadi"] },

  // --- RAMANAGARA (Bengaluru Region) ---
  { id: "ramanagara", name: "Ramanagara", normalizedName: "ramanagara", districtId: "ramanagara", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 12.7209, longitude: 77.2799, neighbouringTaluks: ["channapatna", "magadi", "kanakapura"], neighbouringDistricts: ["bengaluru-urban", "tumakuru"], nearbyTaluks: ["bengaluru-south"] },
  { id: "channapatna", name: "Channapatna", normalizedName: "channapatna", districtId: "ramanagara", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 12.6517, longitude: 77.2089, neighbouringTaluks: ["ramanagara", "kanakapura"], neighbouringDistricts: ["mandya"], nearbyTaluks: ["maddur"] },
  { id: "kanakapura", name: "Kanakapura", normalizedName: "kanakapura", districtId: "ramanagara", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 12.5461, longitude: 77.4178, neighbouringTaluks: ["ramanagara", "channapatna", "harohalli"], neighbouringDistricts: ["bengaluru-urban", "mandya", "chamarajanagar"], nearbyTaluks: ["mekedatu", "malavalli"] },
  { id: "magadi", name: "Magadi", normalizedName: "magadi", districtId: "ramanagara", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.9600, longitude: 77.2200, neighbouringTaluks: ["ramanagara"], neighbouringDistricts: ["bengaluru-rural", "tumakuru"], nearbyTaluks: ["nelamangala", "kunigal"] },
  { id: "harohalli", name: "Harohalli", normalizedName: "harohalli", districtId: "ramanagara", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.6667, longitude: 77.4667, neighbouringTaluks: ["kanakapura", "ramanagara"], neighbouringDistricts: ["bengaluru-urban"], nearbyTaluks: ["anekal"] },

  // --- CHIKKABALLAPURA (Bengaluru Region) ---
  { id: "chikkaballapura", name: "Chikkaballapura", normalizedName: "chikkaballapura", districtId: "chikkaballapura", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 13.4325, longitude: 77.7275, neighbouringTaluks: ["sidlaghatta", "gauribidanur", "gudibanda"], neighbouringDistricts: ["bengaluru-rural"], nearbyTaluks: ["nandi-hills", "devanahalli"] },
  { id: "gauribidanur", name: "Gauribidanur", normalizedName: "gauribidanur", districtId: "chikkaballapura", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.6167, longitude: 77.5167, neighbouringTaluks: ["chikkaballapura", "gudibanda"], neighbouringDistricts: ["tumakuru"], nearbyTaluks: ["madhugiri"] },
  { id: "bagepalli", name: "Bagepalli", normalizedName: "bagepalli", districtId: "chikkaballapura", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.7833, longitude: 77.7833, neighbouringTaluks: ["gudibanda", "chintamani"], neighbouringDistricts: [], nearbyTaluks: ["chikkaballapura"] },
  { id: "chintamani", name: "Chintamani", normalizedName: "chintamani", districtId: "chikkaballapura", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.4000, longitude: 78.0667, neighbouringTaluks: ["sidlaghatta", "bagepalli"], neighbouringDistricts: ["kolar"], nearbyTaluks: ["srinivaspura"] },
  { id: "sidlaghatta", name: "Sidlaghatta", normalizedName: "sidlaghatta", districtId: "chikkaballapura", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.3833, longitude: 77.8667, neighbouringTaluks: ["chikkaballapura", "chintamani"], neighbouringDistricts: ["bengaluru-rural"], nearbyTaluks: ["hosakote"] },
  { id: "gudibanda", name: "Gudibanda", normalizedName: "gudibanda", districtId: "chikkaballapura", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.6667, longitude: 77.7000, neighbouringTaluks: ["chikkaballapura", "bagepalli", "gauribidanur"], neighbouringDistricts: [], nearbyTaluks: ["chikkaballapura"] },

  // --- KOLAR (Bengaluru Region) ---
  { id: "kolar", name: "Kolar", normalizedName: "kolar", districtId: "kolar", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 13.1378, longitude: 78.1292, neighbouringTaluks: ["bangarapet", "malur", "mulbagal", "srinivaspura"], neighbouringDistricts: ["bengaluru-rural", "chikkaballapura"], nearbyTaluks: ["hosakote"] },
  { id: "bangarapet", name: "Bangarapet", normalizedName: "bangarapet", districtId: "kolar", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 12.9833, longitude: 78.2000, neighbouringTaluks: ["kolar", "kgf", "malur"], neighbouringDistricts: [], nearbyTaluks: ["kgf"] },
  { id: "kgf", name: "KGF (Robertsonpet)", normalizedName: "kgf", districtId: "kolar", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 12.9569, longitude: 78.2725, neighbouringTaluks: ["bangarapet"], neighbouringDistricts: [], nearbyTaluks: ["bangarapet"] },
  { id: "malur", name: "Malur", normalizedName: "malur", districtId: "kolar", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.0000, longitude: 77.9333, neighbouringTaluks: ["kolar", "bangarapet"], neighbouringDistricts: ["bengaluru-rural"], nearbyTaluks: ["hosakote"] },
  { id: "mulbagal", name: "Mulbagal", normalizedName: "mulbagal", districtId: "kolar", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 13.1667, longitude: 78.4000, neighbouringTaluks: ["kolar", "srinivaspura"], neighbouringDistricts: [], nearbyTaluks: ["kolar"] },
  { id: "srinivaspura", name: "Srinivaspura", normalizedName: "srinivaspura", districtId: "kolar", region: "bengaluru-region", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.3333, longitude: 78.2167, neighbouringTaluks: ["kolar", "mulbagal"], neighbouringDistricts: ["chikkaballapura"], nearbyTaluks: ["chintamani"] },

  // --- TUMAKURU (Central) ---
  { id: "tumakuru", name: "Tumakuru", normalizedName: "tumakuru", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 13.3400, longitude: 77.1000, neighbouringTaluks: ["gubbi", "koratagere", "kunigal"], neighbouringDistricts: ["bengaluru-rural"], nearbyTaluks: ["nelamangala"] },
  { id: "kunigal", name: "Kunigal", normalizedName: "kunigal", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.0200, longitude: 77.0300, neighbouringTaluks: ["tumakuru", "turuvekere"], neighbouringDistricts: ["ramanagara", "mandya"], nearbyTaluks: ["magadi"] },
  { id: "koratagere", name: "Koratagere", normalizedName: "koratagere", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 13.5200, longitude: 77.2300, neighbouringTaluks: ["tumakuru", "madhugiri"], neighbouringDistricts: ["chikkaballapura"], nearbyTaluks: ["devarayanadurga"] },
  { id: "madhugiri", name: "Madhugiri", normalizedName: "madhugiri", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 13.6600, longitude: 77.2100, neighbouringTaluks: ["koratagere", "pavagada", "sira"], neighbouringDistricts: ["chikkaballapura"], nearbyTaluks: ["gauribidanur"] },
  { id: "sira", name: "Sira", normalizedName: "sira", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.7400, longitude: 76.9000, neighbouringTaluks: ["madhugiri", "tumakuru", "chiknayakanhalli"], neighbouringDistricts: ["chitradurga"], nearbyTaluks: ["hiriyur"] },
  { id: "tiptur", name: "Tiptur", normalizedName: "tiptur", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 13.2600, longitude: 76.4800, neighbouringTaluks: ["turuvekere", "chiknayakanhalli"], neighbouringDistricts: ["hassan"], nearbyTaluks: ["arsikere"] },
  { id: "turuvekere", name: "Turuvekere", normalizedName: "turuvekere", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.1600, longitude: 76.6700, neighbouringTaluks: ["tiptur", "kunigal", "gubbi"], neighbouringDistricts: ["mandya"], nearbyTaluks: ["nagamangala"] },
  { id: "gubbi", name: "Gubbi", normalizedName: "gubbi", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.3100, longitude: 76.9400, neighbouringTaluks: ["tumakuru", "turuvekere", "chiknayakanhalli"], neighbouringDistricts: [], nearbyTaluks: ["tumakuru"] },
  { id: "chiknayakanhalli", name: "Chiknayakanhalli", normalizedName: "chiknayakanhalli", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 13.4200, longitude: 76.6200, neighbouringTaluks: ["tiptur", "gubbi", "sira"], neighbouringDistricts: ["chitradurga"], nearbyTaluks: ["hosadurga"] },
  { id: "pavagada", name: "Pavagada", normalizedName: "pavagada", districtId: "tumakuru", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 14.1000, longitude: 77.2800, neighbouringTaluks: ["madhugiri"], neighbouringDistricts: [], nearbyTaluks: ["challakere"] },

  // --- CHITRADURGA (Central) ---
  { id: "chitradurga", name: "Chitradurga", normalizedName: "chitradurga", districtId: "chitradurga", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 14.2251, longitude: 76.4019, neighbouringTaluks: ["challakere", "holalkere", "hiriyur"], neighbouringDistricts: ["davanagere", "tumakuru"], nearbyTaluks: ["davanagere"] },
  { id: "challakere", name: "Challakere", normalizedName: "challakere", districtId: "chitradurga", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.3167, longitude: 76.6500, neighbouringTaluks: ["chitradurga", "molakalmuru"], neighbouringDistricts: ["ballari"], nearbyTaluks: ["ballari"] },
  { id: "hiriyur", name: "Hiriyur", normalizedName: "hiriyur", districtId: "chitradurga", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.9500, longitude: 76.6167, neighbouringTaluks: ["chitradurga", "hosadurga"], neighbouringDistricts: ["tumakuru"], nearbyTaluks: ["sira"] },
  { id: "holalkere", name: "Holalkere", normalizedName: "holalkere", districtId: "chitradurga", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.0333, longitude: 76.1833, neighbouringTaluks: ["chitradurga", "hosadurga"], neighbouringDistricts: ["davanagere"], nearbyTaluks: ["channagiri"] },
  { id: "hosadurga", name: "Hosadurga", normalizedName: "hosadurga", districtId: "chitradurga", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 13.8000, longitude: 76.2833, neighbouringTaluks: ["holalkere", "hiriyur"], neighbouringDistricts: ["chikkamagaluru", "tumakuru"], nearbyTaluks: ["tarikere"] },
  { id: "molakalmuru", name: "Molakalmuru", normalizedName: "molakalmuru", districtId: "chitradurga", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.7333, longitude: 76.7500, neighbouringTaluks: ["challakere"], neighbouringDistricts: ["ballari"], nearbyTaluks: ["ballari"] },

  // --- DAVANAGERE (Central) ---
  { id: "davanagere", name: "Davanagere", normalizedName: "davanagere", districtId: "davanagere", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 14.4644, longitude: 75.9218, neighbouringTaluks: ["harihara", "channagiri", "jagalur"], neighbouringDistricts: ["haveri", "chitradurga"], nearbyTaluks: ["ranibennur"] },
  { id: "harihara", name: "Harihara", normalizedName: "harihara", districtId: "davanagere", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 14.5167, longitude: 75.8000, neighbouringTaluks: ["davanagere"], neighbouringDistricts: ["haveri"], nearbyTaluks: ["ranibennur"] },
  { id: "channagiri", name: "Channagiri", normalizedName: "channagiri", districtId: "davanagere", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 14.0300, longitude: 75.9300, neighbouringTaluks: ["davanagere", "honnali"], neighbouringDistricts: ["shivamogga", "chitradurga"], nearbyTaluks: ["bhadravati"] },
  { id: "honnali", name: "Honnali", normalizedName: "honnali", districtId: "davanagere", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.2400, longitude: 75.6400, neighbouringTaluks: ["davanagere", "nyamathi", "channagiri"], neighbouringDistricts: ["shivamogga", "haveri"], nearbyTaluks: ["shivamogga"] },
  { id: "nyamathi", name: "Nyamathi", normalizedName: "nyamathi", districtId: "davanagere", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.1500, longitude: 75.5800, neighbouringTaluks: ["honnali"], neighbouringDistricts: ["shivamogga"], nearbyTaluks: ["shivamogga"] },
  { id: "jagalur", name: "Jagalur", normalizedName: "jagalur", districtId: "davanagere", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.5300, longitude: 76.3500, neighbouringTaluks: ["davanagere"], neighbouringDistricts: ["chitradurga", "vijayanagara"], nearbyTaluks: ["kotturu"] },

  // --- HAVERI (Central) ---
  { id: "haveri", name: "Haveri", normalizedName: "haveri", districtId: "haveri", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 14.7977, longitude: 75.4026, neighbouringTaluks: ["byadgi", "shiggaon", "ranibennur", "hangal"], neighbouringDistricts: ["gadag"], nearbyTaluks: ["davanagere"] },
  { id: "ranibennur", name: "Ranibennur", normalizedName: "ranibennur", districtId: "haveri", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 14.6200, longitude: 75.6200, neighbouringTaluks: ["byadgi", "haveri"], neighbouringDistricts: ["davanagere"], nearbyTaluks: ["harihara", "davanagere"] },
  { id: "byadgi", name: "Byadgi", normalizedName: "byadgi", districtId: "haveri", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 14.6800, longitude: 75.4900, neighbouringTaluks: ["haveri", "ranibennur", "hirekerur"], neighbouringDistricts: [], nearbyTaluks: ["haveri"] },
  { id: "hangal", name: "Hangal", normalizedName: "hangal", districtId: "haveri", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 14.7600, longitude: 75.1300, neighbouringTaluks: ["haveri", "shiggaon"], neighbouringDistricts: ["uttara-kannada", "shivamogga"], nearbyTaluks: ["sirsi", "soraba"] },
  { id: "shiggaon", name: "Shiggaon", normalizedName: "shiggaon", districtId: "haveri", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.9900, longitude: 75.2300, neighbouringTaluks: ["haveri", "savanur", "hangal"], neighbouringDistricts: ["dharwad"], nearbyTaluks: ["hubballi-rural"] },
  { id: "savanur", name: "Savanur", normalizedName: "savanur", districtId: "haveri", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.9700, longitude: 75.3400, neighbouringTaluks: ["shiggaon", "haveri"], neighbouringDistricts: ["gadag"], nearbyTaluks: ["shirahatti"] },
  { id: "hirekerur", name: "Hirekerur", normalizedName: "hirekerur", districtId: "haveri", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.4600, longitude: 75.3900, neighbouringTaluks: ["byadgi", "rattihalli"], neighbouringDistricts: ["shivamogga"], nearbyTaluks: ["shikaripura"] },
  { id: "rattihalli", name: "Rattihalli", normalizedName: "rattihalli", districtId: "haveri", region: "central-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.4200, longitude: 75.5200, neighbouringTaluks: ["hirekerur", "byadgi"], neighbouringDistricts: ["davanagere"], nearbyTaluks: ["harihara"] },

  // --- VIJAYANAGARA (Heritage) ---
  { id: "hosapete", name: "Hosapete (Hospet)", normalizedName: "hosapete", districtId: "vijayanagara", region: "heritage-circuit", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 15.2689, longitude: 76.3909, neighbouringTaluks: ["hagaribommanahalli", "kampli"], neighbouringDistricts: ["koppal", "ballari"], nearbyTaluks: ["hampi", "gangavathi"] },
  { id: "hagaribommanahalli", name: "Hagaribommanahalli", normalizedName: "hagaribommanahalli", districtId: "vijayanagara", region: "heritage-circuit", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.0800, longitude: 76.2000, neighbouringTaluks: ["hosapete", "kotturu"], neighbouringDistricts: ["koppal"], nearbyTaluks: ["hosapete"] },
  { id: "harapanahalli", name: "Harapanahalli", normalizedName: "harapanahalli", districtId: "vijayanagara", region: "heritage-circuit", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.8000, longitude: 75.9800, neighbouringTaluks: ["hoovina-hadagali", "kotturu"], neighbouringDistricts: ["davanagere", "haveri"], nearbyTaluks: ["harihara"] },
  { id: "hoovina-hadagali", name: "Hoovina Hadagali", normalizedName: "hoovina hadagali", districtId: "vijayanagara", region: "heritage-circuit", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.0200, longitude: 75.9500, neighbouringTaluks: ["harapanahalli", "hagaribommanahalli"], neighbouringDistricts: ["haveri", "gadag"], nearbyTaluks: ["mundargi"] },
  { id: "kotturu", name: "Kotturu", normalizedName: "kotturu", districtId: "vijayanagara", region: "heritage-circuit", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 14.9300, longitude: 76.2200, neighbouringTaluks: ["kudligi", "harapanahalli", "hagaribommanahalli"], neighbouringDistricts: ["davanagere"], nearbyTaluks: ["jagalur"] },
  { id: "kudligi", name: "Kudligi", normalizedName: "kudligi", districtId: "vijayanagara", region: "heritage-circuit", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 14.9000, longitude: 76.3800, neighbouringTaluks: ["kotturu", "hosapete"], neighbouringDistricts: ["ballari", "chitradurga"], nearbyTaluks: ["sandur"] },

  // --- BALLARI (Kalyana Karnataka) ---
  { id: "ballari", name: "Ballari", normalizedName: "ballari", districtId: "ballari", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 15.1394, longitude: 76.9214, neighbouringTaluks: ["sandur", "siruguppa", "kurugodu"], neighbouringDistricts: ["vijayanagara"], nearbyTaluks: ["hosapete"] },
  { id: "sandur", name: "Sandur", normalizedName: "sandur", districtId: "ballari", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 15.0800, longitude: 76.5500, neighbouringTaluks: ["ballari", "kudligi"], neighbouringDistricts: ["vijayanagara"], nearbyTaluks: ["hosapete"] },
  { id: "siruguppa", name: "Siruguppa", normalizedName: "siruguppa", districtId: "ballari", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.6300, longitude: 76.9000, neighbouringTaluks: ["ballari", "kampli"], neighbouringDistricts: ["raichur", "koppal"], nearbyTaluks: ["sindhanur"] },
  { id: "kampli", name: "Kampli", normalizedName: "kampli", districtId: "ballari", region: "heritage-circuit", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 15.4000, longitude: 76.6000, neighbouringTaluks: ["kurugodu", "siruguppa"], neighbouringDistricts: ["vijayanagara", "koppal"], nearbyTaluks: ["hosapete", "gangavathi"] },
  { id: "kurugodu", name: "Kurugodu", normalizedName: "kurugodu", districtId: "ballari", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.3500, longitude: 76.8200, neighbouringTaluks: ["ballari", "kampli"], neighbouringDistricts: [], nearbyTaluks: ["ballari"] },

  // --- BAGALKOTE (North Karnataka) ---
  { id: "badami", name: "Badami", normalizedName: "badami", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 15.9189, longitude: 75.6766, neighbouringTaluks: ["bagalkote", "guledagudda", "hungund"], neighbouringDistricts: ["gadag", "belagavi"], nearbyTaluks: ["pattadakal", "aihole", "ron"] },
  { id: "bagalkote", name: "Bagalkote", normalizedName: "bagalkote", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 16.1691, longitude: 75.6615, neighbouringTaluks: ["badami", "bilagi", "guledagudda"], neighbouringDistricts: ["vijayapura"], nearbyTaluks: ["badami"] },
  { id: "hungund", name: "Hungund", normalizedName: "hungund", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 16.0600, longitude: 76.0600, neighbouringTaluks: ["badami", "ilkal"], neighbouringDistricts: ["koppal", "raichur"], nearbyTaluks: ["aihole", "pattadakal"] },
  { id: "ilkal", name: "Ilkal", normalizedName: "ilkal", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 15.9600, longitude: 76.1300, neighbouringTaluks: ["hungund"], neighbouringDistricts: ["koppal"], nearbyTaluks: ["kushtagi"] },
  { id: "guledagudda", name: "Guledagudda", normalizedName: "guledagudda", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 16.0500, longitude: 75.7800, neighbouringTaluks: ["badami", "bagalkote"], neighbouringDistricts: [], nearbyTaluks: ["badami"] },
  { id: "bilagi", name: "Bilagi", normalizedName: "bilagi", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.3500, longitude: 75.6200, neighbouringTaluks: ["bagalkote", "mudhol"], neighbouringDistricts: ["vijayapura"], nearbyTaluks: ["bagalkote"] },
  { id: "mudhol", name: "Mudhol", normalizedName: "mudhol", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 16.3400, longitude: 75.2800, neighbouringTaluks: ["jamkhandi", "bilagi"], neighbouringDistricts: ["belagavi"], nearbyTaluks: ["gokak"] },
  { id: "jamkhandi", name: "Jamkhandi", normalizedName: "jamkhandi", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 16.5100, longitude: 75.3000, neighbouringTaluks: ["mudhol", "rabkavi-banhatti"], neighbouringDistricts: ["vijayapura", "belagavi"], nearbyTaluks: ["athani"] },
  { id: "rabkavi-banhatti", name: "Rabkavi Banhatti", normalizedName: "rabkavi banhatti", districtId: "bagalkote", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.4800, longitude: 75.1200, neighbouringTaluks: ["jamkhandi"], neighbouringDistricts: ["belagavi"], nearbyTaluks: ["raybag"] },

  // --- BELAGAVI (North Karnataka) ---
  { id: "belagavi", name: "Belagavi", normalizedName: "belagavi", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 15.8497, longitude: 74.4977, neighbouringTaluks: ["khanapur", "bailhongal", "hukkeri"], neighbouringDistricts: ["uttara-kannada", "dharwad"], nearbyTaluks: ["dandeli"] },
  { id: "gokak", name: "Gokak", normalizedName: "gokak", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 16.1667, longitude: 74.8333, neighbouringTaluks: ["mudalagi", "hukkeri", "saundatti"], neighbouringDistricts: ["bagalkote"], nearbyTaluks: ["gokak-falls"] },
  { id: "bailhongal", name: "Bailhongal", normalizedName: "bailhongal", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 15.8200, longitude: 74.8600, neighbouringTaluks: ["belagavi", "kittur", "saundatti"], neighbouringDistricts: ["dharwad"], nearbyTaluks: ["dharwad"] },
  { id: "kittur", name: "Kittur", normalizedName: "kittur", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 15.6000, longitude: 74.7900, neighbouringTaluks: ["bailhongal", "khanapur"], neighbouringDistricts: ["dharwad"], nearbyTaluks: ["dharwad", "alnavar"] },
  { id: "khanapur", name: "Khanapur", normalizedName: "khanapur", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "ghat", priorityForTravelClustering: 7, latitude: 15.6300, longitude: 74.5200, neighbouringTaluks: ["belagavi", "kittur"], neighbouringDistricts: ["uttara-kannada"], nearbyTaluks: ["joida", "dandeli"] },
  { id: "saundatti", name: "Saundatti (Yellamma)", normalizedName: "saundatti", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 15.7700, longitude: 75.1200, neighbouringTaluks: ["bailhongal", "ramdurg"], neighbouringDistricts: ["dharwad", "gadag"], nearbyTaluks: ["navalgund", "nargund"] },
  { id: "ramdurg", name: "Ramdurg", normalizedName: "ramdurg", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.9500, longitude: 75.3000, neighbouringTaluks: ["saundatti", "gokak"], neighbouringDistricts: ["bagalkote"], nearbyTaluks: ["badami"] },
  { id: "hukkeri", name: "Hukkeri", normalizedName: "hukkeri", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.2300, longitude: 74.6000, neighbouringTaluks: ["belagavi", "gokak", "chikkodi"], neighbouringDistricts: [], nearbyTaluks: ["gokak"] },
  { id: "chikkodi", name: "Chikkodi", normalizedName: "chikkodi", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 16.4300, longitude: 74.6000, neighbouringTaluks: ["hukkeri", "nippani", "raybag"], neighbouringDistricts: [], nearbyTaluks: ["nippani"] },
  { id: "nippani", name: "Nippani", normalizedName: "nippani", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 16.4000, longitude: 74.3800, neighbouringTaluks: ["chikkodi"], neighbouringDistricts: [], nearbyTaluks: ["kolhapur"] },
  { id: "athani", name: "Athani", normalizedName: "athani", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.7300, longitude: 75.0600, neighbouringTaluks: ["raybag"], neighbouringDistricts: ["vijayapura", "bagalkote"], nearbyTaluks: ["jamkhandi"] },
  { id: "raybag", name: "Raybag", normalizedName: "raybag", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.5000, longitude: 74.7800, neighbouringTaluks: ["chikkodi", "athani", "mudalagi"], neighbouringDistricts: ["bagalkote"], nearbyTaluks: ["mudhol"] },
  { id: "mudalagi", name: "Mudalagi", normalizedName: "mudalagi", districtId: "belagavi", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.3200, longitude: 75.0300, neighbouringTaluks: ["gokak", "raybag"], neighbouringDistricts: ["bagalkote"], nearbyTaluks: ["gokak"] },

  // --- DHARWAD (North Karnataka) ---
  { id: "dharwad", name: "Dharwad", normalizedName: "dharwad", districtId: "dharwad", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 15.4589, longitude: 75.0078, neighbouringTaluks: ["hubballi-urban", "hubballi-rural", "kalghatgi", "alnavar"], neighbouringDistricts: ["belagavi", "uttara-kannada"], nearbyTaluks: ["dandeli", "kittur"] },
  { id: "hubballi-urban", name: "Hubballi Urban", normalizedName: "hubballi urban", districtId: "dharwad", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 15.3647, longitude: 75.1240, neighbouringTaluks: ["dharwad", "hubballi-rural"], neighbouringDistricts: ["gadag"], nearbyTaluks: ["gadag"] },
  { id: "hubballi-rural", name: "Hubballi Rural", normalizedName: "hubballi rural", districtId: "dharwad", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.3400, longitude: 75.1800, neighbouringTaluks: ["hubballi-urban", "kundgol", "navalgund"], neighbouringDistricts: ["haveri"], nearbyTaluks: ["shiggaon"] },
  { id: "kalghatgi", name: "Kalghatgi", normalizedName: "kalghatgi", districtId: "dharwad", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.1800, longitude: 74.9700, neighbouringTaluks: ["dharwad", "hubballi-rural"], neighbouringDistricts: ["uttara-kannada", "haveri"], nearbyTaluks: ["yellapura"] },
  { id: "kundgol", name: "Kundgol", normalizedName: "kundgol", districtId: "dharwad", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.2500, longitude: 75.2500, neighbouringTaluks: ["hubballi-rural"], neighbouringDistricts: ["haveri", "gadag"], nearbyTaluks: ["shirahatti"] },
  { id: "navalgund", name: "Navalgund", normalizedName: "navalgund", districtId: "dharwad", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.5600, longitude: 75.3600, neighbouringTaluks: ["hubballi-rural"], neighbouringDistricts: ["gadag", "belagavi"], nearbyTaluks: ["nargund"] },
  { id: "alnavar", name: "Alnavar", normalizedName: "alnavar", districtId: "dharwad", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 15.4300, longitude: 74.7300, neighbouringTaluks: ["dharwad"], neighbouringDistricts: ["uttara-kannada", "belagavi"], nearbyTaluks: ["dandeli", "haliyal"] },

  // --- GADAG (North Karnataka) ---
  { id: "gadag", name: "Gadag", normalizedName: "gadag", districtId: "gadag", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 15.4319, longitude: 75.6358, neighbouringTaluks: ["ron", "shirahatti", "mundargi"], neighbouringDistricts: ["dharwad", "koppal"], nearbyTaluks: ["hubballi-urban"] },
  { id: "ron", name: "Ron", normalizedName: "ron", districtId: "gadag", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 15.7000, longitude: 75.7300, neighbouringTaluks: ["gadag", "gajendragad", "nargund"], neighbouringDistricts: ["bagalkote"], nearbyTaluks: ["badami"] },
  { id: "nargund", name: "Nargund", normalizedName: "nargund", districtId: "gadag", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.7200, longitude: 75.3900, neighbouringTaluks: ["ron"], neighbouringDistricts: ["dharwad", "belagavi", "bagalkote"], nearbyTaluks: ["navalgund", "saundatti"] },
  { id: "shirahatti", name: "Shirahatti", normalizedName: "shirahatti", districtId: "gadag", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.2300, longitude: 75.5800, neighbouringTaluks: ["gadag", "lakshmeshwar", "mundargi"], neighbouringDistricts: ["haveri"], nearbyTaluks: ["savanur"] },
  { id: "mundargi", name: "Mundargi", normalizedName: "mundargi", districtId: "gadag", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.2100, longitude: 75.8800, neighbouringTaluks: ["gadag", "shirahatti"], neighbouringDistricts: ["koppal", "vijayanagara"], nearbyTaluks: ["hoovina-hadagali"] },
  { id: "gajendragad", name: "Gajendragad", normalizedName: "gajendragad", districtId: "gadag", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 15.7300, longitude: 75.9800, neighbouringTaluks: ["ron"], neighbouringDistricts: ["bagalkote", "koppal"], nearbyTaluks: ["badami", "ilkal"] },
  { id: "lakshmeshwar", name: "Lakshmeshwar", normalizedName: "lakshmeshwar", districtId: "gadag", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 15.1300, longitude: 75.4700, neighbouringTaluks: ["shirahatti"], neighbouringDistricts: ["haveri"], nearbyTaluks: ["haveri"] },

  // --- VIJAYAPURA (North Karnataka) ---
  { id: "vijayapura", name: "Vijayapura (Bijapur)", normalizedName: "vijayapura", districtId: "vijayapura", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 16.8302, longitude: 75.7100, neighbouringTaluks: ["basavana-bagewadi", "indi", "tikota", "babaleshwar"], neighbouringDistricts: ["bagalkote", "kalaburagi"], nearbyTaluks: ["bagalkote"] },
  { id: "basavana-bagewadi", name: "Basavana Bagewadi", normalizedName: "basavana bagewadi", districtId: "vijayapura", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 16.5800, longitude: 75.9700, neighbouringTaluks: ["vijayapura", "kolhar", "nidagundi", "muddebihal"], neighbouringDistricts: ["bagalkote"], nearbyTaluks: ["bilagi"] },
  { id: "indi", name: "Indi", normalizedName: "indi", districtId: "vijayapura", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 17.1800, longitude: 75.9600, neighbouringTaluks: ["vijayapura", "chadchan", "sindagi"], neighbouringDistricts: [], nearbyTaluks: ["solapur"] },
  { id: "muddebihal", name: "Muddebihal", normalizedName: "muddebihal", districtId: "vijayapura", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.3400, longitude: 76.1300, neighbouringTaluks: ["basavana-bagewadi", "nidagundi", "talikoti"], neighbouringDistricts: ["bagalkote", "yadgir"], nearbyTaluks: ["hungund"] },
  { id: "sindagi", name: "Sindagi", normalizedName: "sindagi", districtId: "vijayapura", region: "north-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.9200, longitude: 76.2300, neighbouringTaluks: ["indi", "devar-hippargi"], neighbouringDistricts: ["kalaburagi"], nearbyTaluks: ["jevargi"] },

  // --- KALABURAGI (Kalyana Karnataka) ---
  { id: "kalaburagi", name: "Kalaburagi", normalizedName: "kalaburagi", districtId: "kalaburagi", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 8, latitude: 17.3297, longitude: 76.8343, neighbouringTaluks: ["afzalpur", "aland", "kamalapur", "chittapur"], neighbouringDistricts: ["bidar", "yadgir"], nearbyTaluks: ["shahabad"] },
  { id: "sedam", name: "Sedam", normalizedName: "sedam", districtId: "kalaburagi", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 17.1800, longitude: 77.2800, neighbouringTaluks: ["chittapur", "chincholi"], neighbouringDistricts: ["yadgir"], nearbyTaluks: ["wadi"] },
  { id: "chincholi", name: "Chincholi", normalizedName: "chincholi", districtId: "kalaburagi", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 17.4700, longitude: 77.4300, neighbouringTaluks: ["sedam", "kamalapur"], neighbouringDistricts: ["bidar"], nearbyTaluks: ["humnabad"] },
  { id: "chittapur", name: "Chittapur", normalizedName: "chittapur", districtId: "kalaburagi", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 17.1200, longitude: 77.0800, neighbouringTaluks: ["kalaburagi", "sedam", "shahabad"], neighbouringDistricts: ["yadgir"], nearbyTaluks: ["sannati"] },

  // --- BIDAR (Kalyana Karnataka) ---
  { id: "bidar", name: "Bidar", normalizedName: "bidar", districtId: "bidar", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 17.9104, longitude: 77.5199, neighbouringTaluks: ["bhalki", "aurad", "humnabad"], neighbouringDistricts: ["kalaburagi"], nearbyTaluks: ["basavakalyan"] },
  { id: "basavakalyan", name: "Basavakalyan", normalizedName: "basavakalyan", districtId: "bidar", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 9, latitude: 17.8700, longitude: 76.9500, neighbouringTaluks: ["humnabad"], neighbouringDistricts: ["kalaburagi"], nearbyTaluks: ["kamalapur"] },
  { id: "humnabad", name: "Humnabad", normalizedName: "humnabad", districtId: "bidar", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 17.7700, longitude: 77.1300, neighbouringTaluks: ["bidar", "basavakalyan", "chitguppa"], neighbouringDistricts: ["kalaburagi"], nearbyTaluks: ["bidar"] },

  // --- KOPPAL (Kalyana Karnataka / Heritage) ---
  { id: "koppal", name: "Koppal", normalizedName: "koppal", districtId: "koppal", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 15.3463, longitude: 76.1558, neighbouringTaluks: ["gangavathi", "kushtagi", "yelburga"], neighbouringDistricts: ["gadag", "vijayanagara"], nearbyTaluks: ["hosapete"] },
  { id: "gangavathi", name: "Gangavathi (Anegundi)", normalizedName: "gangavathi", districtId: "koppal", region: "heritage-circuit", coastalOrInland: "inland", priorityForTravelClustering: 10, latitude: 15.4300, longitude: 76.5300, neighbouringTaluks: ["koppal", "karatagi"], neighbouringDistricts: ["vijayanagara", "ballari"], nearbyTaluks: ["hosapete", "hampi", "kampli"] },
  { id: "kushtagi", name: "Kushtagi", normalizedName: "kushtagi", districtId: "koppal", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 15.7500, longitude: 76.2000, neighbouringTaluks: ["koppal", "yelburga"], neighbouringDistricts: ["bagalkote"], nearbyTaluks: ["ilkal", "hungund"] },

  // --- RAICHUR (Kalyana Karnataka) ---
  { id: "raichur", name: "Raichur", normalizedName: "raichur", districtId: "raichur", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 7, latitude: 16.2076, longitude: 77.3463, neighbouringTaluks: ["manvi", "devadurga"], neighbouringDistricts: ["yadgir", "ballari"], nearbyTaluks: ["mantralayam"] },
  { id: "sindhanur", name: "Sindhanur", normalizedName: "sindhanur", districtId: "raichur", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 15.7700, longitude: 76.7600, neighbouringTaluks: ["manvi", "maski"], neighbouringDistricts: ["ballari", "koppal"], nearbyTaluks: ["siruguppa", "gangavathi"] },

  // --- YADGIR (Kalyana Karnataka) ---
  { id: "yadgir", name: "Yadgir", normalizedName: "yadgir", districtId: "yadgir", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 16.7644, longitude: 77.1378, neighbouringTaluks: ["shahapur", "gurmitkal"], neighbouringDistricts: ["kalaburagi", "raichur"], nearbyTaluks: ["sedam"] },
  { id: "shahapur", name: "Shahapur", normalizedName: "shahapur", districtId: "yadgir", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 5, latitude: 16.7000, longitude: 76.8400, neighbouringTaluks: ["yadgir", "surpur"], neighbouringDistricts: ["kalaburagi"], nearbyTaluks: ["sannati"] },
  { id: "surpur", name: "Surpur (Shorapur)", normalizedName: "surpur", districtId: "yadgir", region: "kalyana-karnataka", coastalOrInland: "inland", priorityForTravelClustering: 6, latitude: 16.5200, longitude: 76.7600, neighbouringTaluks: ["shahapur", "hunsagi"], neighbouringDistricts: ["raichur"], nearbyTaluks: ["lingasugur"] }
];

// =========================================================================
// 4. DESTINATION -> TALUK & DISTRICT MAPPING (28 Hubs)
// =========================================================================
const destinationTalukMapping = {
  "coorg": { districtId: "kodagu", talukId: "madikeri", type: "destination", cluster: "malnad-region" },
  "mysore": { districtId: "mysuru", talukId: "mysuru", type: "city", cluster: "mysuru-region" },
  "chikmagalur": { districtId: "chikkamagaluru", talukId: "chikkamagaluru", type: "destination", cluster: "malnad-region" },
  "hampi": { districtId: "vijayanagara", talukId: "hosapete", type: "destination", cluster: "heritage-circuit" },
  "gokarna": { districtId: "uttara-kannada", talukId: "kumta", type: "destination", cluster: "coastal-karnataka" },
  "udupi": { districtId: "udupi", talukId: "udupi", type: "city", cluster: "coastal-karnataka" },
  "murudeshwar": { districtId: "uttara-kannada", talukId: "bhatkal", type: "destination", cluster: "coastal-karnataka" },
  "bandipur": { districtId: "chamarajanagar", talukId: "gundlupet", type: "destination", cluster: "mysuru-region" },
  "nagarhole": { districtId: "mysuru", talukId: "heggadadevankote", type: "destination", cluster: "mysuru-region" },
  "badami": { districtId: "bagalkote", talukId: "badami", type: "destination", cluster: "heritage-circuit" },
  "pattadakal": { districtId: "bagalkote", talukId: "badami", type: "destination", cluster: "heritage-circuit" },
  "belur-halebidu": { districtId: "hassan", talukId: "belur", type: "destination", cluster: "malnad-region" },
  "mangalore": { districtId: "dakshina-kannada", talukId: "mangaluru", type: "city", cluster: "coastal-karnataka" },
  "srirangapatna": { districtId: "mandya", talukId: "srirangapatna", type: "destination", cluster: "mysuru-region" },
  "sringeri": { districtId: "chikkamagaluru", talukId: "sringeri", type: "destination", cluster: "malnad-region" },
  "bengaluru": { districtId: "bengaluru-urban", talukId: "bengaluru-north", type: "city", cluster: "bengaluru-region" },
  "dandeli": { districtId: "uttara-kannada", talukId: "dandeli", type: "destination", cluster: "malnad-region" },
  "jog-falls": { districtId: "shivamogga", talukId: "sagara", type: "destination", cluster: "malnad-region" },
  "sakleshpur": { districtId: "hassan", talukId: "sakleshpur", type: "destination", cluster: "malnad-region" },
  "kudremukh": { districtId: "chikkamagaluru", talukId: "kalasa", type: "destination", cluster: "malnad-region" },
  "nandi-hills": { districtId: "chikkaballapura", talukId: "chikkaballapura", type: "destination", cluster: "bengaluru-region" },
  "dharmasthala": { districtId: "dakshina-kannada", talukId: "belathangadi", type: "destination", cluster: "coastal-karnataka" },
  "kukke-subrahmanya": { districtId: "dakshina-kannada", talukId: "kadaba", type: "destination", cluster: "coastal-karnataka" },
  "honnavar": { districtId: "uttara-kannada", talukId: "honnavar", type: "destination", cluster: "coastal-karnataka" },
  "karwar": { districtId: "uttara-kannada", talukId: "karwar", type: "destination", cluster: "coastal-karnataka" },
  "belagavi": { districtId: "belagavi", talukId: "belagavi", type: "city", cluster: "north-karnataka" },
  "shivamogga": { districtId: "shivamogga", talukId: "shivamogga", type: "city", cluster: "malnad-region" },
  "ballari": { districtId: "ballari", talukId: "ballari", type: "city", cluster: "kalyana-karnataka" }
};

// =========================================================================
// 5. ATTRACTION -> TALUK MAPPING (Key attractions with exact taluks)
// =========================================================================
const attractionTalukMapping = {
  // Dakshina Kannada attractions
  "Kadri Manjunatha Temple": { talukId: "mangaluru", destinationSlug: "mangalore" },
  "Kateel Durgaparameshwari Temple": { talukId: "mangaluru", destinationSlug: "mangalore" },
  "Mangaladevi Temple": { talukId: "mangaluru", destinationSlug: "mangalore" },
  "Panambur Beach": { talukId: "mangaluru", destinationSlug: "mangalore" },
  "Tannirbhavi Beach": { talukId: "mangaluru", destinationSlug: "mangalore" },
  "Sultan Battery": { talukId: "mangaluru", destinationSlug: "mangalore" },
  "Pilikula Nisargadhama": { talukId: "mangaluru", destinationSlug: "mangalore" },
  "St. Aloysius Chapel": { talukId: "mangaluru", destinationSlug: "mangalore" },
  "Someshwar Beach & Ullal": { talukId: "ullal", destinationSlug: "mangalore" },
  "Dharmasthala Manjunatha Temple": { talukId: "belathangadi", destinationSlug: "dharmasthala" },
  "Bahubali Monolithic Statue": { talukId: "belathangadi", destinationSlug: "dharmasthala" },
  "Manjusha Museum": { talukId: "belathangadi", destinationSlug: "dharmasthala" },
  "Netravati River Barrage": { talukId: "belathangadi", destinationSlug: "dharmasthala" },
  "Kukke Subrahmanya Temple": { talukId: "kadaba", destinationSlug: "kukke-subrahmanya" },
  "Adi Subrahmanya Temple": { talukId: "kadaba", destinationSlug: "kukke-subrahmanya" },
  "Kumaradhara River Bathing Ghat": { talukId: "kadaba", destinationSlug: "kukke-subrahmanya" },
  "Biladwara Cave": { talukId: "kadaba", destinationSlug: "kukke-subrahmanya" },

  // Udupi attractions
  "Udupi Sri Krishna Temple": { talukId: "udupi", destinationSlug: "udupi" },
  "Malpe Beach": { talukId: "udupi", destinationSlug: "udupi" },
  "St. Mary's Island": { talukId: "udupi", destinationSlug: "udupi" },
  "Anantheshwara Temple": { talukId: "udupi", destinationSlug: "udupi" },
  "Kaup Beach & Lighthouse": { talukId: "kapu", destinationSlug: "udupi" },
  "Kodi Bengre (Delta Beach)": { talukId: "brahmavara", destinationSlug: "udupi" },

  // Uttara Kannada attractions
  "Murdeshwar Temple": { talukId: "bhatkal", destinationSlug: "murudeshwar" },
  "Murudeshwar Beach & Water Sports": { talukId: "bhatkal", destinationSlug: "murudeshwar" },
  "Gokarna Mahabaleshwara Temple": { talukId: "kumta", destinationSlug: "gokarna" },
  "Om Beach": { talukId: "kumta", destinationSlug: "gokarna" },
  "Kudle Beach": { talukId: "kumta", destinationSlug: "gokarna" },
  "Sharavathi Backwaters & Boating": { talukId: "honnavar", destinationSlug: "honnavar" },
  "Eco Beach & Boardwalk": { talukId: "honnavar", destinationSlug: "honnavar" },
  "Rabindranath Tagore Beach": { talukId: "karwar", destinationSlug: "karwar" },
  "Kali River Garden & Bridge": { talukId: "karwar", destinationSlug: "karwar" },
  "White Water River Rafting": { talukId: "dandeli", destinationSlug: "dandeli" },

  // Malnad attractions
  "Mullayanagiri Peak": { talukId: "chikkamagaluru", destinationSlug: "chikmagalur" },
  "Baba Budangiri (Dattatreya Peetha)": { talukId: "chikkamagaluru", destinationSlug: "chikmagalur" },
  "Sharadamba Temple": { talukId: "sringeri", destinationSlug: "sringeri" },
  "Vidyashankara Temple": { talukId: "sringeri", destinationSlug: "sringeri" },
  "Jog Falls (Gerosoppa)": { talukId: "sagara", destinationSlug: "jog-falls" },
  "Bisle Ghat Viewpoint": { talukId: "sakleshpur", destinationSlug: "sakleshpur" },
  "Manjarabad Fort": { talukId: "sakleshpur", destinationSlug: "sakleshpur" },
  "Kudremukh Peak Trek": { talukId: "kalasa", destinationSlug: "kudremukh" },
  "Kalaseshwara Temple": { talukId: "kalasa", destinationSlug: "kudremukh" },
  "Abbey Falls": { talukId: "madikeri", destinationSlug: "coorg" },
  "Raja's Seat": { talukId: "madikeri", destinationSlug: "coorg" },
  "Dubare Elephant Camp": { talukId: "kushalnagar", destinationSlug: "coorg" },
  "Talakaveri & Brahmagiri": { talukId: "madikeri", destinationSlug: "coorg" },
  "Chennakeshava Temple": { talukId: "belur", destinationSlug: "belur-halebidu" },

  // Mysuru attractions
  "Mysore Palace": { talukId: "mysuru", destinationSlug: "mysore" },
  "Chamundi Hill & Temple": { talukId: "mysuru", destinationSlug: "mysore" },
  "Ranganathaswamy Temple": { talukId: "srirangapatna", destinationSlug: "srirangapatna" },
  "Bandipur Tiger Reserve Safari": { talukId: "gundlupet", destinationSlug: "bandipur" },
  "Kabini River Safari": { talukId: "heggadadevankote", destinationSlug: "nagarhole" },

  // Heritage / North
  "Virupaksha Temple": { talukId: "hosapete", destinationSlug: "hampi" },
  "Vijaya Vittala Temple": { talukId: "hosapete", destinationSlug: "hampi" },
  "Badami Cave Temples": { talukId: "badami", destinationSlug: "badami" },
  "Pattadakal Temple Complex": { talukId: "badami", destinationSlug: "pattadakal" }
};

// =========================================================================
// 6. NORMALIZATION ALIASES
// =========================================================================
const locationAliases = {
  "mangalore": "mangaluru",
  "mangaluru": "mangaluru",
  "kudla": "mangaluru",
  "mangaluru city": "mangaluru",
  "bangalore": "bengaluru",
  "bengaluru": "bengaluru",
  "bengaluru city": "bengaluru",
  "blore": "bengaluru",
  "blr": "bengaluru",
  "coorg": "madikeri",
  "kodagu": "madikeri",
  "madikeri": "madikeri",
  "chikmagalur": "chikkamagaluru",
  "chikkamagaluru": "chikkamagaluru",
  "mysore": "mysuru",
  "mysuru": "mysuru",
  "shimoga": "shivamogga",
  "shivamogga": "shivamogga",
  "udupi": "udupi",
  "odipu": "udupi",
  "murudeshwar": "bhatkal",
  "murdeshwar": "bhatkal",
  "gokarna": "kumta",
  "gokarn": "kumta",
  "hampi": "hosapete",
  "hospet": "hosapete",
  "hosapete": "hosapete",
  "badami": "badami",
  "pattadakal": "badami",
  "aihole": "hungund",
  "dharmasthala": "belathangadi",
  "kukke": "kadaba",
  "kukke subrahmanya": "kadaba",
  "subrahmanya": "kadaba",
  "honnavar": "honnavar",
  "karwar": "karwar",
  "belur": "belur",
  "sakleshpur": "sakleshpur",
  "sringeri": "sringeri",
  "kudremukh": "kalasa",
  "dandeli": "dandeli",
  "belgaum": "belagavi",
  "belagavi": "belagavi",
  "bellary": "ballari",
  "ballari": "ballari",
  "bijapur": "vijayapura",
  "vijayapura": "vijayapura",
  "gulbarga": "kalaburagi",
  "kalaburagi": "kalaburagi"
};

// =========================================================================
// 7. EXPORT DATA & SEED PRISMA DATABASE
// =========================================================================
async function main() {
  console.log("🚀 Building and saving data/karnataka-geo-hierarchy.json...");
  const fullHierarchy = {
    metadata: {
      title: "Karnataka District-Taluk Geographic Hierarchy",
      districtsCount: districts.length,
      taluksCount: taluks.length,
      regionsCount: regions.length,
      version: "2.0.0"
    },
    regions,
    districts,
    taluks,
    destinationTalukMapping,
    attractionTalukMapping,
    locationAliases
  };

  const outputPath = path.join(__dirname, '..', 'data', 'karnataka-geo-hierarchy.json');
  fs.writeFileSync(outputPath, JSON.stringify(fullHierarchy, null, 2), 'utf-8');
  console.log(`✅ Saved data/karnataka-geo-hierarchy.json (${districts.length} districts, ${taluks.length} taluks)`);

  console.log("💾 Seeding District and Taluk tables in Prisma SQLite database...");

  // Seed Districts
  for (const d of districts) {
    await prisma.district.upsert({
      where: { id: d.id },
      update: {
        name: d.name,
        normalizedName: d.normalizedName,
        region: d.region,
        latitude: d.latitude,
        longitude: d.longitude,
        neighbouringDistricts: JSON.stringify(d.neighbouringDistricts)
      },
      create: {
        id: d.id,
        name: d.name,
        normalizedName: d.normalizedName,
        region: d.region,
        latitude: d.latitude,
        longitude: d.longitude,
        neighbouringDistricts: JSON.stringify(d.neighbouringDistricts)
      }
    });
  }
  console.log(`✅ Upserted ${districts.length} districts in SQLite.`);

  // Seed Taluks
  for (const t of taluks) {
    await prisma.taluk.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        normalizedName: t.normalizedName,
        districtId: t.districtId,
        region: t.region,
        coastalOrInland: t.coastalOrInland,
        priorityForTravelClustering: t.priorityForTravelClustering,
        latitude: t.latitude,
        longitude: t.longitude,
        neighbouringTaluks: JSON.stringify(t.neighbouringTaluks || []),
        neighbouringDistricts: JSON.stringify(t.neighbouringDistricts || []),
        nearbyTaluks: JSON.stringify(t.nearbyTaluks || [])
      },
      create: {
        id: t.id,
        name: t.name,
        normalizedName: t.normalizedName,
        districtId: t.districtId,
        region: t.region,
        coastalOrInland: t.coastalOrInland,
        priorityForTravelClustering: t.priorityForTravelClustering,
        latitude: t.latitude,
        longitude: t.longitude,
        neighbouringTaluks: JSON.stringify(t.neighbouringTaluks || []),
        neighbouringDistricts: JSON.stringify(t.neighbouringDistricts || []),
        nearbyTaluks: JSON.stringify(t.nearbyTaluks || [])
      }
    });
  }
  console.log(`✅ Upserted ${taluks.length} taluks in SQLite.`);

  // Update Destinations with districtId and talukId
  for (const [slug, meta] of Object.entries(destinationTalukMapping)) {
    try {
      await prisma.destination.updateMany({
        where: { slug },
        data: {
          districtId: meta.districtId,
          talukId: meta.talukId
        }
      });
    } catch (e) {
      // Ignored if destination not yet in db
    }
  }
  console.log("✅ Linked destinations to taluk and district IDs.");

  // Update Attractions with talukId
  for (const [name, meta] of Object.entries(attractionTalukMapping)) {
    try {
      await prisma.attraction.updateMany({
        where: { name },
        data: {
          talukId: meta.talukId
        }
      });
    } catch (e) {}
  }
  console.log("✅ Linked attractions to taluk IDs.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
