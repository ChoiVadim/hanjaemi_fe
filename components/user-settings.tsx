"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Mail, Target, Clock } from 'lucide-react';
import { userService } from '@/lib/services/userService';
import { useTranslation } from '@/lib/i18n';
import { UserSettings } from '@/lib/types/database';
import { toast } from '@/components/ui/use-toast';

export function UserSettingsComponent() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await userService.getUserSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const updatedSettings = await userService.updateUserSettings(settings);
      if (updatedSettings) {
        setSettings(updatedSettings);
        toast({
          title: "Success",
          description: "Settings saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded animate-pulse" />
            <div className="h-2 bg-muted rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('settings.notifications')}
          </CardTitle>
          <CardDescription>
            {t('settings.notificationsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-enabled">
                {t('settings.enableNotifications')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.enableNotificationsDescription')}
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => updateSetting('notifications_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">
                {t('settings.emailNotifications')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.emailNotificationsDescription')}
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="study-reminders">
                {t('settings.studyReminders')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.studyRemindersDescription')}
              </p>
            </div>
            <Switch
              id="study-reminders"
              checked={settings.study_reminders}
              onCheckedChange={(checked) => updateSetting('study_reminders', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('settings.learningPreferences')}
          </CardTitle>
          <CardDescription>
            {t('settings.learningPreferencesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty-preference">
              {t('settings.difficultyPreference')}
            </Label>
            <Select
              value={settings.difficulty_preference}
              onValueChange={(value) => updateSetting('difficulty_preference', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">{t('settings.difficulty.easy')}</SelectItem>
                <SelectItem value="medium">{t('settings.difficulty.medium')}</SelectItem>
                <SelectItem value="hard">{t('settings.difficulty.hard')}</SelectItem>
                <SelectItem value="adaptive">{t('settings.difficulty.adaptive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="study-goal">
              {t('settings.studyGoal')}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="study-goal"
                type="number"
                min="5"
                max="300"
                value={settings.study_goal_minutes}
                onChange={(e) => updateSetting('study_goal_minutes', parseInt(e.target.value) || 30)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">
                {t('settings.minutesPerDay')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? t('settings.saving') : t('settings.save')}
        </Button>
      </div>
    </div>
  );
}
