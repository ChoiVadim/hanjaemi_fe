"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/auth-context";
import { useTranslation } from "@/lib/i18n";
import { userService } from "@/lib/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Globe, Bell, Target, Trophy, Clock, BookOpen, Zap } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [usageLimits, setUsageLimits] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const [userProfile, userSettings, userProgress, limits] = await Promise.all([
          userService.getUserProfile(),
          userService.getUserSettings(),
          userService.getUserProgress(),
          userService.checkUsageLimits()
        ]);
        
        setProfile(userProfile);
        setSettings(userSettings);
        setProgress(userProgress);
        setUsageLimits(limits);
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    
    setIsSaving(true);
    try {
      await userService.updateUserProfile(profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user || !settings) return;
    
    setIsSaving(true);
    try {
      await userService.updateUserSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access settings</h1>
          <p className="text-muted-foreground">You need to be logged in to view and modify your settings.</p>
        </div>
      </div>
    );
  }

  const dailyProgress = usageLimits ? (usageLimits.dailyUsed / usageLimits.dailyLimit) * 100 : 0;
  const monthlyProgress = usageLimits ? (usageLimits.monthlyUsed / usageLimits.monthlyLimit) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/study" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Study</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {profile?.full_name?.charAt(0) || user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div>
                <Label htmlFor="language">Language Preference</Label>
                <Select
                  value={language}
                  onValueChange={(value) => {
                    setLanguage(value as 'en' | 'ru');
                    setProfile({...profile, language_preference: value});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Current Level</Label>
                <Select
                  value={profile?.current_level || 'beginner'}
                  onValueChange={(value) => setProfile({...profile, current_level: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings?.email_notifications ?? true}
                  onCheckedChange={(checked) => setSettings({...settings, email_notifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to study daily
                  </p>
                </div>
                <Switch
                  checked={settings?.study_reminders ?? true}
                  onCheckedChange={(checked) => setSettings({...settings, study_reminders: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Progress Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about your learning progress
                  </p>
                </div>
                <Switch
                  checked={settings?.progress_updates ?? true}
                  onCheckedChange={(checked) => setSettings({...settings, progress_updates: checked})}
                />
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress and Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {progress?.current_level || 'Beginner'}
                </div>
                <p className="text-sm text-muted-foreground">Current Level</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Lessons Completed</span>
                  </div>
                  <Badge variant="secondary">
                    {progress?.lessons_completed || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Achievements</span>
                  </div>
                  <Badge variant="secondary">
                    {progress?.achievements_count || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Study Time</span>
                  </div>
                  <Badge variant="secondary">
                    {progress?.total_study_time || 0}h
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {progress?.daily_streak || 0}
                </div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Daily Requests</span>
                    <span>{usageLimits ? `${usageLimits.dailyUsed} / ${usageLimits.dailyLimit === -1 ? '∞' : usageLimits.dailyLimit}` : '0 / 0'}</span>
                  </div>
                  {usageLimits && usageLimits.dailyLimit !== -1 && (
                    <Progress value={dailyProgress} className="h-2" />
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monthly Requests</span>
                    <span>{usageLimits ? `${usageLimits.monthlyUsed} / ${usageLimits.monthlyLimit === -1 ? '∞' : usageLimits.monthlyLimit}` : '0 / 0'}</span>
                  </div>
                  {usageLimits && usageLimits.monthlyLimit !== -1 && (
                    <Progress value={monthlyProgress} className="h-2" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
