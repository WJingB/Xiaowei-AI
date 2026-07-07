"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { CARD_THEMES } from "@/lib/card-themes";
import { formatShareDate } from "@/lib/utils";
import { getSceneTitle, type CaptureMode, type CardThemeId, type MealCategory, type SceneType } from "@/types";
import type { MonitorSlotId } from "@/lib/monitor-config";
import { cn } from "@/lib/utils";

interface ShareCardProps {
  imageDataUrls: string[];
  copyText: string;
  sceneType: SceneType;
  mealCategory?: MealCategory | null;
  themeId?: CardThemeId;
  institutionName?: string;
  institutionLogo?: string | null;
  timestamp?: Date;
  captureMode?: CaptureMode;
  monitorSlotId?: MonitorSlotId | null;
  /** 多张卡片模式下，仅展示指定索引的单张图 */
  singleImageIndex?: number;
}

function CardImages({ urls }: { urls: string[] }) {
  if (urls.length === 1) {
    return (
      <div className="px-6 pt-5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5">
          <Image
            src={urls[0]}
            alt="分享图片"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    );
  }

  if (urls.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-3 px-6 pt-5">
        {urls.map((url, index) => (
          <div
            key={`${url.slice(0, 24)}-${index}`}
            className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5"
          >
            <Image
              src={url}
              alt={`分享图片 ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-6 pt-5">
      {urls.slice(0, 4).map((url, index) => (
        <div
          key={`${url.slice(0, 24)}-${index}`}
          className={cn(
            "relative overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5",
            index === 0 && urls.length === 3 ? "col-span-2 aspect-[2/1]" : "aspect-square"
          )}
        >
          <Image
            src={url}
            alt={`分享图片 ${index + 1}`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard(
    {
      imageDataUrls,
      copyText,
      sceneType,
      mealCategory,
      themeId = "warm-orange",
      institutionName,
      institutionLogo,
      timestamp = new Date(),
      captureMode = "manual",
      monitorSlotId,
      singleImageIndex,
    },
    ref
  ) {
    const theme = CARD_THEMES[themeId];
    const title = getSceneTitle(
      sceneType,
      mealCategory ?? null,
      captureMode,
      monitorSlotId
    );
    const displayUrls =
      singleImageIndex !== undefined
        ? [imageDataUrls[singleImageIndex]]
        : imageDataUrls;

    const showInstitution =
      Boolean(institutionName?.trim()) || Boolean(institutionLogo);

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-3xl shadow-xl ring-1",
          theme.bodyBg,
          theme.borderColor
        )}
      >
        <div className={cn("px-5 py-4", theme.headerGradient, theme.headerText)}>
          <p className="text-xs opacity-90">
            {captureMode === "monitor"
              ? "午托伴侣 · 无感监控播报"
              : "午托伴侣 · 每日播报"}
          </p>
          <h2 className="mt-1 text-lg font-semibold">{title}</h2>
        </div>

        <CardImages urls={displayUrls} />

        <div className="space-y-4 px-6 py-5">
          <p
            className={cn(
              "font-card-copy whitespace-pre-wrap text-[15px] font-normal leading-[2] tracking-[0.04em] text-black"
            )}
          >
            {copyText}
          </p>

          {showInstitution ? (
            <div
              className={cn(
                "flex items-center justify-between border-t border-dashed pt-4",
                theme.footerBorder
              )}
            >
              <div className="flex items-center gap-2">
                {institutionLogo ? (
                  <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-black/5">
                    <Image
                      src={institutionLogo}
                      alt="机构 Logo"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                      theme.logoBg,
                      theme.logoText
                    )}
                  >
                    {institutionName?.trim().charAt(0) ?? "托"}
                  </div>
                )}
                {institutionName?.trim() && (
                  <p className="text-xs font-medium text-gray-800">
                    {institutionName.trim()}
                  </p>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {formatShareDate(timestamp)}
              </p>
            </div>
          ) : (
            <p className="text-right text-[11px] text-muted-foreground">
              {formatShareDate(timestamp)}
            </p>
          )}
        </div>
      </div>
    );
  }
);
