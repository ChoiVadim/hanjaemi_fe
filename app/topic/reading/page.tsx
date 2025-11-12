"use client";

import React, { useState } from "react";
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

  const currentQuestion = topikReadingQuestions[currentQuestionIndex];
  const totalQuestions = topikReadingQuestions.length;
  const progress = (answeredQuestions.size / totalQuestions) * 100;
  const score = correctAnswers.size;

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
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    resetQuestion();
  };

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

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-screen p-10">
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
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 overflow-auto">
              {/* Passage (if exists) */}
              {currentQuestion.passage && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Reading Passage:</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {currentQuestion.passage}
                  </p>
                </div>
              )}

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
                    <li>• Select your answer from the 4 options</li>
                    <li>• Click "Submit" to see the correct answer</li>
                    <li>• Use "Tip" for solving strategies</li>
                    <li>• Navigate between questions with Previous/Next</li>
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
