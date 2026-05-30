"use client";

import { useEffect } from "react";

type ModifierKey = "ctrl" | "meta" | "shift" | "alt";

interface ShortcutConfig {
  key: string;
  modifiers?: ModifierKey[];
  handler: (e: KeyboardEvent) => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut({
  key,
  modifiers = [],
  handler,
  enabled = true,
  preventDefault = true,
}: ShortcutConfig) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const ctrlOrMeta = modifiers.includes("ctrl") || modifiers.includes("meta");
      const shift = modifiers.includes("shift");
      const alt = modifiers.includes("alt");

      const modMatch =
        (!ctrlOrMeta || e.ctrlKey || e.metaKey) &&
        (!shift || e.shiftKey) &&
        (!alt || e.altKey);

      if (modMatch && e.key.toLowerCase() === key.toLowerCase()) {
        if (preventDefault) e.preventDefault();
        handler(e);
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [key, modifiers, handler, enabled, preventDefault]);
}
