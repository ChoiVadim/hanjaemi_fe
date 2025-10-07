// Internationalization (i18n) system for HanJaemi
import { SupportedLanguage } from '@/lib/types/database';

export interface TranslationKeys {
  // Navigation
  'nav.home': string;
  'nav.study': string;
  'nav.topic': string;
  'nav.youtube': string;
  'nav.login': string;
  'nav.register': string;
  'nav.profile': string;
  'nav.settings': string;
  'nav.logout': string;

  // Common
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.cancel': string;
  'common.save': string;
  'common.delete': string;
  'common.edit': string;
  'common.back': string;
  'common.next': string;
  'common.previous': string;
  'common.close': string;
  'common.yes': string;
  'common.no': string;

  // Homepage
  'home.title': string;
  'home.subtitle': string;
  'home.description': string;
  'home.cta.start': string;
  'home.cta.learn': string;

  // Study
  'study.title': string;
  'study.grammar': string;
  'study.vocabulary': string;
  'study.chat': string;
  'study.flashcards': string;
  'study.summary': string;
  'study.test': string;

  // Chat
  'chat.title': string;
  'chat.placeholder': string;
  'chat.send': string;
  'chat.welcome': string;
  'chat.help.grammar': string;
  'chat.help.vocabulary': string;
  'chat.help.conversation': string;
  'chat.help.writing': string;
  'chat.help.topik': string;
  'chat.help.culture': string;
  'chat.help.translation': string;

  // Usage limits
  'usage.daily.limit': string;
  'usage.monthly.limit': string;
  'usage.remaining': string;
  'usage.exceeded': string;
  'usage.upgrade': string;

  // Progress
  'progress.level': string;
  'progress.lessons': string;
  'progress.grammar': string;
  'progress.vocabulary': string;
  'progress.streak': string;
  'progress.studyTime': string;

  // Settings
  'settings.title': string;
  'settings.language': string;
  'settings.notifications': string;
  'settings.email': string;
  'settings.reminders': string;
  'settings.difficulty': string;
  'settings.goal': string;

  // Errors
  'error.network': string;
  'error.unauthorized': string;
  'error.forbidden': string;
  'error.notFound': string;
  'error.server': string;
  'error.usageLimit': string;
}

