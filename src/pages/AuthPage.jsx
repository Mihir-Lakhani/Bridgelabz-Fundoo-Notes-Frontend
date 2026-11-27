import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginUser, registerUser } from '../services/authService'
import { saveToken } from '../services/api'

export default function AuthPage({ mode, onLogin }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }) }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isRegister) {
        await registerUser(form)
        navigate('/login?registered=1')
      } else {
        const result = await loginUser({ email: form.email, password: form.password })
        saveToken(result.token)
        onLogin(result.token)
        navigate('/dashboard')
      }
    } catch (problem) { setError(problem.message) }
    finally { setBusy(false) }
  }

  return (
    <main className="auth-screen">
      <div className="auth-side"><div className="brand-mark">F</div><p className="eyebrow">FUNDOO NOTES</p><h1>Make room for<br />what matters.</h1><p>Write it down. Find it later. Keep moving.</p></div>
      <div className="auth-panel">
        <Link className="brand" to="/dashboard"><span className="small-mark">F</span> Fundoo Notes</Link>
        <div className="auth-box">
          <p className="eyebrow">{isRegister ? 'START HERE' : 'WELCOME BACK'}</p>
          <h2>{isRegister ? 'Create your account' : 'Log in to your notes'}</h2>
          {!isRegister && new URLSearchParams(location.search).has('registered') && <p className="notice success">Account created. You can log in now.</p>}
          {error && <p className="notice error" role="alert">{error}</p>}
          <form onSubmit={submit} className="stack-form">
            {isRegister && <label>Name<input name="name" value={form.name} onChange={change} required minLength="3" autoComplete="name" /></label>}
            <label>Email<input name="email" type="email" value={form.email} onChange={change} required autoComplete="email" /></label>
            <label>Password<input name="password" type="password" value={form.password} onChange={change} required minLength="8" autoComplete={isRegister ? 'new-password' : 'current-password'} /></label>
            <button className="button full" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button>
          </form>
          <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Fundoo?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create account'}</Link></p>
        </div>
      </div>
    </main>
  )
}
