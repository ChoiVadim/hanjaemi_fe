import { NextRequest, NextResponse } from 'next/server';
import { serverUserService } from '@/lib/services/serverUserService';

export async function GET() {
  try {
    const settings = await serverUserService.getUserSettings();
    
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await serverUserService.updateUserSettings(body);
    
    if (!settings) {
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 400 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
