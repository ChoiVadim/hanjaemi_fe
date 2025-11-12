#!/usr/bin/env node

/**
 * Fix Existing Users Script
 * 
 * This script creates missing records for existing auth users
 * who don't have corresponding records in the user tables.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixExistingUsers() {
  console.log('🔧 Fixing Existing Users...\n');

  try {
    // Get all auth users
    console.log('1️⃣ Getting all auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
      return;
    }

    if (!authUsers?.users || authUsers.users.length === 0) {
      console.log('ℹ️ No auth users found');
      return;
    }

    console.log(`✅ Found ${authUsers.users.length} auth user(s)`);

    for (const user of authUsers.users) {
      console.log(`\n👤 Processing user: ${user.email} (${user.id})`);
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error(`❌ Error checking profile for ${user.email}:`, profileError.message);
        continue;
      }

      if (!existingProfile) {
        console.log('   📝 Creating missing profile...');
        
        // Create user profile
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
          console.error(`   ❌ Error creating profile:`, createProfileError.message);
          continue;
        }
        console.log('   ✅ Profile created');
      } else {
        console.log('   ✅ Profile already exists');
      }

      // Check and create subscription
      const { data: existingSubscription } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingSubscription) {
        console.log('   📝 Creating missing subscription...');
        const { error: subError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_type: 'free',
            max_requests_per_day: 10,
            max_requests_per_month: 300,
            is_active: true
          });

        if (subError) {
          console.error(`   ❌ Error creating subscription:`, subError.message);
        } else {
          console.log('   ✅ Subscription created');
        }
      } else {
        console.log('   ✅ Subscription already exists');
      }

      // Check and create settings
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingSettings) {
        console.log('   📝 Creating missing settings...');
        const { error: settingsError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            notifications_enabled: true,
            email_notifications: true,
            study_reminders: true,
            difficulty_preference: 'adaptive',
            study_goal_minutes: 30
          });

        if (settingsError) {
          console.error(`   ❌ Error creating settings:`, settingsError.message);
        } else {
          console.log('   ✅ Settings created');
        }
      } else {
        console.log('   ✅ Settings already exist');
      }

      // Check and create learning progress
      const { data: existingProgress } = await supabase
        .from('user_learning_progress')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingProgress) {
        console.log('   📝 Creating missing learning progress...');
        const { error: progressError } = await supabase
          .from('user_learning_progress')
          .insert({
            user_id: user.id,
            current_level: 'beginner',
            total_lessons_completed: 0,
            total_grammar_points_studied: 0,
            total_vocabulary_words_learned: 0,
            streak_days: 0,
            total_study_time_minutes: 0
          });

        if (progressError) {
          console.error(`   ❌ Error creating progress:`, progressError.message);
        } else {
          console.log('   ✅ Learning progress created');
        }
      } else {
        console.log('   ✅ Learning progress already exists');
      }
    }

    console.log('\n🎉 User fixing completed successfully!');
    console.log('\n💡 All existing users now have complete profiles in all tables.');

  } catch (error) {
    console.error('❌ User fixing failed:', error);
  }
}

// Run the fixing
fixExistingUsers();
