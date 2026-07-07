import type {
  CaptureMode,
  DoubaoAnalysisResult,
  MealCategory,
  MonitorSlotId,
  SceneType,
} from "@/types";

export interface AnalyzeRequest {
  imageDataList: string[];
  type?: SceneType;
  mealCategory?: MealCategory | null;
  captureMode?: CaptureMode;
  monitorSlotId?: MonitorSlotId;
}

/**
 * 客户端调用入口：请求服务端 /api/analyze
 */
export async function fetchDoubaoAnalysis(
  imageDataList: string[],
  type: SceneType,
  mealCategory?: MealCategory | null
): Promise<DoubaoAnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageDataList,
      type,
      mealCategory,
      captureMode: "manual",
    }),
  });

  const data = (await response.json()) as DoubaoAnalysisResult & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "文案生成失败，请稍后重试");
  }

  return { options: data.options, analysis: data.analysis };
}

/**
 * 监控无感解析：上传监控截帧（或未来 RTSP 自动截帧）后调用
 */
export async function fetchMonitorAnalysis(
  imageDataList: string[],
  monitorSlotId: MonitorSlotId
): Promise<DoubaoAnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageDataList,
      captureMode: "monitor",
      monitorSlotId,
    }),
  });

  const data = (await response.json()) as DoubaoAnalysisResult & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "监控解析失败，请稍后重试");
  }

  return { options: data.options, analysis: data.analysis };
}

export type {
  DoubaoAnalysisResult,
  SceneType,
  MealCategory,
  MonitorSlotId,
  CaptureMode,
};
