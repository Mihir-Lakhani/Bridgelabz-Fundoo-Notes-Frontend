import { api } from './api'

export const getNotes = (search = '') => api(`/api/notes${search ? `?search=${encodeURIComponent(search)}` : ''}`)
export const createNote = (data) => api('/api/notes', { method: 'POST', body: JSON.stringify(data) })
export const updateNote = (id, data) => api(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const trashNote = (id) => api(`/api/notes/${id}`, { method: 'DELETE' })
export const getTrash = () => api('/api/notes/trash')
export const deleteForever = (id) => api(`/api/notes/${id}/permanent`, { method: 'DELETE' })
export const setReminder = (id, reminderAt) => api(`/api/notes/${id}/reminder`, {
  method: 'PUT', body: JSON.stringify({ reminderAt }),
})
export const clearReminder = (id) => api(`/api/notes/${id}/reminder`, { method: 'DELETE' })
export const setNoteState = (id, state, enabled) => api(`/api/notes/${id}/${state}`, {
  method: 'PATCH', body: JSON.stringify({ enabled }),
})
