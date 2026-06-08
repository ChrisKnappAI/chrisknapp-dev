export async function POST(req) {
  const { text, lang = 'es' } = await req.json()

  const voice = lang === 'en'
    ? { languageCode: 'en-US', name: 'en-US-Neural2-J' }
    : { languageCode: 'es-ES', name: 'es-ES-Neural2-B' }

  const speakingRate = lang === 'en' ? 0.92 : 0.88

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice,
        audioConfig: { audioEncoding: 'MP3', speakingRate },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    return new Response(`TTS error: ${err}`, { status: 500 })
  }

  const { audioContent } = await res.json()
  return new Response(Buffer.from(audioContent, 'base64'), {
    headers: { 'Content-Type': 'audio/mpeg' },
  })
}
