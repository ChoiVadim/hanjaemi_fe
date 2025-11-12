import { NextRequest, NextResponse } from 'next/server';
import { fetchLessonsForDifficultyFromAPI } from '@/data/dataService';

export async function GET(
  request: NextRequest,
  { params }: { params: { difficultyId: string } }
) {
  try {
    const { difficultyId } = params;
    console.log('📚 Fetching lessons from local JSON data for difficulty:', difficultyId);
    const lessons = await fetchLessonsForDifficultyFromAPI(difficultyId);
    console.log('✅ Successfully fetched lessons from local data');
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
