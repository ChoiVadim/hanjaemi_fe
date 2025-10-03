import { PenLine, MessageCircle, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";

type GrammarType = "writing" | "speaking" | "common";

type GrammarRule = {
  id: string;
  title: string;
  description: string;
  descriptionKorean?: string;
  descriptionEnglish?: string;
  example?: string;
  examples?: string[];
  translation?: string;
  translations?: string[];
  type?: GrammarType;
  timestamp?: string;
};

const typeIcons = {
  writing: PenLine,
  speaking: MessageCircle,
  common: BookOpen,
  default: BookOpen,
} as const;

const typeDescriptions = {
  writing: "Writing exercise",
  speaking: "Speaking practice",
  common: "Common grammar point",
  default: "Grammar point",
} as const;

export function GrammarLoading() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-full h-[100px] p-3">
          <div className="flex items-start gap-4">
            <Skeleton circle width={24} height={24} />
            <div className="flex-1 space-y-2">
              <Skeleton width={200} height={20} />
              <Skeleton width={300} height={16} />
              <Skeleton width={80} height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Component for individual grammar rule with expandable examples
function GrammarRuleItem({
  rule,
  onGrammarClick,
  disabled,
  isSelected,
  onSelect,
}: {
  rule: GrammarRule;
  onGrammarClick: (grammar: string, timestamp?: string) => void;
  disabled?: boolean;
  isSelected: boolean;
  onSelect: (grammar: string) => void;
}) {
  const [showAllExamples, setShowAllExamples] = useState(false);
  
  const iconType = rule.type && typeIcons[rule.type] ? rule.type : "default";
  const Icon = typeIcons[iconType];
  
  const displayedExamples = showAllExamples 
    ? rule.examples || []
    : (rule.examples || []).slice(0, 3);
  
  const hasMoreExamples = rule.examples && rule.examples.length > 3;
  
  const handleClick = () => {
    if (isSelected) {
      // Second click - send to chat
      onGrammarClick(rule.title, rule.timestamp);
    } else {
      // First click - just select
      onSelect(rule.title);
    }
  };

  return (
    <div
      key={rule.id}
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
        {/* Wrap the Icon in a div instead of directly in TooltipTrigger to avoid SlotClone issues */}
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
              {(rule.type && typeDescriptions[rule.type]) ||
                typeDescriptions.default}
            </p>
          </TooltipContent>
        </Tooltip>
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold leading-none break-words">
            {rule.title}
          </h3>
          
          {/* Display both Korean and English descriptions */}
          {rule.descriptionKorean && rule.descriptionEnglish ? (
            <div className="space-y-1">
              <p className="text-sm text-slate-200 whitespace-normal break-words">
                🇰🇷 {rule.descriptionKorean}
              </p>
              <p className="text-sm text-slate-300 whitespace-normal break-words">
                🇬🇧 {rule.descriptionEnglish}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-300 whitespace-normal break-words">
              {rule.description}
            </p>
          )}
          
          {/* Display examples only when selected */}
          {isSelected && rule.examples && rule.examples.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-300">Examples:</p>
              <div className="space-y-1">
                {displayedExamples.map((example, index) => (
                  <div key={index} className="text-xs bg-slate-700/50 border border-slate-600/50 p-3 rounded-md">
                    <p className="font-medium text-slate-100">{example}</p>
                    {rule.translations && rule.translations[index] && (
                      <p className="text-slate-300 mt-1">{rule.translations[index]}</p>
                    )}
                  </div>
                ))}
                {hasMoreExamples && (
                  <button
                    className="text-xs text-slate-400 italic underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent button
                      setShowAllExamples(!showAllExamples);
                    }}
                  >
                    {showAllExamples 
                      ? "Show less examples" 
                      : `+${rule.examples!.length - 3} more examples...`
                    }
                  </button>
                )}
              </div>
            </div>
          )}
          
          {rule.timestamp && (
            <p className="text-xs text-slate-400">
              Timestamp: {rule.timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Grammar({
  type,
  id,
  onGrammarClick,
  disabled,
  data,
  isLoading,
}: {
  type: string;
  id: string;
  onGrammarClick: (grammar: string, timestamp?: string) => void;
  disabled?: boolean;
  data: GrammarRule[];
  isLoading?: boolean;
}) {
  const [selectedGrammar, setSelectedGrammar] = useState<string | null>(null);
  if (isLoading) {
    return (
      <ScrollArea
        className={cn(
          "flex-1 p-4",
          type === "level" ? "h-[780px] flex-1" : "h-[400px]"
        )}
      >
        <GrammarLoading />
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
            {data.map((rule) => (
              <GrammarRuleItem
                key={rule.id}
                rule={rule}
                onGrammarClick={onGrammarClick}
                disabled={disabled}
                isSelected={selectedGrammar === rule.title}
                onSelect={setSelectedGrammar}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
