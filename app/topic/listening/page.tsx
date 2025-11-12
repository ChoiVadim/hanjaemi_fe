"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle,
  XCircle,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  topikListeningQuestions,
  TopikListeningQuestion,
} from "@/data/topikListeningQuestions";

export default function ListeningPracticePage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.7]);
  const [playbackRate, setPlaybackRate] = useState([1]);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentQuestion = topikListeningQuestions[currentQuestionIndex];
  const totalQuestions = topikListeningQuestions.length;
  const progress = (answeredQuestions.size / totalQuestions) * 100;
  const score = correctAnswers.size;

  // Audio player functions
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
      audioRef.current.playbackRate = playbackRate[0];
    }
  }, [volume, playbackRate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowAnswer(true);
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion.id]));

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers((prev) => new Set([...prev, currentQuestion.id]));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      resetQuestion();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    setShowTip(false);
    setShowScript(false);
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    resetQuestion();
  };

  const getQuestionTypeColor = (type: TopikListeningQuestion["type"]) => {
    switch (type) {
      case "conversation":
        return "bg-blue-100 text-blue-800";
      case "announcement":
        return "bg-green-100 text-green-800";
      case "news":
        return "bg-purple-100 text-purple-800";
      case "lecture":
        return "bg-orange-100 text-orange-800";
      case "interview":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: TopikListeningQuestion["level"]) => {
    switch (level) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-screen py-3 px-4">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentQuestion.audioUrl} preload="metadata" />

      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="h-8 px-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">TOPIK Listening Practice</h1>
        <p className="text-muted-foreground">
          Practice with real TOPIK listening questions and audio materials.
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {answeredQuestions.size}/{totalQuestions} questions
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Score: {score}/{answeredQuestions.size}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Question {currentQuestionIndex + 1}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getQuestionTypeColor(currentQuestion.type)}>
                    {currentQuestion.type}
                  </Badge>
                  <Badge className={getLevelColor(currentQuestion.level)}>
                    {currentQuestion.level}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 overflow-auto">
              {/* Audio Player */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Audio Player
                </h3>

                {/* Play Controls */}
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Progress Slider */}
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                </div>

                {/* Audio Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <span className="text-sm">Volume</span>
                    </div>
                    <Slider
                      value={volume}
                      max={1}
                      step={0.1}
                      onValueChange={setVolume}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Speed: {playbackRate[0]}x</span>
                    </div>
                    <Slider
                      value={playbackRate}
                      min={0.5}
                      max={2}
                      step={0.25}
                      onValueChange={setPlaybackRate}
                    />
                  </div>
                </div>
              </div>

              {/* Question */}
              <div>
                <h3 className="font-medium mb-4">Question:</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                <h3 className="font-medium">Choose the correct answer:</h3>
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showAnswer}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedAnswer === index
                        ? showAnswer
                          ? index === currentQuestion.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-800"
                            : "border-red-500 bg-red-50 text-red-800"
                          : "border-primary bg-primary/5"
                        : showAnswer && index === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-50 text-green-800"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${showAnswer ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{option}</span>
                      {showAnswer &&
                        selectedAnswer === index &&
                        (selectedAnswer === currentQuestion.correctAnswer ? (
                          <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                        ))}
                      {showAnswer &&
                        selectedAnswer !== index &&
                        index === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                        )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!showAnswer ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="flex-1"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === totalQuestions - 1}
                      className="flex-1 flex items-center gap-2"
                    >
                      Next Question
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowTip(!showTip)}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Tip
                </Button>
                {currentQuestion.audioScript && (
                  <Button
                    variant="outline"
                    onClick={() => setShowScript(!showScript)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Script
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Area */}
        <div className="space-y-6 overflow-auto">
          {/* Answer Explanation */}
          {showAnswer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? "Correct!"
                    : "Incorrect"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Correct Answer: </span>
                    <span className="text-green-600">
                      {currentQuestion.options[currentQuestion.correctAnswer]}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Explanation:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Script */}
          {showScript && currentQuestion.audioScript && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Audio Script
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  {currentQuestion.audioScript}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tip */}
          {showTip && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Listening Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.tip}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <Headphones className="h-4 w-4" />
                <AlertDescription>
                  <strong>How to use:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Click Play to listen to the audio</li>
                    <li>• Use volume and speed controls as needed</li>
                    <li>• You can replay the audio multiple times</li>
                    <li>• Select your answer and click Submit</li>
                    <li>
                      • Use Script to see the audio text (after answering)
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Question Types Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Audio Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  conversation
                </Badge>
                <span className="text-xs">Daily dialogues</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  announcement
                </Badge>
                <span className="text-xs">Public announcements</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">news</Badge>
                <span className="text-xs">News reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">lecture</Badge>
                <span className="text-xs">Educational content</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">interview</Badge>
                <span className="text-xs">Q&A sessions</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
