"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  FileText,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { EvaluationResults } from "./EvaluationResults";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

interface EvaluationData {
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

export function SpeakingTestInterface() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize the speaking test with a greeting
  const startTest = async () => {
    setTestStarted(true);
    
    // Check for cached initial greeting
    const cachedGreeting = localStorage.getItem("speaking_test_initial_greeting");
    const cachedAudio = localStorage.getItem("speaking_test_initial_audio");
    
    if (cachedGreeting && cachedAudio) {
      // Use cached audio immediately
      const audioBlob = new Blob([Buffer.from(cachedAudio, "base64")], {
        type: "audio/mpeg",
      });
      const audioUrl = URL.createObjectURL(audioBlob);

      const message: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: cachedGreeting,
        timestamp: new Date(),
        audioUrl,
      };

      setMessages([message]);
      playAudio(audioUrl);
      return;
    }

    // If not cached, generate and save
    setIsProcessing(true);

    try {
      const response = await fetch("/api/speaking/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Cache the greeting text and audio
        localStorage.setItem("speaking_test_initial_greeting", data.text);
        localStorage.setItem("speaking_test_initial_audio", data.audio);
        
        const audioBlob = new Blob([Buffer.from(data.audio, "base64")], {
          type: "audio/mpeg",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const message: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.text,
          timestamp: new Date(),
          audioUrl,
        };

        setMessages([message]);
        playAudio(audioUrl);
      }
    } catch (error) {
      console.error("Error starting test:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start recording user's voice
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const duration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        await sendAudioToAI(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("마이크에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      const duration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
      setRecordingDuration(duration);
    }
  };

  // Handle voice input start
  const handleVoiceStart = () => {
    if (!isRecording) {
      startRecording();
    }
  };

  // Handle voice input stop
  const handleVoiceStop = (duration: number) => {
    if (isRecording) {
      stopRecording();
      setRecordingDuration(duration);
    }
  };

  // Send audio to AI and get response
  const sendAudioToAI = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch("/api/speaking/conversation", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: data.userText,
          timestamp: new Date(),
        };

        // Add AI response
        const aiAudioBlob = new Blob([Buffer.from(data.aiAudio, "base64")], {
          type: "audio/mpeg",
        });
        const aiAudioUrl = URL.createObjectURL(aiAudioBlob);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.aiText,
          timestamp: new Date(),
          audioUrl: aiAudioUrl,
        };

        setMessages((prev) => [...prev, userMessage, aiMessage]);
        playAudio(aiAudioUrl);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("음성 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Play audio response
  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);

    audio.play().catch(console.error);
  };

  // Reset the test
  const resetTest = () => {
    setTestStarted(false);
    setMessages([]);
    setIsRecording(false);
    setIsPlaying(false);
    setIsProcessing(false);
    setEvaluation(null);
    setIsEvaluating(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Stop current audio playback
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Play last AI response
  const playLastResponse = () => {
    const lastAiMessage = [...messages].reverse().find(msg => msg.role === "assistant" && msg.audioUrl);
    if (lastAiMessage?.audioUrl) {
      playAudio(lastAiMessage.audioUrl);
    }
  };

  // Generate final evaluation
  const generateEvaluation = async () => {
    if (messages.length < 2) {
      alert("평가를 위해서는 최소 2개 이상의 대화가 필요합니다.");
      return;
    }

    setIsEvaluating(true);

    try {
      const response = await fetch("/api/speaking/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluation(data.evaluation);
      } else {
        throw new Error("Failed to generate evaluation");
      }
    } catch (error) {
      console.error("Error generating evaluation:", error);
      alert("평가 생성 중 오류가 발생했습니다.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="h-full flex gap-4 p-10 items-center justify-center">
      {/* Conversation History - Left Side */}
      {messages.length > 0 && (
        <Card className="w-2/3 flex flex-col h-full">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Conversation History</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 space-y-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          message.role === "user" ? "secondary" : "default"
                        }
                      >
                        {message.role === "user" ? "나" : "AI 면접관"}
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
                        Play Audio
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Test Interface - Right Side */}
      <div className={cn("flex-1 flex flex-col gap-4 overflow-y-auto", messages.length > 0 ? "" : "max-w-5xl mx-auto")}>
        {!testStarted ? (
          <Card className="border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl mb-2">TOPIK Speaking Test</CardTitle>
              <p className="text-muted-foreground">
                Practice your Korean speaking skills with AI-powered evaluation
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Click the button below to start your speaking test
                </p>
              </div>
              <Button
                onClick={startTest}
                disabled={isProcessing}
                size="lg"
                className="min-w-[200px] h-12 text-lg"
              >
                {isProcessing ? "Starting..." : "Start Speaking Test"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Voice Input Section */}
            <Card className="border-2">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Badge variant={isRecording ? "destructive" : "secondary"} className="text-xs">
                    {isRecording ? "Recording..." : "Ready"}
                  </Badge>
                  <span>Record Your Response</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-8">
                <AIVoiceInput
                  onStart={handleVoiceStart}
                  onStop={handleVoiceStop}
                  visualizerBars={48}
                  className="py-4"
                />
                {isProcessing && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm text-muted-foreground">
                        Processing your response...
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Control Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={isPlaying ? stopAudio : playLastResponse}
                    disabled={messages.length === 0 || (!isPlaying && !messages.some(msg => msg.role === "assistant" && msg.audioUrl))}
                    size="default"
                    variant="outline"
                    className="min-w-[140px]"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Last Response
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={generateEvaluation}
                    disabled={isEvaluating || messages.length < 2 || isProcessing}
                    size="default"
                    variant="secondary"
                    className="min-w-[160px]"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isEvaluating ? "Evaluating..." : "Get Final Evaluation"}
                  </Button>

                  <Button
                    onClick={resetTest}
                    size="default"
                    variant="outline"
                    className="min-w-[120px]"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Test
                  </Button>
                </div>
              </CardContent>
            </Card>

          </>
        )}
      </div>

      {/* Evaluation Results Modal */}
      <Dialog open={!!evaluation} onOpenChange={(open) => !open && setEvaluation(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Final Evaluation Results</DialogTitle>
          </DialogHeader>
          {evaluation && <EvaluationResults evaluation={evaluation} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
