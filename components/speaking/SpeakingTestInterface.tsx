"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
}

export function SpeakingTestInterface() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize the speaking test with a greeting
  const startTest = async () => {
    setTestStarted(true)
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/speaking/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (response.ok) {
        const data = await response.json()
        const audioBlob = new Blob([Buffer.from(data.audio, 'base64')], { type: 'audio/mpeg' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const message: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.text,
          timestamp: new Date(),
          audioUrl
        }
        
        setMessages([message])
        playAudio(audioUrl)
      }
    } catch (error) {
      console.error('Error starting test:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Start recording user's voice
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await sendAudioToAI(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('마이크에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.')
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Send audio to AI and get response
  const sendAudioToAI = async (audioBlob: Blob) => {
    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')
      
      const response = await fetch('/api/speaking/conversation', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: data.userText,
          timestamp: new Date(),
        }
        
        // Add AI response
        const aiAudioBlob = new Blob([Buffer.from(data.aiAudio, 'base64')], { type: 'audio/mpeg' })
        const aiAudioUrl = URL.createObjectURL(aiAudioBlob)
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.aiText,
          timestamp: new Date(),
          audioUrl: aiAudioUrl
        }
        
        setMessages(prev => [...prev, userMessage, aiMessage])
        playAudio(aiAudioUrl)
      }
    } catch (error) {
      console.error('Error processing audio:', error)
      alert('음성 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Play audio response
  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    
    audio.onplay = () => setIsPlaying(true)
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    
    audio.play().catch(console.error)
  }

  // Reset the test
  const resetTest = () => {
    setTestStarted(false)
    setMessages([])
    setIsRecording(false)
    setIsPlaying(false)
    setIsProcessing(false)
    
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  // Stop current audio playback
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>말하기 시험 제어판</span>
            <Badge variant={testStarted ? "default" : "secondary"}>
              {testStarted ? "시험 진행 중" : "시험 대기"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            {!testStarted ? (
              <Button 
                onClick={startTest} 
                disabled={isProcessing}
                size="lg"
                className="min-w-[120px]"
              >
                {isProcessing ? "준비 중..." : "시험 시작"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing || isPlaying}
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  className="min-w-[120px]"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      녹음 중지
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      말하기
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={isPlaying ? stopAudio : undefined}
                  disabled={!isPlaying}
                  size="lg"
                  variant="outline"
                  className="min-w-[120px]"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" />
                      재생 중지
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      재생 대기
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetTest}
                  size="lg"
                  variant="outline"
                  className="min-w-[120px]"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 시작
                </Button>
              </>
            )}
          </div>
          
          {isProcessing && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">처리 중...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversation History */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>대화 기록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 space-y-2",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={message.role === 'user' ? "secondary" : "default"}>
                        {message.role === 'user' ? "나" : "AI 면접관"}
                      </Badge>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    {message.audioUrl && (
                      <Button
                        onClick={() => playAudio(message.audioUrl!)}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2"
                      >
                        <Volume2 className="w-3 h-3 mr-1" />
                        재생
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>사용 방법</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>시험 시작</strong>을 클릭하여 AI 면접관과의 대화를 시작하세요.</p>
            <p>• <strong>말하기</strong> 버튼을 눌러 음성을 녹음하고, 다시 눌러 녹음을 중지하세요.</p>
            <p>• AI가 자동으로 음성을 텍스트로 변환하고 답변을 생성합니다.</p>
            <p>• 실제 한국어 말하기 시험과 유사한 환경에서 연습할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
