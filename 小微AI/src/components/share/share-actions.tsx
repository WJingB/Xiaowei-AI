"use client";

import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareActionsProps {
  onSaveImage: () => void;
  onSaveAll?: () => void;
  onCopyAndReturn: () => void;
  isSaving?: boolean;
  showSaveAll?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

export function ShareActions({
  onSaveImage,
  onSaveAll,
  onCopyAndReturn,
  isSaving,
  showSaveAll,
  currentIndex,
  totalCount,
}: ShareActionsProps) {
  return (
    <div className="space-y-3">
      {showSaveAll && totalCount && totalCount > 1 && (
        <p className="text-center text-xs text-muted-foreground">
          当前第 {(currentIndex ?? 0) + 1} / {totalCount} 张
        </p>
      )}

      <div className="grid grid-cols-1 gap-3">
        <Button
          size="lg"
          onClick={onSaveImage}
          disabled={isSaving}
          className="w-full"
        >
          <Download className="h-4 w-4" />
          {isSaving ? "正在生成图片..." : "保存当前卡片到相册"}
        </Button>

        {showSaveAll && onSaveAll && (
          <Button
            size="lg"
            variant="secondary"
            onClick={onSaveAll}
            disabled={isSaving}
            className="w-full"
          >
            <Download className="h-4 w-4" />
            保存全部卡片
          </Button>
        )}

        <Button
          size="lg"
          variant="outline"
          onClick={onCopyAndReturn}
          className="w-full"
        >
          <Copy className="h-4 w-4" />
          一键复制文案并返回
        </Button>
      </div>
    </div>
  );
}
