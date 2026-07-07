"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MobileShell } from "@/components/layout/mobile-shell";
import { ImagePicker, type ImagePickerHandle } from "@/components/home/image-picker";
import { InstitutionSettings } from "@/components/home/institution-settings";
import { MealCategoryPicker } from "@/components/home/meal-category-picker";
import { UploadEntryCard } from "@/components/home/upload-entry-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/app-context";
import { fileToDataUrl } from "@/lib/utils";
import { SCENE_CONFIG, type MealCategory, type SceneType } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const { setImages } = useAppContext();
  const pickerRef = useRef<ImagePickerHandle>(null);

  const [showMealPicker, setShowMealPicker] = useState(false);
  const [pendingMealCategory, setPendingMealCategory] =
    useState<MealCategory | null>(null);

  const handleOpenPicker = (type: SceneType) => {
    if (type === "meal") {
      setShowMealPicker(true);
      return;
    }
    pickerRef.current?.open(type, true);
  };

  const handleMealCategoryConfirm = () => {
    if (!pendingMealCategory) {
      toast.error("请先选择餐次");
      return;
    }
    setShowMealPicker(false);
    pickerRef.current?.open("meal", true);
  };

  const handleFilesSelect = async (files: File[], type: SceneType) => {
    if (files.length === 0) return;

    if (type === "meal" && !pendingMealCategory) {
      toast.error("请先选择餐次");
      setShowMealPicker(true);
      return;
    }

    try {
      const dataUrls = await Promise.all(files.map((file) => fileToDataUrl(file)));
      setImages(
        dataUrls,
        type,
        type === "meal" ? pendingMealCategory : null
      );
      router.push("/preview");
    } catch {
      toast.error("图片读取失败，请重试");
    }
  };

  return (
    <MobileShell>
      <header className="mb-6 space-y-2 text-center">
        <p className="text-xs font-medium tracking-widest text-orange-600/80">
          WUTUO COMPANION
        </p>
        <h1 className="text-2xl font-bold text-gray-900">午托伴侣 · 老师端</h1>
        <p className="text-sm text-muted-foreground">
          手拍播报 + 无感监控，AI 帮你生成有温度的家校沟通
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-4">
        <InstitutionSettings />

        {showMealPicker && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="space-y-4 p-5">
              <MealCategoryPicker
                value={pendingMealCategory}
                onChange={setPendingMealCategory}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowMealPicker(false);
                    setPendingMealCategory(null);
                  }}
                >
                  取消
                </Button>
                <Button className="flex-1" onClick={handleMealCategoryConfirm}>
                  选择图片
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <UploadEntryCard
          emoji="📹"
          title="无感监控播报"
          description="接入现有摄像头，定时截帧 + AI 自动解析"
          badge="NEW"
          icon="cctv"
          onSelect={() => router.push("/monitor")}
        />

        <div className="relative flex items-center py-1">
          <div className="flex-1 border-t border-dashed" />
          <span className="px-3 text-xs text-muted-foreground">或手动拍摄</span>
          <div className="flex-1 border-t border-dashed" />
        </div>

        <UploadEntryCard
          emoji={SCENE_CONFIG.meal.emoji}
          title={SCENE_CONFIG.meal.label}
          description={`${SCENE_CONFIG.meal.description}（支持多选）`}
          onSelect={() => handleOpenPicker("meal")}
        />
        <UploadEntryCard
          emoji={SCENE_CONFIG.activity.emoji}
          title={SCENE_CONFIG.activity.label}
          description={`${SCENE_CONFIG.activity.description}（支持多选）`}
          onSelect={() => handleOpenPicker("activity")}
        />
      </main>

      <ImagePicker ref={pickerRef} onFilesSelect={handleFilesSelect} />
    </MobileShell>
  );
}
