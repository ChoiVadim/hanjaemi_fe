import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Initial greeting for the Korean speaking test
    const initialPrompt = `안녕하세요! 한국어 말하기 시험에 오신 것을 환영합니다. 저는 오늘 여러분의 면접관을 맡은 AI입니다. 

이번 시험에서는 자연스러운 대화를 통해 여러분의 한국어 실력을 평가하겠습니다. 편안하게 생각하시고 자신있게 답변해 주세요.

먼저 간단한 자기소개를 부탁드립니다. 이름, 출신, 그리고 한국어를 배우는 이유에 대해 말씀해 주세요.`

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Female voice that works well for Korean
      input: initialPrompt,
      speed: 0.9, // Slightly slower for better comprehension
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    const base64Audio = buffer.toString('base64')

    return NextResponse.json({
      text: initialPrompt,
      audio: base64Audio,
    })
  } catch (error) {
    console.error('Error in speaking test start:', error)
    return NextResponse.json(
      { error: 'Failed to start speaking test' },
      { status: 500 }
    )
  }
}
