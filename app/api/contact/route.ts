import { NextRequest, NextResponse } from 'next/server'

const TARGET_EMAIL =
  process.env.FORMSUBMIT_EMAIL || 'nasrqasimroonjha10@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { name, email, message, hp } = body as {
      name?: string
      email?: string
      message?: string
      hp?: string // honeypot
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required.',
        },
        { status: 400 },
      )
    }

    // Honeypot: if filled, silently accept but skip external call
    if (typeof hp === 'string' && hp.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const url = `https://formsubmit.co/ajax/${encodeURIComponent(TARGET_EMAIL)}`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send message. Please try again later.',
          details: text || undefined,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'An unexpected error occurred while sending your message.',
      },
      { status: 500 },
    )
  }
}


