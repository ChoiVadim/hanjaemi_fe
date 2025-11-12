import { NextRequest, NextResponse } from 'next/server';
import { fetchDifficulties } from '@/data/dataService';

export async function GET(request: NextRequest) {
  try {
    console.log('📚 Fetching difficulties from local JSON data');
    const difficulties = await fetchDifficulties();
    console.log('✅ Successfully fetched difficulties from local data');
    return NextResponse.json(difficulties);
  } catch (error) {
    console.error('Difficulties API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
