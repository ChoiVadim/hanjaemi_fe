// Import the static data
import levelsData from './levels-data.json';

// Type definitions for the JSON data structure
type LevelsData = {
  difficulties: Array<{
    difficultyId: number;
    name: string;
    description: string;
    lessonCount: number;
  }>;
  levels: Record<string, {
    title: string;
    description: string;
    lessons: Array<{
      id: string;
      number: number;
      title: string;
      description: string;
      grammar: Array<{
        id: string;
        title: string;
        description: string;
        example: string;
        translation: string;
        type: string;
      }>;
      vocabulary: Array<{
        id: string;
        word: string;
        meaning: string;
        context: string;
        type: string;
        examples?: string[];
        translations?: string[];
      }>;
      exams: Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
      }>;
      summaries: Array<{
        id: string;
        title: string;
        content: string;
      }>;
    }>;
  }>;
};

const typedLevelsData = levelsData as LevelsData;

// Database types matching your MySQL schema
export type DifficultyFromDB = {
  difficulty_id: number;
  name: string;
  description: string;
  lesson_count: number;
};

export type LessonFromDB = {
  lesson_id: number;
  difficulty_id: number;
  title: string;
  description?: string;
  order_num: number;
};

export type VocabularyFromDB = {
  vocab_id: number;
  lesson_id: number;
  word: string;
  meaning: string;
  context: string;
  type: string;
};

export type GrammarFromDB = {
  grammar_id: number;
  lesson_id: number;
  title: string;
  description: string;
  example: string;
  translation: string;
  type: string;
};

// API Response types for the specific lesson endpoint
export type LessonApiResponse = {
  difficulty_id: number;
  lesson_id: number;
  grammars: {
    grammarId: number;
    lessonId: number;
    title: string;
    description: string;
    example: string;
    translation: string;
    type: string;
  }[];
  vocabs: {
    vocabId: number;
    lessonId: number;
    word: string;
    meaning: string;
    context: string;
    type: string;
  }[];
  exams: {
    examId: number;
    lessonId: number;
    question: string;
    options: string;
    correctAnswer: string;
  }[];
};

// Transformed types for the frontend
export type Difficulty = {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
};

export type Exam = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export type Lesson = {
  id: string;
  number: number;
  title: string;
  description?: string;
  grammar: Grammar[];
  vocabulary: Vocabulary[];
  exams: Exam[];
  summaries: Summary[];
};

export type Summary = {
  id: string;
  title: string;
  content: string;
};

export type Grammar = {
  id: string;
  title: string;
  description: string;
  descriptionKorean?: string;
  descriptionEnglish?: string;
  example?: string;
  examples?: string[];
  translation?: string;
  translations?: string[];
  type?: 'writing' | 'speaking' | 'common';
};

export type Vocabulary = {
  id: string;
  word: string;
  meaning: string;
  context?: string;
  type?: 'important' | 'common' | 'new';
  examples?: string[];
  translations?: string[];
};

export type StudyLevel = {
  title: string;
  description: string;
  lessons: Lesson[];
};

// Helper function to map API vocab types to frontend types
function mapVocabType(apiType: string): 'important' | 'common' | 'new' {
  switch (apiType.toLowerCase()) {
    case 'important':
    case 'top 100':
      return 'important';
    case 'rarely use':
    case 'new':
      return 'new';
    default:
      return 'common';
  }
}

// API service functions - now using static data instead of API calls
export async function fetchDifficulties(): Promise<Difficulty[]> {
  try {
    // Transform the static data to match the expected format
    return typedLevelsData.difficulties.map(d => ({
      id: d.difficultyId.toString(),
      title: d.name,
      description: d.description,
      lessonCount: d.lessonCount
    }));
  } catch (error) {
    console.error('Error fetching difficulties:', error);
    return [];
  }
}

