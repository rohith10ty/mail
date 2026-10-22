import { useState } from 'react'
import { ChevronRight, Heart, Star } from 'lucide-react'
import { formatDate, initials } from './shared'
import useLenisContainer from '../useLenisContainer'

export default function RightRail({ scoped, navigate }) {
  const [active, setActive] = useState('fav')
  const starred = scoped.filter(mail => mail.starred && mail.folder !== 'trash')
  const saved = scoped.filter(mail => mail.saved && mail.folder !== 'trash')
  const quickRef = useLenisContainer()
  const quickMails = active === 'fav' ? starred : saved

  return (
    <aside className="right-rail">
      <section className="insight-card panel" aria-label="Favorite and saved mail">
        <div className="rail-switch" role="tablist" aria-label="Quick mail views">
          <button
            role="tab"
            aria-selected={active === 'fav'}
            className={active === 'fav' ? 'active' : ''}
            onClick={() => setActive('fav')}
          >
            <Star size={15} fill={active === 'fav' ? 'currentColor' : 'none'} /> Fav{' '}
            <span>{starred.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={active === 'saved'}
            className={active === 'saved' ? 'active' : ''}
            onClick={() => setActive('saved')}
          >
            <Heart size={15} fill={active === 'saved' ? 'currentColor' : 'none'} /> Saved{' '}
            <span>{saved.length}</span>
          </button>
        </div>
        <div className="quick-list" ref={quickRef} data-lenis-prevent>
          <div>
            {quickMails.length ? (
              quickMails.map(mail => (
                <MiniMail
                  key={mail.id}
                  mail={mail}
                  navigate={navigate}
                  saved={active === 'saved'}
                />
              ))
            ) : (
              <p className="rail-empty">
                {active === 'fav'
                  ? 'Star a message to see it here.'
                  : 'Save a message to see it here.'}
              </p>
            )}
          </div>
        </div>
      </section>
    </aside>
  )
}

function MiniMail({ mail, navigate, saved }) {
  return (
    <button className="mini-mail" onClick={() => navigate(`/mail/${mail.id}`)}>
      <span className={`mini-avatar ${saved ? 'saved-avatar' : ''}`}>
        {initials(mail.sender)}
      </span>
      <span>
        <strong>{mail.subject}</strong>
        <small>
          {mail.sender} · {formatDate(mail.date)}
        </small>
      </span>
      <ChevronRight size={16} />
    </button>
  )
}
