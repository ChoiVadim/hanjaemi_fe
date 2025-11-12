"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTour } from "@/components/context/tour-context";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: "vocabulary" | "grammar";
}

export function FlashcardsLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="text-sm text-muted-foreground">
        <Skeleton width={100} />
      </div>
      <Card className="w-[90%] max-w-[400px] h-[250px]">
        <CardContent className="flex items-center justify-center h-full">
          <Skeleton width={200} height={30} />
        </CardContent>
      </Card>
      <div className="flex gap-4">
        <Skeleton width={40} height={40} circle />
        <Skeleton width={40} height={40} circle />
        <Skeleton width={40} height={40} circle />
      </div>
    </div>
  );
}

export function Flashcards({
  level,
  vocabulary,
  grammar,
  isLoading,
}: {
  level: string;
  vocabulary?: Array<{ id: string; word: string; meaning: string }>;
  grammar?: Array<{ id: string; title: string; description: string }>;
  isLoading?: boolean;
}) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "vocabulary" | "grammar">(
    "all"
  );
  const { startTour } = useTour();

  const vocabularyCards: Flashcard[] =
    vocabulary?.map((item) => ({
      id: item.id,
      front: item.word,
      back: item.meaning,
      type: "vocabulary",
    })) || [];

  const grammarCards: Flashcard[] =
    grammar?.map((item) => ({
      id: item.id,
      front: item.title,
      back: item.description,
      type: "grammar",
    })) || [];

  const allCards = [...vocabularyCards, ...grammarCards];

  const flashcards =
    activeTab === "all"
      ? allCards
      : activeTab === "vocabulary"
      ? vocabularyCards
      : grammarCards;

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const previousCard = () => {
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
    setIsFlipped(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle left arrow key - previous card
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentCard(
          (prev) => (prev - 1 + flashcards.length) % flashcards.length
        );
        setIsFlipped(false);
      }
      // Handle right arrow key - next card
      else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
        setIsFlipped(false);
      }
      // Handle Enter key - flip card
      else if (e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [flashcards]);

  if (isLoading) {
    return <FlashcardsLoading />;
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-muted-foreground">
          {activeTab === "all"
            ? "No flashcards available"
            : `No ${activeTab} cards available`}
        </p>
      </div>
    );
  }

  const currentType = flashcards[currentCard].type;

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as "all" | "vocabulary" | "grammar");
          setCurrentCard(0);
          setIsFlipped(false);
        }}
        className="w-[90%] max-w-[400px] mb-1"
      >
        <TabsList data-tour="flashcard-tabs" className="grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="text-sm text-muted-foreground mb-1">
        Card {currentCard + 1} of {flashcards.length}
      </div>

      {/* Keyboard controls hint */}
      <div className="text-xs text-muted-foreground mb-2 flex items-center justify-center gap-3">
        <span className="flex items-center">
          <kbd className="px-1 py-0.5 text-xs border rounded-sm mr-1 dark:border-gray-700">
            ←
          </kbd>
          <span>Prev</span>
        </span>
        <span className="flex items-center">
          <kbd className="px-1 py-0.5 text-xs border rounded-sm mr-1 dark:border-gray-700">
            →
          </kbd>
          <span>Next</span>
        </span>
        <span className="flex items-center">
          <kbd className="px-1 py-0.5 text-xs border rounded-sm mr-1 dark:border-gray-700">
            Enter
          </kbd>
          <span>Flip</span>
        </span>
      </div>

      <div className="perspective-1000 w-[90%] max-w-[400px] mb-2">
        <Card
          data-tour="flashcard-card"
          className={`w-full h-[260px] cursor-pointer card-flip border-2 ${
            isFlipped ? "flipped" : ""
          } dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-md dark:bg-card`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="card-face">
            <CardContent className="flex items-center justify-center h-full p-4 text-center">
              {currentType === "vocabulary" ? (
                <span className="korean-character text-primary dark:text-primary">
                  {flashcards[currentCard].front}
                </span>
              ) : (
                <span className="text-2xl font-medium text-primary dark:text-primary">
                  {flashcards[currentCard].front}
                </span>
              )}
            </CardContent>
          </div>
          <div className="card-face card-back">
            <CardContent className="flex items-center justify-center h-full p-4 text-center">
              <span className="text-xl text-primary dark:text-primary">
                {flashcards[currentCard].back}
              </span>
            </CardContent>
          </div>
        </Card>
      </div>

      <div data-tour="flashcard-controls" className="flex gap-6 mt-1">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 dark:border-gray-600 dark:hover:border-gray-500"
          onClick={previousCard}
          disabled={flashcards.length <= 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 dark:border-gray-600 dark:hover:border-gray-500"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <Repeat className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 dark:border-gray-600 dark:hover:border-gray-500"
          onClick={nextCard}
          disabled={flashcards.length <= 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
