"use client";

import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CopyOption } from "@/types";

interface CopyOptionCardProps {
  option: CopyOption;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function CopyOptionCard({
  option,
  selected,
  onSelect,
}: CopyOptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className="w-full text-left"
    >
      <Card
        className={cn(
          "transition-all",
          selected
            ? "border-orange-400 bg-orange-50/60 ring-2 ring-orange-400/30"
            : "hover:border-orange-200"
        )}
      >
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-orange-700">
              {option.toneLabel}
            </span>
            {selected && (
              <span className="flex items-center gap-1 text-xs text-orange-600">
                <Check className="h-3.5 w-3.5" />
                已选择
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {option.content}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
