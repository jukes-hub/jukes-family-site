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

export async function onRequestGet({ request }) {
  const email = getEmail(request)
  if (!email) return Response.json({ error: 'Not authenticated' }, { status: 401 })
  const name = EMAIL_TO_NAME[email] || email.split('@')[0]
  const isAdmin = email === 'steve@jukes.nz' || email === 'stevenjohnjukes@gmail.com'
  return Response.json({ email, name, isAdmin })
}
