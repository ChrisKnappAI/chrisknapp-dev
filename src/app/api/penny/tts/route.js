/**
 * POST /api/penny/tts
 *
 * Converts text to speech using Google Cloud TTS Neural2 voice.
 * Returns the audio as an MP3 binary stream.
 *
 * Requires env var: GOOGLE_TTS_API_KEY
 *
 * Body:   { text: string }
 * Returns MP3 audio binary
 */

export async function POST(req) {
  const { text } = await req.json();

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input:       { text },
        voice:       { languageCode: 'en-US', name: 'en-US-Neural2-F' },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9, pitch: 2.0 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return new Response(`TTS error: ${err}`, { status: 500 });
  }

  const { audioContent } = await res.json();
  const buffer = Buffer.from(audioContent, 'base64');

  return new Response(buffer, {
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}
