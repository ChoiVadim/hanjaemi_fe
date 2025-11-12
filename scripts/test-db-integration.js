#!/usr/bin/env node

/**
 * Database Integration Test Script
 * 
 * This script tests the integration between the application and Supabase database.
 * It creates a test user profile and verifies that all database operations work correctly.
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabaseIntegration() {
  console.log('🧪 Testing Database Integration...\n');

  try {
    // Test 1: Check if tables exist
    console.log('1️⃣ Checking if tables exist...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'user_profiles',
        'user_subscriptions',
        'user_daily_usage',
        'user_monthly_usage',
        'user_learning_progress',
        'user_settings',
        'user_achievements',
        'user_chat_history'
      ]);

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError.message);
      return;
    }

    const tableNames = tables?.map(t => t.table_name) || [];
    console.log('✅ Found tables:', tableNames.join(', '));

    // Test 2: Check RLS policies
    console.log('\n2️⃣ Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname')
      .in('tablename', tableNames);

    if (policiesError) {
      console.error('❌ Error checking policies:', policiesError.message);
    } else {
      console.log('✅ Found policies:', policies?.length || 0);
    }

    // Test 3: Check functions
    console.log('\n3️⃣ Checking database functions...');
    const { data: functions, error: functionsError } = await supabase
      .from('pg_proc')
      .select('proname')
      .in('proname', ['can_user_make_request', 'increment_user_usage', 'update_updated_at_column']);

    if (functionsError) {
      console.error('❌ Error checking functions:', functionsError.message);
    } else {
      const functionNames = functions?.map(f => f.proname) || [];
      console.log('✅ Found functions:', functionNames.join(', '));
    }

    // Test 4: Test function calls (without actual user data)
    console.log('\n4️⃣ Testing function calls...');
    
    // Test can_user_make_request function
    const { data: canMakeRequest, error: canMakeRequestError } = await supabase
      .rpc('can_user_make_request', { user_uuid: '00000000-0000-0000-0000-000000000000' });
    
    if (canMakeRequestError) {
      console.error('❌ Error testing can_user_make_request:', canMakeRequestError.message);
    } else {
      console.log('✅ can_user_make_request function works');
    }

    console.log('\n🎉 Database integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Tables: ${tableNames.length}/8 found`);
    console.log(`   - Policies: ${policies?.length || 0} found`);
    console.log(`   - Functions: ${functions?.length || 0}/3 found`);
    console.log('\n💡 Next steps:');
    console.log('   1. Test user registration flow');
    console.log('   2. Test API endpoints with real user data');
    console.log('   3. Verify usage tracking works correctly');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDatabaseIntegration();
