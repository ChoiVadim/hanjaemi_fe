"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [essay, setEssay] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Character count (Korean characters count differently)
  const characterCount = essay.length;
  const wordCount = essay.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleEvaluate = async () => {
    if (!essay.trim()) {
      alert("Please write your essay first.");
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ essay }),
      });

      if (!response.ok) {
        throw new Error("An error occurred during evaluation.");
      }

      const result = await response.json();
      setEvaluation(result);
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("An error occurred during evaluation. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
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

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-screen p-4 md:p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Korean Writing Practice</h1>
        <p className="text-muted-foreground">
          Practice Korean writing in real exam format and get AI evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 overflow-hidden min-h-0">
        {/* Writing Answer Sheet - Takes 2 columns, big */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden min-h-0">
          <Card className="flex flex-col flex-1 overflow-hidden min-h-0">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Writing Answer Sheet (작문 답안지)
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
              <p className="text-sm text-muted-foreground mt-2">
                Please write your answer below; your answer must be between 200 and 300 characters including spaces.
                <br />
                아래 빈칸에 200자에서 300자 이내로 작문하십시오 (띄어쓰기 포함).
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0 space-y-4">
              {/* Exam-style grid background */}
              <div className="relative flex-1 flex flex-col min-h-0">
                <div 
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 25px'
                  }}
                />
                <Textarea
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Write your Korean essay here..."
                  className="flex-1 resize-none font-mono leading-relaxed bg-transparent relative z-10 min-h-[400px]"
                  style={{
                    lineHeight: '25px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {/* Character count indicator */}
              <div className="flex-shrink-0 flex justify-between items-center pt-2">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Characters: {characterCount}</span>
                  <span>Words: {wordCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  {characterCount >= 200 && characterCount <= 300 ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Appropriate Length
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {characterCount < 200 ? "Too Short" : "Too Long"}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button 
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !essay.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isEvaluating ? "Evaluating..." : "Get AI Evaluation"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Question Image and Evaluation Results */}
        <div className="space-y-4 md:space-y-6 overflow-auto">
          {/* Question Image Card - Smaller, on the right */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Question Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="w-full border rounded-lg overflow-auto bg-gray-50 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img 
                  src="/writing_question.png" 
                  alt="Writing question prompt"
                  className="w-full h-auto object-contain max-h-[250px]"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Click to view full size
              </p>
            </CardContent>
          </Card>

          {/* Fullscreen Image Modal */}
          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-2">
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src="/writing_question.png" 
                  alt="Writing question prompt - Full size"
                  className="max-w-full max-h-[90vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Evaluation Results */}
          {evaluation ? (
            <>
              {/* Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Evaluation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2 text-primary">
                      {evaluation.score}/50
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {evaluation.score >= 40 ? "Excellent" : 
                       evaluation.score >= 30 ? "Good" : 
                       evaluation.score >= 20 ? "Average" : "Needs Improvement"}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(evaluation.score / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{evaluation.feedback}</p>
                </CardContent>
              </Card>

              {/* Corrections */}
              {evaluation.corrections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Grammar & Expression Corrections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {evaluation.corrections.map((correction, index) => (
                      <div key={index} className="border-l-4 border-red-200 pl-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-red-600 line-through">
                              {correction.original}
                            </span>
                            <span>→</span>
                            <span className="text-green-600 font-medium">
                              {correction.corrected}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {correction.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Improvements */}
              {evaluation.improvements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Improvement Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {evaluation.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Complete your essay and click "Get AI Evaluation" to receive 
                    a score on a 1-50 point scale.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

