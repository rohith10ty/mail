import { useState } from 'react'
import { Archive, ChevronDown, Ellipsis, Eye, EyeOff, Heart, Mail, Paperclip, Star, Trash2 } from 'lucide-react'
import { formatDate, initials } from './shared'
import { navItems } from './Sidebar'
import useLenisContainer from '../useLenisContainer'

export default function MailPanel({ accounts, account = 'all', unread = 0, base, visible, folder, filter, setFilter, sort, setSort, selected, setSelected, allSelected, toggleSelected, bulk, loading, updateEmails, navigate }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const listRef = useLenisContainer()
  const folderName = navItems.find(item => item.id === folder)?.label || 'Inbox'
  const accountLabel = account === 'all' ? 'All accounts' : accounts.find(a => a.id === account)?.provider || 'Active account'

  return (
    <>
      <div className="mail-card-header">
        <div>
          <h2>
            {folderName} <span className="folder-count-badge">{base.length}</span>
          </h2>
          <p className="mail-card-subtitle">{base.length} total · {unread} unread · {accountLabel}</p>
        </div>
        <button className="more-button" title="More options" onClick={() => setMoreOpen(v => !v)}>
          <Ellipsis size={23} />
        </button>
        {moreOpen && (
          <div className="more-menu">
            <button onClick={() => { setSort(sort === 'newest' ? 'oldest' : 'newest'); setMoreOpen(false) }}>
              Sort {sort === 'newest' ? 'oldest first' : 'newest first'}
            </button>
            <button onClick={() => { setFilter('all'); setMoreOpen(false) }}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs (All mail / Unread / Attachments) */}
      <div className="filter-line">
        <div className="filter-tabs">
          {[
            ['all', 'All mail'],
            ['unread', 'Unread'],
            ['attachments', 'Attachments'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? 'filter-active' : ''}
              onClick={() => {
                setFilter(value)
                setSelected([])
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="sort-button" onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}>
          {sort === 'newest' ? 'Newest first' : 'Oldest first'} <ChevronDown size={15} />
        </button>
      </div>

      {/* Selection Bar: Only rendered when items are selected */}
      {selected.length > 0 && (
        <div className="selection-bar active-selection">
          <label className="select-all">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => setSelected(allSelected ? [] : visible.map(mail => mail.id))}
              aria-label="Select all visible emails"
            />
            <span>{selected.length} selected</span>
          </label>
          <div className="bulk-actions">
            <button title="Mark as read" aria-label="Mark selected as read" onClick={() => bulk({ read: true })}>
              <Eye size={16} />
            </button>
            <button title="Mark as unread" aria-label="Mark selected as unread" onClick={() => bulk({ read: false })}>
              <EyeOff size={16} />
            </button>
            <button title="Star" aria-label="Star selected" onClick={() => bulk({ starred: true })}>
              <Star size={16} />
            </button>
            <button title="Save for later" aria-label="Save selected" onClick={() => bulk({ saved: true })}>
              <Heart size={16} />
            </button>
            <button title="Archive" aria-label="Archive selected" onClick={() => bulk({ folder: 'archive' })}>
              <Archive size={16} />
            </button>
            <button title="Delete" aria-label="Delete selected" onClick={() => bulk({ folder: 'trash' })}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mail List */}
      <div className="mail-list" ref={listRef} data-lenis-prevent>
        <div className="mail-list-inner">
          {loading ? (
            <div className="loading-list">
              {[1, 2, 3, 4, 5].map(x => (
                <div className="loading-row" key={x}>
                  <span />
                  <div>
                    <i />
                    <i />
                  </div>
                </div>
              ))}
            </div>
          ) : visible.length ? (
            visible.map(mail => (
              <MailRow
                key={mail.id}
                mail={mail}
                accounts={accounts}
                selected={selected.includes(mail.id)}
                onSelect={() => toggleSelected(mail.id)}
                onOpen={() => navigate(`/mail/${mail.id}`)}
                onStar={() => updateEmails([mail.id], { starred: !mail.starred })}
              />
            ))
          ) : (
            <div className="empty-state">
              <div>
                <Mail size={29} />
              </div>
              <h3>Nothing here yet</h3>
              <p>Messages in {folder} will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mail-footer">
        <span>Showing {visible.length} of {base.length} messages</span>
        <span>All messages loaded</span>
      </div>
    </>
  )
}

function MailRow({ mail, accounts, selected, onSelect, onOpen, onStar }) {
  const provider = accounts.find(account => account.id === mail.accountId)
  return (
    <div className={`mail-row ${!mail.read ? 'unread' : ''} ${selected ? 'row-selected' : ''}`}>
      <label className="row-check">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          aria-label={`Select ${mail.subject}`}
        />
      </label>
      <button
        className={`row-star ${mail.starred ? 'is-starred' : ''}`}
        onClick={onStar}
        aria-label={mail.starred ? 'Remove star' : 'Star email'}
      >
        <Star size={18} fill={mail.starred ? 'currentColor' : 'none'} />
      </button>
      <button className="row-main" onClick={onOpen}>
        <span
          className="sender-avatar"
          style={{ '--avatar-hue': (mail.sender.length * 37) % 360 }}
        >
          {initials(mail.sender)}
        </span>
        <span className="row-copy">
          <span className="sender-line">
            <strong className="sender-name">{mail.sender}</strong>
            <span className="mail-time">{formatDate(mail.date)}</span>
          </span>
          <span className="subject-line">{mail.subject}</span>
          <span className="preview-line">{mail.preview}</span>
          <span className="row-meta">
            <span className="provider-tag">
              <i style={{ background: provider?.color }} /> {provider?.provider}
            </span>
            {mail.attachment && (
              <span className="attachment-tag">
                <Paperclip size={13} /> {mail.attachment}
              </span>
            )}
          </span>
        </span>
      </button>
      {!mail.read && <span className="unread-dot" />}
    </div>
  )
}
