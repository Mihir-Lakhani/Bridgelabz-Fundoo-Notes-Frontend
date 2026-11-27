import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { forgotPassword, resendVerification, resetPassword, verifyEmail } from '../services/authService'

export default function AccountHelpPage({ mode }) {
  const [searchParams] = useSearchParams()
  const linkToken = searchParams.get('token')
  const attemptedLink = useRef(null)
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [token, setToken] = useState(searchParams.get('token') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState(searchParams.has('sent') ? 'Account created. Check your inbox for a verification link before logging in.' : '')
  const [verified, setVerified] = useState(false)
  const [busy, setBusy] = useState(false)
  const title = mode === 'verify' ? 'Verify your email' : mode === 'forgot' ? 'Forgot password' : 'Reset password'

  useEffect(() => {
    if (mode !== 'verify' || !linkToken || attemptedLink.current === linkToken) return
    attemptedLink.current = linkToken
    setBusy(true)
    setError('')
    verifyEmail(linkToken)
      .then(() => { setVerified(true); setMessage('Email verified. You can log in.') })
      .catch((problem) => setError(problem.message))
      .finally(() => setBusy(false))
  }, [mode, linkToken])

  async function resend(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await resendVerification(email.trim())
      setMessage('If this email is registered and unverified, a new link has been sent.')
    } catch (problem) { setError(problem.message) }
    finally { setBusy(false) }
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      if (mode === 'verify') {
        await verifyEmail(token.trim())
        setVerified(true)
      }
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
        {(!verified || mode !== 'verify') && <form className="stack-form" onSubmit={submit}>
          {mode === 'forgot' ? <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            : <label>{mode === 'verify' ? 'Verification token' : 'Reset token'}<input value={token} onChange={(event) => setToken(event.target.value)} required /></label>}
          {mode === 'reset' && <label>New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" required /></label>}
          <button className="button full" disabled={busy}>{busy ? 'Please wait…' : title}</button>
        </form>}
        {mode === 'verify' && !verified && <form className="stack-form" onSubmit={resend}>
          <label>Need a new link? Enter your email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <button className="button full" disabled={busy}>{busy ? 'Please wait…' : 'Resend verification link'}</button>
        </form>}
        <p className="auth-switch"><Link to="/login">Back to login</Link>{mode === 'forgot' && <> · <Link to="/reset-password">I have a reset token</Link></>}</p>
      </div>
    </div>
  </main>
}
