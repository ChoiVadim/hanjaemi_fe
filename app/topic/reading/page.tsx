"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  Lightbulb,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  topikReadingQuestions,
  TopikQuestion,
} from "@/data/topikReadingQuestions";

export default function ReadingPracticePage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [ userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  // session timer (seconds)
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(60 * 60); // 60 minutes
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = topikReadingQuestions[currentQuestionIndex];
  const totalQuestions = topikReadingQuestions.length;
  const progress = totalQuestions ? (answeredQuestions.size / totalQuestions) * 100 : 0;
  const score = correctAnswers.size;

  const handleAnswerSelect = (answerIndex: number) => {
    // Save selection immediately so it persists when navigating
    setSelectedAnswer(answerIndex);
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerIndex }));
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion.id]));

    // update correctness tracking
    if (answerIndex === currentQuestion.correctAnswer) {
      setCorrectAnswers((prev) => new Set([...prev, currentQuestion.id]));
    } else {
      setCorrectAnswers((prev) => {
        const next = new Set(prev);
        next.delete(currentQuestion.id);
        return next;
      });
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    // record that this question was answered
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion.id]));

    // Save user's selected answer for review
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswer }));

    // record correctness for scoring (kept hidden until review/results)
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers((prev) => new Set([...prev, currentQuestion.id]));
    }

    // If this was the last question, show final results
    if (currentQuestionIndex === totalQuestions - 1) {
      setShowResults(true);
      setIsReviewMode(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      const nextId = topikReadingQuestions[newIndex].id;
      const ans = userAnswers[nextId];
      setSelectedAnswer(ans !== undefined ? ans : null);
      setShowTip(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      const prevId = topikReadingQuestions[newIndex].id;
      const ans = userAnswers[prevId];
      setSelectedAnswer(ans !== undefined ? ans : null);
      setShowTip(false);
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    setShowTip(false);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setShowResults(false);
    setUserAnswers({});
    setIsReviewMode(false);
    resetQuestion();
    // reset session state and return to start screen
    setSessionSecondsLeft(60 * 60);
    setSessionStarted(false);
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };

  // Session timer: start when the sessionStarted flag is set
  useEffect(() => {
    if (!sessionStarted) return;

    // start session timer
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    sessionTimerRef.current = setInterval(() => {
      setSessionSecondsLeft((s) => s - 1);
    }, 1000);

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
    };
  }, [sessionStarted]);

  // When session timer expires, show results
  useEffect(() => {
    if (sessionSecondsLeft <= 0) {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      // finalize and show results with whatever answers exist
      setShowResults(true);
      setIsReviewMode(false);
    }
  }, [sessionSecondsLeft]);

  const getQuestionTypeColor = (type: TopikQuestion["type"]) => {
    switch (type) {
      case "vocabulary":
        return "bg-blue-100 text-blue-800";
      case "grammar":
        return "bg-green-100 text-green-800";
      case "reading_comprehension":
        return "bg-purple-100 text-purple-800";
      case "inference":
        return "bg-orange-100 text-orange-800";
      case "main_idea":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: TopikQuestion["level"]) => {
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

  const formatTime = (s: number) => {
    const total = Math.max(0, s);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Renderer for trusted HTML fragments stored in data (e.g. <u>밑줄</u>)
  // WARNING: only use with trusted data (no user input) because this uses
  // dangerouslySetInnerHTML. It also converts newlines to <br/> for spacing.
  function RenderTrustedHtml({ html }: { html?: string }) {
    if (!html) return null;
  // Support simple marker syntax:
  // - [[...]] -> underline
  // - **...** -> bold
  // This keeps source strings plain and avoids embedding raw HTML.
  // Example: '그는 항상 [[성실하게]] 혹은 **성실하게** 일합니다.'
  let transformed = html.replace(/\[\[(.+?)\]\]/g, "<u>$1</u>");
  transformed = transformed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const safeHtml = transformed.replace(/\n/g, "<br/>");
    return (
      <p
        className="text-sm leading-relaxed whitespace-pre-line"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-2rem)] max-h-screen py-3 px-4">
      {/* Top-right fixed timer badge */}
      {sessionStarted && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white shadow rounded-full px-4 py-2 border border-gray-200 text-sm font-medium text-red-600">
            {formatTime(sessionSecondsLeft)}
          </div>
        </div>
      )}
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
        <h1 className="text-3xl font-bold mb-2">TOPIK Reading Practice</h1>
        <p className="text-muted-foreground">
          Practice with real TOPIK exam questions and get instant feedback with
          tips.
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
        {/* Question Area or Results */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          {/* If session not started, show start card */}
          {!sessionStarted ? (
            <Card className="flex flex-col h-full items-center justify-center p-8">
              <CardHeader>
                <CardTitle className="text-2xl">TOPIK Read Mock Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-lg font-medium">한국어능력시험 토픽 읽기 모의고사</p>
                <p className="text-sm text-muted-foreground">There are total {totalQuestions} questions and you have 60 minutes to solve them</p>
                <div className="mt-4">
                  <Button onClick={() => {
                    // start session
                    setSessionStarted(true);
                    setSessionSecondsLeft(60 * 60);
                    setCurrentQuestionIndex(0);
                    setAnsweredQuestions(new Set());
                    setCorrectAnswers(new Set());
                    setShowResults(false);
                    setUserAnswers({});
                    setIsReviewMode(false);
                    resetQuestion();
                  }}>
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : !showResults ? (
            <Card className="flex flex-col h-full overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getQuestionTypeColor(currentQuestion.type)}>
                      {currentQuestion.type.replace("_", " ")}
                    </Badge>
                    <Badge className={getLevelColor(currentQuestion.level)}>
                      {currentQuestion.level}
                    </Badge>
                    {/* timer moved to fixed top-right for visibility */}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 overflow-auto">
                {/* Passage (if exists) */}
                {currentQuestion.passage && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Reading Passage:</h3>
                    <RenderTrustedHtml html={currentQuestion.passage} />
                  </div>
                )}

                {/* Question */}
                <div>
                  <h3 className="font-medium mb-4">Question:</h3>
                  <RenderTrustedHtml html={currentQuestion.question} />
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  <h3 className="font-medium">Choose the correct answer:</h3>
                  {currentQuestion.options.map((option, index) => {
                    const revealed = isReviewMode || showResults;
                    const isSelected = selectedAnswer === index;
                    let optionClass = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";

                    if (isSelected) {
                      if (revealed) {
                        optionClass = index === currentQuestion.correctAnswer
                          ? "border-green-500 bg-green-50 text-green-800"
                          : "border-red-500 bg-red-50 text-red-800";
                      } else {
                        // selected but not revealed (submitted during exam)
                        optionClass = "border-gray-300 bg-gray-50 text-muted-foreground";
                      }
                    } else if (revealed && index === currentQuestion.correctAnswer) {
                      optionClass = "border-green-500 bg-green-50 text-green-800";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-3 text-left rounded-lg border transition-all ${optionClass} cursor-pointer`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm">{option}</span>
                          {revealed && isSelected && (index === currentQuestion.correctAnswer ? (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                          ))}
                          {revealed && !isSelected && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons: always show Prev/Next; Finish on last question */}
                <div className="flex gap-3 w-full">
                  {currentQuestionIndex > 0 ? (
                    <Button
                      variant="outline"
                      onClick={handlePrevQuestion}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <Button
                      onClick={handleNextQuestion}
                      className="flex-1 flex items-center gap-2"
                    >
                      Next Question
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        // stop the session timer when user finishes the test
                        if (sessionTimerRef.current) {
                          clearInterval(sessionTimerRef.current);
                          sessionTimerRef.current = null;
                        }
                        setSessionStarted(false);
                        setShowResults(true);
                        setIsReviewMode(false);
                      }}
                      className="flex-1"
                    >
                      Finish
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowTip(!showTip)}
                    className="flex items-center gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Tip
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex flex-col h-full items-center justify-center p-8">
              <CardHeader>
                <CardTitle className="text-2xl">You've finished the quiz!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-lg font-medium">Your Score</p>
                <p className="text-4xl font-bold">{score} / {totalQuestions}</p>
                <div className="space-x-2 mt-4">
                  <Button onClick={handleRestart} variant="outline">Restart</Button>
                  <Button
                    onClick={() => {
                      // Enter review mode: hide results and show previous answers
                      setShowResults(false);
                      setIsReviewMode(true);
                      const firstIndex = 0;
                      setCurrentQuestionIndex(firstIndex);
                      const firstId = topikReadingQuestions[firstIndex].id;
                      const firstAns = userAnswers[firstId];
                      setSelectedAnswer(firstAns !== undefined ? firstAns : null);
                      setShowAnswer(firstAns !== undefined);
                    }}
                  >
                    Review Answers
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Feedback Area */}
        <div className="space-y-6 overflow-auto">
          {/* Answer Explanation: only reveal in Review mode or after results */}
          {(isReviewMode || showResults) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {((userAnswers[currentQuestion.id] ?? selectedAnswer) === currentQuestion.correctAnswer) ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  {((userAnswers[currentQuestion.id] ?? selectedAnswer) === currentQuestion.correctAnswer)
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

          {/* Tip */}
          {showTip && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Strategy Tip
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
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                  <strong>How to use:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                    <li>• Read the passage and question carefully</li>
                    <li>• Select your answer from the 4 options — your choice is saved immediately and will be restored when you navigate back and forth</li>
                    <li>• Answers are hidden while the session is active; correct answers and explanations are revealed after the session ends or in Review mode</li>
                    <li>• Use "Tip" for solving strategies</li>
                    <li>• Navigate between questions with Previous/Next (first question has no Previous)</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Question Types Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Question Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">vocabulary</Badge>
                <span className="text-xs">Word meaning & usage</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">grammar</Badge>
                <span className="text-xs">Grammar patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">
                  reading comprehension
                </Badge>
                <span className="text-xs">Text understanding</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">
                  inference
                </Badge>
                <span className="text-xs">Drawing conclusions</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">main idea</Badge>
                <span className="text-xs">Central theme</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