const translations: Record<SupportedLanguage, TranslationKeys> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.study': 'Study',
    'nav.topic': 'Topics',
    'nav.youtube': 'YouTube',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',

    // Homepage
    'home.title': 'Stop Struggling with Boring Korean Textbooks',
    'home.subtitle': 'Start Learning with HanJaemi',
    'home.description': 'Finally, a Korean learning platform that makes you actually want to study with gamified lessons, real K-dramas, and an AI tutor that\'s always available.',
    'home.cta.start': 'Try Free - No Credit Card',
    'home.cta.learn': 'See How It Works',

    // Study
    'study.title': 'Study',
    'study.grammar': 'Grammar',
    'study.vocabulary': 'Vocabulary',
    'study.chat': 'Chat',
    'study.flashcards': 'Flashcards',
    'study.summary': 'Summary',
    'study.test': 'Test',

    // Chat
    'chat.title': 'Chat with AI Tutor',
    'chat.placeholder': 'Ask me anything about Korean...',
    'chat.send': 'Send',
    'chat.welcome': 'Hello! I\'m your Korean learning partner! 🎓',
    'chat.help.grammar': 'Grammar Explanations - I\'ll explain complex Korean grammar in simple terms',
    'chat.help.vocabulary': 'Vocabulary Learning - Learn new words and how to use them properly',
    'chat.help.conversation': 'Conversation Practice - Practice natural Korean conversations',
    'chat.help.writing': 'Writing Help - Get assistance with sentences and essays',
    'chat.help.topik': 'TOPIK Preparation - Tips and practice for Korean proficiency test',
    'chat.help.culture': 'Culture Insights - Learn about Korean culture and customs',
    'chat.help.translation': 'Translation Support - Help with Korean-English translations',

    // Usage limits
    'usage.daily.limit': 'Daily limit',
    'usage.monthly.limit': 'Monthly limit',
    'usage.remaining': 'remaining',
    'usage.exceeded': 'Usage limit exceeded',
    'usage.upgrade': 'Upgrade to continue',

    // Progress
    'progress.level': 'Level',
    'progress.lessons': 'Lessons completed',
    'progress.grammar': 'Grammar points studied',
    'progress.vocabulary': 'Vocabulary words learned',
    'progress.streak': 'Day streak',
    'progress.studyTime': 'Total study time',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.email': 'Email notifications',
    'settings.reminders': 'Study reminders',
    'settings.difficulty': 'Difficulty preference',
    'settings.goal': 'Daily study goal',

    // Errors
    'error.network': 'Network error. Please check your connection.',
    'error.unauthorized': 'Please log in to continue.',
    'error.forbidden': 'You don\'t have permission to access this.',
    'error.notFound': 'The requested resource was not found.',
    'error.server': 'Server error. Please try again later.',
    'error.usageLimit': 'You\'ve reached your usage limit. Please upgrade your plan.'
  },

  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.study': 'Учеба',
    'nav.topic': 'Темы',
    'nav.youtube': 'YouTube',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.profile': 'Профиль',
    'nav.settings': 'Настройки',
    'nav.logout': 'Выйти',

    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.previous': 'Предыдущий',
    'common.close': 'Закрыть',
    'common.yes': 'Да',
    'common.no': 'Нет',

    // Homepage
    'home.title': 'Хватит мучиться со скучными учебниками корейского',
    'home.subtitle': 'Начни учиться с HanJaemi',
    'home.description': 'Наконец-то платформа для изучения корейского, которая действительно мотивирует учиться с геймифицированными уроками, настоящими K-драмами и AI-репетитором, который всегда доступен.',
    'home.cta.start': 'Попробовать бесплатно',
    'home.cta.learn': 'Как это работает',

    // Study
    'study.title': 'Учеба',
    'study.grammar': 'Грамматика',
    'study.vocabulary': 'Словарь',
    'study.chat': 'Чат',
    'study.flashcards': 'Карточки',
    'study.summary': 'Резюме',
    'study.test': 'Тест',

    // Chat
    'chat.title': 'Чат с AI-репетитором',
    'chat.placeholder': 'Спроси меня что-нибудь о корейском...',
    'chat.send': 'Отправить',
    'chat.welcome': 'Привет! Я твой партнер по изучению корейского! 🎓',
    'chat.help.grammar': 'Объяснения грамматики - Я объясню сложную корейскую грамматику простыми словами',
    'chat.help.vocabulary': 'Изучение слов - Изучай новые слова и их правильное использование',
    'chat.help.conversation': 'Практика разговора - Практикуй естественные корейские диалоги',
    'chat.help.writing': 'Помощь в письме - Получай помощь с предложениями и эссе',
    'chat.help.topik': 'Подготовка к TOPIK - Советы и практика для экзамена на знание корейского',
    'chat.help.culture': 'Культурные знания - Изучай корейскую культуру и обычаи',
    'chat.help.translation': 'Помощь с переводом - Помощь с переводом между корейским и английским',

    // Usage limits
    'usage.daily.limit': 'Дневной лимит',
    'usage.monthly.limit': 'Месячный лимит',
    'usage.remaining': 'осталось',
    'usage.exceeded': 'Превышен лимит использования',
    'usage.upgrade': 'Обновите план для продолжения',

    // Progress
    'progress.level': 'Уровень',
    'progress.lessons': 'Уроков пройдено',
    'progress.grammar': 'Грамматических правил изучено',
    'progress.vocabulary': 'Слов изучено',
    'progress.streak': 'Дней подряд',
    'progress.studyTime': 'Общее время учебы',

    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.notifications': 'Уведомления',
    'settings.email': 'Email уведомления',
    'settings.reminders': 'Напоминания об учебе',
    'settings.difficulty': 'Предпочтительная сложность',
    'settings.goal': 'Дневная цель учебы',

    // Errors
    'error.network': 'Ошибка сети. Проверьте подключение к интернету.',
    'error.unauthorized': 'Пожалуйста, войдите в систему для продолжения.',
    'error.forbidden': 'У вас нет прав для доступа к этому ресурсу.',
    'error.notFound': 'Запрашиваемый ресурс не найден.',
    'error.server': 'Ошибка сервера. Попробуйте позже.',
    'error.usageLimit': 'Вы достигли лимита использования. Обновите свой план.'
  }
};

export class I18nService {
  private currentLanguage: SupportedLanguage = 'en';

  constructor() {
    // Try to get language from localStorage or user profile
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language') as SupportedLanguage;
      if (savedLanguage && ['en', 'ru'].includes(savedLanguage)) {
        this.currentLanguage = savedLanguage;
      }
    }
  }

  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language);
    }
  }

  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  t(key: keyof TranslationKeys): string {
    return translations[this.currentLanguage][key] || key;
  }

  getTranslations(): TranslationKeys {
    return translations[this.currentLanguage];
  }

  // Helper method to get all available languages
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
    ];
  }
}

export const i18n = new I18nService();

// Hook for React components
export function useTranslation() {
  return {
    t: i18n.t.bind(i18n),
    language: i18n.getLanguage(),
    setLanguage: i18n.setLanguage.bind(i18n),
    availableLanguages: i18n.getAvailableLanguages()
  };
}
