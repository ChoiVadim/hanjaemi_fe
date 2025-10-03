"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Trophy,
  Target,
  Crown,
  GraduationCap
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

const placementQuestions: Question[] = [
  // Beginner Questions
  {
    id: "q1",
    question: "What does '안녕하세요' mean?",
    options: ["Hello", "Goodbye", "Thank you", "Sorry"],
    correctAnswer: 0,
    level: 'beginner'
  },
  {
    id: "q2", 
    question: "How do you say 'water' in Korean?",
    options: ["물", "불", "달", "별"],
    correctAnswer: 0,
    level: 'beginner'
  },
  {
    id: "q3",
    question: "What is the Korean word for 'book'?",
    options: ["책", "차", "집", "손"],
    correctAnswer: 0,
    level: 'beginner'
  },
  
  // Intermediate Questions
  {
    id: "q4",
    question: "What does '오늘 날씨가 좋네요' mean?",
    options: ["The weather is bad today", "The weather is good today", "It's raining today", "It's cold today"],
    correctAnswer: 1,
    level: 'intermediate'
  },
  {
    id: "q5",
    question: "How do you say 'I want to eat Korean food'?",
    options: ["한국 음식을 먹고 싶어요", "한국 음식을 먹었어요", "한국 음식을 먹을 거예요", "한국 음식을 먹어요"],
    correctAnswer: 0,
    level: 'intermediate'
  },
  {
    id: "q6",
    question: "What does '내일 만날 수 있을까요?' mean?",
    options: ["Can we meet tomorrow?", "Did we meet yesterday?", "We will meet tomorrow", "We met yesterday"],
    correctAnswer: 0,
    level: 'intermediate'
  },

  // Advanced Questions
  {
    id: "q7",
    question: "What does '그 사람은 정말 예의 바르고 친절해서 좋은 인상을 남겼어요' mean?",
    options: [
      "That person was rude and left a bad impression",
      "That person was polite and kind, leaving a good impression", 
      "That person was quiet and shy",
      "That person was loud and annoying"
    ],
    correctAnswer: 1,
    level: 'advanced'
  },
  {
    id: "q8",
    question: "How do you say 'I regret not studying Korean earlier'?",
    options: [
      "한국어를 더 일찍 공부하지 않아서 후회해요",
      "한국어를 더 일찍 공부했어서 후회해요", 
      "한국어를 더 일찍 공부할 거예요",
      "한국어를 더 일찍 공부했어요"
    ],
    correctAnswer: 0,
    level: 'advanced'
  },
  {
    id: "q9",
    question: "What does '그 회사는 경쟁력 있는 제품을 개발하기 위해 많은 투자를 하고 있다' mean?",
    options: [
      "The company is investing heavily to develop competitive products",
      "The company is losing money on product development",
      "The company is closing down due to competition",
      "The company is hiring more employees"
    ],
    correctAnswer: 0,
    level: 'advanced'
  }
];

export default function PlacementTestPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = placementQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / placementQuestions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (currentQuestion < placementQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate scores by level
    const scores = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    placementQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        scores[question.level]++;
      }
    });

    // Determine recommended level
    let recommendedLevel = 'beginner';
    let recommendedDifficultyId = 1;

    if (scores.advanced >= 2) {
      recommendedLevel = 'advanced';
      recommendedDifficultyId = 5; // Assuming advanced levels are 5-6
    } else if (scores.intermediate >= 2) {
      recommendedLevel = 'intermediate';
      recommendedDifficultyId = 3; // Assuming intermediate levels are 3-4
    } else {
      recommendedLevel = 'beginner';
      recommendedDifficultyId = 1; // Assuming beginner levels are 1-2
    }

    // Store results and show results page
    localStorage.setItem('placementTestResults', JSON.stringify({
      scores,
      recommendedLevel,
      recommendedDifficultyId,
      totalScore: Object.values(scores).reduce((sum, score) => sum + score, 0)
    }));

    setShowResults(true);
  };

  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'beginner': return GraduationCap;
      case 'intermediate': return Target;
      case 'advanced': return Crown;
      default: return Trophy;
    }
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'from-gray-400 to-gray-500';
      case 'intermediate': return 'from-gray-600 to-gray-700';
      case 'advanced': return 'from-black to-gray-800';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (showResults) {
    const results = JSON.parse(localStorage.getItem('placementTestResults') || '{}');
    const IconComponent = getLevelIcon(results.recommendedLevel);
    const gradientClass = getLevelColor(results.recommendedLevel);

    const handleGoToLevel = () => {
      router.push(`/study/${results.recommendedDifficultyId}`);
    };

    const handleGoToMainMenu = () => {
      router.push('/study');
    };

    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4">
            <Card className="w-full max-w-2xl">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${gradientClass} rounded-full mb-6`}>
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
                
                <h1 className="text-4xl font-bold text-black mb-4">
                  Test Complete!
                </h1>
                
                <p className="text-lg text-gray-600 mb-8">
                  Based on your answers, we recommend:
                </p>
                
                <div className="bg-gray-50 rounded-lg p-8 mb-8">
                  <h2 className="text-3xl font-bold text-black mb-3 capitalize">
                    {results.recommendedLevel} Level
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Total Score: {results.totalScore} / {placementQuestions.length}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="text-sm text-gray-500">
                      Beginner: {results.scores?.beginner || 0}/3 • 
                      Intermediate: {results.scores?.intermediate || 0}/3 • 
                      Advanced: {results.scores?.advanced || 0}/3
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={handleGoToLevel}
                    className="w-full bg-black text-white hover:bg-gray-800 text-lg py-3"
                  >
                    <Trophy className="h-5 w-5 mr-2" />
                    Go to Level
                  </Button>
                  
                  <Button 
                    onClick={handleGoToMainMenu}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 text-lg py-3"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Go to Main Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-black">Korean Placement Test</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {placementQuestions.length}
              </p>
            </div>

            <div className="w-20"></div> {/* Spacer */}
          </div>
          
          <Progress value={progress} className="mt-4" />
        </div>

        {/* Question Content */}
        <div className="flex-1 px-4 py-6">
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Badge 
                  variant="outline" 
                  className={`bg-gradient-to-r ${getLevelColor(currentQ.level)} text-white border-0`}
                >
                  {currentQ.level.charAt(0).toUpperCase() + currentQ.level.slice(1)}
                </Badge>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-black mb-8 text-center">
                  {currentQ.question}
                </h2>

                <RadioGroup
                  key={currentQ.id}
                  value={answers[currentQ.id]?.toString()}
                  onValueChange={handleAnswerChange}
                  className="space-y-4"
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`${currentQ.id}-${index}`} />
                      <Label htmlFor={`${currentQ.id}-${index}`} className="flex-1 text-lg cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <Button 
                  onClick={handleNext}
                  disabled={answers[currentQ.id] === undefined}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {currentQuestion === placementQuestions.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Finish Test
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
