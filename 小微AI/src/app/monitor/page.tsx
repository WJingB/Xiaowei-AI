"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Cctv, Loader2 } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { InstitutionSettings } from "@/components/home/institution-settings";
import { MonitorCaptureHint } from "@/components/monitor/monitor-schedule-panel";
import { MonitorFramePreview } from "@/components/monitor/monitor-frame-preview";
import { MonitorSchedulePanel } from "@/components/monitor/monitor-schedule-panel";
import { PrivacyBlurToggle } from "@/components/monitor/privacy-blur-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/app-context";
import { applyPrivacyBlurBatch } from "@/lib/image-blur";
import { suggestMonitorSlot, type MonitorSlotId } from "@/lib/monitor-config";
import { fileToDataUrl } from "@/lib/utils";

export default function MonitorPage() {
  const router = useRouter();
  const { setMonitorCapture } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedSlot, setSelectedSlot] = useState<MonitorSlotId>(
    suggestMonitorSlot()
  );
  const [frames, setFrames] = useState<string[]>([]);
  const [privacyBlur, setPrivacyBlur] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleAddFrame = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    try {
      const remaining = 3 - frames.length;
      const toAdd = files.slice(0, remaining);
      const dataUrls = await Promise.all(toAdd.map((f) => fileToDataUrl(f)));
      setFrames((prev) => [...prev, ...dataUrls].slice(0, 3));
    } catch {
      toast.error("图片读取失败");
    }
    event.target.value = "";
  };

  const handleRemoveFrame = (index: number) => {
    setFrames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSimulateCapture = async () => {
    if (frames.length === 0) {
      toast.error("请先上传至少一张监控截帧");
      return;
    }

    setIsCapturing(true);
    try {
      // 模拟定时抓拍延迟
      await new Promise((resolve) => setTimeout(resolve, 800));

      const processed = await applyPrivacyBlurBatch(frames, privacyBlur);
      setMonitorCapture(processed, selectedSlot, privacyBlur);
      toast.success("监控截帧已就绪，正在跳转解析…");
      router.push("/preview");
    } catch {
      toast.error("截帧处理失败，请重试");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <MobileShell className="pb-8">
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="返回"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">无感监控播报</h1>
          <p className="text-xs text-muted-foreground">
            基于现有摄像头 · 豆包多模态解析
          </p>
        </div>
      </div>

      <main className="space-y-4">
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50/60 to-white">
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
              <Cctv className="h-4 w-4" />
              模块说明
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              正式版将对接 RTSP / 海康·大华·萤石云，按作息表自动截帧。当前 MVP
              请上传监控画面截图代替，体验完整「无感 → 解析 → 播报」闭环。
            </p>
          </CardContent>
        </Card>

        <InstitutionSettings />

        <Card className="border-border bg-white/90">
          <CardContent className="space-y-4 p-4">
            <MonitorSchedulePanel
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-white/90">
          <CardContent className="space-y-4 p-4">
            <MonitorFramePreview
              frames={frames}
              onRemove={handleRemoveFrame}
              onAdd={handleAddFrame}
            />
            <MonitorCaptureHint imageCount={frames.length} />
            <PrivacyBlurToggle enabled={privacyBlur} onChange={setPrivacyBlur} />
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full"
          disabled={frames.length === 0 || isCapturing}
          onClick={handleSimulateCapture}
        >
          {isCapturing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              模拟定时抓拍中…
            </>
          ) : (
            <>
              <Cctv className="h-4 w-4" />
              模拟定时抓拍并解析
            </>
          )}
        </Button>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </MobileShell>
  );
}
