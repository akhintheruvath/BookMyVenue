// Central API client — a thin wrapper around fetch.
// All backend calls should go through here so we configure the base URL,
// headers, and error handling in one place.
//
// Vite reads env vars prefixed with VITE_ (see .env). Falls back to the
// local backend if VITE_API_URL is not set.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }

  return res.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}
