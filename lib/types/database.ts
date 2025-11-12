// Database types for HanJaemi
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferred_language: 'en' | 'ru';
  timezone: string;
  is_new_user: boolean;
  lesson_tour_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'premium' | 'pro';
  max_requests_per_day: number;
  max_requests_per_month: number;
  subscription_start_date: string;
  subscription_end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDailyUsage {
  id: string;
  user_id: string;
  usage_date: string;
  requests_count: number;
  chat_requests: number;
  grammar_requests: number;
  vocabulary_requests: number;
  created_at: string;
  updated_at: string;
}

export interface UserMonthlyUsage {
  id: string;
  user_id: string;
  usage_month: string;
  requests_count: number;
  chat_requests: number;
  grammar_requests: number;
  vocabulary_requests: number;
  created_at: string;
  updated_at: string;
}

export interface UserLearningProgress {
  id: string;
  user_id: string;
  current_level: 'beginner' | 'intermediate' | 'advanced';
  total_lessons_completed: number;
  total_grammar_points_studied: number;
  total_vocabulary_words_learned: number;
  current_lesson_id?: string;
  streak_days: number;
  last_study_date?: string;
  total_study_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: 'streak' | 'lessons' | 'vocabulary' | 'grammar' | 'time';
  achievement_name: string;
  achievement_description?: string;
  earned_at: string;
  metadata?: Record<string, any>;
}

export interface UserSettings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  study_reminders: boolean;
  difficulty_preference: 'easy' | 'medium' | 'hard' | 'adaptive';
  study_goal_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface UserChatHistory {
  id: string;
  user_id: string;
  session_id: string;
  message_type: 'user' | 'assistant';
  content: string;
  grammar_context?: string;
  vocabulary_context?: string;
  lesson_context?: string;
  created_at: string;
}

// API Response types
export interface UsageLimitResponse {
  canMakeRequest: boolean;
  dailyUsage: number;
  monthlyUsage: number;
  dailyLimit: number;
  monthlyLimit: number;
  remainingDaily: number;
  remainingMonthly: number;
}

export interface UserProgressResponse {
  level: string;
  lessonsCompleted: number;
  grammarPointsStudied: number;
  vocabularyWordsLearned: number;
  streakDays: number;
  totalStudyTime: number;
  achievements: UserAchievement[];
}

// Language support types
export type SupportedLanguage = 'en' | 'ru';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺'
  }
];

// Request types for API calls
export interface CreateUserProfileRequest {
  email: string;
  full_name?: string;
  preferred_language?: SupportedLanguage;
  timezone?: string;
}

export interface UpdateUserProfileRequest {
  full_name?: string;
  avatar_url?: string;
  preferred_language?: SupportedLanguage;
  timezone?: string;
}

export interface UpdateUserSettingsRequest {
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  study_reminders?: boolean;
  difficulty_preference?: 'easy' | 'medium' | 'hard' | 'adaptive';
  study_goal_minutes?: number;
}

export interface UpdateLearningProgressRequest {
  current_level?: 'beginner' | 'intermediate' | 'advanced';
  total_lessons_completed?: number;
  total_grammar_points_studied?: number;
  total_vocabulary_words_learned?: number;
  current_lesson_id?: string;
  streak_days?: number;
  total_study_time_minutes?: number;
}
