"use client";

import { CheckCircle2, AlertCircle, ScanEye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MONITOR_SLOTS } from "@/lib/monitor-config";
import type { MonitorAnalysisMeta } from "@/lib/monitor-config";
import { cn } from "@/lib/utils";

interface MonitorAnalysisBadgeProps {
  analysis: MonitorAnalysisMeta;
}

export function MonitorAnalysisBadge({ analysis }: MonitorAnalysisBadgeProps) {
  const slot = MONITOR_SLOTS[analysis.slotId];

  return (
    <Card className="border-blue-100 bg-gradient-to-br from-blue-50/80 to-white">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
          <ScanEye className="h-4 w-4" />
          无感监控 · AI 质检报告
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-blue-100">
            <p className="text-muted-foreground">监控时段</p>
            <p className="mt-0.5 font-medium">
              {slot.emoji} {slot.label}
            </p>
          </div>
          <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-blue-100">
            <p className="text-muted-foreground">质量评分</p>
            <p className="mt-0.5 font-medium">{analysis.qualityScore} / 10</p>
          </div>
          <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-blue-100">
            <p className="text-muted-foreground">识别行为</p>
            <p className="mt-0.5 font-medium">{analysis.detectedBehavior}</p>
          </div>
          <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-blue-100">
            <p className="text-muted-foreground">氛围评估</p>
            <p className="mt-0.5 font-medium">{analysis.atmosphere}</p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-start gap-2 rounded-lg p-2.5 text-xs",
            analysis.qualityPass
              ? "bg-green-50 text-green-800"
              : "bg-amber-50 text-amber-800"
          )}
        >
          {analysis.qualityPass ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p>
            {analysis.qualityPass
              ? `质检通过 · ${analysis.summary}`
              : `需关注 · ${analysis.summary}（评分未达 8 分，建议人工复核）`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
