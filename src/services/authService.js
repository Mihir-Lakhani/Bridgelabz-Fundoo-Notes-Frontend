import { api } from './api'

export function registerUser(data) {
  return api('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
}

export function loginUser(data) {
  return api('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
}
