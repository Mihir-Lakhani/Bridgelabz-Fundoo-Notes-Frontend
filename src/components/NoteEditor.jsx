import { useState } from 'react'

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '')
  const [description, setDescription] = useState(note?.description || '')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const saved = await onSave(note?.id, { title: title.trim(), description })
      if (saved && !note) { setTitle(''); setDescription('') }
    } finally { setBusy(false) }
  }

  return (
    <form className="note-editor" onSubmit={submit}>
      <input aria-label="Note title" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <textarea aria-label="Note description" placeholder="Take a note..." value={description} onChange={(event) => setDescription(event.target.value)} />
      <div className="editor-actions">
        {note && <button type="button" className="subtle-button" onClick={onCancel}>Cancel</button>}
        <button className="button" disabled={busy}>{busy ? 'Saving...' : note ? 'Save changes' : 'Add note'}</button>
      </div>
    </form>
  )
}
