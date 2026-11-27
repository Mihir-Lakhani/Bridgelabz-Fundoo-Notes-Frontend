import { useState } from 'react'
import { exportNotes, importNotes } from '../services/noteService'

export default function TransferPage({ onAuthError }) {
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function upload(event) {
    event.preventDefault()
    setBusy(true)
    try {
      await importNotes(file)
      setMessage('Notes imported. Open the Dashboard to see them.')
      setError('')
    } catch (problem) { if (problem.status === 401) onAuthError(); setError(problem.message); setMessage('') }
    finally { setBusy(false) }
  }

  async function download() {
    setBusy(true)
    try {
      const blob = await exportNotes()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'notes.csv'
      document.body.append(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setError('')
    } catch (problem) { if (problem.status === 401) onAuthError(); setError(problem.message) }
    finally { setBusy(false) }
  }

  return <section className="page">
    <p className="eyebrow">YOUR WORKSPACE</p><h1>Import and export</h1>
    <p className="muted">Move notes using a CSV file.</p>
    {error && <p className="notice error" role="alert">{error}</p>}
    {message && <p className="notice success">{message}</p>}
    <div className="transfer-box">
      <h2>Import notes</h2>
      <p className="muted">The first line must be <code>title,description</code>. One note goes on each following line.</p>
      <form onSubmit={upload} className="stack-form">
        <label>Choose a CSV file<input type="file" accept=".csv,text/csv" onChange={(event) => setFile(event.target.files[0] || null)} required /></label>
        <button className="button" disabled={!file || busy}>Import CSV</button>
      </form>
    </div>
    <div className="transfer-box"><h2>Export notes</h2>
      <p className="muted">Download your notes, excluding those in Trash.</p>
      <button className="button" disabled={busy} onClick={download}>Download CSV</button>
    </div>
  </section>
}
