import axios from 'axios'

/**
 * To connect to your real backend, change BASE_URL to your API server.
 * e.g. export const BASE_URL = 'http://localhost:8000'
 */
export const BASE_URL = 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── API functions ─────────────────────────────────────────────────────────────

/** Search medicines by query string and optional filters */
export async function getMedicines(query = '', filters = {}) {
  const res = await client.get('/medicines/search', { params: { q: query, ...filters } })
  return res.data
}

/** Get top AI-powered recommendations for an unavailable medicine */
export async function getRecommendations(medicine_name) {
  const res = await client.get(`/recommend/${encodeURIComponent(medicine_name)}`)
  return res.data
}

/** Get 7-day demand forecast for a specific medicine */
export async function getForecast(medicine_name) {
  const res = await client.get('/forecast', { params: { medicine: medicine_name } })
  return res.data
}

/** Get current stock status for a specific medicine using numerical features array */
export async function getStockStatus(data) {
  const res = await client.post('/stock-status/', data)
  return res.data
}

/** Fetch all medicines (for dashboard inventory table) */
export async function getAllMedicines() {
  const res = await client.get('/medicines/')
  return res.data
}

/** Fetch a single medicine by ID */
export async function getMedicineById(id) {
  const res = await client.get(`/medicines/${id}`)
  return res.data
}
