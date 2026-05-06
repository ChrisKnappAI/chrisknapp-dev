import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Seeds care_log_chris with checked: false for any items that don't yet
// have an entry on the given date. Uses ignoreDuplicates so existing
// entries are never touched.
export async function POST(request) {
  const { date, item_names } = await request.json()

  const rows = item_names.map(item_name => ({
    log_date:   date,
    item_name,
    checked:    false,
    logged_at:  new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('care_log_chris')
    .upsert(rows, { onConflict: 'log_date,item_name', ignoreDuplicates: true })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ seeded: item_names.length })
}
