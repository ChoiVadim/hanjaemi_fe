"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, Step } from 'react-joyride';

interface TourContextType {
  isRunning: boolean;
  startTour: (tourName: string) => void;
  stopTour: () => void;
  resetTour: () => void;
  startFullOnboarding: () => void;
  resetOnboarding: () => void;
  continueLessonTour: () => void;
  markTourCompleted: () => void;
  markLessonTourCompleted: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: React.ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTour, setCurrentTour] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [fullOnboardingTours, setFullOnboardingTours] = useState<string[]>([]);
  const [currentOnboardingIndex, setCurrentOnboardingIndex] = useState(0);

  // Tour configurations
  const tourConfigs: Record<string, Step[]> = {
    homepage: [
      {
        target: '[data-tour="hero-title"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Welcome to HanJaemi! 🎉</h3>
            <p className="text-sm text-gray-600">
              This is where your Korean learning journey begins. We're excited to help you master Korean!
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="hero-description"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Why HanJaemi is Different</h3>
            <p className="text-sm text-gray-600">
              We make Korean learning fun and engaging with gamified lessons, real K-dramas, and an AI tutor that's always available.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '[data-tour="cta-buttons"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Ready to Start?</h3>
            <p className="text-sm text-gray-600">
              Click "Try Free" to start your journey - no credit card required! You can also watch our demo to see how it works.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="problems-section"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Common Korean Learning Problems</h3>
            <p className="text-sm text-gray-600">
              See how we solve the frustrating challenges that most Korean learners face every day.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="solutions-section"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Our Solutions</h3>
            <p className="text-sm text-gray-600">
              Discover our innovative approach to Korean learning that makes studying enjoyable and effective.
            </p>
          </div>
        ),
        placement: 'top',
      },
    ],
    studyPage: [
      {
        target: '[data-tour="study-header"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Choose Your Level 📚</h3>
            <p className="text-sm text-gray-600">
              Select the Korean proficiency level that matches your current skills to get personalized lessons.
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="level-cards"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Available Levels</h3>
            <p className="text-sm text-gray-600">
              Each level contains structured lessons designed to help you progress systematically through Korean learning.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="level-cards"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Click Any Level to Continue 🎯</h3>
            <p className="text-sm text-gray-600">
              Click on any level card to enter the lesson structure. The tour will continue automatically to show you how to navigate through lessons, grammar, vocabulary, and interactive features.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="placement-test"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Not Sure About Your Level? 🎯</h3>
            <p className="text-sm text-gray-600">
              Take our placement test for personalized recommendations based on your current Korean knowledge.
            </p>
          </div>
        ),
        placement: 'top',
      },
    ],
    sidebar: [
      {
        target: '[data-tour="sidebar-nav"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Navigation Menu 🧭</h3>
            <p className="text-sm text-gray-600">
              Use the sidebar to navigate between Learning, YouTube content, and TOPIK preparation sections.
            </p>
          </div>
        ),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: '[data-tour="user-profile"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Your Profile 👤</h3>
            <p className="text-sm text-gray-600">
              Access your profile, account settings, billing information, and learning progress here.
            </p>
          </div>
        ),
        placement: 'right',
      },
    ],
    lessonPage: [
      {
        target: '[data-tour="lesson-navigation"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Lesson Navigation 📚</h3>
            <p className="text-sm text-gray-600">
              Click on different lesson tabs to switch between lessons. Each lesson contains grammar, vocabulary, and interactive content.
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="grammar-tab"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Grammar Section 📝</h3>
            <p className="text-sm text-gray-600">
              Click on grammar points to learn Korean grammar rules. Selected grammar will be sent to the AI chat for personalized explanations.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '[data-tour="vocabulary-tab"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Vocabulary Section 📖</h3>
            <p className="text-sm text-gray-600">
              Click on vocabulary words to learn their meanings and usage. Selected words will be sent to the AI chat for detailed explanations.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '[data-tour="chat-tab"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">AI Chat Assistant 💬</h3>
            <p className="text-sm text-gray-600">
              Chat with our AI tutor! Ask questions about Korean language, get explanations for grammar and vocabulary, or practice conversations.
            </p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: '[data-tour="flashcards-tab"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Flashcards 🃏</h3>
            <p className="text-sm text-gray-600">
              Practice with interactive flashcards! Use arrow keys to navigate, Enter to flip cards, and switch between vocabulary and grammar.
            </p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: '[data-tour="summary-tab"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Lesson Summary 📋</h3>
            <p className="text-sm text-gray-600">
              Review key points from this lesson including grammar rules, essential vocabulary, and cultural notes.
            </p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: '[data-tour="test-tab"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Practice Test 🧠</h3>
            <p className="text-sm text-gray-600">
              Take a test to check your understanding! Answer questions about the lesson content and see your results.
            </p>
          </div>
        ),
        placement: 'left',
      },
    ],
    youtubePage: [
      {
        target: '[data-tour="youtube-input"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">YouTube Learning 🎥</h3>
            <p className="text-sm text-gray-600">
              Paste any YouTube video URL here to learn Korean from real content! Our AI will analyze the video and create interactive lessons.
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="analyze-button"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Start Learning 🚀</h3>
            <p className="text-sm text-gray-600">
              Click "Analyze" to begin learning from the video. The AI will extract vocabulary, grammar, and create practice exercises.
            </p>
          </div>
        ),
        placement: 'left',
      },
    ],
    youtubeVideoPage: [
      {
        target: '[data-tour="video-player"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Video Player 📺</h3>
            <p className="text-sm text-gray-600">
              Watch the YouTube video here. The AI has analyzed this content to create personalized Korean lessons for you.
            </p>
          </div>
        ),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: '[data-tour="video-grammar"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Video Grammar 📝</h3>
            <p className="text-sm text-gray-600">
              Grammar points extracted from the video. Click on any grammar point to learn more or send it to the AI chat.
            </p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: '[data-tour="video-vocabulary"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Video Vocabulary 📚</h3>
            <p className="text-sm text-gray-600">
              Korean words and phrases from the video. Click on vocabulary to learn meanings and usage in context.
            </p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: '[data-tour="video-chat"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Video Chat 💬</h3>
            <p className="text-sm text-gray-600">
              Ask questions about the video content! The AI understands the video context and can explain scenes, dialogue, and cultural references.
            </p>
          </div>
        ),
        placement: 'left',
      },
    ],
    topikPage: [
      {
        target: '[data-tour="topik-topics"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">TOPIK Practice Areas 🎯</h3>
            <p className="text-sm text-gray-600">
              Choose your TOPIK practice area: Writing, Reading, Listening, or Speaking. Each section has specialized exercises and AI feedback.
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="writing-practice"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Writing Practice ✍️</h3>
            <p className="text-sm text-gray-600">
              Practice Korean writing with AI-powered feedback. Get corrections, suggestions, and tips to improve your writing skills.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="reading-practice"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Reading Practice 📖</h3>
            <p className="text-sm text-gray-600">
              Improve reading comprehension with Korean texts and questions. Get detailed explanations for difficult passages.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="listening-practice"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Listening Practice 🎧</h3>
            <p className="text-sm text-gray-600">
              Practice listening comprehension with audio exercises. Get transcripts and explanations for better understanding.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="speaking-practice"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Speaking Practice 🗣️</h3>
            <p className="text-sm text-gray-600">
              Practice Korean speaking with AI conversation partner. Get pronunciation feedback and conversation practice.
            </p>
          </div>
        ),
        placement: 'top',
      },
    ],
    chatComponent: [
      {
        target: '[data-tour="chat-messages"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Chat Messages 💬</h3>
            <p className="text-sm text-gray-600">
              Your conversation history with the AI tutor. The AI remembers context from grammar and vocabulary selections.
            </p>
          </div>
        ),
        placement: 'top',
        disableBeacon: true,
      },
      {
        target: '[data-tour="chat-input"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Ask Questions ❓</h3>
            <p className="text-sm text-gray-600">
              Type your questions here! Ask about Korean grammar, vocabulary, culture, or practice conversations.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="chat-send"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Send Message 📤</h3>
            <p className="text-sm text-gray-600">
              Click to send your message or press Enter. The AI will respond with helpful explanations and examples.
            </p>
          </div>
        ),
        placement: 'left',
      },
    ],
    flashcardsComponent: [
      {
        target: '[data-tour="flashcard-tabs"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Flashcard Types 🃏</h3>
            <p className="text-sm text-gray-600">
              Switch between All cards, Vocabulary only, or Grammar only. Practice different types of content separately.
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '[data-tour="flashcard-card"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Interactive Card 🎴</h3>
            <p className="text-sm text-gray-600">
              Click the card to flip it! Use arrow keys (← →) to navigate and Enter to flip. See Korean on front, English on back.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '[data-tour="flashcard-controls"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Navigation Controls 🎮</h3>
            <p className="text-sm text-gray-600">
              Use these buttons or keyboard shortcuts to navigate through flashcards. Practice makes perfect!
            </p>
          </div>
        ),
        placement: 'top',
      },
    ],
    examComponent: [
      {
        target: '[data-tour="exam-questions"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Practice Questions ❓</h3>
            <p className="text-sm text-gray-600">
              Answer these questions to test your understanding of the lesson. Select your answers and submit when ready.
            </p>
          </div>
        ),
        placement: 'top',
        disableBeacon: true,
      },
      {
        target: '[data-tour="exam-submit"]',
        content: (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-black">Submit Test 📝</h3>
            <p className="text-sm text-gray-600">
              Click "Submit" when you've answered all questions. You'll see your score and get feedback on your performance.
            </p>
          </div>
        ),
        placement: 'top',
      },
    ],
  };

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startTour = useCallback((tourName: string) => {
    if (tourConfigs[tourName]) {
      setCurrentTour(tourName);
      setStepIndex(0);
      setIsRunning(true);
    }
  }, []);

  const continueLessonTour = useCallback(() => {
    setCurrentTour('lessonPage');
    setStepIndex(0);
    setIsRunning(true);
  }, []);

  const markTourCompleted = useCallback(async () => {
    try {
      await fetch('/api/users/mark-not-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error marking tour as completed:', error);
    }
  }, []);

  const markLessonTourCompleted = useCallback(async () => {
    try {
      await fetch('/api/users/mark-lesson-tour-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error marking lesson tour as completed:', error);
    }
  }, []);

  const resetOnboarding = useCallback(() => {
    // Reset onboarding state - no localStorage needed
    setFullOnboardingTours([]);
    setCurrentOnboardingIndex(0);
    setCurrentTour(null);
    setStepIndex(0);
    setIsRunning(false);
  }, []);

  const startFullOnboarding = useCallback(() => {
    const tours = ['studyPage'];
    setFullOnboardingTours(tours);
    setCurrentOnboardingIndex(0);
    setCurrentTour(tours[0]);
    setStepIndex(0);
    setIsRunning(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsRunning(false);
    setCurrentTour(null);
    setStepIndex(0);
  }, []);

  const resetTour = useCallback(() => {
    setStepIndex(0);
  }, []);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, type, index } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      // Check if we're in full onboarding mode
      if (fullOnboardingTours.length > 0 && currentOnboardingIndex < fullOnboardingTours.length - 1) {
        // Move to next tour in onboarding sequence
        const nextIndex = currentOnboardingIndex + 1;
        setCurrentOnboardingIndex(nextIndex);
        setCurrentTour(fullOnboardingTours[nextIndex]);
        setStepIndex(0);
        setIsRunning(true);
      } else {
        // End of tours or single tour
        setIsRunning(false);
        setCurrentTour(null);
        setStepIndex(0);
        setFullOnboardingTours([]);
        setCurrentOnboardingIndex(0);
        
        // Mark tour as completed in database based on tour type
        if (currentTour === 'studyPage') {
          markTourCompleted(); // Mark user as not new
        } else if (currentTour === 'lessonPage') {
          markLessonTourCompleted(); // Mark lesson tour as completed
        }
      }
    } else if (type === EVENTS.STEP_AFTER) {
      setStepIndex(index + 1);
    }
  }, [fullOnboardingTours, currentOnboardingIndex, currentTour]);

  const currentSteps = currentTour ? tourConfigs[currentTour] : [];

  const value: TourContextType = {
    isRunning,
    startTour,
    stopTour,
    resetTour,
    startFullOnboarding,
    resetOnboarding,
    continueLessonTour,
    markTourCompleted,
    markLessonTourCompleted,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
      {isMounted && (
        <Joyride
          steps={currentSteps}
          run={isRunning}
          stepIndex={stepIndex}
          callback={handleJoyrideCallback}
          continuous
          showProgress
          showSkipButton
          styles={{
          options: {
            primaryColor: '#000000',
            textColor: '#000000',
            backgroundColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            arrowColor: '#ffffff',
            width: 420,
            zIndex: 1000,
          },
          tooltip: {
            borderRadius: 12,
            fontSize: 16,
            padding: 24,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e7eb',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: 12,
            lineHeight: 1.3,
          },
          tooltipContent: {
            fontSize: 14,
            color: '#6b7280',
            lineHeight: 1.6,
            marginBottom: 16,
          },
          buttonNext: {
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: '600',
            padding: '12px 24px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          buttonBack: {
            color: '#6b7280',
            fontSize: 14,
            marginRight: 12,
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'color 0.2s ease',
          },
          buttonSkip: {
            color: '#9ca3af',
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'color 0.2s ease',
          },
          buttonClose: {
            color: '#9ca3af',
            fontSize: 20,
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          },
          beacon: {
            inner: '#000000',
            outer: '#000000',
          } as any,
          spotlight: {
            borderRadius: 8,
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish Tour',
          next: 'Next',
          skip: 'Skip Tour',
        }}
      />
      )}
    </TourContext.Provider>
  );
};
