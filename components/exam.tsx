"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTour } from "@/components/context/tour-context";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function Test({ level, exams = [] }: { level: string; exams?: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const { startTour } = useTour();

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getScore = () => {
    return Object.entries(answers).reduce((score, [questionId, answer]) => {
      const question = exams.find((q) => q.id === questionId);
      return score + (question?.correctAnswer === answer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full rounded-lg">
      <ScrollArea className="flex-1">
        <div data-tour="exam-questions" className="space-y-4">
          {exams.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground">No exam questions available for this lesson.</p>
              </CardContent>
            </Card>
          ) : (
            exams.map((question) => (
            <Card key={question.id}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <RadioGroup
                  onValueChange={(value) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: Number.parseInt(value),
                    }))
                  }
                  value={answers[question.id]?.toString()}
                >
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`${question.id}-${index}`}
                        disabled={showResults}
                      />
                      <Label htmlFor={`${question.id}-${index}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {showResults && (
                  <div className="mt-2 text-sm">
                    {answers[question.id] === question.correctAnswer ? (
                      <p className="text-green-500">Correct!</p>
                    ) : (
                      <p className="text-red-500">
                        Incorrect. The correct answer is:{" "}
                        {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
          )}
          {showResults && (
            <Card>
              <CardContent className="p-4">
                          <p className="text-lg font-semibold">
            Your Score: {getScore()} out of {exams.length}
          </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
      {!showResults && (
        <Button
          data-tour="exam-submit"
          className="h-9"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== exams.length}
        >
          Submit Test
        </Button>
      )}
    </div>
  );
}
