import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { serverUserService } from "@/lib/services/serverUserService";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check usage limits before processing, but allow bypass in local/dev for easier testing.
    // Production must always enforce usage checks.
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_UNAUTH_EVAL !== 'true') {
      const usageLimits = await serverUserService.checkUsageLimits();
      if (!usageLimits.canMakeRequest) {
        return NextResponse.json(
          {
            error: "Usage limit exceeded",
            usage: usageLimits,
          },
          { status: 429 }
        );
      }
    }

    const { essay } = await request.json();

    if (!essay || typeof essay !== "string") {
      return NextResponse.json(
        { error: "Essay content is required." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const prompt = `
Please evaluate this Korean essay. Score it on a 1-50 point scale based on the following criteria and provide detailed feedback:

Evaluation Criteria:
1. Grammar Accuracy (15 points)
2. Vocabulary Usage (10 points)
3. Content Structure (10 points)
4. Expression Quality (10 points)
5. Spelling (5 points)

Essay Content:
${essay}

Please respond in the following JSON format:
{
  "score": score(1-50),
  "feedback": "Comprehensive evaluation feedback",
  "corrections": [
    {
      "original": "incorrect expression",
      "corrected": "correct expression",
      "explanation": "reason for correction"
    }
  ],
  "improvements": [
    "improvement suggestion 1",
    "improvement suggestion 2"
  ]
}

Please respond in English.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a Korean language education expert. Please evaluate Korean essays accurately and constructively.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("Unable to get AI response.");
    }

    // Parse the JSON response
    let evaluationResult;
    try {
      evaluationResult = JSON.parse(responseText);
    } catch (parseError) {
      // If JSON parsing fails, create a basic response
      evaluationResult = {
        score: 25,
        feedback: responseText,
        corrections: [],
        improvements: ["Error occurred while parsing AI response. Please try again."],
      };
    }

    // Validate the score is within range
    if (evaluationResult.score < 1 || evaluationResult.score > 50) {
      evaluationResult.score = Math.max(
        1,
        Math.min(50, evaluationResult.score)
      );
    }

    // Increment usage after successful completion
    await serverUserService.incrementUsage('chat');

    return NextResponse.json(evaluationResult);
  } catch (error: any) {
    console.error("Writing evaluation error:", error);
    
    // Handle OpenAI quota / rate-limit errors specifically
    const isQuotaError =
      error?.status === 429 ||
      error?.code === "insufficient_quota" ||
      error?.type === "insufficient_quota" ||
      error?.name === "RateLimitError";

    if (isQuotaError) {
      // In non-production environments, return a deterministic mock evaluation so UI/dev work can continue.
      if (process.env.NODE_ENV !== "production") {
        const mockEvaluation = {
          score: 30,
          feedback:
            "Mock evaluation (OpenAI quota exhausted). This is a developer fallback response so you can continue testing locally.",
          corrections: [],
          improvements: [
            "(Mock) Try to structure your essay with a clear intro, body, and conclusion.",
          ],
          _mock: true,
        } as const;

        return NextResponse.json(mockEvaluation);
      }

      // In production, surface a 429 to the client indicating quota/billing issue.
      return NextResponse.json(
        {
          error:
            "OpenAI quota exceeded or rate-limited. Please check your OpenAI plan and billing details.",
        },
        { status: 429 }
      );
    }

    // For other errors, return a generic 500 with a hint
    return NextResponse.json(
      { error: "An error occurred during evaluation. Please try again." },
      { status: 500 }
    );
  }
}
