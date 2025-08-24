"use client"

import { SpeakingTestInterface } from '@/components/speaking/SpeakingTestInterface'

export default function SpeakingPracticePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold text-center">한국어 말하기 시험</h1>
      <p className="mb-8 text-center text-muted-foreground">
        AI와 실제 말하기 시험처럼 대화해보세요. 마이크를 사용하여 자연스럽게 대화할 수 있습니다.
      </p>
      <SpeakingTestInterface />
    </div>
  )
}

