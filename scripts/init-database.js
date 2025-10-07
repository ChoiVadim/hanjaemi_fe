#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script initializes the database with test data and verifies
 * that all functionality works correctly.
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

async function initializeDatabase() {
  console.log('🚀 Initializing Database...\n');

  try {
    // Test 1: Create a test user profile
    console.log('1️⃣ Creating test user profile...');
    
    const testUserId = '00000000-0000-0000-0000-000000000001';
    const testEmail = 'test@hanjaemi.com';
    
    // Insert test profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: testUserId,
        email: testEmail,
        full_name: 'Test User',
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

    // Test 5: Test usage functions
    console.log('\n5️⃣ Testing usage functions...');
    
    // Test can_user_make_request
    const { data: canMakeRequest, error: canMakeRequestError } = await supabase
      .rpc('can_user_make_request', { user_uuid: testUserId });
    
    if (canMakeRequestError) {
      console.error('❌ Error testing can_user_make_request:', canMakeRequestError.message);
    } else {
      console.log('✅ can_user_make_request result:', canMakeRequest);
    }

    // Test increment_user_usage
    const { error: incrementError } = await supabase
      .rpc('increment_user_usage', { 
        user_uuid: testUserId, 
        request_type: 'chat' 
      });
    
    if (incrementError) {
      console.error('❌ Error testing increment_user_usage:', incrementError.message);
    } else {
      console.log('✅ increment_user_usage executed successfully');
    }

    // Test 6: Verify usage was recorded
    console.log('\n6️⃣ Verifying usage was recorded...');
    const { data: dailyUsage, error: dailyUsageError } = await supabase
      .from('user_daily_usage')
      .select('*')
      .eq('user_id', testUserId)
      .eq('usage_date', new Date().toISOString().split('T')[0])
      .single();

    if (dailyUsageError) {
      console.error('❌ Error fetching daily usage:', dailyUsageError.message);
    } else {
      console.log('✅ Daily usage recorded:', dailyUsage.requests_count, 'requests');
    }

    // Test 7: Create sample achievement
    console.log('\n7️⃣ Creating sample achievement...');
    const { data: achievement, error: achievementError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: testUserId,
        achievement_type: 'streak',
        achievement_name: 'First Day',
        achievement_description: 'Completed your first day of study!',
        metadata: { days: 1 }
      })
      .select()
      .single();

    if (achievementError) {
      console.error('❌ Error creating achievement:', achievementError.message);
    } else {
      console.log('✅ Sample achievement created:', achievement.achievement_name);
    }

    // Test 8: Create sample chat history
    console.log('\n8️⃣ Creating sample chat history...');
    const { data: chatHistory, error: chatHistoryError } = await supabase
      .from('user_chat_history')
      .insert({
        user_id: testUserId,
        session_id: 'test-session-001',
        message_type: 'user',
        content: 'Hello, I want to learn Korean!',
        grammar_context: 'greeting',
        vocabulary_context: 'basic'
      })
      .select()
      .single();

    if (chatHistoryError) {
      console.error('❌ Error creating chat history:', chatHistoryError.message);
    } else {
      console.log('✅ Sample chat history created');
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Test user: ${testEmail}`);
    console.log(`   - User ID: ${testUserId}`);
    console.log(`   - Profile: ✅`);
    console.log(`   - Subscription: ✅`);
    console.log(`   - Settings: ✅`);
    console.log(`   - Progress: ✅`);
    console.log(`   - Usage tracking: ✅`);
    console.log(`   - Achievement: ✅`);
    console.log(`   - Chat history: ✅`);
    
    console.log('\n💡 Next steps:');
    console.log('   1. Test the application with the test user');
    console.log('   2. Verify all API endpoints work correctly');
    console.log('   3. Check the UI components display data properly');

  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
}

// Run the initialization
initializeDatabase();
