import { Star, CircleDot, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Skeleton from "react-loading-skeleton";
import { cn, formatTimestamp } from "@/lib/utils";
import { useState } from "react";

export type VocabType = "important" | "common" | "new";

type VocabularyWord = {
  id: string;
  word: string;
  meaning: string;
  type?: VocabType;
  timestamp?: string;
  context?: string;
  examples?: string[];
  translations?: string[];
};

const typeIcons = {
  important: Star,
  common: CircleDot,
  new: Sparkles,
  default: CircleDot,
} as const;

const typeDescriptions = {
  important: "Important vocabulary",
  common: "Common vocabulary",
  new: "Newly introduced vocabulary",
  default: "Vocabulary item",
} as const;

export function VocabularyLoading() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-full h-[100px] p-3">
          <div className="flex items-start gap-4">
            <Skeleton circle width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton width={120} height={20} />
              <Skeleton width={200} height={16} />
              <Skeleton width={80} height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Vocabulary({
  type,
  id,
  onWordClick,
  onTimestampClick,
  disabled,
  data,
  isLoading,
}: {
  type: string;
  id: string;
  onWordClick: (word: string, timestamp?: string) => void;
  onTimestampClick?: (timestamp: string) => void;
  disabled?: boolean;
  data: VocabularyWord[];
  isLoading?: boolean;
}) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  if (isLoading) {
    return (
      <ScrollArea
        className={cn(
          "flex-1 p-4",
          type === "level" ? "h-[780px] flex-1" : "h-[400px]"
        )}
      >
        <VocabularyLoading />
      </ScrollArea>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <ScrollArea
          className={cn("flex-1", type === "level" ? "h-[780px]" : "h-[400px]")}
        >
          <div className="space-y-3">
            {data.map((word) => {
              const iconType =
                word.type && typeIcons[word.type] ? word.type : "default";
              const Icon = typeIcons[iconType];
              const isSelected = selectedWord === word.word;
              
              const handleClick = () => {
                if (isSelected) {
                  // Second click - send to chat
                  onWordClick && onWordClick(word.word, word.timestamp);
                } else {
                  // First click - just select
                  setSelectedWord(word.word);
                }
              };
              
              return (
                <div
                  key={word.id}
                  className={cn(
                    "w-full h-auto py-3 px-3 border border-border rounded-md cursor-pointer transition-all duration-200",
                    isSelected && "bg-slate-800 text-slate-50 border-slate-600"
                  )}
                  onClick={handleClick}
                >
                  <div className={cn(
                    "flex items-start gap-4 w-full transition-all duration-200",
                    isSelected ? "min-h-[120px]" : "min-h-[60px]"
                  )}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={cn(
                          "rounded-md p-2 shrink-0 transition-colors duration-200",
                          isSelected ? "bg-white" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isSelected ? "text-slate-800" : "text-muted-foreground"
                          )} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {(word.type && typeDescriptions[word.type]) ||
                            typeDescriptions.default}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold leading-none break-words">
                        {word.word}
                      </h3>
                      <p className={cn(
                        "text-sm whitespace-normal break-words",
                        isSelected ? "text-slate-300" : "text-slate-600"
                      )}>
                        {word.meaning}
                      </p>
                      
                      {/* Display Korean examples when selected */}
                      {isSelected && word.examples && word.examples.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-300">Examples:</p>
                          <div className="space-y-1">
                            {word.examples.map((example, index) => (
                              <div key={index} className="text-xs bg-slate-700/50 border border-slate-600/50 p-3 rounded-md">
                                <p className="font-medium text-slate-100">{example}</p>
                                {word.translations && word.translations[index] && (
                                  <p className="text-slate-300 mt-1">{word.translations[index]}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Display context if no examples available */}
                      {isSelected && (!word.examples || word.examples.length === 0) && word.context && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-300">Context:</p>
                          <div className="text-xs bg-slate-700/50 border border-slate-600/50 p-3 rounded-md">
                            <p className="font-medium text-slate-100">{word.context}</p>
                          </div>
                        </div>
                      )}
                      
                      {word.timestamp && (
                        <p className="text-xs text-slate-400">
                          Timestamp: {onTimestampClick ? (
                            <button
                              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTimestampClick(word.timestamp!);
                              }}
                            >
                              {formatTimestamp(word.timestamp)}
                            </button>
                          ) : (
                            formatTimestamp(word.timestamp)
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
