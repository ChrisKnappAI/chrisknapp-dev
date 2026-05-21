import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const tbl = () => supabase.schema('travel').from('packing')

export async function GET(request) {
  const person = new URL(request.url).searchParams.get('person')
  const { data, error } = await tbl()
    .select('*')
    .eq('person', person)
    .order('sort_order')
    .order('created_at')
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data: data || [] })
}

export async function POST(request) {
  const { person, body } = await request.json()
  const { data: top } = await tbl()
    .select('sort_order')
    .eq('person', person)
    .order('sort_order', { ascending: false })
    .limit(1)
  const sort_order = (top?.[0]?.sort_order ?? -1) + 1
  const { data, error } = await tbl().insert({ person, body, sort_order }).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PATCH(request) {
  const { id, ...updates } = await request.json()
  const { data, error } = await tbl().update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get('id')
  const { error } = await tbl().delete().eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}
