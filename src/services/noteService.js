import { api } from './api'

export const getNotes = () => api('/api/notes')
export const createNote = (data) => api('/api/notes', { method: 'POST', body: JSON.stringify(data) })
export const updateNote = (id, data) => api(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const trashNote = (id) => api(`/api/notes/${id}`, { method: 'DELETE' })
