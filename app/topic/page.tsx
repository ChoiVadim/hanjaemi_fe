"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Book, Headphones, MessageCircle } from "lucide-react";

const topics = [
  {
    name: "Writing",
    icon: Pencil,
    description: "Practice your Korean writing skills",
  },
  {
    name: "Reading",
    icon: Book,
    description: "Improve your Korean reading comprehension",
  },
  {
    name: "Listening",
    icon: Headphones,
    description: "Enhance your Korean listening abilities",
  },
  {
    name: "Speaking",
    icon: MessageCircle,
    description: "Develop your Korean speaking fluency",
  },
];

export default function TopicPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const router = useRouter();

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  const handleStartPractice = () => {
    if (selectedTopic) {
      router.push(`/topic/${selectedTopic.toLowerCase()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-4">Choose a Topic</h1>
        <p className="text-muted-foreground text-center mb-12">
          Select the area of Korean language you want to focus on
        </p>
        <div data-tour="topik-topics" className="lg:w-2/3 grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <Card
              key={topic.name}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTopic === topic.name ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleTopicSelect(topic.name)}
            >
              <CardContent className="aspect-square p-6 flex flex-col items-center justify-center text-center">
                <div
                  className={`mb-6 p-3 rounded-full ${
                    selectedTopic === topic.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10"
                  } transition-colors`}
                >
                  <topic.icon className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">{topic.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {topic.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {selectedTopic && (
          <div className="mt-8 text-center">
            <Button size="lg" onClick={handleStartPractice} className="px-8">
              Start {selectedTopic} Practice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
