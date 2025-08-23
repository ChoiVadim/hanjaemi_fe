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
import {
  fetchLessonData,
  fetchLessonsForDifficultyFromAPI,
  Lesson,
} from "@/data/dataService";

// Helper functions (copied from dataService to avoid circular imports)
function safeParseJSON(jsonString: string): string[] {
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [jsonString];
  } catch (error) {
    console.warn("Failed to parse JSON:", jsonString);
    return [jsonString];
  }
}

function mapVocabType(apiType: string): "important" | "common" | "new" {
  switch (apiType.toLowerCase()) {
    case "important":
    case "top 100":
      return "important";
    case "rarely use":
    case "new":
      return "new";
    default:
      return "common";
  }
}

export default function LevelPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [selectedGrammar, setSelectedGrammar] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentLessonData, setCurrentLessonData] = useState<Lesson | null>(
    null
  );
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(true);
  const [summarySections, setSummarySections] = useState<
    { id: string; title: string; content: string[] }[]
  >([]);

  // Load lessons for the difficulty
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoading(true);
        const lessonsData = await fetchLessonsForDifficultyFromAPI(params.id);
        // Sort lessons by lesson_id to ensure consistent order
        const sortedLessons = lessonsData.sort(
          (a, b) => a.lesson_id - b.lesson_id
        );
        setLessons(sortedLessons);
        if (sortedLessons.length > 0) {
          setSelectedLessonId(sortedLessons[0].lesson_id?.toString() || "1");
        }
      } catch (error) {
        console.error("Error loading lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [params.id]);

  // Load current lesson data from the lessons array
  useEffect(() => {
    if (!selectedLessonId || lessons.length === 0) return;

    const selectedLesson = lessons.find(
      (lesson) => lesson.lesson_id.toString() === selectedLessonId
    );
    if (selectedLesson) {
      // Transform the lesson data to match our Lesson type
      const transformedLesson: Lesson = {
        id: `lesson-${params.id}-${selectedLesson.lesson_id}`,
        number: selectedLesson.lesson_id,
        title: `Lesson ${selectedLesson.lesson_id}`,
        grammar:
          selectedLesson.grammars?.map((g: any) => {
            const examples = safeParseJSON(g.example);
            const translations = safeParseJSON(g.translation);
            const descriptions = safeParseJSON(g.description);

            return {
              id: `grammar-${g.grammarId}`,
              title: g.title,
              description:
                descriptions.length > 0 ? descriptions[0] : g.description,
              descriptionKorean:
                descriptions.length > 0 ? descriptions[0] : undefined,
              descriptionEnglish:
                descriptions.length > 1 ? descriptions[1] : undefined,
              examples: examples,
              translations: translations,
              example: examples.length > 0 ? examples[0] : g.example,
              translation:
                translations.length > 0 ? translations[0] : g.translation,
              type: ["writing", "speaking", "common"].includes(g.type)
                ? (g.type as "writing" | "speaking" | "common")
                : "common",
            };
          }) || [],
        vocabulary:
          selectedLesson.vocabs?.map((v: any) => ({
            id: `vocab-${v.vocabId}`,
            word: v.word,
            meaning: v.meaning,
            context: v.context,
            type: mapVocabType(v.type),
          })) || [],
        exams:
          selectedLesson.exams?.map((e: any) => {
            const options = safeParseJSON(e.options);
            return {
              id: `exam-${e.examId}`,
              question: e.question,
              options: options,
              correctAnswer: parseInt(e.correctAnswer),
            };
          }) || [],
      };

      setCurrentLessonData(transformedLesson);

      // Extract summaries from the selected lesson data
      if (selectedLesson.summaries && Array.isArray(selectedLesson.summaries)) {
        const first = selectedLesson.summaries[0];
        const parsed = parseSummaryContent(
          typeof first?.content === "string" ? first.content : ""
        );
        setSummarySections(parsed);
      } else {
        setSummarySections([]); // Clear summaries if none found
      }
    }
  }, [selectedLessonId, lessons, params.id]);

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
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-screen py-3 px-4">
      <div className="flex items-center mb-2">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="h-8 px-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Lesson Navigation Tabs */}
      <div className="mb-3">
        <Tabs value={selectedLessonId} onValueChange={setSelectedLessonId}>
          <TabsList className="w-full">
            {lessons.map((lesson, index) => (
              <TabsTrigger
                key={lesson.lesson_id}
                value={lesson.lesson_id.toString()}
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
              <TabsTrigger value="grammar">Grammar</TabsTrigger>
              <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
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
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
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
