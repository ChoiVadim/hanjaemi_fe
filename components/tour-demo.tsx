"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Play, BookOpen, Target, Users, Zap } from "lucide-react";
import { useTour } from "@/components/context/tour-context";

export function TourDemo() {
  const { startTour } = useTour();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-black">React Joyride Onboarding Tours</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience interactive guided tours that help users understand your application's features and navigation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Play className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Homepage Tour</CardTitle>
            <CardDescription>
              Guided walkthrough of the main landing page features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => startTour('homepage')}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start Homepage Tour
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Study Page Tour</CardTitle>
            <CardDescription>
              Learn how to navigate the learning interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => startTour('studyPage')}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start Study Tour
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Sidebar Tour</CardTitle>
            <CardDescription>
              Discover navigation and user profile features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => startTour('sidebar')}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start Sidebar Tour
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Lesson Page Tour</CardTitle>
            <CardDescription>
              Complete guide to lesson navigation and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => startTour('lessonPage')}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start Lesson Tour
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Play className="h-6 w-6 text-white" />
            </div>
            <CardTitle>YouTube Page Tour</CardTitle>
            <CardDescription>
              Learn how to analyze YouTube videos for Korean learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => startTour('youtubePage')}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start YouTube Tour
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <CardTitle>TOPIK Page Tour</CardTitle>
            <CardDescription>
              Explore TOPIK practice areas and test preparation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => startTour('topikPage')}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start TOPIK Tour
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Chat Component Tour</CardTitle>
            <CardDescription>
              Learn how to interact with the AI tutor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => startTour('chatComponent')}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start Chat Tour
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Flashcards Tour</CardTitle>
            <CardDescription>
              Master vocabulary and grammar with interactive flashcards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => startTour('flashcardsComponent')}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start Flashcards Tour
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-black" />
            Features Included
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-black">Interactive Elements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Smooth animations and transitions</li>
                <li>• Customizable styling to match your theme</li>
                <li>• Progress indicators</li>
                <li>• Skip and back navigation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-black">User Experience</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Context-aware content</li>
                <li>• Responsive design</li>
                <li>• Accessible navigation</li>
                <li>• Mobile-friendly interface</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
