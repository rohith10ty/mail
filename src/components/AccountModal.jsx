import { useState } from 'react'
import useDialog from '../useDialog'
import { ArrowRight, Check, CircleHelp, X } from 'lucide-react'

const providers = [
  { name: 'Gmail', color: '#ea4335', letter: 'G' }, { name: 'iCloud', color: '#59b9ff', letter: 'i' },
  { name: 'Outlook', color: '#2878d0', letter: 'O' }, { name: 'Yahoo', color: '#8546d3', letter: 'Y' },
  { name: 'Proton Mail', color: '#7153bc', letter: 'P' }, { name: 'Other', color: '#f78d42', letter: '@' },
]
export default function AccountModal({ accounts, add, close }) {
  const dialogRef = useDialog(close)
  const [provider, setProvider] = useState(providers[0]), [address, setAddress] = useState(''), [error, setError] = useState('')
  const submit = e => { e.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return setError('Enter a valid email address.'); if (accounts.some(a => a.address.toLowerCase() === address.toLowerCase())) return setError('This account is already in your workspace.'); add({ id: `custom-${Date.now()}`, provider: provider.name, address, color: provider.color, letter: provider.letter }) }
  return <div data-lenis-prevent className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close() }}><div ref={dialogRef} className="account-modal" role="dialog" aria-modal="true" aria-label="Add mail account"><div className="modal-head"><div><span className="section-kicker">EXPAND YOUR SPACE</span><h2>Add an account</h2></div><button className="icon-btn" onClick={close} aria-label="Close"><X size={20}/></button></div><p className="modal-intro">Choose a provider to add another account to your unified workspace.</p><div className="provider-grid">{providers.map(item => <button key={item.name} className={provider.name === item.name ? 'provider-choice chosen' : 'provider-choice'} onClick={() => setProvider(item)}><span aria-hidden="true" className="provider-icon" style={{'--provider-color':item.color}}>{item.letter}</span><strong>{item.name}</strong>{provider.name === item.name && <Check size={16}/>}</button>)}</div><form onSubmit={submit}><label className="account-field">Email address<input type="email" placeholder="you@example.com" value={address} onChange={e => { setAddress(e.target.value); setError('') }}/></label>{error && <p className="form-error">{error}</p>}<div className="account-note"><CircleHelp size={16}/> This adds an account to the local demo. Live provider sign-in and syncing require a backend.</div><button className="primary-button wide" type="submit">Add account <ArrowRight size={16}/></button></form></div></div>
}
