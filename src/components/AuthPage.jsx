import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Check, Eye, EyeOff, Mail, Sparkles } from 'lucide-react'

export default function AuthPage({ kind, setProfile, setTheme }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState(() => (kind === 'sign-in' ? 'rohith.naidu@gmail.com' : ''))
  const [password, setPassword] = useState(() => (kind === 'sign-in' ? 'password123' : ''))
  const [confirm, setConfirm] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const isSignUp = kind === 'sign-up'
  const isForgot = kind === 'forgot'
  const submit = e => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.')
    if (isForgot) {
      setDone(true)
      setError('')
      return
    }
    if (isSignUp && name.trim().length < 2) return setError('Enter your name.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (isSignUp && password !== confirm) return setError('Passwords do not match.')
    setProfile?.({ name: isSignUp ? name.trim() : 'Rohith Naidu', email: email.trim() })
    if (kind === 'sign-in' && setTheme) {
      setTheme('light')
    }
    navigate('/dashboard')
  }
  return <div className="auth-page"><div className="auth-visual"><div className="auth-brand"><span className="brand-mark"><Mail size={21}/></span><strong>mail<span>.</span></strong></div><div className="auth-art"><div className="art-halo"/><div className="art-card art-card-back"><span/><span/><span/></div><div className="art-card art-card-front"><div className="art-top"><span className="art-icon"><Mail size={23}/></span><span className="art-spark"><Sparkles size={18}/></span></div><div className="art-line wide-line"/><div className="art-line"/><div className="art-line short-line"/><div className="art-bottom"><span/><span/><span/></div></div></div><div className="auth-visual-copy"><span>ONE SPACE. EVERY CONVERSATION.</span><h2>Make room for<br/>what matters.</h2><p>A calmer way to keep up with every inbox, all in one place.</p></div><div className="auth-visual-footer">© 2026 mail. Made for better conversations.</div></div><div className="auth-form-side"><div className="auth-mobile-brand"><span className="brand-mark"><Mail size={19}/></span><strong>mail<span>.</span></strong></div><div className="auth-form-wrap"><div className="auth-kicker">WELCOME TO MAIL <span>✳</span></div><h1>{isForgot ? 'Reset password' : isSignUp ? 'Create an account' : 'Welcome back'}</h1><p className="auth-subtitle">{isForgot ? 'Enter your email and we’ll show a demo reset confirmation.' : isSignUp ? 'Your conversations look better together.' : 'Sign in to your personal workspace.'}</p>{done ? <div className="reset-done"><div><Check size={24}/></div><h3>Check your inbox</h3><p>In a connected app, a reset link would be sent to {email}. This demo does not send email.</p><button className="primary-button wide" onClick={() => navigate('/sign-in')}>Back to sign in</button></div> : <form onSubmit={submit} noValidate>{isSignUp && <label className="auth-field">Full name<input value={name} onChange={e => {setName(e.target.value);setError('')}} placeholder="Rohith Naidu" autoComplete="name"/></label>}<label className="auth-field">Email address<input type="email" value={email} onChange={e => {setEmail(e.target.value);setError('')}} placeholder="you@example.com" autoComplete="email"/></label>{!isForgot && <label className="auth-field">Password<span className="password-wrap"><input type={visible ? 'text':'password'} value={password} onChange={e => {setPassword(e.target.value);setError('')}} placeholder="At least 8 characters" autoComplete={isSignUp ? 'new-password':'current-password'}/><button type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? 'Hide password':'Show password'}>{visible ? <EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>}{isSignUp && <label className="auth-field">Confirm password<input type={visible ? 'text':'password'} value={confirm} onChange={e => {setConfirm(e.target.value);setError('')}} placeholder="Repeat your password" autoComplete="new-password"/></label>}{!isForgot && !isSignUp && <button type="button" className="forgot-link" onClick={() => navigate('/forgot-password')}>Forgot password?</button>}{error && <p className="form-error">{error}</p>}<button type="submit" className="primary-button wide">{isForgot ? 'Reset password' : isSignUp ? 'Create account':'Sign in'} <ArrowRight size={17}/></button></form>}<div className="auth-switch">{isForgot ? <>Remembered it? <button onClick={() => navigate('/sign-in')}>Sign in</button></> : isSignUp ? <>Already have an account? <button onClick={() => navigate('/sign-in')}>Sign in</button></> : <>New to mail? <button onClick={() => navigate('/sign-up')}>Create an account</button></>}</div><button className="demo-link" onClick={() => { setTheme?.('light'); navigate('/dashboard') }}>Explore the demo workspace <ArrowRight size={15}/></button></div><div className="auth-bottom">Private by design. Simple by nature.</div></div></div>
}

