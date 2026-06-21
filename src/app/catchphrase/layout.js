import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Catchphrase Español',
  description: 'Spanish catchphrase practice',
  manifest: '/catchphrase-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Catchphrase',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default async function CatchphraseLayout({ children }) {
  const jar = await cookies()
  if (jar.get('chris_auth')?.value !== 'true') {
    redirect('/login/chris')
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { height: 100%; background: #0D0D14; }
        body { height: 100%; background: #0D0D14; overflow: hidden; -webkit-text-size-adjust: 100%; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      {children}
    </>
  )
}
