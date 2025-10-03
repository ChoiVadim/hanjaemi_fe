"use client";

import {
  Home,
  Youtube,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowUpCircle,
  Bell,
  CreditCard,
  User,
  FileText,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

const platformItems = [
  {
    title: "Learning",
    icon: Home,
    href: "/study",
  },
  {
    title: "Youtube",
    icon: Youtube,
    href: "/youtube",
  },
  {
    title: "TOPIK",
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
  const { open, setOpen, toggleSidebar } = useSidebar();
  const { user, signOut, backendData, loading: authLoading } = useAuth();

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

  return (
    <div className="flex relative">
      <Sidebar
        className={cn(
          "border-r border-border bg-sidebar transition-all duration-300 ease-in-out",
          open ? "w-64 min-w-[16rem]" : "w-[60px] min-w-[60px]"
        )}
        collapsible="none"
      >
        <SidebarHeader
          className={cn(
            "flex transition-all duration-300 ease-in-out",
            open ? "justify-between px-5 py-3" : "justify-center py-3"
          )}
        >
          {open ? (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <JaemiLogo size={28} />
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-sm font-semibold">HanJaemi</h1>
                <p className="text-xs text-muted-foreground">Learning Korean</p>
              </div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-primary-foreground">
                <JaemiLogo size={32} />
              </div>
            </Link>
          )}
        </SidebarHeader>

        <SidebarContent
          className={cn(
            "transition-all duration-300 ease-in-out",
            open ? "px-2" : ""
          )}
        >
          <SidebarGroup>
            {open && (
              <SidebarGroupLabel className="text-xs font-normal text-muted-foreground">
                Platform
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              {open ? (
                <SidebarMenu>
                  {platformItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        title={item.title}
                        className={cn(
                          "transition-all duration-300 ease-in-out h-9 justify-start gap-2 px-3",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <Link href={item.href} className="flex items-center">
                          <item.icon className="shrink-0 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ) : (
                <div className="flex flex-col items-center gap-1 py-3">
                  {platformItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-md transition-all duration-300 ease-in-out",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                      title={item.title}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>

          {open && (
            <SidebarGroup className="pt-3">
              <SidebarGroupLabel className="text-xs font-normal text-muted-foreground">
                Chat History
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {authLoading ? (
                  <div className="px-3 py-2">
                    <div className="text-xs text-muted-foreground animate-pulse">Loading chat history...</div>
                  </div>
                ) : formattedChatHistory.length > 0 ? (
                  <ScrollArea className="h-48">
                    <TooltipProvider>
                      <SidebarMenu>
                        {formattedChatHistory.map((chat) => (
                          <SidebarMenuItem key={chat.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  className="h-auto min-h-[36px] justify-start gap-2 px-3 py-2 hover:bg-accent/50 cursor-pointer transition-colors"
                                  onClick={() => {
                                    // Navigate to study page to see chat
                                    router.push('/study');
                                  }}
                                >
                                  <MessageCircle className="shrink-0 h-3 w-3 text-muted-foreground" />
                                  <div className="flex flex-col gap-0.5 text-left flex-1 min-w-0">
                                    <span className="text-xs font-medium truncate">
                                      {chat.title}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      {chat.createdAt.toLocaleDateString()} • 
                                      {chat.lessonContext ? ` Lesson ${chat.lessonContext}` : ' General'}
                                    </span>
                                  </div>
                                </SidebarMenuButton>
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
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </TooltipProvider>
                  </ScrollArea>
                ) : (
                  <div className="px-3 py-2">
                    <div className="text-xs text-muted-foreground">
                      💬 No chat history yet
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Start a conversation to see history
                    </div>
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="mt-auto">
          {open ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-3 h-auto rounded-none border-t"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded">
                      <AvatarImage
                        src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"}
                        alt="user"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm">{user?.user_metadata?.full_name || "User"}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email || "No email"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                className="w-56 ml-1"
                sideOffset={0}
              >
                <DropdownMenuItem className="flex gap-2 items-center">
                  <ArrowUpCircle className="h-4 w-4" />
                  <span>Upgrade to Pro</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-2 items-center">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <CreditCard className="h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex gap-2 items-center"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex flex-col">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="py-3 flex justify-center cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"}
                        alt="user"
                      />
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
                >
                  <DropdownMenuItem className="flex gap-2 items-center">
                    <ArrowUpCircle className="h-4 w-4" />
                    <span>Upgrade to Pro</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex gap-2 items-center">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-2 items-center">
                    <CreditCard className="h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-2 items-center">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex gap-2 items-center"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Toggle button positioned to the right of the sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute top-4 h-6 w-6 rounded-full bg-background border shadow-sm z-50 transition-all duration-300"
        style={{
          left: open ? "calc(var(--sidebar-width) - 12px)" : "46px",
        }}
      >
        {open ? (
          <ChevronLeft className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
