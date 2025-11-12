"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, Search } from "lucide-react";

type HistoryItem = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export default function YouTubeAnalysis() {
  const [videoUrl, setVideoUrl] = useState("");
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load search history from localStorage
    const searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
      setHistory(JSON.parse(searchHistory));
    }
  }, [router]);

  const handleAnalyze = async () => {
    try {
      const url = new URL(videoUrl);
      let videoId: string | null = null;

      // Handle youtube.com/watch?v= format
      if (
        url.hostname === "www.youtube.com" ||
        url.hostname === "youtube.com"
      ) {
        videoId = url.searchParams.get("v");
      }
      // Handle youtu.be/ format
      else if (url.hostname === "youtu.be") {
        videoId = url.pathname.slice(1); // Remove the leading slash
      }

      if (videoId) {
        // Create a placeholder history item
        const newHistory: HistoryItem = {
          id: videoId,
          title: "Loading...", // Placeholder until we get the actual title
          content: videoUrl,
          createdAt: new Date(),
        };

        // Add to history first with placeholder
        setHistory((prev) => {
          const updatedHistory = [newHistory, ...prev];
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
          return updatedHistory;
        });

        // Navigate to the video page immediately
        router.push(`/youtube/${videoId}`);

        // Fetch the video title in the background
        try {
          const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
          );
          const data = await response.json();
          const videoTitle = data.title;

          // Update history with actual title
          setHistory((prev) => {
            const updatedHistory = prev.map((item) =>
              item.id === videoId ? { ...item, title: videoTitle } : item
            );
            localStorage.setItem(
              "searchHistory",
              JSON.stringify(updatedHistory)
            );
            return updatedHistory;
          });
        } catch (fetchError) {
          console.error("Failed to fetch video title:", fetchError);
        }
      }
    } catch (error) {
      console.error("Invalid URL:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">

      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center">
          What would you like to learn from?
        </h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            data-tour="youtube-input"
            className="pl-10 pr-20 h-14 text-lg bg-muted/40"
            placeholder="Paste YouTube video URL here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            data-tour="analyze-button"
            className="absolute right-2 top-2 bottom-2"
            onClick={handleAnalyze}
          >
            <Search className="h-4 w-4 mr-2" />
            Analyze
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Press Enter or click Analyze to start learning from the video
        </p>
      </div>
    </div>
  );
}
