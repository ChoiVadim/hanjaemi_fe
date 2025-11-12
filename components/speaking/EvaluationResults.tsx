"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, BookOpen, Trophy } from "lucide-react";

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

interface EvaluationResultsProps {
  evaluation: EvaluationData;
}

const categoryNames = {
  pronunciation: "Pronunciation",
  fluency: "Fluency",
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  coherence: "Coherence",
};

const getScoreColor = (score: number) => {
  if (score >= 5) return "text-green-600";
  if (score >= 4) return "text-blue-600";
  if (score >= 3) return "text-yellow-600";
  return "text-red-600";
};

const getScoreDescription = (score: number) => {
  if (score >= 5) return "Excellent";
  if (score >= 4) return "Good";
  if (score >= 3) return "Average";
  return "Needs Improvement";
};

export function EvaluationResults({ evaluation }: EvaluationResultsProps) {
  const overallPercentage = (evaluation.overallScore / 6) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Final Evaluation Results
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">
              {evaluation.overallScore.toFixed(1)}/6.0
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              TOPIK {evaluation.topikLevel}
            </Badge>
          </div>
          <Progress value={overallPercentage} className="w-full h-3" />
          <p className="text-muted-foreground">
            Overall Score: {getScoreDescription(evaluation.overallScore)}
          </p>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(evaluation.categoryScores).map(([key, score]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="font-medium">
                  {categoryNames[key as keyof typeof categoryNames]}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(score)}`}>
                    {score.toFixed(1)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {getScoreDescription(score)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {evaluation.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {evaluation.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Study Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {evaluation.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
