import { useQuery } from "@tanstack/react-query";

export interface YouTubeStudyData {
  grammar: Array<{
    id: string;
    title: string;
    description: string;
    descriptionKorean?: string;
    descriptionEnglish?: string;
    example?: string;
    examples?: string[];
    translation?: string;
    translations?: string[];
    type?: string;
    timestamp?: string;
  }>;
  vocabulary: Array<{
    id: string;
    word: string;
    meaning: string;
    context?: string;
    type?: string;
    timestamp?: string;
    examples?: string[];
    translations?: string[];
  }>;
}

export function useYouTubeData(videoId: string) {
  return useQuery<YouTubeStudyData>({
    queryKey: ["youtubeData", videoId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_YT_API_URL || 'https://backend-fastapi-94xx.onrender.com'}/api/grammar-and-vocabulary/${videoId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json().catch(() => null);
          if (errorData?.error === "No transcript found for this video ID") {
            throw new Error("NO_SUBTITLES");
          }
          throw new Error("NOT_FOUND");
        }
        throw new Error("Failed to fetch study data");
      }

      const data = await response.json();
      
      // Transform YouTube API data to match component expectations
      return {
        grammar: data.grammar?.map((item: any) => ({
          id: item.id || item.grammar_id?.toString() || Math.random().toString(),
          title: item.title,
          description: item.description,
          descriptionKorean: item.descriptionKorean,
          descriptionEnglish: item.descriptionEnglish,
          example: item.example,
          examples: item.example ? [item.example] : item.examples || [],
          translation: item.translation,
          translations: item.translation ? [item.translation] : item.translations || [],
          type: item.type || item.difficulty || 'common',
          timestamp: item.timestamp
        })) || [],
        vocabulary: data.vocabulary?.map((item: any) => ({
          id: item.id || item.vocab_id?.toString() || Math.random().toString(),
          word: item.word,
          meaning: item.meaning,
          context: item.context,
          type: item.type || 'common',
          timestamp: item.timestamp,
          examples: item.examples || [],
          translations: item.translations || []
        })) || []
      };
    },
    enabled: !!videoId,
    retry: false,
  });
}

