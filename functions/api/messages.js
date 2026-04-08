const EMAIL_TO_NAME = {
  'steve@jukes.nz':           'Steve',
  'melanie@jukes.nz':         'Melanie',
  'honor@jukes.nz':           'Honor',
  'cobie@jukes.nz':           'Cobie',
  'stevenjohnjukes@gmail.com':'Steve',
  'honorjukes@gmail.com':     'Honor',
  'cobiejukes@gmail.com':     'Cobie',
}

function getEmail(request) {
  // Try header first (desktop)
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion')
  if (jwt) {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]))
      if (payload.email) return payload.email
    } catch {}
  }
  // Fall back to cookie (iOS Safari)
  const cookies = request.headers.get('Cookie') || ''
  const match = cookies.match(/CF_Authorization=([^;]+)/)
  if (match) {
    try {
      const payload = JSON.parse(atob(match[1].split('.')[1]))
      if (payload.email) return payload.email
    } catch {}
  }
  return null
}

// GET — fetch all messages
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT 100'
    ).all()
    return Response.json(results)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

// POST — post a new message
export async function onRequestPost({ request, env }) {
  const email = getEmail(request)
  if (!email) return Response.json({ error: 'Not authenticated' }, { status: 401 })

  const name = EMAIL_TO_NAME[email] || email.split('@')[0]
  const body = await request.json()
  const text = (body.text || '').trim()

  if (!text) return Response.json({ error: 'Message cannot be empty' }, { status: 400 })
  if (text.length > 1000) return Response.json({ error: 'Message too long' }, { status: 400 })

  await env.DB.prepare(
    'INSERT INTO messages (author, email, text, created_at) VALUES (?, ?, ?, ?)'
  ).bind(name, email, text, new Date().toISOString()).run()

  return Response.json({ success: true })
}

// DELETE — delete a message by id
export async function onRequestDelete({ request, env }) {
  const email = getEmail(request)
  if (!email) return Response.json({ error: 'Not authenticated' }, { status: 401 })

  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id) return Response.json({ error: 'No id provided' }, { status: 400 })

  const isAdmin = email === 'steve@jukes.nz' || email === 'stevenjohnjukes@gmail.com'

  if (isAdmin) {
    // Admin can delete any message
    await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run()
  } else {
    // Others can only delete their own
    await env.DB.prepare('DELETE FROM messages WHERE id = ? AND email = ?').bind(id, email).run()
  }

  return Response.json({ success: true })
}
