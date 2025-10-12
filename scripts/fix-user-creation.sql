-- Fix User Creation Issues in Supabase
-- This script ensures users can be created in all necessary tables

-- First, ensure all tables have proper RLS policies
-- Drop existing restrictive policies
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

-- Grant necessary permissions to the service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Make sure the functions are accessible
GRANT EXECUTE ON FUNCTION can_user_make_request(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION increment_user_usage(UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO service_role;

-- Create a function to automatically create user records when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (id, email, full_name, preferred_language, timezone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    'en',
    'UTC'
  );

  -- Insert into user_subscriptions
  INSERT INTO public.user_subscriptions (user_id, plan_type, max_requests_per_day, max_requests_per_month)
  VALUES (NEW.id, 'free', 10, 300);

  -- Insert into user_settings
  INSERT INTO public.user_settings (user_id, notifications_enabled, email_notifications, study_reminders, difficulty_preference, study_goal_minutes)
  VALUES (NEW.id, true, true, true, 'adaptive', 30);

  -- Insert into user_learning_progress
  INSERT INTO public.user_learning_progress (user_id, current_level, total_lessons_completed, total_grammar_points_studied, total_vocabulary_words_learned, streak_days, total_study_time_minutes)
  VALUES (NEW.id, 'beginner', 0, 0, 0, 0, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user records
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions for the trigger function
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT SELECT ON auth.users TO service_role;
