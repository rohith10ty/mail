import { useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { createThemeTransition } from '../lib/themeTransition'
import {
  Archive,
  FileText,
  Inbox,
  Mail,
  Moon,
  MoreHorizontal,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  Trash2,
  X,
} from 'lucide-react'
import useLenisContainer from '../useLenisContainer'
import RightRail from './RightRail'

export const navItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: FileText },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'spam', label: 'Spam', icon: ShieldAlert },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

export default function Sidebar({
  accounts = [],
  emails = [],
  account,
  folder,
  profile,
  theme,
  unread,
  countFor,
  accountUnread,
  menuOpen,
  setMenuOpen,
  selectFolder,
  selectAccount,
  setTheme,
  setAccountModal,
  openCompose,
  navigate,
  scoped,
}) {
  const [profileOpen, setProfileOpen] = useState(false)
  const sidebarRef = useLenisContainer()

  const toggleTheme = useMemo(
    () =>
      createThemeTransition({
        document,
        window,
        commit: next => flushSync(() => setTheme(next)),
      }),
    [setTheme]
  )

  return (
    <aside
      ref={sidebarRef}
      data-lenis-prevent
      className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}
    >
      <div className="sidebar-inner">
        {/* Brand Header with Mail Logo and Theme Switch */}
        <div className="sidebar-brand-row">
          <div className="brand" onClick={() => selectFolder('inbox')} style={{ cursor: 'pointer' }}>
            <div className="brand-mark">
              <Mail size={19} strokeWidth={2.4} />
            </div>
            <span>
              mail<span className="brand-dot">.</span>
            </span>
          </div>

          <div className="sidebar-header-actions">
            {/* V14 Capsule Sun/Moon Theme Switch */}
            <button
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Toggle dark mode"
              className={`v14-theme-capsule-switch ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="v14-theme-indicator-circle" />
              <span className="v14-theme-icon-slot sun">
                <Sun size={13} strokeWidth={2.2} />
              </span>
              <span className="v14-theme-icon-slot moon">
                <Moon size={13} strokeWidth={2.2} />
              </span>
            </button>

            {/* Mobile close button */}
            <button
              className="mobile-close icon-btn"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Compose Button */}
        <button
          className="compose-button"
          onClick={() => {
            setMenuOpen(false)
            openCompose()
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Compose mail</span>
        </button>

        {/* Folders Navigation */}
        <div className="nav-label">WORKSPACE</div>
        <nav className="folder-nav" aria-label="Mail folders">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${folder === item.id ? 'active' : ''}`}
              onClick={() => selectFolder(item.id)}
            >
              <item.icon size={17} strokeWidth={folder === item.id ? 2.3 : 1.9} />
              <span>{item.label}</span>
              {item.id === 'inbox' && unread > 0 ? (
                <span className="nav-count unread-count">{unread}</span>
              ) : countFor(item.id) > 0 && ['drafts', 'spam', 'trash'].includes(item.id) ? (
                <span className="nav-count">{countFor(item.id)}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Accounts Section */}
        <div className="accounts-heading">
          <span>ACCOUNTS</span>
          <button
            title="Add account"
            aria-label="Add account"
            className="small-icon"
            onClick={() => setAccountModal(true)}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="account-list">
          <button
            className={`account-item ${account === 'all' ? 'selected-account' : ''}`}
            onClick={() => selectAccount('all')}
          >
            <span className="all-icon">
              <Sparkles size={15} />
            </span>
            <span className="account-copy">
              <strong>All accounts</strong>
              <small>Unified inbox</small>
            </span>
            <span className="account-count">
              {emails.filter(mail => mail.folder === 'inbox' && !mail.read).length}
            </span>
          </button>

          {accounts.map(item => (
            <button
              key={item.id}
              className={`account-item ${account === item.id ? 'selected-account' : ''}`}
              onClick={() => selectAccount(item.id)}
            >
              <span className="provider-icon" style={{ '--provider-color': item.color }}>
                {item.letter}
              </span>
              <span className="account-copy">
                <strong>{item.provider}</strong>
                <small>{item.address}</small>
              </span>
              {accountUnread(item.id) > 0 && (
                <span className="account-count">{accountUnread(item.id)}</span>
              )}
            </button>
          ))}
        </div>

        <button className="add-account" onClick={() => setAccountModal(true)}>
          <Plus size={15} /> Add another account
        </button>

        {/* Mobile & Portrait iPad Drawer: Favorites & Saved */}
        {scoped && (
          <div className="sidebar-mobile-rail">
            <div className="sidebar-mobile-rail-heading">FAVORITES & SAVED</div>
            <RightRail
              scoped={scoped}
              navigate={to => {
                setMenuOpen(false)
                navigate?.(to)
              }}
            />
          </div>
        )}

        {/* User Profile Footer */}
        <div className="sidebar-bottom">
          <button
            className="profile-row"
            onClick={() => setProfileOpen(v => !v)}
          >
            <span className="profile-avatar">
              {profile?.name
                ? profile.name
                    .split(' ')
                    .map(w => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'RN'}
            </span>
            <span className="profile-copy">
              <strong>{profile?.name || 'Rohith Naidu'}</strong>
              <small>Personal workspace</small>
            </span>
            <MoreHorizontal size={17} />
          </button>

          {profileOpen && (
            <div className="profile-menu">
              <span>{profile?.email || 'rohith.naidu@gmail.com'}</span>
              <button onClick={() => navigate?.('/sign-in')}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
