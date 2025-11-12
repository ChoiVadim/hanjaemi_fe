"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { topikWritingQuestions } from "@/data/topikWritingQuestions";

interface EvaluationResult {
  score: number;
  feedback: string;
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  improvements: string[];
}

export default function WritingPracticePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const questions = topikWritingQuestions.slice(0, 4); // use first 4 questions

  // answers persisted per question id
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    try {
      const raw = localStorage.getItem("writingAnswers_v1");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<Record<number, EvaluationResult | null>>(() => ({}));
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Character count (Korean characters count differently)
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id] ?? "";
  const characterCount = currentAnswer.length;
  const wordCount = currentAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleEvaluate = async () => {
    // Only evaluate questions 3 and 4 (ids 3 and 4 in our small set)
    if (!currentAnswer.trim()) {
      alert("Please write your answer first.");
      return;
    }

    if (![3, 4].includes(currentQuestion.id)) {
      // Not graded by GPT per spec
      alert("This question is not graded by AI. Your answer has been saved.");
      handleSaveAnswer(currentQuestion.id, currentAnswer);
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: currentAnswer }),
      });
      if (!response.ok) throw new Error("Evaluation failed");
      const result = await response.json();
      setEvaluations(prev => ({ ...prev, [currentQuestion.id]: result }));
      // persist evaluations if desired (not required)
    } catch (err) {
      console.error(err);
      alert("Evaluation failed. Try again later.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveAnswer = (id: number, text: string) => {
    setAnswers(prev => {
      const next = { ...prev, [id]: text };
      try { localStorage.setItem("writingAnswers_v1", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // persist answers when component unloads (just in case)
  React.useEffect(() => {
    const handler = () => {
      try { localStorage.setItem("writingAnswers_v1", JSON.stringify(answers)); } catch (e) {}
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [answers]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-screen py-3 px-4">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="h-8 px-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Korean Writing Practice</h1>
        <p className="text-muted-foreground">Answer each prompt below. Questions 3 and 4 are graded by AI — questions 1 and 2 are not.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          {!sessionStarted ? (
            <Card className="flex flex-col h-full items-center justify-center p-8">
              <CardHeader>
                <CardTitle className="text-2xl">TOPIK Writing Mock Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-lg font-medium">한국어능력시험 토픽 쓰기 모의고사</p>
                <p className="text-sm text-muted-foreground">There are total {questions.length} questions and you have 50 minutes to solve them</p>
                <div className="mt-4">
                  <Button onClick={() => {
                    // start session: reset state and start timer
                    setSessionStarted(true);
                    setAnswers(() => ({}));
                    setEvaluations(() => ({}));
                    try { localStorage.removeItem('writingAnswers_v1'); } catch (e) {}
                    setTimeElapsed(0);
                    setIsTimerRunning(true);
                    setCurrentIndex(0);
                    setIsReviewMode(false);
                    setIsEvaluating(false);
                  }}>
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
          <Card className="flex flex-col h-full overflow-hidden">
            {isReviewMode ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Review Answers
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <Button size="sm" onClick={() => {
                        // Reset everything when returning from review to practice
                        setIsReviewMode(false);
                        setCurrentIndex(0);
                        setAnswers(() => ({}));
                        setEvaluations(() => ({}));
                        try { localStorage.removeItem('writingAnswers_v1'); } catch (e) {}
                        setTimeElapsed(0);
                        setIsTimerRunning(false);
                        setIsEvaluating(false);
                      }}>
                        Back to Practice
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-auto p-4 space-y-4">
                  {questions.map((q) => {
                    const aiGraded = [3, 4].includes(q.id);
                    return (
                      <div key={q.id} className="border rounded p-3 bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">Q{q.id}: {q.question}</div>
                          <div>
                            {aiGraded ? (
                              <Badge variant="default" className="bg-blue-500">AI-reviewed</Badge>
                            ) : (
                              <Badge variant="secondary">Answer only</Badge>
                            )}
                          </div>
                        </div>

                        {q.images && q.images.length > 0 && (
                          <div className="flex gap-2 mb-2 flex-wrap">
                            {q.images.map((src, idx) => (
                              <img key={idx} src={src.replace(/^\/public/, "")} alt={`img-${idx}`} className="max-h-40 object-contain rounded" />
                            ))}
                          </div>
                        )}

                        <div className="mb-2">
                          <div className="text-sm text-muted-foreground">Your answer:</div>
                          <div className="whitespace-pre-wrap bg-muted p-2 rounded mt-1">{answers[q.id] ?? 'No answer'}</div>
                        </div>

                        <div className="mb-2">
                          <div className="text-sm text-muted-foreground"> Good answer:</div>
                          <div className="whitespace-pre-wrap p-2 rounded mt-1 bg-white border">{(q as any).goodAnswer ?? 'No model answer available'}</div>
                        </div>

                        {aiGraded ? (
                          evaluations[q.id] ? (
                            <div className="mt-3 text-sm">
                              <div className="font-semibold">Score: {evaluations[q.id]?.score}/50</div>
                              <div className="text-muted-foreground">{evaluations[q.id]?.feedback}</div>
                            </div>
                          ) : (
                            <div className="mt-3 text-sm text-muted-foreground">AI review: pending or not requested.</div>
                          )
                        ) : null}
                      </div>
                    );
                  })}
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Question {currentIndex + 1}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono">{formatTime(timeElapsed)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={isTimerRunning ? "destructive" : "default"}
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                      >
                        {isTimerRunning ? "Pause" : "Start"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed">
                    {currentQuestion?.question}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  {/* Images */}
                  {currentQuestion?.images && currentQuestion.images.length > 0 && (
                    <div className="flex gap-4 mb-4 overflow-auto py-2 justify-center items-start flex-wrap">
                      {currentQuestion.images.map((src: string, idx: number) => {
                        const normalized = src.replace(/^\/public/, "");
                        return (
                          <img
                            key={idx}
                            src={normalized}
                            alt={`question-${currentQuestion.id}-img-${idx}`}
                            className="max-h-64 md:max-h-80 w-auto md:w-3/4 object-contain rounded border shadow-sm mx-auto"
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Answer box */}
                  <div className="relative flex-1 flex flex-col">
                    <Textarea
                      value={currentAnswer}
                      onChange={(e) => {
                        const v = e.target.value;
                        setAnswers(prev => ({ ...prev, [currentQuestion.id]: v }));
                      }}
                      placeholder="Type your answer here..."
                      className="flex-1 resize-none font-mono leading-relaxed bg-transparent relative z-10 min-h-0"
                      style={{ lineHeight: '25px', fontSize: '14px' }}
                    />
                  </div>

                  {/* Character count & controls */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Characters: {characterCount}</span>
                      <span>Words: {wordCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentQuestion && (currentQuestion.id === 3 || currentQuestion.id === 4) ? (
                        <Badge variant="default" className="bg-blue-500">
                          <FileText className="h-3 w-3 mr-1" />
                          AI graded
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Sample / Not AI graded</Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() => handleSaveAnswer(currentQuestion.id, currentAnswer)}
                    >
                      Save
                    </Button>

                    <Button
                      onClick={handleEvaluate}
                      disabled={isEvaluating || !currentAnswer.trim()}
                    >
                      {isEvaluating ? 'Evaluating...' : (currentQuestion && [3,4].includes(currentQuestion.id) ? 'Get AI Evaluation' : 'Save (Not graded)')}
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="mt-6 flex justify-between">
                    <div className="flex-1">
                      <Button
                        onClick={() => setCurrentIndex(idx => Math.max(0, idx - 1))}
                        disabled={currentIndex === 0}
                        className="w-full"
                      >
                        Previous
                      </Button>
                    </div>
                    <div className="w-6" />
                    <div className="flex-1">
                      {currentIndex < questions.length - 1 ? (
                        <Button
                          onClick={() => setCurrentIndex(idx => Math.min(questions.length - 1, idx + 1))}
                          className="w-full"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={async () => {
                            // On finish, run evaluations for Q3 & Q4 if present and not yet evaluated
                            const qToEval = questions.filter(q => [3,4].includes(q.id));
                            setIsEvaluating(true);
                            for (const q of qToEval) {
                              const ans = answers[q.id] ?? "";
                              if (!ans.trim()) continue;
                              if (evaluations[q.id]) continue; // already have
                              try {
                                const res = await fetch('/api/evaluate-writing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ essay: ans }) });
                                if (res.ok) {
                                  const json = await res.json();
                                  setEvaluations(prev => ({ ...prev, [q.id]: json }));
                                }
                              } catch (e) { console.error(e) }
                            }
                            setIsEvaluating(false);
                            // Enter review mode to show answers vs correct answers
                            setCurrentIndex(0);
                            setIsReviewMode(true);
                          }}
                          className="w-full"
                        >
                          Finish
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
          )}
        </div>

        {/* Right column: evaluations & summary */}
        <div className="space-y-6 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {questions.map((q) => (
                  <li key={q.id} className="border p-3 rounded">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Q{q.id}</div>
                      <div className="text-xs text-muted-foreground">{answers[q.id]?.slice(0, 60) ?? 'No answer yet'}</div>
                    </div>
                    {evaluations[q.id] ? (
                      <div className="mt-2 text-xs">
                        <div className="font-semibold">Score: {evaluations[q.id]?.score}/50</div>
                        <div className="text-muted-foreground">{evaluations[q.id]?.feedback}</div>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Questions 1 & 2 are sample-style prompts (not AI graded). Questions 3 & 4 will be graded by AI when you request evaluation or finish the set.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

