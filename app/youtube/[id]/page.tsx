"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { YoutubeVideo } from "@/components/youtube-video";
import { Grammar } from "@/components/grammar";
import { Vocabulary } from "@/components/vocabulary";
import { Chat } from "@/components/chat";
import { Flashcards } from "@/components/flashcards";
import { Summary } from "@/components/summary";
import { Test } from "@/components/exam";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import "react-loading-skeleton/dist/skeleton.css";

export default function StudyPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { type, id } = params;
  const router = useRouter();
  const [selectedGrammar, setSelectedGrammar] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [studyData, setStudyData] = useState<{
    grammar: any[];
    vocabulary: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type === "youtube") {
      localStorage.setItem("lastYouTubeVideoId", id);
    }
  }, [type, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/grammar-and-vocabulary/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch study data");
        }
        const data = await response.json();
        setStudyData(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load study data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    if (type === "youtube") {
      localStorage.removeItem("lastYouTubeVideoId");
      router.push("/youtube");
    } else {
      router.push("/study");
    }
  };

  const handleGrammarClick = useCallback(
    (grammar: string, timestamp?: string) => {
      if (isChatLoading) return;
      setSelectedGrammar(null); // Reset first to ensure the effect triggers
      setTimeout(() => {
        setSelectedGrammar(grammar);
        setActiveTab("chat");
        if (timestamp && videoRef.current) {
          const seconds = convertTimestampToSeconds(timestamp);
          const iframe = videoRef.current as HTMLIFrameElement & {
            contentWindow: {
              postMessage: (message: any, target: string) => void;
            };
          };
          iframe.contentWindow.postMessage(
            { event: "command", func: "seekTo", args: [seconds] },
            "*"
          );
        }
      }, 0);
    },
    [isChatLoading]
  );

  const handleWordClick = useCallback(
    (word: string, timestamp?: string) => {
      if (isChatLoading) return;
      setSelectedWord(null); // Reset first to ensure the effect triggers
      setTimeout(() => {
        setSelectedWord(word);
        setActiveTab("chat");
        if (timestamp && videoRef.current) {
          const seconds = convertTimestampToSeconds(timestamp);
          const iframe = videoRef.current as HTMLIFrameElement & {
            contentWindow: {
              postMessage: (message: any, target: string) => void;
            };
          };
          iframe.contentWindow.postMessage(
            { event: "command", func: "seekTo", args: [seconds] },
            "*"
          );
        }
      }, 0);
    },
    [isChatLoading]
  );

  const convertTimestampToSeconds = (timestamp: string): number => {
    const [minutes, seconds] = timestamp.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  return (
    <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
      <Button variant="ghost" onClick={handleBack} className="mb-4 w-fit">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
      </Button>
      <div className="grid gap-4 lg:grid-cols-2 flex-1 overflow-hidden">
        <div className="space-y-4 overflow-hidden flex flex-col">
          <Card className="p-3">
            <div className="relative rounded-md">
              <YoutubeVideo videoId={id} ref={videoRef} />
            </div>
          </Card>

          <Card className="p-3 flex flex-col overflow-hidden">
            <Tabs className="flex flex-col h-full " defaultValue="grammar">
              <TabsList className="w-full">
                <TabsTrigger value="grammar">Grammar</TabsTrigger>
                <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
              </TabsList>
              <TabsContent value="grammar" className="flex-1 overflow-auto">
                <Grammar
                  type={type}
                  id={id}
                  onGrammarClick={handleGrammarClick}
                  disabled={isChatLoading}
                  data={studyData?.grammar || []}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="vocabulary" className="flex-1 h-0 p-0 mt-0">
                <Vocabulary
                  type={type}
                  id={id}
                  onWordClick={handleWordClick}
                  disabled={isChatLoading}
                  data={studyData?.vocabulary || []}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        <Card className="p-3 flex flex-col overflow-hidden h-full max-h-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col h-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 overflow-auto h-0">
              <Chat
                level={id}
                selectedGrammar={selectedGrammar}
                selectedWord={selectedWord}
                onLoadingChange={setIsChatLoading}
              />
            </TabsContent>
            <TabsContent
              value="flashcards"
              className="flex-1 overflow-auto h-0"
            >
              <Flashcards
                level={type}
                vocabulary={studyData?.vocabulary}
                grammar={studyData?.grammar}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="summary" className="flex-1 overflow-auto h-0">
              <Summary level={id} />
            </TabsContent>
            <TabsContent value="test" className="flex-1 overflow-auto h-0">
              <Test level={id} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
