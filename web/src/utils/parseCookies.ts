import cookie from 'cookie'

type Request = {
  headers?: any
}

export default function parseCookies(req: Request) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie)
}
