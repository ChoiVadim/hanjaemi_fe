import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface EvaluationResult {
  overallScore: number;
  categoryScores: {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
    coherence: number;
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  topikLevel: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Create conversation transcript for evaluation
    const transcript = messages
      .map(
        (msg: Message) =>
          `${msg.role === "user" ? "Student" : "Interviewer"}: ${msg.content}`
      )
      .join("\n");

    const evaluationPrompt = `
You are a professional TOPIK Korean speaking test evaluator. Please evaluate the student's Korean speaking ability based on the following conversation.

Conversation:
${transcript}

Please evaluate based on these criteria:
1. Pronunciation: Accurate pronunciation and intonation
2. Fluency: Natural flow and pace of speech
3. Vocabulary: Appropriate and varied vocabulary usage
4. Grammar: Correct grammatical structure usage
5. Coherence: Logical and consistent expression

Rate each category on a scale of 1-6, and calculate the overall score as an average.
Also provide a TOPIK level assessment (Level 1-6).

Please respond ONLY in the following JSON format:
{
  "overallScore": overall_score(1-6),
  "categoryScores": {
    "pronunciation": pronunciation_score(1-6),
    "fluency": fluency_score(1-6),
    "vocabulary": vocabulary_score(1-6),
    "grammar": grammar_score(1-6),
    "coherence": coherence_score(1-6)
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "topikLevel": "Level X"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional TOPIK Korean speaking test evaluator. Provide detailed, constructive feedback in English.",
        },
        {
          role: "user",
          content: evaluationPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const evaluationText = completion.choices[0]?.message?.content;
    if (!evaluationText) {
      throw new Error("No evaluation generated");
    }

    // Parse the JSON response
    let evaluation: EvaluationResult;
    try {
      evaluation = JSON.parse(evaluationText);
    } catch (parseError) {
      console.error("Failed to parse evaluation JSON:", parseError);
      // Fallback evaluation if parsing fails
      evaluation = {
        overallScore: 3,
        categoryScores: {
          pronunciation: 3,
          fluency: 3,
          vocabulary: 3,
          grammar: 3,
          coherence: 3,
        },
        strengths: ["Actively participated in the conversation"],
        improvements: ["Try using more varied expressions"],
        recommendations: ["Practice Korean speaking daily"],
        topikLevel: "Level 3",
      };
    }

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Error generating evaluation:", error);
    return NextResponse.json(
      { error: "Failed to generate evaluation" },
      { status: 500 }
    );
  }
}
