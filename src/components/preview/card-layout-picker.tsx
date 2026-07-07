"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CardLayoutMode } from "@/types";
import { LayoutGrid, Layers } from "lucide-react";

interface CardLayoutPickerProps {
  value: CardLayoutMode;
  onChange: (mode: CardLayoutMode) => void;
  imageCount: number;
}

export function CardLayoutPicker({
  value,
  onChange,
  imageCount,
}: CardLayoutPickerProps) {
  if (imageCount <= 1) return null;

  const options: {
    mode: CardLayoutMode;
    label: string;
    desc: string;
    icon: ReactNode;
  }[] = [
    {
      mode: "merged",
      label: "合并一张",
      desc: "多图拼在一张卡片里",
      icon: <LayoutGrid className="h-4 w-4" />,
    },
    {
      mode: "multiple",
      label: "多张卡片",
      desc: "每张图单独生成卡片",
      icon: <Layers className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">卡片生成方式</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.mode}
            type="button"
            onClick={() => onChange(option.mode)}
            className={cn(
              "rounded-xl border p-3 text-left transition-all active:scale-[0.98]",
              value === option.mode
                ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200"
                : "border-border bg-white hover:border-orange-200"
            )}
          >
            <div className="mb-1 flex items-center gap-1.5 text-orange-600">
              {option.icon}
              <span className="text-sm font-medium">{option.label}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{option.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
