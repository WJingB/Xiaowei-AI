"use client";

import Image from "next/image";
import { getSceneTitle, SCENE_CONFIG, type CaptureMode, type SceneType } from "@/types";
import type { MealCategory } from "@/types";

interface ImagePreviewHeaderProps {
  imageDataUrls: string[];
  sceneType: SceneType;
  mealCategory?: MealCategory | null;
  captureMode?: CaptureMode;
}

export function ImagePreviewHeader({
  imageDataUrls,
  sceneType,
  mealCategory,
  captureMode = "manual",
}: ImagePreviewHeaderProps) {
  const scene = SCENE_CONFIG[sceneType];
  const title = getSceneTitle(sceneType, mealCategory ?? null, captureMode);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{title}</span>
        <span>
          {captureMode === "monitor" ? "监控截帧" : ""} {imageDataUrls.length} 张
        </span>
      </div>

      {imageDataUrls.length === 1 ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted shadow-sm">
          <Image
            src={imageDataUrls[0]}
            alt="上传预览"
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {imageDataUrls.map((url, index) => (
            <div
              key={`${url.slice(0, 32)}-${index}`}
              className="relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm"
            >
              <Image
                src={url}
                alt={`上传预览 ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">{scene.description}</p>
    </div>
  );
}