export async function fetchLessonsForDifficulty(difficultyId: string): Promise<Lesson[]> {
  try {
    const levelData = typedLevelsData.levels[difficultyId];
    if (!levelData) {
      console.warn(`No level data found for difficulty ${difficultyId}`);
      return [];
    }
    
    // Transform the data to match the expected Lesson type
    return levelData.lessons.map(lesson => ({
      ...lesson,
      grammar: lesson.grammar.map(g => ({
        ...g,
        type: ['writing', 'speaking', 'common'].includes(g.type) 
          ? g.type as 'writing' | 'speaking' | 'common' 
          : 'common' as const,
        // Convert single example/translation to arrays for the Grammar component
        examples: g.example ? [g.example] : [],
        translations: g.translation ? [g.translation] : [],
        // Split description into Korean and English parts
        descriptionKorean: (() => {
          const parts = g.description.split('.');
          return parts[0] || g.description;
        })(),
        descriptionEnglish: (() => {
          const parts = g.description.split('.');
          if (parts.length > 1) {
            return parts.slice(1).join('.').trim();
          }
          return '';
        })(),
        // Keep single values for backward compatibility
        example: g.example,
        translation: g.translation
      })),
      vocabulary: lesson.vocabulary.map(v => ({
        ...v,
        type: mapVocabType(v.type)
      })),
      summaries: lesson.summaries || []
    }));
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
}

export async function fetchStudyLevel(difficultyId: string): Promise<StudyLevel | null> {
  try {
    const levelData = typedLevelsData.levels[difficultyId];
    if (!levelData) {
      console.warn(`No level data found for difficulty ${difficultyId}`);
      return null;
    }
    
    // Transform the data to match the expected types
    const transformedLessons = levelData.lessons.map(lesson => ({
      ...lesson,
      grammar: lesson.grammar.map(g => ({
        ...g,
        type: ['writing', 'speaking', 'common'].includes(g.type) 
          ? g.type as 'writing' | 'speaking' | 'common' 
          : 'common' as const,
        // Convert single example/translation to arrays for the Grammar component
        examples: g.example ? [g.example] : [],
        translations: g.translation ? [g.translation] : [],
        // Split description into Korean and English parts
        descriptionKorean: (() => {
          const parts = g.description.split('.');
          return parts[0] || g.description;
        })(),
        descriptionEnglish: (() => {
          const parts = g.description.split('.');
          if (parts.length > 1) {
            return parts.slice(1).join('.').trim();
          }
          return '';
        })(),
        // Keep single values for backward compatibility
        example: g.example,
        translation: g.translation
      })),
      vocabulary: lesson.vocabulary.map(v => ({
        ...v,
        type: mapVocabType(v.type)
      })),
      summaries: lesson.summaries || []
    }));
    
    return {
      title: levelData.title,
      description: levelData.description,
      lessons: transformedLessons
    };
  } catch (error) {
    console.error('Error fetching study level:', error);
    return null;
  }
}

// For backwards compatibility, create a mock-like structure
export const createMockLevels = async (): Promise<Record<string, StudyLevel>> => {
  try {
    const levels: Record<string, StudyLevel> = {};
    
    Object.keys(typedLevelsData.levels).forEach(difficultyId => {
      const levelData = typedLevelsData.levels[difficultyId];
      
      // Transform the data to match the expected types
      const transformedLessons = levelData.lessons.map(lesson => ({
        ...lesson,
        grammar: lesson.grammar.map(g => ({
          ...g,
          type: ['writing', 'speaking', 'common'].includes(g.type) 
            ? g.type as 'writing' | 'speaking' | 'common' 
            : 'common' as const,
          // Convert single example/translation to arrays for the Grammar component
          examples: g.example ? [g.example] : [],
          translations: g.translation ? [g.translation] : [],
          // Keep single values for backward compatibility
          example: g.example,
          translation: g.translation
        })),
        vocabulary: lesson.vocabulary.map(v => ({
          ...v,
          type: mapVocabType(v.type)
        }))
      }));
      
      levels[difficultyId] = {
        title: levelData.title,
        description: levelData.description,
        lessons: transformedLessons
      };
    });
    
    return levels;
  } catch (error) {
    console.error('Error creating mock levels:', error);
    return {};
  }
};

// Helper function to safely parse JSON strings from API
function safeParseJSON(jsonString: string): string[] {
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [jsonString];
  } catch (error) {
    console.warn('Failed to parse JSON:', jsonString);
    return [jsonString];
  }
}

// Function to fetch all lessons for a difficulty
export async function fetchLessonsForDifficultyFromAPI(difficultyId: string): Promise<any[]> {
  try {
    const levelData = typedLevelsData.levels[difficultyId];
    if (!levelData) {
      console.warn(`No level data found for difficulty ${difficultyId}`);
      return [];
    }
    
    // Transform the data to match the expected Lesson type
    return levelData.lessons.map(lesson => ({
      ...lesson,
      grammar: lesson.grammar.map(g => ({
        ...g,
        type: ['writing', 'speaking', 'common'].includes(g.type) 
          ? g.type as 'writing' | 'speaking' | 'common' 
          : 'common' as const,
        // Convert single example/translation to arrays for the Grammar component
        examples: g.example ? [g.example] : [],
        translations: g.translation ? [g.translation] : [],
        // Split description into Korean and English parts
        descriptionKorean: (() => {
          const parts = g.description.split('.');
          return parts[0] || g.description;
        })(),
        descriptionEnglish: (() => {
          const parts = g.description.split('.');
          if (parts.length > 1) {
            return parts.slice(1).join('.').trim();
          }
          return '';
        })(),
        // Keep single values for backward compatibility
        example: g.example,
        translation: g.translation
      })),
      vocabulary: lesson.vocabulary.map(v => ({
        ...v,
        type: mapVocabType(v.type)
      })),
      summaries: lesson.summaries || []
    }));
  } catch (error) {
    console.error('Error fetching lessons for difficulty:', error);
    return [];
  }
}

// Function to fetch specific lesson data from the API
export async function fetchLessonData(difficultyId: string, lessonId: string): Promise<Lesson | null> {
  try {
    const levelData = typedLevelsData.levels[difficultyId];
    if (!levelData) {
      console.warn(`No level data found for difficulty ${difficultyId}`);
      return null;
    }
    
    const lesson = levelData.lessons.find((l: any) => l.id === `lesson-${difficultyId}-${lessonId}`);
    if (!lesson) {
      console.warn(`No lesson found with ID lesson-${difficultyId}-${lessonId}`);
      return null;
    }
    
    // Transform the data to match the expected Lesson type
    return {
      ...lesson,
      grammar: lesson.grammar.map(g => ({
        ...g,
        type: ['writing', 'speaking', 'common'].includes(g.type) 
          ? g.type as 'writing' | 'speaking' | 'common' 
          : 'common' as const,
        // Convert single example/translation to arrays for the Grammar component
        examples: g.example ? [g.example] : [],
        translations: g.translation ? [g.translation] : [],
        // Split description into Korean and English parts
        descriptionKorean: (() => {
          const parts = g.description.split('.');
          return parts[0] || g.description;
        })(),
        descriptionEnglish: (() => {
          const parts = g.description.split('.');
          if (parts.length > 1) {
            return parts.slice(1).join('.').trim();
          }
          return '';
        })(),
        // Keep single values for backward compatibility
        example: g.example,
        translation: g.translation
      })),
      vocabulary: lesson.vocabulary.map(v => ({
        ...v,
        type: mapVocabType(v.type)
      }))
    };
  } catch (error) {
    console.error('Error fetching lesson data:', error);
    return null;
  }
}
