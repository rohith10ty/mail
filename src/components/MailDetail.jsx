import { Archive, ArrowLeft, Download, EyeOff, FileText, Forward, Heart, Pencil, Reply, Star, Trash2, Undo2 } from 'lucide-react'
import { downloadAttachment } from '../lib/attachments'
import { initials } from './shared'

export default function MailDetail({ email, accounts, navigate, updateEmails, openCompose, setToast }) {
  const account = accounts.find(a => a.id === email.accountId)
  return (
    <div className="detail">
      {/* Top Header: [<- Back] [Subject] ... [• Gmail pill] [Action tools] */}
      <div className="detail-top">
        <div className="detail-top-left">
          <button
            className="back-button icon-only"
            onClick={() => navigate('/dashboard')}
            title="Back to inbox"
            aria-label="Back to inbox"
          >
            <ArrowLeft size={19} />
          </button>
          <h2 className="detail-top-subject" title={email.subject}>
            {email.subject}
          </h2>
        </div>

        <div className="detail-top-right">
          <span className="detail-provider">
            <i style={{ background: account?.color }} />
            {account?.provider}
          </span>
          <div className="detail-tools">
            <button
              title={email.starred ? 'Unstar' : 'Star'}
              onClick={() => updateEmails([email.id], { starred: !email.starred })}
              aria-label="Star email"
            >
              <Star size={18} fill={email.starred ? 'currentColor' : 'none'} />
            </button>
            <button
              title={email.saved ? 'Remove saved' : 'Save for later'}
              onClick={() => {
                updateEmails([email.id], { saved: !email.saved })
                setToast(email.saved ? 'Removed from saved' : 'Saved for later')
              }}
              aria-label="Save email"
            >
              <Heart size={18} fill={email.saved ? 'currentColor' : 'none'} />
            </button>
            <button
              title={email.read ? 'Mark unread' : 'Mark read'}
              onClick={() => {
                updateEmails([email.id], { read: !email.read })
                setToast(email.read ? 'Marked unread' : 'Marked read')
              }}
              aria-label="Toggle read"
            >
              <EyeOff size={18} />
            </button>
            <button
              title="Archive"
              onClick={() => {
                updateEmails([email.id], { folder: 'archive' })
                navigate('/dashboard')
                setToast('Message archived')
              }}
              aria-label="Archive"
            >
              <Archive size={18} />
            </button>
            {['trash', 'archive', 'spam'].includes(email.folder) && (
              <button
                title="Move to inbox"
                onClick={() => {
                  updateEmails([email.id], { folder: 'inbox' })
                  navigate('/dashboard')
                  setToast('Message restored to inbox')
                }}
                aria-label="Move to inbox"
              >
                <Undo2 size={18} />
              </button>
            )}
            <button
              title="Delete"
              onClick={() => {
                updateEmails([email.id], { folder: 'trash' })
                navigate('/dashboard')
                setToast('Message moved to trash')
              }}
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Body: Sender, Timestamp, Message content & Attachments brought to the top */}
      <div className="detail-body">
        <div className="detail-person">
          <span
            className="sender-avatar large"
            style={{ '--avatar-hue': (email.sender.length * 37) % 360 }}
          >
            {initials(email.sender)}
          </span>
          <div className="detail-person-info">
            <strong>
              {email.sender} <span className="detail-sender-email">&lt;{email.senderEmail}&gt;</span>
            </strong>
            <small>
              To: {email.to || 'me'}
              {email.cc ? ` · Cc: ${email.cc}` : ''}
            </small>
          </div>
          <time className="detail-timestamp">
            {new Date(email.date).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </time>
        </div>

        <div className="message-body">{email.body}</div>

        {email.attachment && (
          <div className="detail-attachment">
            <div className="file-icon">
              <FileText size={21} />
            </div>
            <div>
              <strong>{email.attachment}</strong>
              <small>
                {email.attachmentKey
                  ? 'Attachment · Stored in this browser'
                  : 'Sample attachment · Notes available'}
              </small>
            </div>
            <button
              onClick={() => downloadAttachment(email).catch(error => setToast(error.message))}
              title={email.attachmentKey ? 'Download attachment' : 'Download sample notes'}
              aria-label="Download attachment"
            >
              <Download size={18} />
            </button>
          </div>
        )}

        <div className="detail-actions">
          {email.folder === 'drafts' ? (
            <button onClick={() => openCompose('edit', email)}>
              <Pencil size={17} /> Edit draft
            </button>
          ) : (
            <>
              <button onClick={() => openCompose('reply', email)}>
                <Reply size={17} /> Reply
              </button>
              <button onClick={() => openCompose('forward', email)}>
                <Forward size={17} /> Forward
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
