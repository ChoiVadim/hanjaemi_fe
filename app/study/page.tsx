"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Trophy, 
  Target, 
  Zap, 
  Crown, 
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchDifficulties } from "@/data/dataService";
import { useEffect, useState } from "react";

export default function StudyPage() {
  const [levels, setLevels] = useState<any[]>([]);

  useEffect(() => {
    const loadLevels = async () => {
      const data = await fetchDifficulties();
      setLevels(data);
    };
    loadLevels();
  }, []);

  // Define icons for each level
  const getLevelIcon = (levelName: string) => {
    const name = levelName.toLowerCase();
    if (name.includes('beginner')) return GraduationCap;
    if (name.includes('intermediate')) return Target;
    if (name.includes('advanced')) return Crown;
    return Star;
  };

  // Define colors for each level
  const getLevelColor = (levelName: string) => {
    return 'bg-black';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">

      <div className="h-full flex items-center justify-center px-8 py-8">
        <div className="text-center">
          {/* Header Section */}
          <div data-tour="study-header" className="mb-8">
          
            <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
              Choose Your Level
            </h1>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Select the level that matches your current Korean proficiency
            </p>
          </div>

          {/* Levels Grid */}
          <div data-tour="level-cards" className="grid gap-3 grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-8 px-4">
            {levels.map((level, index) => {
              const IconComponent = getLevelIcon(level.title);
              const gradientClass = getLevelColor(level.title);
              
              return (
                <Link key={level.id} href={`/study/${level.id}`}>
                  <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-102 bg-white w-64 h-64">
                    <CardContent className="p-6 h-full w-full flex flex-col items-center text-center justify-center">
                      {/* Icon Section */}
                      <div className="flex items-center justify-center mb-4">
                        <div className={`p-3 rounded-xl ${gradientClass} shadow-sm group-hover:shadow-md transition-all duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col items-center text-center space-y-3 px-3">
                        <h2 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors">
                          {level.title}
                        </h2>
                        <p className="text-base text-gray-600 leading-relaxed">
                          {level.description}
                        </p>
                        
                        {/* Lesson Count */}
                        <div className="flex items-center justify-center mt-3">
                          <Badge 
                            variant="outline" 
                            className="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 transition-colors text-sm px-4 py-1.5"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {`${level.lessonCount} ${level.lessonCount === 1 ? "lesson" : "lessons"}`}
                          </Badge>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div data-tour="placement-test">
            <Link href="/placement-test">
              <button className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
                Take a Placement Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
