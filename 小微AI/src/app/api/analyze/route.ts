import { NextResponse } from "next/server";
import {
  analyzeImageWithDoubao,
  analyzeMonitorWithDoubao,
} from "@/lib/doubao-server";
import type { MonitorSlotId } from "@/lib/monitor-config";
import type { CaptureMode, MealCategory, SceneType } from "@/types";

export const runtime = "nodejs";

interface AnalyzeRequestBody {
  imageDataList?: string[];
  type?: SceneType;
  mealCategory?: MealCategory | null;
  captureMode?: CaptureMode;
  monitorSlotId?: MonitorSlotId;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody;
    const {
      imageDataList,
      type,
      mealCategory = null,
      captureMode = "manual",
      monitorSlotId,
    } = body;

    const images = imageDataList?.filter((item) => item?.trim()) ?? [];

    if (images.length === 0) {
      return NextResponse.json({ error: "缺少图片数据" }, { status: 400 });
    }

    if (captureMode === "monitor") {
      if (
        monitorSlotId !== "lunch" &&
        monitorSlotId !== "nap" &&
        monitorSlotId !== "homework"
      ) {
        return NextResponse.json({ error: "无效的监控时段" }, { status: 400 });
      }

      const result = await analyzeMonitorWithDoubao(images, monitorSlotId);
      return NextResponse.json(result);
    }

    if (type !== "meal" && type !== "activity") {
      return NextResponse.json({ error: "无效的场景类型" }, { status: 400 });
    }

    const result = await analyzeImageWithDoubao(images, type, mealCategory);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "文案生成失败，请稍后重试";

    console.error("[analyze]", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
