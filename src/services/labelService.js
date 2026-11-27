import { api } from './api'

export const getLabels = () => api('/api/labels')
export const createLabel = (name) => api('/api/labels', { method: 'POST', body: JSON.stringify({ name }) })
export const deleteLabel = (id) => api(`/api/labels/${id}`, { method: 'DELETE' })
export const addLabelToNote = (noteId, labelId) => api(`/api/notes/${noteId}/labels/${labelId}`, { method: 'PUT' })
export const removeLabelFromNote = (noteId, labelId) => api(`/api/notes/${noteId}/labels/${labelId}`, { method: 'DELETE' })
