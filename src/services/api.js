const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export function getToken() { return localStorage.getItem('fundoo_token') }
export function saveToken(token) { localStorage.setItem('fundoo_token', token) }
export function clearToken() { localStorage.removeItem('fundoo_token') }

export async function api(path, options = {}) {
  const headers = { ...options.headers }
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers })
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try { message = (await response.json()).error || message } catch { /* Response has no JSON body. */ }
    if (response.status === 401 && !path.startsWith('/api/auth/')) clearToken()
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  if (response.status === 204) return null
  return response.json()
}
