-- Fix RLS policies to allow user creation
-- This script fixes the Row Level Security policies to allow users to create their own records

-- Drop existing policies that might be blocking creation
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own daily usage" ON user_daily_usage;
DROP POLICY IF EXISTS "Users can view own monthly usage" ON user_monthly_usage;
DROP POLICY IF EXISTS "Users can view own learning progress" ON user_learning_progress;
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can view own chat history" ON user_chat_history;

-- Create comprehensive policies that allow both SELECT and INSERT
CREATE POLICY "Users can manage own subscription" ON user_subscriptions 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily usage" ON user_daily_usage 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own monthly usage" ON user_monthly_usage 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning progress" ON user_learning_progress 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings" ON user_settings 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievements" ON user_achievements 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat history" ON user_chat_history 
FOR ALL USING (auth.uid() = user_id);

-- Also ensure the functions can work with service role
-- Grant necessary permissions to the service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Make sure the functions are accessible
GRANT EXECUTE ON FUNCTION can_user_make_request(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION increment_user_usage(UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO service_role;
