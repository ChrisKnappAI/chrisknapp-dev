// Reads spanish_vocab — dumps Chris's learned + introduced words to JSON
// so the catchphrase generator knows what vocab he actually owns.

const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://kkwafiscyshdailnourb.supabase.co'
const ENV_PATH = 'C:\\KnappFiles\\chrisknapp-dev\\.env'

function readEnv(p) {
  return fs.readFileSync(p, 'utf-8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/)
    if (m) acc[m[1].trim()] = m[2].trim()
    return acc
  }, {})
}

const env = readEnv(ENV_PATH)
const sb = createClient(SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

async function main() {
  console.log('Fetching learned + introduced words from spanish_vocab...')

  const all = []
  let from = 0
  const pageSize = 1000
  while (true) {
    const { data, error } = await sb
      .from('spanish_vocab')
      .select('spanish, english, part_of_speech, cefr_level, is_learned, is_introduced')
      .or('is_learned.eq.true,is_introduced.eq.true')
      .range(from, from + pageSize - 1)
    if (error) { console.error(error); process.exit(1) }
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < pageSize) break
    from += pageSize
  }

  const learned = all.filter(w => w.is_learned)
  const introduced = all.filter(w => w.is_introduced && !w.is_learned)

  console.log(`  Learned: ${learned.length}`)
  console.log(`  Introduced (not yet learned): ${introduced.length}`)
  console.log(`  Total: ${all.length}`)

  const out = {
    summary: { learned: learned.length, introduced: introduced.length, total: all.length },
    learned,
    introduced,
  }

  const outPath = 'C:\\KnappFiles\\chrisknapp-dev\\scripts\\catchphrase-seed\\learned-vocab.json'
  fs.mkdirSync(require('path').dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
  console.log(`\nWrote ${outPath}`)
}

main().catch(e => { console.error(e); process.exit(1) })
