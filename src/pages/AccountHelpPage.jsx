import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { forgotPassword, resetPassword, verifyEmail } from '../services/authService'

export default function AccountHelpPage({ mode }) {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState(searchParams.get('token') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const title = mode === 'verify' ? 'Verify your email' : mode === 'forgot' ? 'Forgot password' : 'Reset password'

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      if (mode === 'verify') await verifyEmail(token.trim())
      else if (mode === 'forgot') await forgotPassword(email.trim())
      else await resetPassword(token.trim(), password)
      setMessage(mode === 'verify' ? 'Email verified. You can log in.'
        : mode === 'forgot' ? 'If the email exists, a reset token has been sent.' : 'Password changed. You can log in.')
    } catch (problem) { setError(problem.message) }
    finally { setBusy(false) }
  }

  return <main className="auth-screen">
    <div className="auth-side"><div className="brand-mark">F</div><p className="eyebrow">FUNDOO NOTES</p><h1>Your notes,<br />your space.</h1></div>
    <div className="auth-panel"><Link className="brand" to="/login"><span className="small-mark">F</span> Fundoo Notes</Link>
      <div className="auth-box"><p className="eyebrow">ACCOUNT HELP</p><h2>{title}</h2>
        {error && <p className="notice error" role="alert">{error}</p>}
        {message && <p className="notice success">{message}</p>}
        <form className="stack-form" onSubmit={submit}>
          {mode === 'forgot' ? <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            : <label>{mode === 'verify' ? 'Verification token' : 'Reset token'}<input value={token} onChange={(event) => setToken(event.target.value)} required /></label>}
          {mode === 'reset' && <label>New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" required /></label>}
          <button className="button full" disabled={busy}>{busy ? 'Please wait…' : title}</button>
        </form>
        <p className="auth-switch"><Link to="/login">Back to login</Link>{mode === 'forgot' && <> · <Link to="/reset-password">I have a reset token</Link></>}</p>
      </div>
    </div>
  </main>
}
