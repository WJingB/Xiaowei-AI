import type { MealCategory, SceneType } from "@/types";

export type MonitorSlotId = "lunch" | "nap" | "homework";

export type CaptureMode = "manual" | "monitor";

export interface MonitorSlotConfig {
  id: MonitorSlotId;
  label: string;
  emoji: string;
  location: string;
  timeRange: string;
  description: string;
  /** 映射到手拍流程的场景类型，用于卡片展示 */
  sceneType: SceneType;
  mealCategory: MealCategory | null;
}

export const MONITOR_SLOTS: Record<MonitorSlotId, MonitorSlotConfig> = {
  lunch: {
    id: "lunch",
    label: "午餐就餐",
    emoji: "🍱",
    location: "餐厅摄像头",
    timeRange: "12:00 - 12:30",
    description: "自动抓拍餐厅画面，分析就餐秩序与氛围",
    sceneType: "meal",
    mealCategory: "lunch",
  },
  nap: {
    id: "nap",
    label: "午休监护",
    emoji: "😴",
    location: "午休室摄像头",
    timeRange: "13:00 - 14:00",
    description: "自动抓拍午休室画面，分析休息状态",
    sceneType: "activity",
    mealCategory: null,
  },
  homework: {
    id: "homework",
    label: "作业辅导",
    emoji: "✏️",
    location: "教室摄像头",
    timeRange: "16:00 - 18:00",
    description: "自动抓拍教室画面，分析学习专注度",
    sceneType: "activity",
    mealCategory: null,
  },
};

export const MONITOR_SLOT_LIST = Object.values(MONITOR_SLOTS);

/** 根据当前时间推荐监控时段（演示用） */
export function suggestMonitorSlot(now = new Date()): MonitorSlotId {
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 12 * 60 && totalMinutes < 13 * 60) return "lunch";
  if (totalMinutes >= 13 * 60 && totalMinutes < 14 * 60) return "nap";
  if (totalMinutes >= 16 * 60 && totalMinutes < 18 * 60) return "homework";

  // 默认推荐午餐（演示）
  return "lunch";
}

export function isSlotActive(slotId: MonitorSlotId, now = new Date()): boolean {
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;

  switch (slotId) {
    case "lunch":
      return totalMinutes >= 12 * 60 && totalMinutes < 12 * 60 + 30;
    case "nap":
      return totalMinutes >= 13 * 60 && totalMinutes < 14 * 60;
    case "homework":
      return totalMinutes >= 16 * 60 && totalMinutes < 18 * 60;
    default:
      return false;
  }
}

export interface MonitorAnalysisMeta {
  slotId: MonitorSlotId;
  detectedBehavior: string;
  atmosphere: string;
  qualityScore: number;
  qualityPass: boolean;
  summary: string;
}

export interface MonitorDoubaoAnalysisResult {
  options: import("@/types").CopyOption[];
  analysis: MonitorAnalysisMeta;
}
