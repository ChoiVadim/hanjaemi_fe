import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// System prompt for the Korean speaking test AI
const SYSTEM_PROMPT = `당신은 한국어 말하기 시험의 면접관입니다. 다음 지침을 따라주세요:

1. 한국어로만 대화하세요
2. 친근하지만 전문적인 톤을 유지하세요
3. 학습자의 수준에 맞춰 적절한 난이도의 질문을 하세요
4. 실제 한국어 능력시험(TOPIK)의 말하기 시험과 유사한 주제들을 다루세요:
   - 자기소개 및 개인 정보
   - 일상생활 및 취미
   - 학교/직장 생활
   - 한국 문화 및 사회
   - 미래 계획 및 목표
   - 의견 표현 및 토론

5. 학습자의 답변을 듣고 자연스럽게 후속 질문을 하세요
6. 너무 길지 않게 2-3문장으로 응답하세요
7. 학습자가 어려워하면 더 쉬운 표현으로 바꿔서 질문하세요
8. 격려와 긍정적인 피드백을 적절히 섞어주세요

현재 대화의 맥락을 고려하여 자연스러운 대화를 이어가세요.`

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Convert user's speech to text using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'ko', // Korean language
      response_format: 'text',
    })

    const userText = transcription.trim()

    if (!userText) {
      return NextResponse.json(
        { error: 'Could not transcribe audio' },
        { status: 400 }
      )
    }

    // Generate AI response using ChatGPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userText,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const aiText = completion.choices[0]?.message?.content?.trim()

    if (!aiText) {
      return NextResponse.json(
        { error: 'Failed to generate AI response' },
        { status: 500 }
      )
    }

    // Convert AI response to speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // Female voice that works well for Korean
      input: aiText,
      speed: 0.9, // Slightly slower for better comprehension
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    const base64Audio = buffer.toString('base64')

    return NextResponse.json({
      userText,
      aiText,
      aiAudio: base64Audio,
    })
  } catch (error) {
    console.error('Error in speaking conversation:', error)
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
}
