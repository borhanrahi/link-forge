"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "dark" | "light" | "system";

function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme") as Theme | null;
  return stored || "dark";
}

function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem("theme", theme);
  applyTheme(theme);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(prefersDark ? "dark" : "light");
  } else {
    root.classList.add(theme);
  }
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setThemeState(getTheme());
    applyTheme(getTheme());
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" className="text-white/40">
        <Moon className="h-4 w-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setThemeState(next);
    setTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-white/40 hover:text-white"
      onClick={cycleTheme}
      title={`Theme: ${theme}`}
    >
      {theme === "dark" && <Moon className="h-4 w-4" />}
      {theme === "light" && <Sun className="h-4 w-4" />}
      {theme === "system" && <Monitor className="h-4 w-4" />}
    </Button>
  );
}
