import { useEffect, useState } from 'react'
import NoteCard from '../components/NoteCard'
import NoteEditor from '../components/NoteEditor'
import { addLabelToNote, getLabels, removeLabelFromNote } from '../services/labelService'
import { clearReminder, createNote, getNotes, setNoteState, setReminder, trashNote, updateNote } from '../services/noteService'

export default function DashboardPage({ onAuthError }) {
  const [notes, setNotes] = useState([])
  const [labels, setLabels] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeSearch, setActiveSearch] = useState('')

  async function load() {
    try { setNotes(await getNotes(activeSearch)); setError('') }
    catch (problem) { if (problem.status === 401) onAuthError(); setError(problem.message) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    Promise.all([getNotes(), getLabels()]).then(([items, availableLabels]) => {
      setNotes(items)
      setLabels(availableLabels)
    }).catch((problem) => {
      if (problem.status === 401) onAuthError()
      setError(problem.message)
    }).finally(() => setLoading(false))
  }, [onAuthError])

  useEffect(() => {
    const timer = window.setInterval(() => {
      getNotes(activeSearch).then((items) => { setNotes(items); setError('') }).catch((problem) => {
        if (problem.status === 401) onAuthError()
        else setError(problem.message)
      })
    }, 30000)
    return () => window.clearInterval(timer)
  }, [activeSearch, onAuthError])

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

  async function changeState(id, state, enabled) {
    try { await setNoteState(id, state, enabled); await load() }
    catch (problem) { setError(problem.message) }
  }

  async function addLabel(noteId, labelId) {
    try { await addLabelToNote(noteId, labelId); await load() }
    catch (problem) { setError(problem.message) }
  }

  async function removeLabel(noteId, name) {
    const label = labels.find((item) => item.name === name)
    if (!label) return
    try { await removeLabelFromNote(noteId, label.id); await load() }
    catch (problem) { setError(problem.message) }
  }

  async function changeReminder(id, value) {
    try { await setReminder(id, value); await load() }
    catch (problem) { setError(problem.message) }
  }

  async function removeReminder(id) {
    try { await clearReminder(id); await load() }
    catch (problem) { setError(problem.message) }
  }

  async function submitSearch(event) {
    event.preventDefault()
    setActiveSearch(search.trim())
    try { setNotes(await getNotes(search.trim())); setError('') }
    catch (problem) { setError(problem.message) }
  }

  const visibleNotes = notes.filter((note) => !note.archived)

  return (
    <section className="page">
      <div className="page-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Your notes</h1><p className="muted">Capture ideas and keep moving.</p></div><span className="count-pill">{visibleNotes.length} notes</span></div>
      {error && <p className="notice error" role="alert">{error}</p>}
      <NoteEditor key={editing?.id || 'new'} note={editing} onSave={save} onCancel={() => setEditing(null)} />
      <form className="search-row" onSubmit={submitSearch}><input aria-label="Search notes" placeholder="Search notes by title or description" value={search} onChange={(event) => setSearch(event.target.value)} /><button className="button">Search</button></form>
      {loading ? <p className="muted">Loading notes...</p> : visibleNotes.length === 0 ? <div className="empty-state"><strong>No notes found</strong><p>Try a different search or add a new note.</p></div> : <div className="note-grid">{visibleNotes.map((note) => <NoteCard key={note.id} note={note} labels={labels} onEdit={setEditing} onTrash={remove} onPin={(item) => changeState(item.id, 'pin', !item.pinned)} onArchive={(item) => changeState(item.id, 'archive', true)} onAddLabel={addLabel} onRemoveLabel={removeLabel} onReminder={changeReminder} onClearReminder={removeReminder} />)}</div>}
    </section>
  )
}
