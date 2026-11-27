import { useState } from 'react'

export default function NoteCard({ note, labels = [], onEdit, onTrash, onPin, onArchive, onAddLabel, onRemoveLabel, onReminder, onClearReminder }) {
  const [date, setDate] = useState('')

  function saveReminder(event) {
    event.preventDefault()
    if (!date) return
    if (new Date(date) <= new Date()) { window.alert('Choose a future time.'); return }
    onReminder(note.id, new Date(date).toISOString())
    setDate('')
  }

  return (
    <article className="note-card">
      <div className="card-head"><h3>{note.title}</h3>{note.pinned && <span className="mini-tag">Pinned</span>}</div>
      {note.description && <p>{note.description}</p>}
      {note.reminderAt && <p className="reminder-line">Reminder: {new Date(note.reminderAt).toLocaleString()} <button onClick={() => onClearReminder(note.id)}>Remove</button></p>}
      {note.labels?.length > 0 && <div className="card-labels">{note.labels.map((name) => <button key={name} onClick={() => onRemoveLabel(note.id, name)} title={`Remove ${name} label`}>{name} ×</button>)}</div>}
      {labels.length > 0 && <select aria-label={`Add label to ${note.title}`} value="" onChange={(event) => onAddLabel(note.id, Number(event.target.value))}><option value="">Add label...</option>{labels.filter((label) => !note.labels?.includes(label.name)).map((label) => <option key={label.id} value={label.id}>{label.name}</option>)}</select>}
      <details className="reminder-control"><summary>Set reminder</summary><form onSubmit={saveReminder}><input type="datetime-local" aria-label={`Reminder time for ${note.title}`} value={date} onChange={(event) => setDate(event.target.value)} required /><button className="subtle-button">Save</button></form></details>
      <div className="card-actions">
        <button onClick={() => onEdit(note)}>Edit</button>
        <button onClick={() => onPin(note)}>{note.pinned ? 'Unpin' : 'Pin'}</button>
        <button onClick={() => onArchive(note)}>Archive</button>
        <button onClick={() => onTrash(note.id)}>Trash</button>
      </div>
    </article>
  )
}
