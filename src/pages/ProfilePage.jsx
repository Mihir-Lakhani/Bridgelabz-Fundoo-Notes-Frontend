import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getProfile, updateProfile } from '../services/authService'

export default function ProfilePage({ onAuthError }) {
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getProfile().then((user) => { setProfile(user); setName(user.name) })
      .catch((problem) => { if (problem.status === 401) onAuthError(); setError(problem.message) })
  }, [onAuthError])

  async function save(event) {
    event.preventDefault()
    try {
      setProfile(await updateProfile(name.trim()))
      setMessage('Profile updated.')
      setError('')
    } catch (problem) { setError(problem.message); setMessage('') }
  }

  return <section className="page">
    <p className="eyebrow">YOUR ACCOUNT</p><h1>Profile</h1>
    {error && <p className="notice error" role="alert">{error}</p>}
    {message && <p className="notice success">{message}</p>}
    {!profile ? <p className="muted">Loading profile...</p> : <>
      <p className="muted">Email: {profile.email}</p>
      <p className="muted">Email status: {profile.verified ? 'Verified' : 'Not verified'}
        {!profile.verified && <> · <Link to="/verify">Enter verification token</Link></>}</p>
      <form className="stack-form profile-form" onSubmit={save}>
        <label>Display name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
        <button className="button">Save name</button>
      </form>
    </>}
  </section>
}
