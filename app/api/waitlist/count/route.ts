import { NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
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

    console.log('🔍 Fetching waitlist count...')

    // First, try to get all records to see what we have
    const { data: allData, error: selectError } = await supabase
      .from('waitlist_emails')
      .select('id, email, created_at')

    if (selectError) {
      console.error('❌ Error selecting waitlist emails:', selectError)
      console.error('Error code:', selectError.code)
      console.error('Error message:', selectError.message)
      
      // If table doesn't exist, return 0
      if (selectError.code === '42P01') {
        console.warn('⚠️ Table waitlist_emails does not exist')
        return NextResponse.json({ count: 0 }, { status: 200 })
      }

      return NextResponse.json(
        { error: 'Failed to get waitlist count', details: selectError.message },
        { status: 500 }
      )
    }

    console.log('✅ Found waitlist emails:', allData?.length || 0)
    if (allData && allData.length > 0) {
      console.log('Sample emails:', allData.slice(0, 3).map(e => e.email))
    }

    // Now get the count
    const { count, error: countError } = await supabase
      .from('waitlist_emails')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Error getting count:', countError)
      // Fallback to array length if count fails
      const fallbackCount = allData?.length || 0
      console.log('📊 Using fallback count:', fallbackCount)
      return NextResponse.json(
        { count: fallbackCount },
        { status: 200 }
      )
    }

    const finalCount = count || allData?.length || 0
    console.log('📊 Final count:', finalCount)

    return NextResponse.json(
      { count: finalCount },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Unexpected error in waitlist count API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

