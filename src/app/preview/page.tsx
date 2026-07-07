"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { MonitorAnalysisBadge } from "@/components/monitor/monitor-analysis-badge";
import { CardLayoutPicker } from "@/components/preview/card-layout-picker";
import { CopyEditor } from "@/components/preview/copy-editor";
import { CopyLoadingSkeleton } from "@/components/preview/copy-loading-skeleton";
import { CopyOptionCard } from "@/components/preview/copy-option-card";
import { ImagePreviewHeader } from "@/components/preview/image-preview-header";
import { CardThemePicker } from "@/components/share/card-theme-picker";
import { useAppContext } from "@/context/app-context";
import { fetchDoubaoAnalysis, fetchMonitorAnalysis } from "@/utils/api";
import { getSelectedCopy } from "@/types";

export default function PreviewPage() {
  const router = useRouter();
  const hasRequestedRef = useRef(false);
  const {
    imageDataUrls,
    sceneType,
    mealCategory,
    copyOptions,
    selectedCopyId,
    editedCopy,
    isAnalyzing,
    cardTheme,
    cardLayoutMode,
    captureMode,
    monitorSlotId,
    monitorAnalysis,
    privacyBlurEnabled,
    setCopyOptions,
    setSelectedCopyId,
    setEditedCopy,
    setIsAnalyzing,
    setCardTheme,
    setCardLayoutMode,
    setMonitorAnalysis,
  } = useAppContext();

  useEffect(() => {
    hasRequestedRef.current = false;
  }, [imageDataUrls, sceneType, mealCategory, captureMode, monitorSlotId]);

  useEffect(() => {
    if (imageDataUrls.length === 0 || !sceneType) {
      router.replace("/");
      return;
    }

    if (captureMode === "manual" && sceneType === "meal" && !mealCategory) {
      router.replace("/");
      return;
    }

    if (captureMode === "monitor" && !monitorSlotId) {
      router.replace("/monitor");
      return;
    }

    if (hasRequestedRef.current || copyOptions.length > 0) {
      return;
    }

    hasRequestedRef.current = true;

    const analyze = async () => {
      setIsAnalyzing(true);
      try {
        const result =
          captureMode === "monitor" && monitorSlotId
            ? await fetchMonitorAnalysis(imageDataUrls, monitorSlotId)
            : await fetchDoubaoAnalysis(
                imageDataUrls,
                sceneType,
                mealCategory
              );

        setCopyOptions(result.options);
        if (result.analysis) {
          setMonitorAnalysis(result.analysis);
        }
        if (result.options[0]) {
          setSelectedCopyId(result.options[0].id);
          setEditedCopy(result.options[0].content);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "文案生成失败，请稍后重试";
        toast.error(message);
      } finally {
        setIsAnalyzing(false);
      }
    };

    void analyze();
  }, [
    imageDataUrls,
    sceneType,
    mealCategory,
    captureMode,
    monitorSlotId,
    copyOptions.length,
    router,
    setCopyOptions,
    setEditedCopy,
    setIsAnalyzing,
    setSelectedCopyId,
    setMonitorAnalysis,
  ]);

  const handleSelectCopy = (id: string) => {
    const option = copyOptions.find((item) => item.id === id);
    if (!option) return;
    setSelectedCopyId(id);
    setEditedCopy(option.content);
  };

  const handleGenerateCard = () => {
    if (!editedCopy.trim()) {
      toast.error("请先选择或编辑文案");
      return;
    }
    if (
      captureMode === "monitor" &&
      monitorAnalysis &&
      !monitorAnalysis.qualityPass
    ) {
      toast.warning("质检评分未达标，建议人工复核后再分享");
    }
    router.push("/share");
  };

  if (imageDataUrls.length === 0 || !sceneType) {
    return null;
  }

  return (
    <MobileShell className="pb-6">
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
          <h1 className="text-lg font-semibold">
            {captureMode === "monitor" ? "监控解析结果" : "预览与文案生成"}
          </h1>
          {captureMode === "monitor" && (
            <p className="text-xs text-muted-foreground">
              无感截帧 · 豆包多模态解析
              {privacyBlurEnabled && " · 已启用隐私模糊"}
            </p>
          )}
        </div>
      </div>

      <ImagePreviewHeader
        imageDataUrls={imageDataUrls}
        sceneType={sceneType}
        mealCategory={mealCategory}
        captureMode={captureMode}
      />

      <section className="mt-6 space-y-5">
        {monitorAnalysis && (
          <MonitorAnalysisBadge analysis={monitorAnalysis} />
        )}

        <CardLayoutPicker
          value={cardLayoutMode}
          onChange={setCardLayoutMode}
          imageCount={imageDataUrls.length}
        />

        <CardThemePicker value={cardTheme} onChange={setCardTheme} />

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            AI 文案选项
          </h2>

          {isAnalyzing ? (
            <CopyLoadingSkeleton />
          ) : (
            <>
              <div className="space-y-3">
                {copyOptions.map((option) => (
                  <CopyOptionCard
                    key={option.id}
                    option={option}
                    selected={selectedCopyId === option.id}
                    onSelect={handleSelectCopy}
                  />
                ))}
              </div>

              <CopyEditor
                value={editedCopy}
                onChange={setEditedCopy}
                disabled={!getSelectedCopy(copyOptions, selectedCopyId)}
              />

              <Button
                size="lg"
                className="mt-2 w-full"
                onClick={handleGenerateCard}
                disabled={!editedCopy.trim()}
              >
                生成分享卡片
              </Button>
            </>
          )}
        </div>
      </section>
    </MobileShell>
  );
}
