import OpenAI from "openai";
import { NextResponse } from "next/server";
import { serverUserService } from "@/lib/services/serverUserService";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Check usage limits before processing
    const usageLimits = await serverUserService.checkUsageLimits();
    if (!usageLimits.canMakeRequest) {
      return NextResponse.json(
        { 
          error: "Usage limit exceeded",
          usage: usageLimits
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { stream = false, sessionId } = body;

    if (stream) {
      // Streaming response
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: body.messages,
        max_tokens: 1000,
        stream: true,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                const data = JSON.stringify({ content });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
            
            // Increment usage after successful completion
            await serverUserService.incrementUsage('chat');
            
            // Save chat history if sessionId provided
            if (sessionId && body.messages?.length > 0) {
              const lastUserMessage = body.messages[body.messages.length - 1];
              if (lastUserMessage.role === 'user') {
                await serverUserService.saveChatMessage(sessionId, 'user', lastUserMessage.content);
              }
            }
          } catch (error) {
            console.error("Streaming error:", error);
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      // Non-streaming response (backward compatibility)
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: body.messages,
        max_tokens: 1000,
      });

      // Increment usage after successful completion
      await serverUserService.incrementUsage('chat');
      
      // Save chat history if sessionId provided
      if (sessionId && body.messages?.length > 0) {
        const lastUserMessage = body.messages[body.messages.length - 1];
        if (lastUserMessage.role === 'user') {
          await serverUserService.saveChatMessage(sessionId, 'user', lastUserMessage.content);
        }
      }

      return NextResponse.json(completion);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process chat request" },
      { status: 500 }
    );
  }
}
