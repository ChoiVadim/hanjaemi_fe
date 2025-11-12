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
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchDifficulties } from "@/data/dataService";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

  // Define gradient colors for each level
  const getLevelGradient = (levelName: string, index: number) => {
    const name = levelName.toLowerCase();
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-green-500 to-emerald-500',
      'from-indigo-500 to-purple-500',
      'from-amber-500 to-orange-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            data-tour="study-header" 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Choose Your Level
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Select the level that matches your current Korean proficiency and start your learning journey
            </p>
          </motion.div>

          {/* Levels Grid */}
          <motion.div 
            data-tour="level-cards" 
            className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {levels.map((level, index) => {
              const IconComponent = getLevelIcon(level.title);
              const gradientClass = getLevelGradient(level.title, index);
              
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/study/${level.id}`} className="block h-full">
                    <Card className="group relative overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full flex flex-col">
                      <CardContent className="p-6 sm:p-8 h-full flex flex-col items-center text-center justify-between">
                        {/* Icon Section */}
                        <div className="flex items-center justify-center mb-6">
                          <motion.div 
                            className={`p-4 rounded-2xl bg-gradient-to-br ${gradientClass} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                          </motion.div>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col items-center text-center space-y-3 flex-1">
                          <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {level.title}
                          </h2>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                            {level.description}
                          </p>
                        </div>
                        
                        {/* Lesson Count */}
                        <div className="flex items-center justify-center mt-6 pt-4 border-t border-border/50 w-full">
                          <Badge 
                            variant="secondary" 
                            className="bg-muted text-muted-foreground border-0 hover:bg-muted/80 transition-colors text-sm px-4 py-2 font-medium"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {`${level.lessonCount} ${level.lessonCount === 1 ? "lesson" : "lessons"}`}
                          </Badge>
                        </div>

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/5 group-hover:to-primary/5 transition-all duration-300 pointer-events-none rounded-lg" />
                        
                        {/* Arrow indicator on hover */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <ArrowRight className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div 
            data-tour="placement-test"
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="inline-flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Not sure which level is right for you?
              </p>
              <Link href="/placement-test">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-6 text-base font-semibold"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Take a Placement Test
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
