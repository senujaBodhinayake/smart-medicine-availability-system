import axios from 'axios'

/**
 * To connect to your real backend, change BASE_URL to your API server.
 * e.g. export const BASE_URL = 'http://localhost:8000'
 * All functions fall back to mock data when the request fails so the
 * frontend remains fully usable without a running backend.
 */
export const BASE_URL = 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Mock datasets ────────────────────────────────────────────────────────────

const MOCK_MEDICINES = [
  { id: 1,  medicine_name: 'Paracetamol 500mg',   category: 'Painkiller',       stock_status: 'Sufficient', pharmacy_name: 'MediPlus Pharmacy',  quantity: 150, unit_price: 25,  age_group: 'All Ages',  dosage_form: 'Tablet' },
  { id: 2,  medicine_name: 'Amoxicillin 250mg',   category: 'Antibiotic',       stock_status: 'Reorder',    pharmacy_name: 'City Pharmacy',       quantity: 20,  unit_price: 45,  age_group: 'Adult',     dosage_form: 'Capsule' },
  { id: 3,  medicine_name: 'Metformin 500mg',     category: 'Antidiabetic',     stock_status: 'Overstock',  pharmacy_name: 'HealthCare Plus',     quantity: 400, unit_price: 15,  age_group: 'Adult',     dosage_form: 'Tablet' },
  { id: 4,  medicine_name: 'Amlodipine 5mg',      category: 'Antihypertensive', stock_status: 'Sufficient', pharmacy_name: 'Sunrise Pharmacy',    quantity: 200, unit_price: 30,  age_group: 'Adult',     dosage_form: 'Tablet' },
  { id: 5,  medicine_name: 'Cetirizine 10mg',     category: 'Antihistamine',    stock_status: 'Sufficient', pharmacy_name: 'MediPlus Pharmacy',   quantity: 300, unit_price: 12,  age_group: 'All Ages',  dosage_form: 'Tablet' },
  { id: 6,  medicine_name: 'Ibuprofen 400mg',     category: 'Painkiller',       stock_status: 'Reorder',    pharmacy_name: 'City Pharmacy',       quantity: 18,  unit_price: 20,  age_group: 'Adult',     dosage_form: 'Tablet' },
  { id: 7,  medicine_name: 'Omeprazole 20mg',     category: 'Antacid',          stock_status: 'Sufficient', pharmacy_name: 'HealthCare Plus',     quantity: 120, unit_price: 35,  age_group: 'Adult',     dosage_form: 'Capsule' },
  { id: 8,  medicine_name: 'Vitamin C 500mg',     category: 'Supplement',       stock_status: 'Overstock',  pharmacy_name: 'Sunrise Pharmacy',    quantity: 480, unit_price: 8,   age_group: 'All Ages',  dosage_form: 'Tablet' },
  { id: 9,  medicine_name: 'Insulin 100IU/mL',    category: 'Antidiabetic',     stock_status: 'Sufficient', pharmacy_name: 'MediPlus Pharmacy',   quantity: 50,  unit_price: 250, age_group: 'Adult',     dosage_form: 'Injection' },
  { id: 10, medicine_name: 'Atorvastatin 20mg',   category: 'Antihypertensive', stock_status: 'Sufficient', pharmacy_name: 'City Pharmacy',       quantity: 180, unit_price: 55,  age_group: 'Adult',     dosage_form: 'Tablet' },
  { id: 11, medicine_name: 'Azithromycin 500mg',  category: 'Antibiotic',       stock_status: 'Reorder',    pharmacy_name: 'HealthCare Plus',     quantity: 12,  unit_price: 90,  age_group: 'Adult',     dosage_form: 'Tablet' },
  { id: 12, medicine_name: 'Loratadine 10mg',     category: 'Antihistamine',    stock_status: 'Sufficient', pharmacy_name: 'Sunrise Pharmacy',    quantity: 220, unit_price: 18,  age_group: 'All Ages',  dosage_form: 'Tablet' },
]

const MOCK_RECOMMENDATIONS = {
  default: [
    { rank: 1, medicine_name: 'Ibuprofen 400mg',    category: 'Painkiller', age_group: 'Adult', dosage_form: 'Tablet',  similarity_score: 94 },
    { rank: 2, medicine_name: 'Aspirin 300mg',       category: 'Painkiller', age_group: 'Adult', dosage_form: 'Tablet',  similarity_score: 87 },
    { rank: 3, medicine_name: 'Naproxen 250mg',      category: 'Painkiller', age_group: 'Adult', dosage_form: 'Tablet',  similarity_score: 81 },
    { rank: 4, medicine_name: 'Diclofenac 50mg',     category: 'Painkiller', age_group: 'Adult', dosage_form: 'Tablet',  similarity_score: 76 },
    { rank: 5, medicine_name: 'Mefenamic Acid',      category: 'Painkiller', age_group: 'Adult', dosage_form: 'Capsule', similarity_score: 71 },
  ],
}

const MOCK_FORECAST = [
  { day: 'Mon', demand: 120 },
  { day: 'Tue', demand: 145 },
  { day: 'Wed', demand: 132 },
  { day: 'Thu', demand: 178 },
  { day: 'Fri', demand: 165 },
  { day: 'Sat', demand: 190 },
  { day: 'Sun', demand: 155 },
]

// ─── API functions ─────────────────────────────────────────────────────────────

/** Search medicines by query string and optional filters */
export async function getMedicines(query = '', filters = {}) {
  try {
    const res = await client.get('/medicines/search', { params: { q: query, ...filters } })
    return res.data
  } catch {
    // Filter mock data locally so the UI still works offline
    let results = MOCK_MEDICINES
    if (query) {
      const q = query.toLowerCase()
      results = results.filter(m => m.medicine_name.toLowerCase().includes(q))
    }
    if (filters.category && filters.category !== 'All') {
      results = results.filter(m => m.category === filters.category)
    }
    if (filters.stock_status) {
      results = results.filter(m => m.stock_status === filters.stock_status)
    }
    if (filters.age_group && filters.age_group !== 'All Ages') {
      results = results.filter(m => m.age_group === filters.age_group || m.age_group === 'All Ages')
    }
    return results
  }
}

/** Get top AI-powered recommendations for an unavailable medicine */
export async function getRecommendations(medicine_name) {
  try {
    const res = await client.get('/recommendations', { params: { medicine: medicine_name } })
    return res.data
  } catch {
    return MOCK_RECOMMENDATIONS.default
  }
}

/** Get 7-day demand forecast for a specific medicine */
export async function getForecast(medicine_name) {
  try {
    const res = await client.get('/forecast', { params: { medicine: medicine_name } })
    return res.data
  } catch {
    return MOCK_FORECAST
  }
}

/** Get current stock status for a specific medicine */
export async function getStockStatus(medicine_name) {
  try {
    const res = await client.get('/stock', { params: { medicine: medicine_name } })
    return res.data
  } catch {
    const match = MOCK_MEDICINES.find(m =>
      m.medicine_name.toLowerCase().includes(medicine_name.toLowerCase())
    )
    return match ? { status: match.stock_status, quantity: match.quantity } : { status: 'Unknown', quantity: 0 }
  }
}

/** Fetch all medicines (for dashboard inventory table) */
export async function getAllMedicines() {
  try {
    const res = await client.get('/medicines')
    return res.data
  } catch {
    return MOCK_MEDICINES
  }
}

/** Fetch a single medicine by ID */
export async function getMedicineById(id) {
  try {
    const res = await client.get(`/medicines/${id}`)
    return res.data
  } catch {
    return MOCK_MEDICINES.find(m => m.id === Number(id)) || null
  }
}
