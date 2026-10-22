import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Bell, ChevronDown, Menu, RefreshCw, Search, Settings, User, LogOut } from 'lucide-react'
import Sidebar, { navItems } from './Sidebar'
import MailPanel from './MailPanel'
import MailDetail from './MailDetail'
import RightRail from './RightRail'
import ProfileModal from './ProfileModal'
import useLenisContainer from '../useLenisContainer'

export default function Dashboard({
  emails = [],
  accounts = [],
  theme,
  profile,
  updateEmails,
  setTheme,
  setToast,
  openCompose,
  setAccountModal,
  setProfile,
}) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [account, setAccount] = useState('all')
  const [folder, setFolder] = useState('inbox')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [selected, setSelected] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [animTrigger, setAnimTrigger] = useState(0)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  const searchRef = useRef(null)
  const profileMenuRef = useRef(null)
  const [searchRequested, setSearchRequested] = useState(false)

  const focusSearch = () => {
    setSearchRequested(true)
    navigate('/dashboard')
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileDropdownOpen])

  useEffect(() => {
    if (!id && searchRequested) {
      searchRef.current?.focus()
      setSearchRequested(false)
    }
  }, [id, searchRequested])

  useEffect(() => {
    const shortcut = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        focusSearch()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [navigate])

  const current = emails.find(mail => mail.id === id)

  const selectFolder = value => {
    setFolder(value)
    setFilter('all')
    setQuery('')
    setSelected([])
    setMenuOpen(false)
    navigate('/dashboard')
  }

  const selectAccount = value => {
    setAccount(value)
    setFolder('inbox')
    setFilter('all')
    setQuery('')
    setSelected([])
    setMenuOpen(false)
    navigate('/dashboard')
  }

  useEffect(() => {
    if (current && !current.read) updateEmails([current.id], { read: true })
  }, [id])

  const scoped = useMemo(
    () => emails.filter(mail => account === 'all' || mail.accountId === account),
    [emails, account]
  )

  const base = useMemo(
    () =>
      scoped.filter(mail =>
        folder === 'starred'
          ? mail.starred && mail.folder !== 'trash'
          : mail.folder === folder
      ),
    [scoped, folder]
  )

  const visible = useMemo(
    () =>
      base
        .filter(mail => {
          const matchesQuery = `${mail.sender} ${mail.subject} ${mail.preview} ${mail.attachment || ''}`
            .toLowerCase()
            .includes(query.toLowerCase())
          return (
            matchesQuery &&
            (filter === 'all' || (filter === 'unread' ? !mail.read : !!mail.attachment))
          )
        })
        .sort((a, b) =>
          sort === 'newest'
            ? new Date(b.date) - new Date(a.date)
            : new Date(a.date) - new Date(b.date)
        ),
    [base, query, filter, sort]
  )

  const unread = scoped.filter(mail => mail.folder === 'inbox' && !mail.read).length
  const countFor = item =>
    scoped.filter(mail =>
      item === 'starred' ? mail.starred && mail.folder !== 'trash' : mail.folder === item
    ).length
  const accountUnread = id =>
    emails.filter(mail => mail.accountId === id && mail.folder === 'inbox' && !mail.read).length

  const allSelected = visible.length > 0 && visible.every(mail => selected.includes(mail.id))
  const toggleSelected = id =>
    setSelected(current =>
      current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    )
  const bulk = patch => {
    updateEmails(selected, patch)
    setToast(`${selected.length} message${selected.length > 1 ? 's' : ''} updated`)
    setSelected([])
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const folderLabel = navItems.find(item => item.id === folder)?.label || 'Inbox'

  const targetTitle = useMemo(() => {
    return `${getGreeting()}, ${profile?.name || 'Rohith Naidu'}`
  }, [profile?.name])

  const { displayed: typedTitle, isTyping } = useTypewriter(targetTitle, 32, animTrigger)
  const animatedCount = useCountUp(base.length, 750, animTrigger)
  const animatedUnread = useCountUp(unread, 650, animTrigger)

  const refresh = () => {
    setLoading(true)
    setAnimTrigger(c => c + 1)
    setTimeout(() => {
      setLoading(false)
      setToast('Inbox is up to date')
    }, 600)
  }

  return (
    <div className="app-shell min-h-screen">
      {menuOpen && (
        <button
          className="mobile-scrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Clean Single Sidebar */}
      <Sidebar
        accounts={accounts}
        emails={emails}
        account={account}
        folder={folder}
        profile={profile}
        theme={theme}
        unread={unread}
        countFor={countFor}
        accountUnread={accountUnread}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        selectFolder={selectFolder}
        selectAccount={selectAccount}
        setTheme={setTheme}
        setAccountModal={setAccountModal}
        openCompose={openCompose}
        navigate={navigate}
        scoped={scoped}
      />

      <div className="content-area">
        {/* Authentic, Clean Email App Header */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="hamburger icon-btn"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="topbar-greeting">
              <h1>
                <span className="v14-typewriter-text" aria-label={targetTitle}>
                  {typedTitle}
                </span>
                <span className={`v14-typewriter-cursor ${isTyping ? 'typing' : 'done'}`}>|</span>
              </h1>
            </div>
          </div>

          {/* Top Navbar Search Bar (Sablefinch style) */}
          <div className="topbar-search-wrap">
            <label className="topbar-search-box">
              <Search size={16} />
              <input
                ref={searchRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                  setSelected([])
                  if (id) navigate('/dashboard')
                }}
                placeholder="Search mail..."
                aria-label="Search your emails"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <kbd>⌘K</kbd>
            </label>
          </div>

          <div className="topbar-right">
            <button
              className="outline-button nav-refresh"
              onClick={refresh}
              disabled={loading}
              aria-label="Refresh inbox"
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              className="icon-btn notification"
              aria-label="Show unread emails"
              title="Show unread emails"
              onClick={() => {
                selectFolder('inbox')
                setFilter('unread')
              }}
            >
              <Bell size={18} />
              {unread > 0 && <i />}
            </button>

            {/* Profile Pill & Dropdown */}
            <div className="top-profile-wrap" ref={profileMenuRef}>
              <button
                className="top-profile-btn"
                onClick={() => setProfileDropdownOpen(v => !v)}
                aria-label="User account menu"
                aria-expanded={profileDropdownOpen}
              >
                <span className="top-avatar">
                  {profile?.name
                    ? profile.name
                        .split(' ')
                        .map(w => w[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'RN'}
                </span>
                <span className="top-profile-name">{profile?.name || 'Rohith Naidu'}</span>
                <ChevronDown size={14} className={`top-chevron ${profileDropdownOpen ? 'open' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className="v14-dropdown-menu">
                  <div className="v14-dropdown-header">
                    <strong>{profile?.name || 'Rohith Naidu'}</strong>
                    <small>{profile?.email || 'rohith.naidu@gmail.com'}</small>
                  </div>
                  <div className="v14-dropdown-divider" />
                  <button
                    className="v14-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      setProfileModalOpen(true)
                    }}
                  >
                    <User size={15} />
                    <span>Manage Profile</span>
                  </button>
                  <button
                    className="v14-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      setAccountModal(true)
                    }}
                  >
                    <Settings size={15} />
                    <span>Manage Accounts</span>
                  </button>
                  <div className="v14-dropdown-divider" />
                  <button
                    className="v14-dropdown-item text-danger"
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      navigate('/sign-in')
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Mail Dashboard Body with Staggered Entrance Reveal */}
        <div className="dashboard-body v14-enter-stagger" key={`body-anim-${animTrigger}`}>
          <div className="dashboard-grid">
            <main className="mail-card panel" role="main">
              {id ? (
                current ? (
                  <SmoothDetail>
                    <MailDetail
                      email={current}
                      accounts={accounts}
                      navigate={navigate}
                      updateEmails={updateEmails}
                      openCompose={openCompose}
                      setToast={setToast}
                    />
                  </SmoothDetail>
                ) : (
                  <div className="empty-state">
                    <h3>Message not found</h3>
                    <button className="outline-button" onClick={() => navigate('/dashboard')}>
                      Back to inbox
                    </button>
                  </div>
                )
              ) : (
                <MailPanel
                  accounts={accounts}
                  account={account}
                  unread={unread}
                  base={base}
                  visible={visible}
                  folder={folder}
                  filter={filter}
                  setFilter={setFilter}
                  sort={sort}
                  setSort={setSort}
                  selected={selected}
                  setSelected={setSelected}
                  allSelected={allSelected}
                  toggleSelected={toggleSelected}
                  bulk={bulk}
                  loading={loading}
                  updateEmails={updateEmails}
                  navigate={navigate}
                />
              )}
            </main>
            <div className="desktop-right-rail">
              <RightRail scoped={scoped} navigate={navigate} />
            </div>
          </div>
        </div>
      </div>

      {/* Manage Profile Modal */}
      {profileModalOpen && (
        <ProfileModal
          profile={profile}
          setProfile={setProfile}
          accounts={accounts}
          openAddAccount={() => setAccountModal(true)}
          close={() => setProfileModalOpen(false)}
          setToast={setToast}
        />
      )}
    </div>
  )
}

function SmoothDetail({ children }) {
  const ref = useLenisContainer()
  return (
    <div className="detail-scroll" ref={ref} data-lenis-prevent>
      <div>{children}</div>
    </div>
  )
}

function useCountUp(target, duration = 750, trigger = 0) {
  const [count, setCount] = useState(() =>
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'test' ? target : 0
  )

  useEffect(() => {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
      setCount(target)
      return
    }

    let start = 0
    const end = Number(target) || 0
    if (end === 0) {
      setCount(0)
      return
    }

    const startTime = performance.now()
    let frameId

    const step = now => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setCount(current)

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration, trigger])

  return count
}

function useTypewriter(targetText, speed = 32, trigger = 0) {
  const [displayed, setDisplayed] = useState(() =>
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'test' ? targetText : ''
  )
  const [isTyping, setIsTyping] = useState(
    !(typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')
  )

  useEffect(() => {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
      setDisplayed(targetText)
      setIsTyping(false)
      return
    }

    setDisplayed('')
    setIsTyping(true)
    let index = 0
    const interval = setInterval(() => {
      index++
      setDisplayed(targetText.slice(0, index))
      if (index >= targetText.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [targetText, speed, trigger])

  return { displayed, isTyping }
}
