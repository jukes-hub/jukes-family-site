import { useState, useEffect } from 'react'

// ─── Mobile detection hook ────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:     '#F5EFE3',
  nav:    '#1a3d47',
  accent: '#c4893a',
  text:   '#2c2010',
  muted:  '#7a6a55',
  teal:   '#2d7a8a',
  card:   '#ffffff',
}

const styles = {
  card: {
    background: C.card,
    borderRadius: 16,
    border: '1px solid #e8ddd0',
    boxShadow: '0 2px 10px rgba(26,61,71,0.07)',
  },
  section: {
    maxWidth: 880,
    margin: '0 auto',
    padding: '44px 24px',
  },
  h2: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 34,
    color: C.text,
    marginBottom: 4,
    fontWeight: 600,
  },
  subhead: {
    color: C.muted,
    fontSize: 14,
    marginBottom: 28,
  },
}

// ─── Maths grid helpers ───────────────────────────────────────────────────────
function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function shuffled(arr, seed) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = hashCode(seed + i) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Components ──────────────────────────────────────────────────────────────

function Nav({ page, setPage }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const pages = ['Home', 'Photos', 'Messages', 'Useful Links', 'Over & Above']

  const logoStyle = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: isMobile ? 20 : 26,
    fontWeight: 600,
    color: 'white',
    letterSpacing: 5,
    padding: '14px 0',
  }

  if (isMobile) {
    return (
      <nav style={{ background: C.nav, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={logoStyle}>JUKES HUB</div>
          <button
            onClick={() => setMenuOpen(m => !m)}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer', padding: '14px 0' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {pages.map(p => (
              <button
                key={p}
                onClick={() => { setPage(p); setMenuOpen(false) }}
                style={{
                  display: 'block', width: '100%', padding: '14px 20px',
                  border: 'none', background: page === p ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: page === p ? 'white' : 'rgba(255,255,255,0.7)',
                  textAlign: 'left', fontSize: 15, letterSpacing: 1,
                  fontWeight: page === p ? 600 : 400, cursor: 'pointer',
                  borderLeft: page === p ? `3px solid ${C.accent}` : '3px solid transparent',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </nav>
    )
  }

  return (
    <nav style={{
      background: C.nav,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
    }}>
      <div style={logoStyle}>JUKES HUB</div>
      <div style={{ display: 'flex', gap: 2 }}>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              padding: '18px 14px',
              border: 'none',
              cursor: 'pointer',
              background: page === p ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: page === p ? 'white' : 'rgba(255,255,255,0.58)',
              fontSize: 12,
              letterSpacing: 1.5,
              fontWeight: page === p ? 600 : 400,
              borderBottom: page === p ? `2px solid ${C.accent}` : '2px solid transparent',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  )
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const isMobile = useIsMobile()
  const sections = [
    { label: 'PHOTOS',       icon: '📷', page: 'Photos'       },
    { label: 'MESSAGES',     icon: '💬', page: 'Messages'     },
    { label: 'USEFUL LINKS', icon: '🔗', page: 'Useful Links' },
    { label: 'OVER & ABOVE', icon: '⭐', page: 'Over & Above' },
  ]
  const dailyPhoto = getDailyPhoto()

  return (
    <div style={{ ...styles.section, padding: isMobile ? '32px 16px' : '44px 24px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 44 }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: isMobile ? 34 : 46,
          color: C.text,
          letterSpacing: 2,
          marginBottom: 8,
          fontWeight: 600,
        }}>
          Jukes Hub
        </h1>
        <p style={{ color: C.muted, fontSize: isMobile ? 15 : 18 }}>
          Sumner, Christchurch &nbsp;·&nbsp; New Zealand
        </p>
        <div style={{ width: 52, height: 3, background: C.accent, margin: '14px auto 0', borderRadius: 2 }} />
      </div>

      {/* Family photo — rotates daily */}
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(26,61,71,0.15)',
        border: '1px solid #e8ddd0',
        marginBottom: isMobile ? 24 : 36,
        aspectRatio: '4/3',
        background: '#d4eaef',
      }}>
        <img
          src={`/${dailyPhoto}`}
          alt="The Jukes family"
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        />
      </div>

      {/* Section shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 10 : 14 }}>
        {sections.map(s => (
          <button
            key={s.label}
            onClick={() => setPage(s.page)}
            style={{
              background: C.nav,
              borderRadius: 14,
              padding: isMobile ? '18px 12px' : '22px 12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(26,61,71,0.22)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,61,71,0.32)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,61,71,0.22)' }}
          >
            <span style={{ fontSize: isMobile ? 20 : 22 }}>{s.icon}</span>
            <span style={{ color: 'white', fontSize: 12, letterSpacing: 1.5, fontWeight: 600 }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Photos ───────────────────────────────────────────────────────────────────
// To link an album: replace the `url` value with your Google Photos shared album link.
const PHOTO_ALBUMS = [
  { name: 'Summer 2025–26',    date: 'Dec 2025',   thumb: '🏖️', count: 47,  url: 'https://photos.google.com' },
  { name: 'Swimming Carnival', date: 'Nov 2025',   thumb: '🏊', count: 23,  url: 'https://photos.google.com' },
  { name: 'Beach House Reno',  date: 'Ongoing',    thumb: '🏠', count: 89,  url: 'https://photos.google.com' },
  { name: 'Christmas 2024',    date: 'Dec 2024',   thumb: '🎄', count: 34,  url: 'https://photos.google.com' },
  { name: 'School Events',     date: '2025',       thumb: '🎒', count: 61,  url: 'https://photos.google.com' },
  { name: 'Family Trips',      date: '2024–25',    thumb: '✈️', count: 112, url: 'https://photos.google.com' },
]

function PhotosPage() {
  const isMobile = useIsMobile()
  return (
    <div style={{ ...styles.section, padding: isMobile ? '32px 16px' : '44px 24px' }}>
      <h2 style={styles.h2}>Photos</h2>
      <p style={styles.subhead}>Family albums — click to open in Google Photos</p>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 18 }}>
        {PHOTO_ALBUMS.map(a => (
          <a
            key={a.name}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.card, textDecoration: 'none', display: 'block', overflow: 'hidden', transition: 'transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = '' }}
          >
            <div style={{
              height: 100,
              background: 'linear-gradient(135deg, #d4eaef, #aed4dc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
            }}>
              {a.thumb}
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: C.text }}>{a.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{a.date} · {a.count} photos</div>
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: '#d4eaef', color: C.teal, fontWeight: 500 }}>
                  Open in Google Photos →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Messages ─────────────────────────────────────────────────────────────────
function MessagesPage() {
  const isMobile = useIsMobile()
  const [messages, setMessages] = useState([])
  const [me, setMe]             = useState(null)
  const [text, setText]         = useState('')
  const [posting, setPosting]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, msgsRes] = await Promise.all([
          fetch('/api/me', { credentials: 'include' }),
          fetch('/api/messages', { credentials: 'include' }),
        ])
        const [meData, msgs] = await Promise.all([meRes.json(), msgsRes.json()])
        setMe(meData)
        setMessages(Array.isArray(msgs) ? msgs : [])
      } catch {
        setError('Could not load messages.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const post = async () => {
    if (!text.trim()) return
    setPosting(true)
    await fetch('/api/messages', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const msgs = await fetch('/api/messages', { credentials: 'include' }).then(r => r.json())
    setMessages(Array.isArray(msgs) ? msgs : [])
    setText('')
    setPosting(false)
  }

  const del = async (id) => {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/messages?id=${id}`, { method: 'DELETE', credentials: 'include' })
    setMessages(m => m.filter(msg => msg.id !== id))
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-NZ', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const initials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ ...styles.section, maxWidth: 680, padding: isMobile ? '32px 16px' : '44px 24px' }}>
      <h2 style={styles.h2}>Messages</h2>
      <p style={styles.subhead}>Family noticeboard</p>

      {/* Compose box */}
      {me && !me.error && (
        <div style={{ ...styles.card, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: C.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 13, fontWeight: 600, flexShrink: 0,
            }}>
              {initials(me.name)}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{me.name}</span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write a message for the family..."
            rows={3}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid #d4c9bb', fontSize: 16, fontFamily: 'inherit',
              color: C.text, resize: 'vertical', outline: 'none',
              background: '#fdfaf6', WebkitAppearance: 'none',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              onClick={post}
              disabled={posting || !text.trim()}
              style={{
                background: text.trim() ? C.nav : '#ccc',
                color: 'white', border: 'none', borderRadius: 8,
                padding: '9px 22px', fontSize: 14, fontWeight: 600,
                cursor: text.trim() ? 'pointer' : 'default', transition: 'background 0.15s',
              }}
            >
              {posting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Messages list */}
      {loading && <p style={{ color: C.muted, fontSize: 14 }}>Loading messages…</p>}
      {error  && <p style={{ color: '#e05050', fontSize: 14 }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map(m => (
          <div key={m.id} style={{ ...styles.card, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: C.nav,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 12, fontWeight: 600, flexShrink: 0,
                }}>
                  {initials(m.author)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{m.author}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{formatDate(m.created_at)}</div>
                </div>
              </div>
              {me && (me.isAdmin || me.email === m.email) && (
                <button
                  onClick={() => del(m.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#ccc', fontSize: 18, lineHeight: 1, padding: '0 4px',
                  }}
                  title="Delete message"
                >
                  ×
                </button>
              )}
            </div>
            <p style={{ color: C.text, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{m.text}</p>
          </div>
        ))}
        {!loading && messages.length === 0 && (
          <p style={{ color: C.muted, fontSize: 14, textAlign: 'center', padding: '32px 0' }}>
            No messages yet — be the first to post!
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Links ────────────────────────────────────────────────────────────────────
// Add or edit links here — group them into categories.
const LINK_CATEGORIES = [
  {
    name: 'School & Sports',
    links: [
      { label: 'AquaGym',                        url: 'https://aquagym.co.nz/' },
      { label: 'Netball',                        url: 'https://www.sporty.co.nz/srnc/Home' },
      { label: 'Basketball',                     url: 'https://hillviewsport.wordpress.com/basketball/' }
      { label: 'Hillview Christian School',      url: 'https://www.hillview.school.nz/' },
    ],
  },
  {
    name: 'Family Admin',
    links: [
      { label: 'Google Calendar',  url: 'https://calendar.google.com' },
      { label: 'Google Drive',     url: 'https://drive.google.com' },
      { label: 'MetService', url: 'https://www.metservice.com/towns-cities/regions/christchurch/locations/christchurch' },
    ],
  },
  {
    name: 'Sumner Project',
    links: [
      { label: 'IRD',                  url: 'https://www.ird.govt.nz' },
      { label: 'CCC Building',         url: 'https://www.ccc.govt.nz' },
      { label: 'Christchurch Maps',    url: 'https://maps.ccc.govt.nz' },
    ],
  },
]

function LinksPage() {
  const isMobile = useIsMobile()
  return (
    <div style={{ ...styles.section, padding: isMobile ? '32px 16px' : '44px 24px' }}>
      <h2 style={styles.h2}>Useful Links</h2>
      <p style={styles.subhead}>Useful family bookmarks and resources</p>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 18 }}>
        {LINK_CATEGORIES.map(cat => (
          <div key={cat.name} style={{ ...styles.card, padding: 22 }}>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 15, color: C.nav, margin: '0 0 14px',
              paddingBottom: 10, borderBottom: '2px solid #e8ddd0',
            }}>
              {cat.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {cat.links.map(l => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: C.teal, textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span style={{ color: C.accent, fontSize: 15 }}>→</span>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Maths Grid Tool ──────────────────────────────────────────────────────────
function MathsGrid() {
  const isMobile = useIsMobile()
  const [mode, setMode]        = useState('addition')
  const [showAnswers, setShow] = useState(false)
  const [inputs, setInputs]    = useState({})
  const [checked, setChecked]  = useState({})
  const [gridIndex, setGridIndex] = useState(0)

  const allNums = Array.from({ length: 12 }, (_, i) => i + 1) // 1–12
  const seed = 'jukes-' + mode + '-' + gridIndex
  const mobileCount = 6

  // Desktop: all 12 numbers. Mobile: 6 randomly selected from 1–12
  const rows = isMobile
    ? shuffled(allNums, seed + 'r').slice(0, mobileCount)
    : shuffled(allNums, seed + 'r')
  const cols = isMobile
    ? shuffled(allNums, seed + 'c').slice(0, mobileCount)
    : shuffled(allNums, seed + 'c')

  const cellSize = isMobile ? 44 : 42

  const calc = (r, c) => mode === 'addition' ? r + c : r - c

  const handleInput = (key, val, answer) => {
    setInputs(p => ({ ...p, [key]: val }))
    if (val === '') { setChecked(p => { const n = {...p}; delete n[key]; return n }); return }
    setChecked(p => ({ ...p, [key]: parseInt(val) === answer ? 'correct' : 'wrong' }))
  }

  const reset = () => {
    setInputs({})
    setChecked({})
    setGridIndex(i => i + 1) // new shuffle each reset
  }

  const Btn = ({ children, active, onClick, outline }) => (
    <button onClick={onClick} style={{
      padding: '8px 18px', borderRadius: 8, border: outline ? `1px solid ${C.accent}` : 'none',
      cursor: 'pointer', fontSize: 13, fontWeight: 500,
      background: outline ? 'transparent' : active ? C.nav : '#e8ddd0',
      color: outline ? C.accent : active ? 'white' : C.text,
      transition: 'all 0.15s',
    }}>
      {children}
    </button>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        <Btn active={mode === 'addition'}    onClick={() => { setMode('addition');    reset() }}>Addition</Btn>
        <Btn active={mode === 'subtraction'} onClick={() => { setMode('subtraction'); reset() }}>Subtraction</Btn>
        <Btn outline onClick={() => setShow(s => !s)}>{showAnswers ? 'Hide Answers' : 'Show Answers'}</Btn>
        <Btn onClick={reset}>{isMobile ? 'New Grid' : 'Reset'}</Btn>
      </div>

      {isMobile && (
        <p style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
          Showing 6 numbers from 1–12. Tap "New Grid" for a different set.
        </p>
      )}

      <div style={{ overflowX: 'visible' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: cellSize, height: cellSize, background: C.nav, color: 'white', textAlign: 'center', fontSize: 16, borderRadius: '4px 0 0 0', flexShrink: 0 }}>
                {mode === 'addition' ? '+' : '−'}
              </th>
              {cols.map(c => (
                <th key={c} style={{ width: cellSize, height: cellSize, textAlign: 'center', background: C.nav, color: 'white', fontWeight: 600, fontSize: 14 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r}>
                <td style={{ textAlign: 'center', fontWeight: 600, background: '#d4eaef', width: cellSize, height: cellSize, fontSize: 14 }}>{r}</td>
                {cols.map(c => {
                  const answer = calc(r, c)
                  const key = `${r}-${c}`
                  const status = checked[key]

                  if (mode === 'subtraction' && answer < 0) {
                    return <td key={c} style={{ width: cellSize, height: cellSize, textAlign: 'center', color: '#ccc' }}>—</td>
                  }

                  return (
                    <td key={c} style={{ width: cellSize, height: cellSize, padding: 2 }}>
                      {showAnswers ? (
                        <div style={{ width: cellSize - 4, height: cellSize - 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.teal, fontSize: 14 }}>
                          {answer}
                        </div>
                      ) : (
                        <input
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={inputs[key] || ''}
                          onChange={e => handleInput(key, e.target.value, answer)}
                          style={{
                            width: cellSize - 4, height: cellSize - 4, textAlign: 'center',
                            border: `1px solid ${status === 'correct' ? '#4a9e6b' : status === 'wrong' ? '#e05050' : '#d4c9bb'}`,
                            borderRadius: 6, fontSize: 14, fontWeight: 600,
                            background: status === 'correct' ? '#e8f7ee' : status === 'wrong' ? '#fde8e8' : 'white',
                            color: status === 'correct' ? '#2d6e4a' : status === 'wrong' ? '#b03030' : C.text,
                            outline: 'none', cursor: 'text', display: 'block', margin: 'auto',
                          }}
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Daily photo rotation ─────────────────────────────────────────────────────
// To add more photos: upload them to the public/ folder and add the filename here
const FAMILY_PHOTOS = [
  'family.jpeg',
  // 'family2.jpeg',
  // 'family3.jpeg',
]

function getDailyPhoto() {
  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  return FAMILY_PHOTOS[dayOfYear % FAMILY_PHOTOS.length]
}

// ─── Tools ────────────────────────────────────────────────────────────────────
// To add a new tool: copy one of the entries below and fill in the details.
// Upload the HTML file to the public/ folder in GitHub first.
const TOOLS = [
  {
    name: "Cobie's Maths App",
    description: 'Addition, subtraction, multiplication & division up to 12 · Scoring · Leaderboard',
    icon: '🧮',
    url: '/cobies-maths.html',
  },
  {
    name: 'Maths Grid',
    description: 'Practise addition and subtraction facts 1–12 in a shuffled grid',
    icon: '📐',
    url: '/maths-grid.html',
  },
  {
    name: 'Epilog',
    description: 'Read, Rate, Remember',
    icon: '📖',
    url: 'https://epilog.org.nz',
  },
]

function OverAndAbovePage() {
  const isMobile = useIsMobile()
  return (
    <div style={{ ...styles.section, padding: isMobile ? '32px 16px' : '44px 24px' }}>
      <h2 style={styles.h2}>Over & Above</h2>
      <p style={styles.subhead}>Homework and learning tools</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TOOLS.map(t => (
          <div key={t.name} style={{ ...styles.card, padding: isMobile ? '20px' : '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: '#d4eaef', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 26, flexShrink: 0,
                }}>
                  {t.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isMobile ? 17 : 19, color: C.text, marginBottom: 4 }}>
                    {t.name}
                  </h3>
                  <p style={{ color: C.muted, fontSize: 13 }}>{t.description}</p>
                </div>
              </div>
              <a
                href={t.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  background: C.nav,
                  color: 'white',
                  padding: '11px 24px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  flexShrink: 0,
                  width: isMobile ? '100%' : 'auto',
                  textAlign: 'center',
                }}
              >
                Open →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
const VALID_PAGES = ['Home', 'Photos', 'Messages', 'Useful Links', 'Over & Above']

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '').replace(/-/g, ' ')
  return VALID_PAGES.includes(hash) ? hash : 'Home'
}

export default function App() {
  const [page, setPage] = useState(getPageFromHash)

  // Sync URL hash when page changes
  const navigate = (p) => {
    setPage(p)
    window.location.hash = p.replace(/ /g, '-')
  }

  // Handle browser back/forward and refresh
  useEffect(() => {
    const handler = () => setPage(getPageFromHash())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav page={page} setPage={navigate} />
      {page === 'Home'         && <HomePage     setPage={navigate} />}
      {page === 'Photos'       && <PhotosPage />}
      {page === 'Messages'     && <MessagesPage />}
      {page === 'Useful Links' && <LinksPage />}
      {page === 'Over & Above' && <OverAndAbovePage />}
    </div>
  )
}
