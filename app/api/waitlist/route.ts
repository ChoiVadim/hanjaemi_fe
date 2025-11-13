import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { sendTelegramMessage, formatWaitlistNotification } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      console.error('Missing:', {
        url: !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
        key: !supabaseServiceKey ? 'SUPABASE_SERVICE_ROLE_KEY' : null
      })
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing required Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
        },
        { status: 500 }
      )
    }
    
    const supabase = createServiceSupabaseClient()

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('waitlist_emails')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    // If table doesn't exist, handle it
    if (checkError && checkError.code === '42P01') {
      return NextResponse.json(
        { error: 'Waitlist table not found. Please create the waitlist_emails table in Supabase.' },
        { status: 500 }
      )
    }

    if (existing) {
      return NextResponse.json(
        { message: 'Email already registered', alreadyExists: true },
        { status: 200 }
      )
    }

    // Insert new email
    const { data, error } = await supabase
      .from('waitlist_emails')
      .insert({
        email: normalizedEmail,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting waitlist email:', error)
      
      // If table doesn't exist, we'll handle it gracefully
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Waitlist table not found. Please create the waitlist_emails table in Supabase.' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      )
    }

    // Get total count of waitlist signups
    const { count } = await supabase
      .from('waitlist_emails')
      .select('*', { count: 'exact', head: true })

    const totalCount = count || 0

    // Send Telegram notification (non-blocking)
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (telegramBotToken && telegramChatId) {
      const message = formatWaitlistNotification(normalizedEmail, totalCount)
      sendTelegramMessage(telegramBotToken, telegramChatId, message)
        .then((success) => {
          if (success) {
            console.log('✅ Telegram notification sent successfully')
          } else {
            console.warn('⚠️ Failed to send Telegram notification')
          }
        })
        .catch((err) => {
          console.error('Error sending Telegram notification:', err)
        })
    } else {
      console.warn('⚠️ Telegram credentials not configured, skipping notification')
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined waitlist', 
        data,
        totalCount 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in waitlist API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

