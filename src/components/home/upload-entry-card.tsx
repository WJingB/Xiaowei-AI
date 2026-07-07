"use client";

import { Camera, Cctv } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadEntryCardProps {
  emoji: string;
  title: string;
  description: string;
  onSelect: () => void;
  className?: string;
  icon?: "camera" | "cctv";
  badge?: string;
}

export function UploadEntryCard({
  emoji,
  title,
  description,
  onSelect,
  className,
  icon = "camera",
  badge,
}: UploadEntryCardProps) {
  const Icon = icon === "cctv" ? Cctv : Camera;
  const iconBg = icon === "cctv" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600";
  const cardBorder = icon === "cctv" ? "border-blue-100 hover:border-blue-200" : "border-orange-100 hover:border-orange-200";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn("w-full text-left transition-transform active:scale-[0.98]", className)}
    >
      <Card className={cn("bg-white/90 shadow-md hover:shadow-lg", cardBorder)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">
                  {emoji} {title}
                </CardTitle>
                {badge && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    {badge}
                  </span>
                )}
              </div>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconBg)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">
            {icon === "cctv" ? "接入监控 · 无感自动播报" : "点击拍照或从相册选择"}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
