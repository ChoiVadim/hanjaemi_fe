"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, Clock, Target, Flame } from 'lucide-react';
import { userService } from '@/lib/services/userService';
import { useTranslation } from '@/lib/i18n';
import { UserProgressResponse } from '@/lib/types/database';

export function LearningProgress() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const progressData = await userService.getUserProgress();
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('progress.title')}
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

  if (!progress) {
    return null;
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Current Level */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4" />
            {t('progress.currentLevel')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Badge className={getLevelColor(progress.level)}>
            {progress.level.charAt(0).toUpperCase() + progress.level.slice(1)}
          </Badge>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4" />
            {t('progress.streak')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {progress.streakDays}
          </div>
          <p className="text-xs text-muted-foreground">
            {t('progress.days')}
          </p>
        </CardContent>
      </Card>

      {/* Study Time */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            {t('progress.studyTime')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl font-semibold">
            {formatTime(progress.totalStudyTime)}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4" />
            {t('progress.statistics')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t('progress.lessonsCompleted')}</span>
            <span className="font-semibold">{progress.lessonsCompleted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t('progress.grammarPoints')}</span>
            <span className="font-semibold">{progress.grammarPointsStudied}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t('progress.vocabularyWords')}</span>
            <span className="font-semibold">{progress.vocabularyWordsLearned}</span>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {progress.achievements && progress.achievements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4" />
              {t('progress.achievements')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {progress.achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.achievement_name}</p>
                    {achievement.achievement_description && (
                      <p className="text-xs text-muted-foreground">
                        {achievement.achievement_description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {progress.achievements.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{progress.achievements.length - 3} more achievements
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
