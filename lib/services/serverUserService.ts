import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import {
  UserProfile,
  UserSubscription,
  UserDailyUsage,
  UserMonthlyUsage,
  UserLearningProgress,
  UserSettings,
  UserAchievement,
  UsageLimitResponse,
  UserProgressResponse,
  CreateUserProfileRequest,
  UpdateUserProfileRequest,
  UpdateUserSettingsRequest,
  UpdateLearningProgressRequest,
  SupportedLanguage
} from '@/lib/types/database';

export class ServerUserService {
  private getSupabase() {
    return createServerSupabaseClient();
  }

  private getServiceSupabase() {
    return createServiceSupabaseClient();
  }

  // User Profile Management
  async createUserProfile(data: CreateUserProfileRequest): Promise<UserProfile | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const profileData = {
        id: user.user.id,
        email: data.email,
        full_name: data.full_name,
        preferred_language: data.preferred_language || 'en',
        timezone: data.timezone || 'UTC'
      };

      // Use service role for creating profile to bypass RLS
      const serviceSupabase = this.getServiceSupabase();
      const { data: profile, error } = await serviceSupabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;

      // Create default subscription using service role
      await this.createDefaultSubscription(user.user.id);
      
      // Create default settings using service role
      await this.createDefaultSettings(user.user.id);
      
      // Create learning progress using service role
      await this.createLearningProgress(user.user.id);

      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', user.user.id)
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  async markUserAsNotNew(): Promise<boolean> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({ is_new_user: false })
        .eq('id', user.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking user as not new:', error);
      return false;
    }
  }

  async markLessonTourCompleted(): Promise<boolean> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({ lesson_tour_completed: true })
        .eq('id', user.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking lesson tour as completed:', error);
      return false;
    }
  }

  // Subscription Management
  private async createDefaultSubscription(userId: string): Promise<void> {
    const serviceSupabase = this.getServiceSupabase();
    const { error } = await serviceSupabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_type: 'free',
        max_requests_per_day: 10,
        max_requests_per_month: 300
      });

    if (error) throw error;
  }

  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return subscription;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  // Usage Tracking
  async checkUsageLimits(): Promise<UsageLimitResponse> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get subscription limits
      const subscription = await this.getUserSubscription();
      if (!subscription) throw new Error('No active subscription found');

      // Get current usage
      const { data: dailyUsage } = await supabase
        .from('user_daily_usage')
        .select('requests_count')
        .eq('user_id', user.user.id)
        .eq('usage_date', new Date().toISOString().split('T')[0])
        .single();

      const { data: monthlyUsage } = await supabase
        .from('user_monthly_usage')
        .select('requests_count')
        .eq('user_id', user.user.id)
        .eq('usage_month', new Date().toISOString().substring(0, 7) + '-01')
        .single();

      const currentDaily = dailyUsage?.requests_count || 0;
      const currentMonthly = monthlyUsage?.requests_count || 0;

      return {
        canMakeRequest: currentDaily < subscription.max_requests_per_day && 
                        currentMonthly < subscription.max_requests_per_month,
        dailyUsage: currentDaily,
        monthlyUsage: currentMonthly,
        dailyLimit: subscription.max_requests_per_day,
        monthlyLimit: subscription.max_requests_per_month,
        remainingDaily: subscription.max_requests_per_day - currentDaily,
        remainingMonthly: subscription.max_requests_per_month - currentMonthly
      };
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return {
        canMakeRequest: false,
        dailyUsage: 0,
        monthlyUsage: 0,
        dailyLimit: 0,
        monthlyLimit: 0,
        remainingDaily: 0,
        remainingMonthly: 0
      };
    }
  }

  async incrementUsage(requestType: 'chat' | 'grammar' | 'vocabulary' = 'chat'): Promise<void> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('increment_user_usage', {
        user_uuid: user.user.id,
        request_type: requestType
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  }

  // Learning Progress
  private async createLearningProgress(userId: string): Promise<void> {
    const serviceSupabase = this.getServiceSupabase();
    const { error } = await serviceSupabase
      .from('user_learning_progress')
      .insert({
        user_id: userId,
        current_level: 'beginner',
        total_lessons_completed: 0,
        total_grammar_points_studied: 0,
        total_vocabulary_words_learned: 0,
        streak_days: 0,
        total_study_time_minutes: 0
      });

    if (error) throw error;
  }

  async getLearningProgress(): Promise<UserLearningProgress | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data: progress, error } = await supabase
        .from('user_learning_progress')
        .select('*')
        .eq('user_id', user.user.id)
        .single();

      if (error) throw error;
      return progress;
    } catch (error) {
      console.error('Error fetching learning progress:', error);
      return null;
    }
  }

  async updateLearningProgress(data: UpdateLearningProgressRequest): Promise<UserLearningProgress | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: progress, error } = await supabase
        .from('user_learning_progress')
        .update(data)
        .eq('user_id', user.user.id)
        .select()
        .single();

      if (error) throw error;
      return progress;
    } catch (error) {
      console.error('Error updating learning progress:', error);
      return null;
    }
  }

  async getUserProgress(): Promise<UserProgressResponse | null> {
    try {
      const progress = await this.getLearningProgress();
      if (!progress) return null;

      const achievements = await this.getUserAchievements();

      return {
        level: progress.current_level,
        lessonsCompleted: progress.total_lessons_completed,
        grammarPointsStudied: progress.total_grammar_points_studied,
        vocabularyWordsLearned: progress.total_vocabulary_words_learned,
        streakDays: progress.streak_days,
        totalStudyTime: progress.total_study_time_minutes,
        achievements: achievements || []
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  // Achievements
  async getUserAchievements(): Promise<UserAchievement[] | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data: achievements, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return achievements;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return null;
    }
  }

  // Settings
  private async createDefaultSettings(userId: string): Promise<void> {
    const serviceSupabase = this.getServiceSupabase();
    const { error } = await serviceSupabase
      .from('user_settings')
      .insert({
        user_id: userId,
        notifications_enabled: true,
        email_notifications: true,
        study_reminders: true,
        difficulty_preference: 'adaptive',
        study_goal_minutes: 30
      });

    if (error) throw error;
  }

  async getUserSettings(): Promise<UserSettings | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.user.id)
        .single();

      if (error) throw error;
      return settings;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }
  }

  async updateUserSettings(data: UpdateUserSettingsRequest): Promise<UserSettings | null> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: settings, error } = await supabase
        .from('user_settings')
        .update(data)
        .eq('user_id', user.user.id)
        .select()
        .single();

      if (error) throw error;
      return settings;
    } catch (error) {
      console.error('Error updating user settings:', error);
      return null;
    }
  }

  // Language Management
  async updateLanguage(language: SupportedLanguage): Promise<boolean> {
    try {
      const result = await this.updateUserProfile({ preferred_language: language });
      return result !== null;
    } catch (error) {
      console.error('Error updating language:', error);
      return false;
    }
  }

  // Chat History
  async saveChatMessage(
    sessionId: string,
    messageType: 'user' | 'assistant',
    content: string,
    context?: {
      grammar?: string;
      vocabulary?: string;
      lesson?: string;
    }
  ): Promise<void> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_chat_history')
        .insert({
          user_id: user.user.id,
          session_id: sessionId,
          message_type: messageType,
          content,
          grammar_context: context?.grammar,
          vocabulary_context: context?.vocabulary,
          lesson_context: context?.lesson
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  }

  async getChatHistory(sessionId: string): Promise<any[]> {
    try {
      const supabase = this.getSupabase();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data: history, error } = await supabase
        .from('user_chat_history')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return history || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }
}

export const serverUserService = new ServerUserService();