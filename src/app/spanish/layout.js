import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Spanish B2',
  description: 'Spanish vocabulary flashcards',
  manifest: '/spanish-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Spanish B2',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default async function SpanishAppLayout({ children }) {
  const jar = await cookies()
  if (jar.get('chris_auth')?.value !== 'true') {
    redirect('/login/chris')
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #080D14; overflow: hidden; }
        #__next, main { height: 100%; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
      {children}
    </>
  )
}
