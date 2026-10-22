import { useEffect, useLayoutEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { Check } from 'lucide-react'
import { initialAccounts, initialEmails } from './data/seed'
import Dashboard from './components/Dashboard'
import ComposeModal from './components/ComposeModal'
import AccountModal from './components/AccountModal'
import AuthPage from './components/AuthPage'
import './styles.css'
import './extras.css'
import './revamp.css'
import './v14.css'

const saveLocal = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* optional storage */ } }
const readLocal = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback } }

export default function App() {
  const renameDemo = value => JSON.parse(JSON.stringify(value).replaceAll('alex.morgan', 'rohith.naidu').replaceAll('Alex Morgan', 'Rohith Naidu').replaceAll('Alex Rivera', 'Arjun Rivera'))
  const [emails, setEmails] = useState(() => renameDemo(readLocal('mail-emails-v1', initialEmails)))
  const [accounts, setAccounts] = useState(() => renameDemo(readLocal('mail-accounts-v1', initialAccounts)))
  const [theme, setTheme] = useState(() => readLocal('mail-theme-v1', 'dark') === 'light' ? 'light' : 'dark')
  const [profile, setProfile] = useState(() => renameDemo(readLocal('mail-profile-v1', { name: 'Rohith Naidu', email: 'rohith.naidu@gmail.com' })))
  const [toast, setToast] = useState('')
  const [compose, setCompose] = useState(null)
  const [accountModal, setAccountModal] = useState(false)
  useEffect(() => saveLocal('mail-emails-v1', emails), [emails])
  useEffect(() => saveLocal('mail-accounts-v1', accounts), [accounts])
  useEffect(() => saveLocal('mail-theme-v1', theme), [theme])
  useEffect(() => saveLocal('mail-profile-v1', profile), [profile])
  useLayoutEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme }, [theme])
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer) }, [toast])
  const updateEmails = (ids, patch) => setEmails(current => current.map(mail => ids.includes(mail.id) ? { ...mail, ...patch } : mail))
  const openCompose = (mode = 'new', email = null) => setCompose({ mode, email })
  const createEmail = (fields, folder) => {
    const accountId = fields.accountId || accounts[0]?.id
    if (fields.editId) {
      setEmails(current => current.map(mail => mail.id === fields.editId ? { ...mail, accountId, sender: profile.name, senderEmail: accounts.find(account => account.id === accountId)?.address || profile.email, to: fields.to, cc: fields.cc, bcc: fields.bcc, subject: fields.subject || '(no subject)', preview: fields.body.slice(0, 140) || 'No message', body: fields.body, date: new Date().toISOString(), folder, attachment: fields.attachment?.name || null, attachmentKey: fields.attachment?.key || null } : mail))
      setCompose(null)
      setToast(folder === 'sent' ? 'Draft sent in demo workspace' : 'Draft updated')
      return
    }
    setEmails(current => [{
      id: `local-${Date.now()}`, accountId, sender: profile.name,
      senderEmail: accounts.find(a => a.id === accountId)?.address || profile.email,
      to: fields.to, cc: fields.cc, bcc: fields.bcc, subject: fields.subject || '(no subject)',
      preview: fields.body.slice(0, 140) || 'No message', body: fields.body, date: new Date().toISOString(),
      read: true, starred: false, saved: false, folder, attachment: fields.attachment?.name || null, attachmentKey: fields.attachment?.key || null,
    }, ...current])
    setCompose(null)
    setToast(folder === 'sent' ? 'Message sent in demo workspace' : 'Draft saved')
  }
  const props = { emails, accounts, theme, profile, updateEmails, setEmails, setTheme, setToast, openCompose, setAccountModal, setProfile }
  return <BrowserRouter><ReactLenis root options={{ lerp: 0.12, smoothWheel: true, syncTouch: true, allowNestedScroll: true }}>
    <Routes>
      <Route path="/sign-in" element={<AuthPage kind="sign-in" setProfile={setProfile} setTheme={setTheme} />} />
      <Route path="/sign-up" element={<AuthPage kind="sign-up" setProfile={setProfile} setTheme={setTheme} />} />
      <Route path="/forgot-password" element={<AuthPage kind="forgot" setProfile={setProfile} setTheme={setTheme} />} />
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
      <Route path="/dashboard" element={<Dashboard {...props} />} />
      <Route path="/mail/:id" element={<Dashboard {...props} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    {compose && <ComposeModal config={compose} accounts={accounts} close={() => setCompose(null)} submit={createEmail} />}
    {accountModal && <AccountModal accounts={accounts} add={account => { setAccounts(current => [...current, account]); setAccountModal(false); setToast(`${account.provider} account added to demo workspace`) }} close={() => setAccountModal(false)} />}
    {toast && <div className="toast" role="status"><Check size={16}/>{toast}</div>}
  </ReactLenis></BrowserRouter>
}
