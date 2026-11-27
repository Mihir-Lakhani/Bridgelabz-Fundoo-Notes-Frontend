import { useEffect, useState } from 'react'
import { createLabel, deleteLabel, getLabels } from '../services/labelService'
import { api } from '../services/api'

export default function LabelsPage({ onAuthError }) {
  const [labels, setLabels] = useState([])
  const [selected, setSelected] = useState('')
  const [notes, setNotes] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getLabels().then(setLabels).catch((problem) => {
      if (problem.status === 401) onAuthError()
      setError(problem.message)
    })
  }, [onAuthError])

  async function add(event) {
    event.preventDefault()
    try { await createLabel(name.trim()); setName(''); setLabels(await getLabels()); setError('') }
    catch (problem) { setError(problem.message) }
  }

  async function remove(id) {
    try { await deleteLabel(id); setLabels(await getLabels()); setSelected(''); setNotes([]) }
    catch (problem) { setError(problem.message) }
  }

  async function show(nameToShow) {
    try { setSelected(nameToShow); setNotes(await api(`/api/notes?label=${encodeURIComponent(nameToShow)}`)); setError('') }
    catch (problem) { setError(problem.message) }
  }

  return <section className="page">
    <p className="eyebrow">ORGANIZE</p><h1>Labels</h1><p className="muted">Group notes by topic and find them quickly.</p>
    {error && <p className="notice error" role="alert">{error}</p>}
    <form className="search-row label-form" onSubmit={add}><input aria-label="New label name" placeholder="New label name" value={name} onChange={(event) => setName(event.target.value)} required /><button className="button">Add label</button></form>
    {labels.length === 0 ? <div className="empty-state"><strong>No labels yet</strong></div> : <div className="label-list">{labels.map((label) => <div className="label-row" key={label.id}><button onClick={() => show(label.name)}>{label.name}</button><button className="subtle-button" onClick={() => remove(label.id)}>Delete</button></div>)}</div>}
    {selected && <div className="label-results"><h2>Notes in {selected}</h2>{notes.length ? <div className="note-grid">{notes.map((note) => <article className="note-card" key={note.id}><h3>{note.title}</h3><p>{note.description}</p></article>)}</div> : <p className="muted">No notes with this label.</p>}</div>}
  </section>
}
