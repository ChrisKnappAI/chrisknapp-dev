import { NextResponse } from 'next/server'

export function proxy(request) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/chris')) {
    const auth = request.cookies.get('chris_auth')
    if (auth?.value !== 'true') {
      return NextResponse.redirect(new URL('/login/chris', request.url))
    }
  }

  if (pathname.startsWith('/natalie')) {
    const auth = request.cookies.get('natalie_auth')
    if (auth?.value !== 'true') {
      return NextResponse.redirect(new URL('/login/natalie', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chris/:path*', '/natalie/:path*'],
}
