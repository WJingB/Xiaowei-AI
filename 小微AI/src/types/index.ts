import { cn } from "@/lib/utils";
import { MONITOR_SLOTS } from "@/lib/monitor-config";
import type { CaptureMode, MonitorAnalysisMeta, MonitorSlotId } from "@/lib/monitor-config";

export type { CaptureMode, MonitorAnalysisMeta, MonitorSlotId };

export type SceneType = "meal" | "activity";

export type MealCategory =
  | "lunch"
  | "dinner"
  | "snack"
  | "breakfast"
  | "fruit";

export type CardThemeId =
  | "warm-orange"
  | "fresh-green"
  | "elegant-purple"
  | "classic-blue"
  | "playful-pink";

export type CardLayoutMode = "merged" | "multiple";

export interface CopyOption {
  id: string;
  tone: "professional" | "warm" | "playful";
  toneLabel: string;
  content: string;
}

export interface DoubaoAnalysisResult {
  options: CopyOption[];
  analysis?: MonitorAnalysisMeta;
}

export interface InstitutionInfo {
  name: string;
  logoDataUrl: string | null;
}

export interface AppState {
  imageDataUrls: string[];
  sceneType: SceneType | null;
  mealCategory: MealCategory | null;
  copyOptions: CopyOption[];
  selectedCopyId: string | null;
  editedCopy: string;
  isAnalyzing: boolean;
  institutionName: string;
  institutionLogo: string | null;
  cardTheme: CardThemeId;
  cardLayoutMode: CardLayoutMode;
  captureMode: CaptureMode;
  monitorSlotId: MonitorSlotId | null;
  monitorAnalysis: MonitorAnalysisMeta | null;
  privacyBlurEnabled: boolean;
}

export interface AppContextValue extends AppState {
  setImages: (
    dataUrls: string[],
    type: SceneType,
    mealCategory?: MealCategory | null
  ) => void;
  setMonitorCapture: (
    dataUrls: string[],
    slotId: MonitorSlotId,
    privacyBlur: boolean
  ) => void;
  setCopyOptions: (options: CopyOption[]) => void;
  setSelectedCopyId: (id: string) => void;
  setEditedCopy: (text: string) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setInstitutionName: (name: string) => void;
  setInstitutionLogo: (logo: string | null) => void;
  setCardTheme: (theme: CardThemeId) => void;
  setCardLayoutMode: (mode: CardLayoutMode) => void;
  setMonitorAnalysis: (analysis: MonitorAnalysisMeta | null) => void;
  resetSession: () => void;
}

export const SCENE_CONFIG: Record<
  SceneType,
  { label: string; emoji: string; description: string }
> = {
  meal: {
    label: "食安与营养播报",
    emoji: "🍽️",
    description: "拍摄生鲜食材、刚出锅的饭菜",
  },
  activity: {
    label: "课堂与午休剪影",
    emoji: "📸",
    description: "拍摄孩子写作业、午休的场景",
  },
};

export const MEAL_CATEGORY_CONFIG: Record<
  MealCategory,
  { label: string; emoji: string }
> = {
  lunch: { label: "午饭", emoji: "🍱" },
  dinner: { label: "晚饭", emoji: "🥘" },
  snack: { label: "点心/零食", emoji: "🍪" },
  breakfast: { label: "早餐", emoji: "🥐" },
  fruit: { label: "水果", emoji: "🍎" },
};

export function getSelectedCopy(
  options: CopyOption[],
  selectedId: string | null
): CopyOption | undefined {
  return options.find((option) => option.id === selectedId);
}

export function getSceneTitle(
  sceneType: SceneType,
  mealCategory: MealCategory | null,
  captureMode?: CaptureMode,
  monitorSlotId?: MonitorSlotId | null
): string {
  if (captureMode === "monitor" && monitorSlotId) {
    const slot = MONITOR_SLOTS[monitorSlotId];
    return `${slot.emoji} ${slot.label} · 无感播报`;
  }
  if (sceneType === "meal" && mealCategory) {
    const meal = MEAL_CATEGORY_CONFIG[mealCategory];
    return `${meal.emoji} ${meal.label} · 食安播报`;
  }
  return `${SCENE_CONFIG[sceneType].emoji} ${SCENE_CONFIG[sceneType].label}`;
}

export { cn };
