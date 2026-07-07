"use client";

import { cn } from "@/lib/utils";
import { CARD_THEME_LIST } from "@/lib/card-themes";
import type { CardThemeId } from "@/types";

interface CardThemePickerProps {
  value: CardThemeId;
  onChange: (theme: CardThemeId) => void;
}

export function CardThemePicker({ value, onChange }: CardThemePickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">卡片外观</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CARD_THEME_LIST.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1.5 rounded-xl border p-2 transition-all",
              value === theme.id
                ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200"
                : "border-border bg-white hover:border-orange-200"
            )}
          >
            <div
              className={cn("h-8 w-12 rounded-lg shadow-sm", theme.preview)}
            />
            <span className="text-[10px] font-medium">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
