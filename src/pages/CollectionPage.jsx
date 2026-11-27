import { useEffect, useState } from 'react'
import { deleteForever, getNotes, getTrash, setNoteState } from '../services/noteService'

export default function CollectionPage({ kind, onAuthError }) {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const isTrash = kind === 'trash'

  async function load() {
    try {
      const items = isTrash ? await getTrash() : (await getNotes()).filter((note) => note.archived)
      setNotes(items)
      setError('')
    } catch (problem) {
      if (problem.status === 401) onAuthError()
      setError(problem.message)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    const request = isTrash ? getTrash() : getNotes()
    request.then((items) => setNotes(isTrash ? items : items.filter((note) => note.archived)))
      .catch((problem) => { if (problem.status === 401) onAuthError(); setError(problem.message) })
      .finally(() => setLoading(false))
  }, [isTrash, onAuthError])

  async function act(note, action) {
    if (action === 'delete' && !window.confirm('Delete this note permanently?')) return
    try {
      if (action === 'delete') await deleteForever(note.id)
      else if (action === 'restore') await setNoteState(note.id, 'trash', false)
      else await setNoteState(note.id, 'archive', false)
      await load()
    } catch (problem) { setError(problem.message) }
  }

  return (
    <section className="page">
      <p className="eyebrow">YOUR WORKSPACE</p><h1>{isTrash ? 'Trash' : 'Archive'}</h1>
      <p className="muted">{isTrash ? 'Restore a note or delete it permanently.' : 'Notes you have put away for later.'}</p>
      {error && <p className="notice error" role="alert">{error}</p>}
      {loading ? <p className="muted">Loading...</p> : notes.length === 0 ? <div className="empty-state"><strong>Nothing here yet</strong></div> :
        <div className="note-grid collection-grid">{notes.map((note) => <article className="note-card" key={note.id}>
          <h3>{note.title}</h3><p>{note.description}</p>
          <div className="card-actions">{isTrash ? <><button onClick={() => act(note, 'restore')}>Restore</button><button onClick={() => act(note, 'delete')}>Delete forever</button></> : <button onClick={() => act(note, 'unarchive')}>Unarchive</button>}</div>
        </article>)}</div>}
    </section>
  )
}
