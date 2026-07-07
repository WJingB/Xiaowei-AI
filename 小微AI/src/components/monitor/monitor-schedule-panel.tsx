"use client";

import { cn } from "@/lib/utils";
import {
  isSlotActive,
  MONITOR_SLOT_LIST,
  type MonitorSlotId,
} from "@/lib/monitor-config";
import { Clock, Video } from "lucide-react";

interface MonitorSchedulePanelProps {
  selectedSlot: MonitorSlotId | null;
  onSelect: (slotId: MonitorSlotId) => void;
}

export function MonitorSchedulePanel({
  selectedSlot,
  onSelect,
}: MonitorSchedulePanelProps) {
  const now = new Date();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="h-4 w-4 text-orange-500" />
        作息定时抓拍计划
      </div>
      <div className="space-y-2">
        {MONITOR_SLOT_LIST.map((slot) => {
          const active = isSlotActive(slot.id, now);
          const selected = selectedSlot === slot.id;

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelect(slot.id)}
              className={cn(
                "w-full rounded-xl border p-3 text-left transition-all active:scale-[0.98]",
                selected
                  ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200"
                  : "border-border bg-white hover:border-orange-200"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {slot.emoji} {slot.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {slot.timeRange} · {slot.location}
                  </p>
                </div>
                {active && (
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    当前时段
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        正式版将通过 RTSP / 海康·大华·萤石云接口自动截帧；当前 MVP
        请上传监控画面截图模拟。
      </p>
    </div>
  );
}

interface MonitorCaptureHintProps {
  imageCount: number;
}

export function MonitorCaptureHint({ imageCount }: MonitorCaptureHintProps) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-3">
      <Video className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
      <div className="text-[11px] leading-relaxed text-blue-800/80">
        <p className="font-medium">多镜头优选（已选 {imageCount} 张）</p>
        <p className="mt-1">
          建议上传 1-3 张不同角度或 5 分钟内连续抓拍的监控截图，AI
          将综合评估后生成最全面的状态汇报。
        </p>
      </div>
    </div>
  );
}
