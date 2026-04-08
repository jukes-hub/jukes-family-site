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
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion')
  if (!jwt) return null
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]))
    return payload.email || null
  } catch {
    return null
  }
}

export async function onRequestGet({ request }) {
  const email = getEmail(request)
  if (!email) return Response.json({ error: 'Not authenticated' }, { status: 401 })
  const name = EMAIL_TO_NAME[email] || email.split('@')[0]
  const isAdmin = email === 'steve@jukes.nz' || email === 'stevenjohnjukes@gmail.com'
  return Response.json({ email, name, isAdmin })
}
