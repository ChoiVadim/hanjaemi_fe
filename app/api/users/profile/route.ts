import { NextRequest, NextResponse } from "next/server";
import { serverUserService } from "@/lib/services/serverUserService";

export async function GET(request: NextRequest) {
  try {
    const profile = await serverUserService.getUserProfile();
    
    if (profile) {
      return NextResponse.json(profile, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}