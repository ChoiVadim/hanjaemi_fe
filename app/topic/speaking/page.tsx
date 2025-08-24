"use client";

import { SpeakingTestInterface } from "@/components/speaking/SpeakingTestInterface";

export default function SpeakingPracticePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Speaking Test</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here you can practice your Korean speaking skills. This is have a
            knowledge of more than 100 TOPIK speaking tests!
          </p>
        </div>
        <SpeakingTestInterface />
      </div>
    </div>
  );
}
