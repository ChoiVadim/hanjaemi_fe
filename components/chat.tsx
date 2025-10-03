"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Bot, User } from "lucide-react";
import { useAuth } from "@/components/context/auth-context";
import { clearLocalChatData, transformChatHistory } from "@/lib/chat-utils";
import { useTour } from "@/components/context/tour-context";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
}

const generateMessageId = () => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function Chat({
  level,
  selectedGrammar,
  selectedWord,
  onLoadingChange,
}: {
  level: string;
  selectedGrammar: string | null;
  selectedWord: string | null;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { backendData, loading: authLoading } = useAuth();
  const { startTour } = useTour();

  // Clear any existing localStorage chat data on component mount
  useEffect(() => {
    clearLocalChatData();
  }, []);

  // Load chat history from backend data
  useEffect(() => {
    if (!authLoading) {
      if (backendData?.chatHistory && backendData.chatHistory.length > 0) {
        console.log("📊 Loading chat history from backend:", backendData.chatHistory);
        
        // Transform backend chat history to frontend message format
        const transformedMessages = transformChatHistory(backendData.chatHistory);
        
        setMessages(transformedMessages);
        console.log("✅ Chat history loaded:", transformedMessages);
      } else {
        // No backend data or empty chat history, show default greeting
        console.log("💬 No chat history found, showing default greeting");
        setMessages([
          {
            id: generateMessageId(),
            content: `Hello! I'm your Korean learning partner! 🎓

**What I can help you with:**

📚 **Grammar Explanations** - I'll explain complex Korean grammar in simple terms
📖 **Vocabulary Learning** - Learn new words and how to use them properly
💬 **Conversation Practice** - Practice natural Korean conversations
✍️ **Writing Help** - Get assistance with sentences and essays
🎯 **TOPIK Preparation** - Tips and practice for Korean proficiency test
🇰🇷 **Culture Insights** - Learn about Korean culture and customs
🔍 **Translation Support** - Help with Korean-English translations

**How to use:**
- Click on grammar or vocabulary items to automatically send questions
- Type your questions directly to get answers
- Type "help" anytime to get usage instructions

Feel free to ask me anything! Let's improve your Korean together! 💪`,
            sender: "assistant",
          },
        ]);
      }
    }
  }, [backendData, authLoading]);

  // Handle grammar selection
  useEffect(() => {
    if (selectedGrammar) {
      const newMessage: Message = {
        id: generateMessageId(),
        content: `Tell me a little bit more about ${selectedGrammar}!`,
        sender: "user",
      };
      setMessages((prev) => [...prev, newMessage]);

      handleSubmit(
        newMessage.content +
          " with 2 real live examples. Make it short as possible. Onyl key moments! Im on level"
      );
    }
  }, [selectedGrammar]);

  // Handle word selection
  useEffect(() => {
    if (selectedWord) {
      const newMessage: Message = {
        id: generateMessageId(),
        content: `Can you explain the usage of "${selectedWord}"`,
        sender: "user",
      };
      setMessages((prev) => [...prev, newMessage]);
      handleSubmit(
        newMessage.content +
          "and provide some example sentences? Make it short as possible. Onyl key moments!"
      );
    }
  }, [selectedWord]);

  // Handle loading state
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Handle scrolling to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle message sending
  const handleSubmit = async (message: string) => {
    let assistantMessageId: string | null = null;
    
    try {
      setIsLoading(true);
      
      // Create assistant message placeholder for streaming
      assistantMessageId = generateMessageId();
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: "",
        sender: "assistant",
      };
      
      // Add the assistant message immediately to show it's being typed
      setMessages((prev) => [...prev, assistantMessage]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { id: "temp", sender: "user", content: message }].map(
            (msg) => ({
              role: msg.sender,
              content: msg.content,
            })
          ),
          stream: true, // Enable streaming
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  break;
                }
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: msg.content + parsed.content }
                          : msg
                      )
                    );
                  }
                } catch (e) {
                  console.error("Error parsing streaming data:", e);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Remove the assistant message if there was an error
      if (assistantMessageId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
      }
      throw error; // Re-throw to handle in sendMessage
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: generateMessageId(),
      content: input,
      sender: "user" as const,
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      await handleSubmit(currentInput);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg">
      <ScrollArea className="flex-1 p-3">
        <div data-tour="chat-messages" className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === "assistant" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <Avatar>
                <AvatarFallback
                  className={
                    message.sender === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {message.sender === "assistant" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg px-4 py-3 max-w-[85%] ${
                  message.sender === "assistant"
                    ? "bg-muted shadow-sm"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  className={`prose prose-sm max-w-none font-sans ${
                    message.sender === "assistant"
                      ? "dark:prose-invert"
                      : "text-primary-foreground"
                  } break-words`}
                  components={{
                    code: ({
                      node,
                      inline,
                      className,
                      children,
                      ...props
                    }: any) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="not-prose rounded-md overflow-hidden my-2">
                          <div className="bg-zinc-800 text-xs text-zinc-400 px-3 py-1 border-b border-zinc-700">
                            {match[1]}
                          </div>
                          <pre className="p-0 m-0">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <code
                          className="bg-zinc-800/60 px-1.5 py-0.5 rounded text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }: any) => {
                      return <pre className="p-0 m-0">{children}</pre>;
                    },
                    p: ({ children }: any) => {
                      return <p className="mb-2 last:mb-0 font-sans whitespace-pre-line">{children}</p>;
                    },
                    br: () => {
                      return <br />;
                    },
                    ul: ({ children }: any) => {
                      return (
                        <ul className="list-disc pl-6 mb-2 last:mb-0">
                          {children}
                        </ul>
                      );
                    },
                    ol: ({ children }: any) => {
                      return (
                        <ol className="list-decimal pl-6 mb-2 last:mb-0">
                          {children}
                        </ol>
                      );
                    },
                    li: ({ children }: any) => {
                      return <li className="mb-1 last:mb-0">{children}</li>;
                    },
                    blockquote: ({ children }: any) => {
                      return (
                        <blockquote className="border-l-2 border-zinc-500 pl-4 italic">
                          {children}
                        </blockquote>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="flex gap-2 border-t p-2">
        <Input
          data-tour="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
          disabled={isLoading}
          className="h-9"
        />
        <Button 
          data-tour="chat-send"
          onClick={sendMessage} 
          disabled={isLoading} 
          className="h-9 px-3"
        >
          Send
        </Button>
      </div>
    </div>
  );
}