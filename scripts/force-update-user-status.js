#!/usr/bin/env node

/**
 * Force update user status script
 * This script forces all existing users to be marked as not new
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

async function forceUpdateUserStatus() {
  console.log('🔧 Force updating user status...\n');

  try {
    // Force update all users to is_new_user = false
    console.log('1️⃣ Updating all users to is_new_user = false...');
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ is_new_user: false })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all users

    if (error) {
      console.error('❌ Error updating users:', error.message);
      return;
    }

    console.log('✅ All users updated successfully');

    // Verify the update
    console.log('\n2️⃣ Verifying user status...');
    const { data: users, error: verifyError } = await supabase
      .from('user_profiles')
      .select('email, is_new_user')
      .order('created_at', { ascending: false });

    if (verifyError) {
      console.error('❌ Error verifying users:', verifyError.message);
      return;
    }

    console.log('📋 Current user status:');
    users.forEach(user => {
      console.log(`   - ${user.email}: ${user.is_new_user ? 'NEW USER' : 'EXISTING USER'}`);
    });

    console.log('\n🎉 User status update completed!');
    console.log('💡 All existing users are now marked as not new.');
    console.log('🔄 Please refresh your browser to see the changes.');

  } catch (error) {
    console.error('❌ User status update failed:', error);
  }
}

// Run the update
forceUpdateUserStatus();
