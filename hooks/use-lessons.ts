import { useQuery } from "@tanstack/react-query";
import type { Lesson } from "@/data/dataService";

export function useLessons(difficultyId: string) {
  return useQuery<Lesson[]>({
    queryKey: ["lessons", difficultyId],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${difficultyId}`);
      if (!response.ok) throw new Error("Failed to fetch lessons");
      const data = await response.json();
      // Sort lessons by number to ensure consistent order
      return data.sort((a: Lesson, b: Lesson) => a.number - b.number);
    },
    enabled: !!difficultyId,
  });
}

export function useLesson(difficultyId: string, lessonId: string) {
  return useQuery<Lesson>({
    queryKey: ["lesson", difficultyId, lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${difficultyId}/${lessonId}`);
      if (!response.ok) throw new Error("Failed to fetch lesson");
      return response.json();
    },
    enabled: !!difficultyId && !!lessonId,
  });
}

