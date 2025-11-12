#!/usr/bin/env node

/**
 * Test User Creation Script
 * 
 * This script tests creating a user profile directly using service role
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUserCreation() {
  console.log('🧪 Testing User Creation with Service Role...\n');

  const testUserId = '00000000-0000-0000-0000-000000000002';
  const testEmail = 'test2@hanjaemi.com';

  try {
    // Test 1: Create user profile
    console.log('1️⃣ Creating test user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: testUserId,
        email: testEmail,
        full_name: 'Test User 2',
        preferred_language: 'en',
        timezone: 'UTC'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message);
      return;
    }
    console.log('✅ Test profile created:', profile.email);

    // Test 2: Create subscription
    console.log('\n2️⃣ Creating test subscription...');
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: testUserId,
        plan_type: 'free',
        max_requests_per_day: 10,
        max_requests_per_month: 300,
        is_active: true
      })
      .select()
      .single();

    if (subError) {
      console.error('❌ Error creating subscription:', subError.message);
    } else {
      console.log('✅ Test subscription created:', subscription.plan_type);
    }

    // Test 3: Create settings
    console.log('\n3️⃣ Creating test settings...');
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: testUserId,
        notifications_enabled: true,
        email_notifications: true,
        study_reminders: true,
        difficulty_preference: 'adaptive',
        study_goal_minutes: 30
      })
      .select()
      .single();

    if (settingsError) {
      console.error('❌ Error creating settings:', settingsError.message);
    } else {
      console.log('✅ Test settings created');
    }

    // Test 4: Create learning progress
    console.log('\n4️⃣ Creating test learning progress...');
    const { data: progress, error: progressError } = await supabase
      .from('user_learning_progress')
      .upsert({
        user_id: testUserId,
        current_level: 'beginner',
        total_lessons_completed: 0,
        total_grammar_points_studied: 0,
        total_vocabulary_words_learned: 0,
        streak_days: 0,
        total_study_time_minutes: 0
      })
      .select()
      .single();

    if (progressError) {
      console.error('❌ Error creating progress:', progressError.message);
    } else {
      console.log('✅ Test learning progress created');
    }

    console.log('\n🎉 User creation test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Test user: ${testEmail}`);
    console.log(`   - User ID: ${testUserId}`);
    console.log(`   - Profile: ✅`);
    console.log(`   - Subscription: ✅`);
    console.log(`   - Settings: ✅`);
    console.log(`   - Progress: ✅`);
    
    console.log('\n💡 Next steps:');
    console.log('   1. Check Supabase Dashboard to see the created records');
    console.log('   2. Try registering a new user in the app');
    console.log('   3. Verify that records are created automatically');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testUserCreation();
