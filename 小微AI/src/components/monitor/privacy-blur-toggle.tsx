"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyBlurToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function PrivacyBlurToggle({ enabled, onChange }: PrivacyBlurToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border p-3 transition-all",
        enabled
          ? "border-violet-300 bg-violet-50"
          : "border-border bg-white hover:border-violet-200"
      )}
    >
      <div className="flex items-center gap-2 text-left">
        <Shield className={cn("h-4 w-4", enabled ? "text-violet-600" : "text-muted-foreground")} />
        <div>
          <p className="text-sm font-medium">隐私马赛克</p>
          <p className="text-[11px] text-muted-foreground">
            调用 API 前对画面模糊处理，保护其他孩子隐私
          </p>
        </div>
      </div>
      <div
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          enabled ? "bg-violet-500" : "bg-gray-200"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            enabled ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </div>
    </button>
  );
}
