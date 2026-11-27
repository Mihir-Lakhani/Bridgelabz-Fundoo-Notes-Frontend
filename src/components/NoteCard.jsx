export default function NoteCard({ note, onEdit, onTrash }) {
  return (
    <article className="note-card">
      <div className="card-head"><h3>{note.title}</h3>{note.pinned && <span className="mini-tag">Pinned</span>}</div>
      {note.description && <p>{note.description}</p>}
      <div className="card-actions">
        <button onClick={() => onEdit(note)}>Edit</button>
        <button onClick={() => onTrash(note.id)}>Trash</button>
      </div>
    </article>
  )
}
