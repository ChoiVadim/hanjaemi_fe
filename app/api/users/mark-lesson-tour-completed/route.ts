import { NextRequest, NextResponse } from "next/server";
import { serverUserService } from "@/lib/services/serverUserService";

export async function POST(request: NextRequest) {
  try {
    const success = await serverUserService.markLessonTourCompleted();
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to update lesson tour status" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error marking lesson tour as completed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
