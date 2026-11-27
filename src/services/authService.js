import { api } from './api'

export function registerUser(data) {
  return api('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
}

export function loginUser(data) {
  return api('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
}

export const getProfile = () => api('/api/users/me')
export const updateProfile = (name) => api('/api/users/me', { method: 'PUT', body: JSON.stringify({ name }) })
export const verifyEmail = (token) => api('/api/auth/verify', { method: 'POST', body: JSON.stringify({ token }) })
export const resendVerification = (email) => api('/api/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) })
export const forgotPassword = (email) => api('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
export const resetPassword = (token, password) => api('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) })
