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
import { ArrowLeft, AlertCircle, FileX } from "lucide-react";
import { convertTimestampToSeconds } from "@/lib/utils";
import { useYouTubeData } from "@/hooks/use-youtube-data";
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
  const videoRef = useRef<HTMLDivElement>(null);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const [noSubtitles, setNoSubtitles] = useState(false);

  useEffect(() => {
    if (type === "youtube") {
      localStorage.setItem("lastYouTubeVideoId", id);
    }
  }, [type, id]);

  // Initialize YouTube player
  useEffect(() => {
    const initializePlayer = () => {
      console.log('Initializing YouTube player for video ID:', id);
      if (window.YT && videoRef.current) {
        const player = new window.YT.Player('youtube-player', {
          videoId: id,
          width: '100%',
          height: '100%',
          playerVars: {
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              console.log('YouTube player ready!');
              setYoutubePlayer(player);
            },
            onError: (event: any) => {
              console.error('YouTube player error:', event);
            },
          },
        });
      } else {
        console.log('YouTube API not ready or videoRef not available');
      }
    };

    if (window.YT) {
      initializePlayer();
    } else {
      console.log('YouTube API not loaded, setting up callback');
      window.onYouTubeIframeAPIReady = initializePlayer;
    }
  }, [id]);

  // Use TanStack Query for YouTube data
  const { data: studyData, isLoading, error: queryError } = useYouTubeData(id);

  useEffect(() => {
    if (queryError) {
      const errorMessage = queryError instanceof Error ? queryError.message : String(queryError);
      if (errorMessage === "NO_SUBTITLES" || errorMessage === "NOT_FOUND") {
        setNoSubtitles(true);
      }
    }
  }, [queryError]);

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
        if (timestamp && youtubePlayer) {
          const seconds = convertTimestampToSeconds(timestamp);
          youtubePlayer.seekTo(seconds, true);
        }
      }, 0);
    },
    [isChatLoading, youtubePlayer]
  );

  const handleWordClick = useCallback(
    (word: string, timestamp?: string) => {
      if (isChatLoading) return;
      setSelectedWord(null); // Reset first to ensure the effect triggers
      setTimeout(() => {
        setSelectedWord(word);
        setActiveTab("chat");
        if (timestamp && youtubePlayer) {
          const seconds = convertTimestampToSeconds(timestamp);
          youtubePlayer.seekTo(seconds, true);
        }
      }, 0);
    },
    [isChatLoading, youtubePlayer]
  );

  const handleTimestampClick = useCallback(
    (timestamp: string) => {
      console.log('Timestamp clicked:', timestamp);
      console.log('YouTube player:', youtubePlayer);
      if (youtubePlayer) {
        const seconds = convertTimestampToSeconds(timestamp);
        console.log('Seeking to seconds:', seconds);
        youtubePlayer.seekTo(seconds, true);
      } else {
        console.log('YouTube player not ready');
      }
    },
    [youtubePlayer]
  );


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
            {noSubtitles ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8">
                <FileX className="w-16 h-16 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    No Subtitles Available
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    This video doesn't have subtitles or transcripts available.
                    Grammar and vocabulary analysis requires subtitles to work.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>Try a different video with available subtitles</span>
                </div>
              </div>
            ) : (
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
                    onTimestampClick={handleTimestampClick}
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
                    onTimestampClick={handleTimestampClick}
                    disabled={isChatLoading}
                    data={studyData?.vocabulary || []}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            )}
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
