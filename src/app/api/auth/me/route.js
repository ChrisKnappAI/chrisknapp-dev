import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const jar = await cookies()
  if (jar.get('chris_auth')?.value === 'true')   return NextResponse.json({ person: 'chris' })
  if (jar.get('natalie_auth')?.value === 'true') return NextResponse.json({ person: 'natalie' })
  return NextResponse.json({ person: null })
}
