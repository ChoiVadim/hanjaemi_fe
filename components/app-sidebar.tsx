"use client";

import {
  Home,
  Youtube,
  LogOut,
  User,
  FileText,
  MessageCircle,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarBody,
} from "@/components/ui/animated-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { JaemiLogo } from "@/components/jaemi-logo";
import { useAuth } from "@/components/context/auth-context";
import { useTranslation, TranslationKeys } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

const platformItems = [
  {
    titleKey: "common.learning",
    icon: Home,
    href: "/study",
  },
  {
    titleKey: "common.youtube",
    icon: Youtube,
    href: "/youtube",
  },
  {
    titleKey: "common.test",
    icon: FileText,
    href: "/topic",
  },
];

type ChatHistoryItem = {
  id: number;
  message: string;
  response?: string;
  lessonContext?: number;
  createdAt: string;
};

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { user, signOut, backendData, loading: authLoading } = useAuth();
  const { t } = useTranslation();

  // Get chat history from backend data
  const chatHistory: ChatHistoryItem[] = backendData?.chatHistory || [];

  // Format chat history for display in sidebar
  const formatChatHistoryForSidebar = (history: ChatHistoryItem[]) => {
    return history
      .slice(0, 10) // Limit to 10 most recent conversations
      .map((chat) => ({
        id: chat.id,
        title: chat.message.length > 30 
          ? `${chat.message.substring(0, 30)}...` 
          : chat.message,
        fullMessage: chat.message,
        response: chat.response,
        lessonContext: chat.lessonContext,
        createdAt: new Date(chat.createdAt),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Most recent first
  };

  const formattedChatHistory = formatChatHistoryForSidebar(chatHistory);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Обработка открытия/закрытия dropdown меню
  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
    if (open) {
      // При открытии dropdown закрываем сайдбар
      setOpen(false);
    }
  };

  // Обработка наведения на dropdown меню
  const handleDropdownEnter = () => {
    setIsDropdownHovered(true);
    // Отменяем любые запланированные закрытия сайдбара
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const handleDropdownLeave = () => {
    setIsDropdownHovered(false);
    // Закрываем сайдбар с задержкой после ухода с dropdown
    // Если курсор вернется на сайдбар, закрытие отменится
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Create platform links for animated sidebar
  const platformLinks = platformItems.map((item) => ({
    label: t(item.titleKey as keyof TranslationKeys),
    href: item.href,
    icon: (
      <item.icon className={cn(
        "h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200",
        pathname === item.href && "text-primary"
      )} />
    ),
  }));

  return (
    <Sidebar 
      open={open} 
      setOpen={setOpen}
      isDropdownHovered={isDropdownHovered}
      setIsDropdownHovered={setIsDropdownHovered}
      isDropdownOpen={isDropdownOpen}
    >
      <SidebarBody className="justify-between gap-4 border-r border-border bg-sidebar h-full">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden gap-4">
          {/* Logo Section */}
          {open ? (
            <Link href="/" className="flex items-center gap-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center">
                <JaemiLogo size={28} />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col text-left"
              >
                <h1 className="text-sm font-semibold">HanJaemi</h1>
                <p className="text-xs text-muted-foreground">Korean Learning Platform</p>
              </motion.div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center py-2">
              <div className="flex h-10 w-10 items-center justify-center">
                <JaemiLogo size={32} />
              </div>
            </Link>
          )}

          {/* Platform Links */}
          <div className="flex flex-col gap-1">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-normal text-muted-foreground mb-2 px-1"
                >
                  {t('common.platform')}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-col gap-1">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-start gap-2 group/sidebar py-2 px-1 rounded-md transition-colors",
                    pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )}
                >
                  {link.icon}
                  <motion.span
                    animate={{
                      display: open ? "inline-block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre"
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>

          {/* Chat History Section */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2 pt-2"
              >
                <div className="text-xs font-normal text-muted-foreground px-1">
                  {t('common.chatHistory')}
                </div>
                {authLoading ? (
                  <div className="px-3 py-2">
                    <div className="text-xs text-muted-foreground animate-pulse">{t('common.loading')}</div>
                  </div>
                ) : formattedChatHistory.length > 0 ? (
                  <ScrollArea className="h-48">
                    <TooltipProvider>
                      <div className="flex flex-col gap-1">
                        {formattedChatHistory.map((chat) => (
                          <Tooltip key={chat.id}>
                            <TooltipTrigger asChild>
                              <div
                                className="h-auto min-h-[36px] flex items-start gap-2 px-3 py-2 hover:bg-accent/50 cursor-pointer transition-colors rounded-md"
                                onClick={() => {
                                  router.push('/study');
                                }}
                              >
                                <MessageCircle className="shrink-0 h-3 w-3 text-muted-foreground mt-1" />
                                <div className="flex flex-col gap-0.5 text-left flex-1 min-w-0">
                                  <span className="text-xs font-medium truncate">
                                    {chat.title}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {chat.createdAt.toLocaleDateString()} • 
                                    {chat.lessonContext ? ` Lesson ${chat.lessonContext}` : ' General'}
                                  </span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="space-y-1">
                                <p className="font-semibold text-xs text-primary">Question:</p>
                                <p className="text-xs">{chat.fullMessage}</p>
                                {chat.response && (
                                  <>
                                    <p className="font-semibold text-xs text-primary pt-2">Response:</p>
                                    <p className="text-xs text-muted-foreground">
                                      {chat.response.length > 150 
                                        ? `${chat.response.substring(0, 150)}...` 
                                        : chat.response}
                                    </p>
                                  </>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
                  </ScrollArea>
                ) : (
                  <div className="px-3 py-2">
                    <div className="text-xs text-muted-foreground">
                      💬 {t('common.noChatHistory')}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {t('common.startConversation')}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with User Profile */}
        <div 
          className="mt-auto border-t pt-2"
          onMouseEnter={() => {
            // Отменяем закрытие при возврате на сайдбар
            if (dropdownTimeoutRef.current) {
              clearTimeout(dropdownTimeoutRef.current);
              dropdownTimeoutRef.current = null;
            }
            handleDropdownEnter();
          }}
          onMouseLeave={handleDropdownLeave}
        >
          {open ? (
            <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
              <DropdownMenuTrigger asChild>
                <div className="w-full flex items-center justify-between p-3 h-auto cursor-pointer hover:bg-accent/50 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-start text-left"
                    >
                      <span className="text-sm">{user?.user_metadata?.full_name || "User"}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email || "No email"}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                className="w-56 ml-1"
                sideOffset={0}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <DropdownMenuItem className="flex gap-2 items-center" asChild>
                  <Link href="/settings">
                    <User className="h-4 w-4" />
                    <span>{t('common.account')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <MessageSquare className="h-4 w-4" />
                  <span>Фидбек</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <HelpCircle className="h-4 w-4" />
                  <span>Инструкция</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex gap-2 items-center"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('common.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
              <DropdownMenuTrigger asChild>
                <div className="py-2 flex justify-center cursor-pointer hover:bg-accent/50 rounded-md transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                className="w-56 ml-1"
                sideOffset={0}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <DropdownMenuItem className="flex gap-2 items-center" asChild>
                  <Link href="/settings">
                    <User className="h-4 w-4" />
                    <span>{t('common.account')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <MessageSquare className="h-4 w-4" />
                  <span>Feedback</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <HelpCircle className="h-4 w-4" />
                  <span>Instruction</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex gap-2 items-center"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('common.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
