"use client";

import Image from "next/image";
import { X, Upload } from "lucide-react";

interface MonitorFramePreviewProps {
  frames: string[];
  onRemove: (index: number) => void;
  onAdd: () => void;
  maxCount?: number;
}

export function MonitorFramePreview({
  frames,
  onRemove,
  onAdd,
  maxCount = 3,
}: MonitorFramePreviewProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">监控截帧（模拟）</p>
      <div className="grid grid-cols-3 gap-2">
        {frames.map((url, index) => (
          <div
            key={`${url.slice(0, 20)}-${index}`}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-dashed border-blue-200 bg-muted"
          >
            <Image
              src={url}
              alt={`监控截帧 ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
              CAM {index + 1}
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {frames.length < maxCount && (
          <button
            type="button"
            onClick={onAdd}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 text-blue-600 transition-colors hover:bg-blue-50"
          >
            <Upload className="h-5 w-5" />
            <span className="text-[10px]">上传截帧</span>
          </button>
        )}
      </div>
    </div>
  );
}
