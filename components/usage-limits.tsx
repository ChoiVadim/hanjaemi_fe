"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, Zap, Calendar, TrendingUp } from 'lucide-react';
import { userService } from '@/lib/services/userService';
import { useTranslation } from '@/lib/i18n';
import { UsageLimitResponse } from '@/lib/types/database';

export function UsageLimits() {
  const { t } = useTranslation();
  const [usage, setUsage] = useState<UsageLimitResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsageData();
  }, []);

  const loadUsageData = async () => {
    try {
      setLoading(true);
      const usageData = await userService.checkUsageLimits();
      setUsage(usageData);
    } catch (error) {
      console.error('Error loading usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t('usage.daily.limit')}
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

  if (!usage) {
    return null;
  }

  const dailyPercentage = (usage.dailyUsage / usage.dailyLimit) * 100;
  const monthlyPercentage = (usage.monthlyUsage / usage.monthlyLimit) * 100;

  return (
    <div className="space-y-4">
      {/* Daily Usage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            {t('usage.daily.limit')}
          </CardTitle>
          <CardDescription className="text-xs">
            {usage.dailyUsage} / {usage.dailyLimit} {t('usage.remaining')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress 
            value={dailyPercentage} 
            className="h-2"
            style={{
              backgroundColor: dailyPercentage > 80 ? '#ef4444' : dailyPercentage > 60 ? '#f59e0b' : undefined
            }}
          />
          {usage.dailyUsage >= usage.dailyLimit && (
            <Alert className="mt-2">
              <AlertDescription className="text-xs">
                {t('error.usageLimit')}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Monthly Usage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            {t('usage.monthly.limit')}
          </CardTitle>
          <CardDescription className="text-xs">
            {usage.monthlyUsage} / {usage.monthlyLimit} {t('usage.remaining')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress 
            value={monthlyPercentage} 
            className="h-2"
            style={{
              backgroundColor: monthlyPercentage > 80 ? '#ef4444' : monthlyPercentage > 60 ? '#f59e0b' : undefined
            }}
          />
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      {(!usage.canMakeRequest || dailyPercentage > 80 || monthlyPercentage > 80) && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
              <Crown className="h-4 w-4" />
              {t('usage.upgrade')}
            </CardTitle>
            <CardDescription className="text-xs text-amber-700 dark:text-amber-300">
              {!usage.canMakeRequest 
                ? "You've reached your limit. Upgrade to continue learning!"
                : "You're approaching your limit. Consider upgrading for unlimited access."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
