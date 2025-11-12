"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '@/lib/i18n';
import { userService } from '@/lib/services/userService';

export function LanguageSwitcher() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    if (newLanguage === language) return;

    setIsUpdating(true);
    try {
      // Update in i18n service
      setLanguage(newLanguage);
      
      // Update in user profile
      await userService.updateLanguage(newLanguage);
      
      // Reload page to apply language changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating language:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isUpdating}>
          <Globe className="h-4 w-4 mr-2" />
          {currentLanguage?.flag} {currentLanguage?.nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as SupportedLanguage)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            <span className="mr-2">{lang.nativeName}</span>
            <span className="text-muted-foreground text-sm">({lang.name})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
