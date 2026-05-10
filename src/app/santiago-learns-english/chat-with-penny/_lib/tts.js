/**
 * tts.js
 *
 * Text-to-speech helpers.
 *
 * Two modes:
 *   playPreBaked(index) — plays a pre-baked encouragement MP3 from /santiago/audio/encouragement/
 *   speakLive(text)     — calls Google TTS via /api/penny/tts and plays the result
 *
 * Both return a Promise that resolves when the audio finishes playing.
 */

/**
 * Plays a pre-baked encouragement phrase by index.
 * Files live at: public/santiago/audio/encouragement/{index}.mp3
 */
export function playPreBaked(index) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`/santiago-learns-english/chat-with-penny/audio/encouragement/${index}.mp3`);
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play().catch(reject);
  });
}

/**
 * Calls Google TTS for dynamic text (corrections, Penny's question responses).
 * Streams the MP3 back from the API route and plays it.
 */
export async function speakLive(text) {
  const res = await fetch('/api/penny/tts', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error('TTS API failed');

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended  = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror  = reject;
    audio.play().catch(reject);
  });
}

/**
 * Picks a random encouragement index and plays it.
 */
export function playRandomEncouragement(total) {
  const index = Math.floor(Math.random() * total);
  return playPreBaked(index);
}
