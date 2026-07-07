"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { CardThemePicker } from "@/components/share/card-theme-picker";
import { ShareActions } from "@/components/share/share-actions";
import { ShareCard } from "@/components/share/share-card";
import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";

export default function SharePage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    imageDataUrls,
    sceneType,
    mealCategory,
    editedCopy,
    institutionName,
    institutionLogo,
    cardTheme,
    cardLayoutMode,
    captureMode,
    monitorSlotId,
    setCardTheme,
    resetSession,
  } = useAppContext();

  const isMultipleMode =
    cardLayoutMode === "multiple" && imageDataUrls.length > 1;
  const totalCount = isMultipleMode ? imageDataUrls.length : 1;

  useEffect(() => {
    if (imageDataUrls.length === 0 || !sceneType || !editedCopy.trim()) {
      router.replace("/");
    }
  }, [editedCopy, imageDataUrls.length, router, sceneType]);

  if (imageDataUrls.length === 0 || !sceneType || !editedCopy.trim()) {
    return null;
  }

  const saveCardElement = async (element: HTMLElement, suffix = "") => {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = `午托播报${suffix}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;

    setIsSaving(true);
    try {
      await saveCardElement(
        cardRef.current,
        isMultipleMode ? `-${currentIndex + 1}` : ""
      );
      toast.success("图片已保存，请到相册查看");
    } catch {
      toast.error("图片保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (!isMultipleMode) return;

    setIsSaving(true);
    try {
      const cards = document.querySelectorAll<HTMLElement>("[data-share-card-batch]");
      for (let i = 0; i < cards.length; i++) {
        await saveCardElement(cards[i], `-${i + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      toast.success(`已保存 ${cards.length} 张卡片`);
    } catch {
      toast.error("部分图片保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyAndReturn = async () => {
    try {
      await navigator.clipboard.writeText(editedCopy);
      toast.success("文案已复制到剪贴板");
      resetSession();
      router.push("/");
    } catch {
      toast.error("复制失败，请手动复制");
    }
  };

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
        <h1 className="text-lg font-semibold">分享卡片</h1>
      </div>

      <div className="mb-4">
        <CardThemePicker value={cardTheme} onChange={setCardTheme} />
      </div>

      {isMultipleMode ? (
        <div className="mb-6 space-y-3">
          <div className="relative">
            <div ref={cardRef} data-share-card>
              <ShareCard
                imageDataUrls={imageDataUrls}
                copyText={editedCopy}
                sceneType={sceneType}
                mealCategory={mealCategory}
                themeId={cardTheme}
                institutionName={institutionName}
                institutionLogo={institutionLogo}
                captureMode={captureMode}
                monitorSlotId={monitorSlotId}
                singleImageIndex={currentIndex}
              />
            </div>

            <div className="mt-3 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1.5">
                {imageDataUrls.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index === currentIndex
                        ? "w-5 bg-orange-500"
                        : "w-2 bg-orange-200"
                    )}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                disabled={currentIndex === imageDataUrls.length - 1}
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 离屏渲染全部卡片，用于批量保存 */}
          <div
            className="pointer-events-none fixed -left-[9999px] top-0 w-[360px] opacity-0"
            aria-hidden
          >
            {imageDataUrls.map((_, index) => (
              <div key={index} data-share-card-batch className="mb-4">
                <ShareCard
                  imageDataUrls={imageDataUrls}
                  copyText={editedCopy}
                  sceneType={sceneType}
                  mealCategory={mealCategory}
                  themeId={cardTheme}
                  institutionName={institutionName}
                  institutionLogo={institutionLogo}
                  singleImageIndex={index}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6" ref={cardRef} data-share-card>
          <ShareCard
            imageDataUrls={imageDataUrls}
            copyText={editedCopy}
            sceneType={sceneType}
            mealCategory={mealCategory}
            themeId={cardTheme}
            institutionName={institutionName}
            institutionLogo={institutionLogo}
            captureMode={captureMode}
            monitorSlotId={monitorSlotId}
          />
        </div>
      )}

      <ShareActions
        onSaveImage={handleSaveImage}
        onSaveAll={handleSaveAll}
        onCopyAndReturn={handleCopyAndReturn}
        isSaving={isSaving}
        showSaveAll={isMultipleMode}
        currentIndex={currentIndex}
        totalCount={totalCount}
      />
    </MobileShell>
  );
}
