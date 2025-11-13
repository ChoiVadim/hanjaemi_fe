import { useQuery } from "@tanstack/react-query";
import { GrammarType } from "@/components/grammar";
import { VocabType } from "@/components/vocabulary";

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
    type?: GrammarType;
    timestamp?: string;
  }>;
  vocabulary: Array<{
    id: string;
    word: string;
    meaning: string;
    context?: string;
    type?: VocabType;
    timestamp?: string;
    examples?: string[];
    translations?: string[];
  }>;
}

export function useYouTubeData(videoId: string) {
  return useQuery<YouTubeStudyData>({
    queryKey: ["youtubeData", videoId],
    queryFn: async () => {
      // Get API URL with proper fallback
      // NEXT_PUBLIC_* vars are embedded at build time in Next.js
      const apiUrl = process.env.NEXT_PUBLIC_YT_API_URL || 'https://backend-fastapi-94xx.onrender.com';
      const url = `${apiUrl}/api/grammar-and-vocabulary/${videoId}`;
      
      console.log('Fetching YouTube data from:', url);
      console.log('API URL env var:', process.env.NEXT_PUBLIC_YT_API_URL ? 'Set' : 'Not set (using fallback)');
      
      let response: Response;
      try {
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(30000), // 30 second timeout
        });
      } catch (fetchError) {
        console.error('Network error fetching YouTube data:', fetchError);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error("Request timeout - the API took too long to respond");
        }
        if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
          throw new Error("Network error - unable to reach the API. Please check your connection and try again.");
        }
        throw new Error(`Failed to fetch study data: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json().catch(() => null);
          if (errorData?.error === "No transcript found for this video ID") {
            throw new Error("NO_SUBTITLES");
          }
          throw new Error("NOT_FOUND");
        }
        if (response.status === 500) {
          const errorData = await response.json().catch(() => null);
          console.error('API server error:', errorData);
          throw new Error("API server error - please try again later");
        }
        if (response.status === 503) {
          throw new Error("Service unavailable - the API is temporarily down");
        }
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch study data (${response.status})`);
      }

      const data = await response.json();
      
      // Transform YouTube API data to match component expectations
      const validGrammarTypes: GrammarType[] = ["writing", "speaking", "common"];
      const validateGrammarType = (type: any): GrammarType => {
        if (typeof type === "string" && validGrammarTypes.includes(type as GrammarType)) {
          return type as GrammarType;
        }
        return "common";
      };

      const validVocabTypes: VocabType[] = ["important", "common", "new"];
      const validateVocabType = (type: any): VocabType => {
        if (typeof type === "string" && validVocabTypes.includes(type as VocabType)) {
          return type as VocabType;
        }
        // Map common API types to VocabType
        if (typeof type === "string") {
          const lowerType = type.toLowerCase();
          if (lowerType === "important" || lowerType === "top 100") {
            return "important";
          }
          if (lowerType === "rarely use" || lowerType === "new") {
            return "new";
          }
        }
        return "common";
      };

      const grammar: YouTubeStudyData['grammar'] = (data.grammar?.map((item: any) => {
        const validatedType: GrammarType = validateGrammarType(item.type || item.difficulty);
        return {
          id: item.id || item.grammar_id?.toString() || Math.random().toString(),
          title: item.title,
          description: item.description,
          descriptionKorean: item.descriptionKorean,
          descriptionEnglish: item.descriptionEnglish,
          example: item.example,
          examples: item.example ? [item.example] : item.examples || [],
          translation: item.translation,
          translations: item.translation ? [item.translation] : item.translations || [],
          type: validatedType as GrammarType | undefined,
          timestamp: item.timestamp
        };
      }) || []);

      const vocabulary: YouTubeStudyData['vocabulary'] = (data.vocabulary?.map((item: any) => {
        const validatedType: VocabType = validateVocabType(item.type);
        return {
          id: item.id || item.vocab_id?.toString() || Math.random().toString(),
          word: item.word,
          meaning: item.meaning,
          context: item.context,
          type: validatedType as VocabType | undefined,
          timestamp: item.timestamp,
          examples: item.examples || [],
          translations: item.translations || []
        };
      }) || []);

      return {
        grammar,
        vocabulary
      };
    },
    enabled: !!videoId,
    retry: false,
  });
}

