"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Grammar } from "@/components/grammar";
import { Vocabulary } from "@/components/vocabulary";
import { Chat } from "@/components/chat";
import { Flashcards } from "@/components/flashcards";
import { Summary } from "@/components/summary";
import { Test } from "@/components/exam";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Lesson } from "@/data/dataService";
import { useTour } from "@/components/context/tour-context";
import { useLessons } from "@/hooks/use-lessons";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function LevelPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { continueLessonTour } = useTour();

  const [selectedGrammar, setSelectedGrammar] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("1");
  const [summarySections, setSummarySections] = useState<
    { id: string; title: string; content: string[] }[]
  >([]);

  // Use TanStack Query for lessons
  const { data: lessons = [], isLoading } = useLessons(params.id);
  const { data: profile } = useUserProfile();

  // Set initial selected lesson when lessons load - always set to first lesson
  useEffect(() => {
    if (lessons.length > 0) {
      const firstLessonId = lessons[0].number?.toString() || "1";
      setSelectedLessonId(firstLessonId);
    }
  }, [lessons.length]);

  // Continue lesson page tour when page loads (only for new users)
  useEffect(() => {
    if (!isLoading && lessons.length > 0 && profile) {
      // Show lesson tour if user completed main tour but not lesson tour
      if (!profile.is_new_user && !profile.lesson_tour_completed) {
        console.log('User completed main tour but not lesson tour, starting lesson tour');
        const timer = setTimeout(() => {
          continueLessonTour();
        }, 1000);
        return () => clearTimeout(timer);
      } else if (profile.is_new_user) {
        console.log('New user on lesson page, skipping lesson tour (should complete main tour first)');
      } else if (profile.lesson_tour_completed) {
        console.log('User already completed lesson tour, skipping');
      }
    }
  }, [isLoading, lessons.length, profile, continueLessonTour]);

  // Get current lesson data and parse summaries
  const currentLessonData = useMemo(() => {
    if (!selectedLessonId || lessons.length === 0) return null;

    const selectedLesson = lessons.find(
      (lesson) => lesson.number.toString() === selectedLessonId
    );
    
    if (selectedLesson) {
      // Extract summaries from the selected lesson data
      if (selectedLesson.summaries && Array.isArray(selectedLesson.summaries)) {
        const first = selectedLesson.summaries[0];
        const parsed = parseSummaryContent(
          typeof first?.content === "string" ? first.content : ""
        );
        setSummarySections(parsed);
      } else {
        setSummarySections([]);
      }
      
      return selectedLesson;
    }
    
    return null;
  }, [selectedLessonId, lessons]);

  function parseSummaryContent(
    raw: string
  ): { id: string; title: string; content: string[] }[] {
    const titles = [
      "Key Grammar Points",
      "Essential Vocabulary",
      "Cultural Notes",
    ];
    const sections: Record<string, string[]> = {
      "Key Grammar Points": [],
      "Essential Vocabulary": [],
      "Cultural Notes": [],
    };
    let current: string = "Key Grammar Points";
    if (!raw) return [];
    const lines = raw.split("\n");
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      const heading = titles.find((t) =>
        line.toLowerCase().startsWith(t.toLowerCase())
      );
      if (heading) {
        current = heading;
        continue;
      }
      const clean = line.replace(/^[-•\s]+/, "");
      sections[current].push(clean);
    }
    return titles.map((t, idx) => ({
      id: String(idx + 1),
      title: t,
      content: sections[t],
    }));
  }

  const handleGrammarClick = useCallback((grammar: string) => {
    setSelectedGrammar(grammar);
  }, []);

  const handleWordClick = useCallback((word: string) => {
    setSelectedWord(word);
  }, []);

  return (
    <div className="flex flex-col max-h-screen p-10">
      {/* Lesson Navigation Tabs */}
      <div data-tour="lesson-navigation" className="mb-3">
        <Tabs value={selectedLessonId} onValueChange={setSelectedLessonId}>
          <TabsList className="w-full">
            {lessons.map((lesson, index) => (
              <TabsTrigger
                key={lesson.id}
                value={lesson.number.toString()}
              >
                Lesson {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 flex-1 overflow-hidden lg:grid-cols-2">
        <Card className="p-3 flex flex-col overflow-hidden">
          <Tabs defaultValue="grammar" className="flex flex-col h-full">
            <TabsList className="w-full">
              <TabsTrigger data-tour="grammar-tab" value="grammar">Grammar</TabsTrigger>
              <TabsTrigger data-tour="vocabulary-tab" value="vocabulary">Vocabulary</TabsTrigger>
            </TabsList>
            <TabsContent value="grammar" className="flex-1 overflow-auto">
              <Grammar
                type="lesson"
                id={selectedLessonId}
                onGrammarClick={handleGrammarClick}
                disabled={isChatLoading}
                data={currentLessonData?.grammar || []}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="vocabulary" className="flex-1 overflow-auto">
              <Vocabulary
                type="lesson"
                id={selectedLessonId}
                onWordClick={handleWordClick}
                disabled={isChatLoading}
                data={currentLessonData?.vocabulary || []}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </Card>
        <Card className="p-3 flex flex-col overflow-hidden">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="w-full">
              <TabsTrigger data-tour="chat-tab" value="chat">Chat</TabsTrigger>
              <TabsTrigger data-tour="flashcards-tab" value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger data-tour="summary-tab" value="summary">Summary</TabsTrigger>
              <TabsTrigger data-tour="test-tab" value="test">Test</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 overflow-auto">
              <Chat
                level={selectedLessonId}
                selectedGrammar={selectedGrammar}
                selectedWord={selectedWord}
                onLoadingChange={setIsChatLoading}
              />
            </TabsContent>
            <TabsContent value="flashcards" className="flex-1 overflow-auto">
              <Flashcards
                level={selectedLessonId}
                vocabulary={currentLessonData?.vocabulary || []}
                grammar={currentLessonData?.grammar || []}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="summary" className="flex-1 overflow-auto">
              <Summary level={selectedLessonId} data={summarySections} />
            </TabsContent>
            <TabsContent value="test" className="flex-1 overflow-auto">
              <Test
                level={selectedLessonId}
                exams={currentLessonData?.exams || []}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
