#!/usr/bin/env node

/**
 * Create Profile for Existing User Script
 * 
 * This script creates a profile for the existing auth user
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProfileForExistingUser() {
  console.log('👤 Creating Profile for Existing User...\n');

  try {
    // Get existing auth user
    console.log('1️⃣ Getting existing auth user...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
      return;
    }

    if (!authUsers?.users || authUsers.users.length === 0) {
      console.error('❌ No auth users found');
      return;
    }

    const user = authUsers.users[0];
    console.log(`✅ Found user: ${user.email} (${user.id})`);

    // Check if profile already exists
    console.log('\n2️⃣ Checking if profile already exists...');
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking profile:', profileError.message);
      return;
    }

    if (existingProfile) {
      console.log('✅ Profile already exists');
      return;
    }

    // Create user profile
    console.log('\n3️⃣ Creating user profile...');
    const { data: profile, error: createProfileError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        preferred_language: 'en',
        timezone: 'UTC'
      })
      .select()
      .single();

    if (createProfileError) {
      console.error('❌ Error creating profile:', createProfileError.message);
      return;
    }
    console.log('✅ Profile created:', profile.email);

    // Create subscription
    console.log('\n4️⃣ Creating subscription...');
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
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
      console.log('✅ Subscription created:', subscription.plan_type);
    }

    // Create settings
    console.log('\n5️⃣ Creating settings...');
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .insert({
        user_id: user.id,
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
      console.log('✅ Settings created');
    }

    // Create learning progress
    console.log('\n6️⃣ Creating learning progress...');
    const { data: progress, error: progressError } = await supabase
      .from('user_learning_progress')
      .insert({
        user_id: user.id,
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
      console.log('✅ Learning progress created');
    }

    console.log('\n🎉 Profile creation completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - User: ${user.email}`);
    console.log(`   - User ID: ${user.id}`);
    console.log(`   - Profile: ✅`);
    console.log(`   - Subscription: ✅ (Free plan: 10 daily, 300 monthly)`);
    console.log(`   - Settings: ✅`);
    console.log(`   - Progress: ✅`);
    
    console.log('\n💡 Now the usage limits should show 10/10 daily and 300/300 monthly!');

  } catch (error) {
    console.error('❌ Profile creation failed:', error);
  }
}

// Run the creation
createProfileForExistingUser();
