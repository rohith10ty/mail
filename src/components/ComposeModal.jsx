import { useRef, useState } from 'react'
import useDialog from '../useDialog'
import { storeAttachment } from '../lib/attachments'
import { ArrowRight, Paperclip, Send, X } from 'lucide-react'

export default function ComposeModal({ config, accounts, close, submit }) {
  const dialogRef = useDialog(close)
  const [uploading, setUploading] = useState(false)
  const source = config.email
  const [form, setForm] = useState({ editId: config.mode === 'edit' ? source?.id : null, accountId: source?.accountId || accounts[0]?.id || '', to: config.mode === 'reply' ? source?.senderEmail || '' : config.mode === 'edit' ? source?.to || '' : '', cc: config.mode === 'edit' ? source?.cc || '' : '', bcc: config.mode === 'edit' ? source?.bcc || '' : '', subject: config.mode === 'reply' ? `Re: ${source.subject}` : config.mode === 'forward' ? `Fwd: ${source.subject}` : config.mode === 'edit' ? source?.subject || '' : '', body: config.mode === 'forward' ? `\n\n---------- Forwarded message ----------\nFrom: ${source.sender}\nSubject: ${source.subject}\n\n${source.body}` : config.mode === 'edit' ? source?.body || '' : '', attachment: ['edit', 'forward'].includes(config.mode) && source?.attachment ? { name: source.attachment, key: source.attachmentKey } : null })
  const [showExtra, setShowExtra] = useState(Boolean(source?.cc || source?.bcc)), [error, setError] = useState('')
  const fileRef = useRef(null)
  const change = (key, value) => { setForm(current => ({...current,[key]:value})); setError('') }
  const attach = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    try { change('attachment', await storeAttachment(file)) }
    catch { setError('Could not save the attachment. Check available browser storage and try again.') }
    finally { setUploading(false) }
  }
  const validEmails = value => value.split(',').every(address => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.trim()))
  const send = () => { if (!form.to.trim() || !validEmails(form.to)) return setError('Enter a valid recipient email address.'); if (form.cc && !validEmails(form.cc)) return setError('Enter a valid CC address.'); if (form.bcc && !validEmails(form.bcc)) return setError('Enter a valid BCC address.'); if (!form.subject.trim()) return setError('Add a subject before sending.'); if (!form.body.trim()) return setError('Write a message before sending.'); submit(form,'sent') }
  return <div data-lenis-prevent className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close() }}><div ref={dialogRef} className="compose-modal" role="dialog" aria-modal="true" aria-label="Compose mail"><div className="modal-head"><div><span className="section-kicker">NEW CONVERSATION</span><h2>{config.mode === 'reply' ? 'Reply to message' : config.mode === 'forward' ? 'Forward message' : config.mode === 'edit' ? 'Edit draft' : 'Compose mail'}</h2></div><button className="icon-btn" onClick={close} aria-label="Close compose"><X size={20}/></button></div><div className="compose-fields"><label><span>From</span><select value={form.accountId} onChange={e => change('accountId',e.target.value)}>{accounts.map(account => <option key={account.id} value={account.id}>{account.address}</option>)}</select></label><label><span>To</span><input type="text" placeholder="name@example.com" value={form.to} onChange={e => change('to',e.target.value)}/><button type="button" className="cc-trigger" onClick={() => setShowExtra(v => !v)}>Cc / Bcc</button></label>{showExtra && <><label><span>Cc</span><input type="text" placeholder="Optional" value={form.cc} onChange={e => change('cc',e.target.value)}/></label><label><span>Bcc</span><input type="text" placeholder="Optional" value={form.bcc} onChange={e => change('bcc',e.target.value)}/></label></>}<label><span>Subject</span><input type="text" placeholder="Add a subject" value={form.subject} onChange={e => change('subject',e.target.value)}/></label><textarea aria-label="Message" placeholder="Write your message here..." value={form.body} onChange={e => change('body',e.target.value)}/></div>{form.attachment && <div className="attached-file"><Paperclip size={16}/>{form.attachment.name}<button onClick={() => change('attachment',null)} aria-label="Remove attachment"><X size={14}/></button></div>}{error && <p className="form-error">{error}</p>}<div className="compose-footer"><div><input ref={fileRef} type="file" hidden onChange={attach}/><button className="icon-btn" title="Attach file" disabled={uploading} onClick={() => fileRef.current?.click()}><Paperclip size={19}/></button><span>{uploading ? 'Saving attachment…' : 'Demo workspace'}</span></div><div><button className="text-button" onClick={close}>Discard</button><button className="outline-button" disabled={uploading} onClick={() => submit(form,'drafts')}>Save draft</button><button className="primary-button" disabled={uploading} onClick={send}>Send mail <Send size={16}/></button></div></div></div></div>
}
