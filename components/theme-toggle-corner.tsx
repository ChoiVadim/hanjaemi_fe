"use client";

import * as React from "react";
import { Computer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggleCorner() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we have access to the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Force a component update when system theme changes
  React.useEffect(() => {
    // This empty effect will re-render the component when resolvedTheme changes
    // which happens when the system theme changes
  }, [resolvedTheme]);

  if (!mounted) {
    return (
      <div className="fixed top-3 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-3 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm relative"
          >
            {/* Show appropriate icon based on theme setting */}
            {theme === "light" && (
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
            {theme === "dark" && (
              <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
            {theme === "system" && (
              <Computer className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[130px]">
          <DropdownMenuItem 
            onClick={() => setTheme("light")} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
            {theme === "light" && (
              <span className="absolute right-2 text-xs">✓</span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
            {theme === "dark" && (
              <span className="absolute right-2 text-xs">✓</span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <Computer className="h-4 w-4" />
            <span>System</span>
            {theme === "system" && (
              <span className="absolute right-2 text-xs">✓</span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
