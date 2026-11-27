import { useEffect, useState } from 'react'
import NoteCard from '../components/NoteCard'
import NoteEditor from '../components/NoteEditor'
import { createNote, getNotes, trashNote, updateNote } from '../services/noteService'

export default function DashboardPage({ onAuthError }) {
  const [notes, setNotes] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try { setNotes(await getNotes()); setError('') }
    catch (problem) { if (problem.status === 401) onAuthError(); setError(problem.message) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    getNotes().then(setNotes).catch((problem) => {
      if (problem.status === 401) onAuthError()
      setError(problem.message)
    }).finally(() => setLoading(false))
  }, [onAuthError])

  async function save(id, data) {
    try {
      if (id) await updateNote(id, data)
      else await createNote(data)
      setEditing(null)
      await load()
      return true
    } catch (problem) { setError(problem.message); return false }
  }

  async function remove(id) {
    try { await trashNote(id); await load() }
    catch (problem) { setError(problem.message) }
  }

  return (
    <section className="page">
      <div className="page-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Your notes</h1><p className="muted">Capture ideas and keep moving.</p></div><span className="count-pill">{notes.length} notes</span></div>
      {error && <p className="notice error" role="alert">{error}</p>}
      <NoteEditor key={editing?.id || 'new'} note={editing} onSave={save} onCancel={() => setEditing(null)} />
      {loading ? <p className="muted">Loading notes...</p> : notes.length === 0 ? <div className="empty-state"><strong>No notes yet</strong><p>Your first idea starts above.</p></div> : <div className="note-grid">{notes.map((note) => <NoteCard key={note.id} note={note} onEdit={setEditing} onTrash={remove} />)}</div>}
    </section>
  )
}
