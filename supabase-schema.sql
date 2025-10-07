-- HanJaemi Database Schema
-- User management, language support, and usage tracking

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ru')),
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscription/plan information
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'pro')),
  max_requests_per_day INTEGER DEFAULT 10,
  max_requests_per_month INTEGER DEFAULT 300,
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily usage tracking
CREATE TABLE IF NOT EXISTS user_daily_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  usage_date DATE DEFAULT CURRENT_DATE,
  requests_count INTEGER DEFAULT 0,
  chat_requests INTEGER DEFAULT 0,
  grammar_requests INTEGER DEFAULT 0,
  vocabulary_requests INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, usage_date)
);

-- Monthly usage tracking
CREATE TABLE IF NOT EXISTS user_monthly_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  usage_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE),
  requests_count INTEGER DEFAULT 0,
  chat_requests INTEGER DEFAULT 0,
  grammar_requests INTEGER DEFAULT 0,
  vocabulary_requests INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, usage_month)
);

-- User learning progress
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  current_level TEXT DEFAULT 'beginner' CHECK (current_level IN ('beginner', 'intermediate', 'advanced')),
  total_lessons_completed INTEGER DEFAULT 0,
  total_grammar_points_studied INTEGER DEFAULT 0,
  total_vocabulary_words_learned INTEGER DEFAULT 0,
  current_lesson_id TEXT,
  streak_days INTEGER DEFAULT 0,
  last_study_date TIMESTAMP WITH TIME ZONE,
  total_study_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User achievements/badges
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('streak', 'lessons', 'vocabulary', 'grammar', 'time')),
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- User settings/preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  study_reminders BOOLEAN DEFAULT true,
  difficulty_preference TEXT DEFAULT 'adaptive' CHECK (difficulty_preference IN ('easy', 'medium', 'hard', 'adaptive')),
  study_goal_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Chat history (for context and analytics)
CREATE TABLE IF NOT EXISTS user_chat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('user', 'assistant')),
  content TEXT NOT NULL,
  grammar_context TEXT,
  vocabulary_context TEXT,
  lesson_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_usage_user_date ON user_daily_usage(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_user_monthly_usage_user_month ON user_monthly_usage(user_id, usage_month);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_chat_history_user_id ON user_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_chat_history_session ON user_chat_history(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_daily_usage_updated_at BEFORE UPDATE ON user_daily_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_monthly_usage_updated_at BEFORE UPDATE ON user_monthly_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_learning_progress_updated_at BEFORE UPDATE ON user_learning_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_monthly_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own subscription" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own daily usage" ON user_daily_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own monthly usage" ON user_monthly_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own learning progress" ON user_learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own learning progress" ON user_learning_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning progress" ON user_learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own chat history" ON user_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat history" ON user_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to check if user can make a request
CREATE OR REPLACE FUNCTION can_user_make_request(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  daily_count INTEGER;
  monthly_count INTEGER;
  max_daily INTEGER;
  max_monthly INTEGER;
BEGIN
  -- Get current usage
  SELECT COALESCE(SUM(requests_count), 0) INTO daily_count
  FROM user_daily_usage 
  WHERE user_id = user_uuid AND usage_date = CURRENT_DATE;
  
  SELECT COALESCE(SUM(requests_count), 0) INTO monthly_count
  FROM user_monthly_usage 
  WHERE user_id = user_uuid AND usage_month = DATE_TRUNC('month', CURRENT_DATE);
  
  -- Get limits from subscription
  SELECT max_requests_per_day, max_requests_per_month 
  INTO max_daily, max_monthly
  FROM user_subscriptions 
  WHERE user_id = user_uuid AND is_active = true;
  
  -- Check limits
  RETURN (daily_count < max_daily) AND (monthly_count < max_monthly);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_user_usage(
  user_uuid UUID,
  request_type TEXT DEFAULT 'chat'
)
RETURNS VOID AS $$
BEGIN
  -- Update daily usage
  INSERT INTO user_daily_usage (user_id, requests_count, chat_requests)
  VALUES (user_uuid, 1, CASE WHEN request_type = 'chat' THEN 1 ELSE 0 END)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET 
    requests_count = user_daily_usage.requests_count + 1,
    chat_requests = user_daily_usage.chat_requests + CASE WHEN request_type = 'chat' THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  -- Update monthly usage
  INSERT INTO user_monthly_usage (user_id, requests_count, chat_requests)
  VALUES (user_uuid, 1, CASE WHEN request_type = 'chat' THEN 1 ELSE 0 END)
  ON CONFLICT (user_id, usage_month)
  DO UPDATE SET 
    requests_count = user_monthly_usage.requests_count + 1,
    chat_requests = user_monthly_usage.chat_requests + CASE WHEN request_type = 'chat' THEN 1 ELSE 0 END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
