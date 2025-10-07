// Internationalization (i18n) system for HanJaemi
import { useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'ru';

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
  'common.hello': string;
  'common.home': string;
  'common.learning': string;
  'common.youtube': string;
  'common.chat': string;
  'common.flashcards': string;
  'common.summary': string;
  'common.test': string;
  'common.grammar': string;
  'common.vocabulary': string;
  'common.upgradeToPro': string;
  'common.account': string;
  'common.billing': string;
  'common.notifications': string;
  'common.logout': string;
  'common.usage': string;
  'common.dailyRequests': string;
  'common.monthlyRequests': string;
  'common.remaining': string;
  'common.used': string;
  'common.unlimited': string;
  'common.platform': string;
  'common.chatHistory': string;
  'common.noChatHistory': string;
  'common.startConversation': string;

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
    'common.hello': 'Hello',
    'common.home': 'Home',
    'common.learning': 'Learning',
    'common.youtube': 'YouTube',
    'common.chat': 'Chat',
    'common.flashcards': 'Flashcards',
    'common.summary': 'Summary',
    'common.test': 'Test',
    'common.grammar': 'Grammar',
    'common.vocabulary': 'Vocabulary',
    'common.upgradeToPro': 'Upgrade to Pro',
    'common.account': 'Account',
    'common.billing': 'Billing',
    'common.notifications': 'Notifications',
    'common.logout': 'Log out',
    'common.usage': 'Usage',
    'common.dailyRequests': 'Daily Requests',
    'common.monthlyRequests': 'Monthly Requests',
    'common.remaining': 'Remaining',
    'common.used': 'Used',
    'common.unlimited': 'Unlimited',
    'common.platform': 'Platform',
    'common.chatHistory': 'Chat History',
    'common.noChatHistory': 'No chat history yet',
    'common.startConversation': 'Start a conversation to see history',

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
    'common.hello': 'Привет',
    'common.home': 'Главная',
    'common.learning': 'Обучение',
    'common.youtube': 'YouTube',
    'common.chat': 'Чат',
    'common.flashcards': 'Флэшкарты',
    'common.summary': 'Сводка',
    'common.test': 'Тест',
    'common.grammar': 'Грамматика',
    'common.vocabulary': 'Словарь',
    'common.upgradeToPro': 'Обновить до Pro',
    'common.account': 'Аккаунт',
    'common.billing': 'Оплата',
    'common.notifications': 'Уведомления',
    'common.logout': 'Выйти',
    'common.usage': 'Использование',
    'common.dailyRequests': 'Ежедневные запросы',
    'common.monthlyRequests': 'Ежемесячные запросы',
    'common.remaining': 'Осталось',
    'common.used': 'Использовано',
    'common.unlimited': 'Безлимитно',
    'common.platform': 'Платформа',
    'common.chatHistory': 'История чата',
    'common.noChatHistory': 'Истории чата пока нет',
    'common.startConversation': 'Начните разговор, чтобы увидеть историю',

    // Homepage
    'home.title': 'Хватит мучиться со скучными учебниками корейского',
    'home.subtitle': 'Начни учиться с HanJaemi',
    'home.description': 'Наконец-то платформа для изучения корейского, которая действительно мотивирует учиться с геймифицированными уроками, настоящими K-драмами и AI-репетитором, который всегда доступен.',
    'home.cta.start': 'Попробовать бесплатно - без карты',
    'home.cta.learn': 'Посмотреть как это работает',

    // Study
    'study.title': 'Учеба',
    'study.grammar': 'Грамматика',
    'study.vocabulary': 'Словарь',
    'study.chat': 'Чат',
    'study.flashcards': 'Флэшкарты',
    'study.summary': 'Сводка',
    'study.test': 'Тест',

    // Chat
    'chat.title': 'Чат с AI-репетитором',
    'chat.placeholder': 'Спроси меня что угодно о корейском...',
    'chat.send': 'Отправить',
    'chat.welcome': 'Привет! Я твой партнер по изучению корейского языка! 🎓',
    'chat.help.grammar': 'Объяснения грамматики - Я объясню сложную корейскую грамматику простыми словами',
    'chat.help.vocabulary': 'Изучение слов - Изучай новые слова и как их правильно использовать',
    'chat.help.conversation': 'Практика разговора - Практикуй естественные корейские разговоры',
    'chat.help.writing': 'Помощь в написании - Получи помощь с предложениями и эссе',
    'chat.help.topik': 'Подготовка к TOPIK - Советы и практика для экзамена по корейскому языку',
    'chat.help.culture': 'Культурные особенности - Узнай о корейской культуре и обычаях',
    'chat.help.translation': 'Поддержка перевода - Помощь с корейско-английскими переводами',

    // Usage limits
    'usage.daily.limit': 'Ежедневный лимит',
    'usage.monthly.limit': 'Ежемесячный лимит',
    'usage.remaining': 'осталось',
    'usage.exceeded': 'Превышен лимит использования',
    'usage.upgrade': 'Обновите для продолжения',

    // Progress
    'progress.level': 'Уровень',
    'progress.lessons': 'Уроков завершено',
    'progress.grammar': 'Грамматических правил изучено',
    'progress.vocabulary': 'Слов изучено',
    'progress.streak': 'Дней подряд',
    'progress.studyTime': 'Общее время изучения',

    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.notifications': 'Уведомления',
    'settings.email': 'Email уведомления',
    'settings.reminders': 'Напоминания об учебе',
    'settings.difficulty': 'Предпочтения сложности',
    'settings.goal': 'Ежедневная цель изучения',

    // Errors
    'error.network': 'Ошибка сети. Проверьте подключение.',
    'error.unauthorized': 'Пожалуйста, войдите в систему.',
    'error.forbidden': 'У вас нет прав доступа к этому.',
    'error.notFound': 'Запрашиваемый ресурс не найден.',
    'error.server': 'Ошибка сервера. Попробуйте позже.',
    'error.usageLimit': 'Вы достигли лимита использования. Обновите план.'
  },
};

// Hook for React components
export function useTranslation() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Load language preference from localStorage
    const storedLang = localStorage.getItem('languagePreference') as SupportedLanguage;
    if (storedLang && translations[storedLang]) {
      setLanguage(storedLang);
    } else {
      // Fallback to browser language or default 'en'
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  const t = (key: keyof TranslationKeys): string => {
    return translations[language][key] || key;
  };

  const changeLanguage = (newLang: SupportedLanguage) => {
    if (translations[newLang]) {
      setLanguage(newLang);
      localStorage.setItem('languagePreference', newLang);
    }
  };

  return { 
    t, 
    language, 
    setLanguage: changeLanguage,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
    ]
  };
}