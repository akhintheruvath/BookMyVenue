// Central API client — a thin wrapper around fetch.
// All backend calls should go through here so we configure the base URL,
// headers, auth token, and error handling in one place.
//
// Vite reads env vars prefixed with VITE_ (see .env). Falls back to the
// local backend if VITE_API_URL is not set.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Where the app JWT lives in the browser.
const TOKEN_KEY = 'bmv_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    // Try to surface the backend's { message } for nicer errors.
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.message || detail;
    } catch {
      // response had no JSON body; keep statusText
    }
    throw new Error(`API error ${res.status}: ${detail}`);
  }

  return res.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}
