import { useEffect, useState } from 'react'
import { clearReminder, getNotes } from '../services/noteService'

export default function RemindersPage({ onAuthError }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getNotes().then(setNotes).catch((problem) => {
      if (problem.status === 401) onAuthError()
      setError(problem.message)
    }).finally(() => setLoading(false))
  }, [onAuthError])

  async function remove(id) {
    try {
      await clearReminder(id)
      setNotes((current) => current.map((note) => note.id === id ? { ...note, reminderAt: null } : note))
      setError('')
    } catch (problem) { setError(problem.message) }
  }

  const reminders = notes.filter((note) => note.reminderAt && !note.trashed)
    .sort((a, b) => new Date(a.reminderAt) - new Date(b.reminderAt))

  return <section className="page">
    <p className="eyebrow">YOUR WORKSPACE</p><h1>Reminders</h1>
    <p className="muted">Notes with a reminder, ordered by time.</p>
    {error && <p className="notice error" role="alert">{error}</p>}
    {loading ? <p className="muted">Loading reminders...</p> : reminders.length === 0
      ? <div className="empty-state"><strong>No reminders yet</strong></div>
      : <div className="note-grid collection-grid">{reminders.map((note) =>
        <article className="note-card" key={note.id}>
          <h3>{note.title}</h3><p>{note.description}</p>
          <p>Reminder: {new Date(note.reminderAt).toLocaleString()}</p>
          <div className="card-actions"><button onClick={() => remove(note.id)}>Remove reminder</button></div>
        </article>)}</div>}
  </section>
}
