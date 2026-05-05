import { NextResponse } from 'next/server'

export async function POST(request) {
  const { user } = await request.json()
  const response = NextResponse.json({ success: true })
  response.cookies.delete(`${user}_auth`)
  return response
}
