"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface JaemiLogoProps {
  className?: string;
  size?: number;
}

export function JaemiLogo({ className, size = 48 }: JaemiLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드 렌더링 중이거나 마운트되지 않았을 때는 기본 로고 사용
  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/logo-dark.webp" 
    : "/logo-light.png";

  return (
    <Image
      src={logoSrc}
      alt="Jaemi Logo"
      width={size}
      height={size}
      className={cn(className)}
    />
  );
}
