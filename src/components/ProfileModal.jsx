import { useState } from 'react'
import useDialog from '../useDialog'
import { ArrowRight, Check, Mail, Plus, Shield, User, X } from 'lucide-react'

export default function ProfileModal({
  profile,
  setProfile,
  accounts = [],
  openAddAccount,
  close,
  setToast,
}) {
  const dialogRef = useDialog(close)
  const [name, setName] = useState(profile?.name || 'Rohith Naidu')
  const [email, setEmail] = useState(profile?.email || 'rohith.naidu@gmail.com')
  const [error, setError] = useState('')

  const initials = (name.trim() || 'RN')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleSubmit = e => {
    e.preventDefault()
    if (!name.trim()) {
      return setError('Please enter your name.')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError('Please enter a valid email address.')
    }
    setProfile?.(curr => ({
      ...curr,
      name: name.trim(),
      email: email.trim(),
    }))
    setToast?.('Profile updated successfully!')
    close()
  }

  return (
    <div
      data-lenis-prevent
      className="modal-backdrop"
      onMouseDown={e => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        ref={dialogRef}
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Manage Profile"
      >
        <div className="modal-head">
          <div>
            <span className="section-kicker">USER PREFERENCES</span>
            <h2>Manage Profile</h2>
          </div>
          <button className="icon-btn" onClick={close} aria-label="Close profile modal">
            <X size={20} />
          </button>
        </div>

        {/* Live Avatar Preview Card */}
        <div className="profile-preview-card">
          <div className="profile-preview-avatar">
            <span>{initials}</span>
          </div>
          <div className="profile-preview-info">
            <strong>{name.trim() || 'Your Name'}</strong>
            <small>{email.trim() || 'your.email@example.com'}</small>
            <span className="profile-workspace-badge">
              <Shield size={12} /> Personal Workspace
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-form-fields">
            <label className="account-field">
              Full Name
              <input
                type="text"
                placeholder="Rohith Naidu"
                value={name}
                onChange={e => {
                  setName(e.target.value)
                  setError('')
                }}
              />
            </label>

            <label className="account-field">
              Primary Email Address
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setError('')
                }}
              />
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          {/* Connected Accounts Quick List */}
          <div className="profile-accounts-section">
            <div className="profile-accounts-head">
              <span>CONNECTED ACCOUNTS ({accounts.length})</span>
              <button
                type="button"
                className="profile-add-acc-link"
                onClick={() => {
                  close()
                  openAddAccount?.()
                }}
              >
                <Plus size={14} /> Add Account
              </button>
            </div>
            <div className="profile-accounts-pills">
              {accounts.map(acc => (
                <div key={acc.id} className="profile-acc-pill">
                  <span
                    className="provider-dot"
                    style={{ background: acc.color || '#ff5722' }}
                  />
                  <strong>{acc.provider}</strong>
                  <small>{acc.address}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-modal-actions">
            <button type="button" className="text-button" onClick={close}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Changes <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
