#!/usr/bin/env node

/**
 * Check Database Status Script
 * 
 * This script checks the current state of the database tables
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

async function checkDatabaseStatus() {
  console.log('🔍 Checking Database Status...\n');

  try {
    // Check user_profiles
    console.log('1️⃣ Checking user_profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .limit(5);

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message);
    } else {
      console.log(`✅ Found ${profiles?.length || 0} profiles`);
      if (profiles && profiles.length > 0) {
        profiles.forEach(profile => {
          console.log(`   - ${profile.email} (${profile.full_name})`);
        });
      }
    }

    // Check user_subscriptions
    console.log('\n2️⃣ Checking user_subscriptions...');
    const { data: subscriptions, error: subError } = await supabase
      .from('user_subscriptions')
      .select('user_id, plan_type, max_requests_per_day, max_requests_per_month')
      .limit(5);

    if (subError) {
      console.error('❌ Error fetching subscriptions:', subError.message);
    } else {
      console.log(`✅ Found ${subscriptions?.length || 0} subscriptions`);
      if (subscriptions && subscriptions.length > 0) {
        subscriptions.forEach(sub => {
          console.log(`   - User: ${sub.user_id}, Plan: ${sub.plan_type}, Daily: ${sub.max_requests_per_day}, Monthly: ${sub.max_requests_per_month}`);
        });
      }
    }

    // Check user_settings
    console.log('\n3️⃣ Checking user_settings...');
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('user_id, notifications_enabled, study_goal_minutes')
      .limit(5);

    if (settingsError) {
      console.error('❌ Error fetching settings:', settingsError.message);
    } else {
      console.log(`✅ Found ${settings?.length || 0} settings`);
    }

    // Check user_learning_progress
    console.log('\n4️⃣ Checking user_learning_progress...');
    const { data: progress, error: progressError } = await supabase
      .from('user_learning_progress')
      .select('user_id, current_level, total_lessons_completed')
      .limit(5);

    if (progressError) {
      console.error('❌ Error fetching progress:', progressError.message);
    } else {
      console.log(`✅ Found ${progress?.length || 0} progress records`);
    }

    // Check auth.users (if possible)
    console.log('\n5️⃣ Checking auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
    } else {
      console.log(`✅ Found ${authUsers?.users?.length || 0} auth users`);
      if (authUsers?.users && authUsers.users.length > 0) {
        authUsers.users.forEach(user => {
          console.log(`   - ${user.email} (${user.id})`);
        });
      }
    }

    console.log('\n📋 Summary:');
    console.log(`   - Profiles: ${profiles?.length || 0}`);
    console.log(`   - Subscriptions: ${subscriptions?.length || 0}`);
    console.log(`   - Settings: ${settings?.length || 0}`);
    console.log(`   - Progress: ${progress?.length || 0}`);
    console.log(`   - Auth Users: ${authUsers?.users?.length || 0}`);

    if ((profiles?.length || 0) === 0) {
      console.log('\n💡 No user data found. This explains why usage limits show 0/0.');
      console.log('   The user needs to register/login first to create their profile.');
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

// Run the check
checkDatabaseStatus();
