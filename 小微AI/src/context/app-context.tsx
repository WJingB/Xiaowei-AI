"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadInstitutionLogo,
  loadInstitutionName,
  saveInstitutionLogo,
  saveInstitutionName,
} from "@/lib/institution-storage";
import { MONITOR_SLOTS } from "@/lib/monitor-config";
import type { MonitorAnalysisMeta, MonitorSlotId } from "@/lib/monitor-config";
import type {
  AppContextValue,
  CaptureMode,
  CardLayoutMode,
  CardThemeId,
  CopyOption,
  MealCategory,
  SceneType,
} from "@/types";

const sessionInitialState = {
  imageDataUrls: [] as string[],
  sceneType: null as SceneType | null,
  mealCategory: null as MealCategory | null,
  copyOptions: [] as CopyOption[],
  selectedCopyId: null as string | null,
  editedCopy: "",
  isAnalyzing: false,
  cardLayoutMode: "merged" as CardLayoutMode,
  captureMode: "manual" as CaptureMode,
  monitorSlotId: null as MonitorSlotId | null,
  monitorAnalysis: null as MonitorAnalysisMeta | null,
  privacyBlurEnabled: false,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [imageDataUrls, setImageDataUrls] = useState<string[]>(
    sessionInitialState.imageDataUrls
  );
  const [sceneType, setSceneType] = useState<SceneType | null>(
    sessionInitialState.sceneType
  );
  const [mealCategory, setMealCategory] = useState<MealCategory | null>(
    sessionInitialState.mealCategory
  );
  const [copyOptions, setCopyOptions] = useState<CopyOption[]>(
    sessionInitialState.copyOptions
  );
  const [selectedCopyId, setSelectedCopyId] = useState<string | null>(
    sessionInitialState.selectedCopyId
  );
  const [editedCopy, setEditedCopy] = useState(sessionInitialState.editedCopy);
  const [isAnalyzing, setIsAnalyzing] = useState(sessionInitialState.isAnalyzing);
  const [cardLayoutMode, setCardLayoutMode] = useState<CardLayoutMode>(
    sessionInitialState.cardLayoutMode
  );
  const [cardTheme, setCardTheme] = useState<CardThemeId>("warm-orange");
  const [captureMode, setCaptureMode] = useState<CaptureMode>(
    sessionInitialState.captureMode
  );
  const [monitorSlotId, setMonitorSlotId] = useState<MonitorSlotId | null>(
    sessionInitialState.monitorSlotId
  );
  const [monitorAnalysis, setMonitorAnalysis] =
    useState<MonitorAnalysisMeta | null>(sessionInitialState.monitorAnalysis);
  const [privacyBlurEnabled, setPrivacyBlurEnabled] = useState(
    sessionInitialState.privacyBlurEnabled
  );

  const [institutionName, setInstitutionNameState] = useState("");
  const [institutionLogo, setInstitutionLogoState] = useState<string | null>(
    null
  );
  const [institutionLoaded, setInstitutionLoaded] = useState(false);

  useEffect(() => {
    setInstitutionNameState(loadInstitutionName());
    setInstitutionLogoState(loadInstitutionLogo());
    setInstitutionLoaded(true);
  }, []);

  const setInstitutionName = useCallback((name: string) => {
    setInstitutionNameState(name);
    saveInstitutionName(name);
  }, []);

  const setInstitutionLogo = useCallback((logo: string | null) => {
    setInstitutionLogoState(logo);
    saveInstitutionLogo(logo);
  }, []);

  const resetAnalysisState = useCallback(() => {
    setCopyOptions([]);
    setSelectedCopyId(null);
    setEditedCopy("");
    setIsAnalyzing(false);
    setMonitorAnalysis(null);
  }, []);

  const setImages = useCallback(
    (
      dataUrls: string[],
      type: SceneType,
      category: MealCategory | null = null
    ) => {
      setImageDataUrls(dataUrls);
      setSceneType(type);
      setMealCategory(type === "meal" ? category : null);
      setCaptureMode("manual");
      setMonitorSlotId(null);
      setPrivacyBlurEnabled(false);
      setCardLayoutMode(dataUrls.length > 1 ? "merged" : "merged");
      resetAnalysisState();
    },
    [resetAnalysisState]
  );

  const setMonitorCapture = useCallback(
    (dataUrls: string[], slotId: MonitorSlotId, privacyBlur: boolean) => {
      const slot = MONITOR_SLOTS[slotId];
      setImageDataUrls(dataUrls);
      setSceneType(slot.sceneType);
      setMealCategory(slot.mealCategory);
      setCaptureMode("monitor");
      setMonitorSlotId(slotId);
      setPrivacyBlurEnabled(privacyBlur);
      setCardLayoutMode(dataUrls.length > 1 ? "merged" : "merged");
      resetAnalysisState();
    },
    [resetAnalysisState]
  );

  const resetSession = useCallback(() => {
    setImageDataUrls(sessionInitialState.imageDataUrls);
    setSceneType(sessionInitialState.sceneType);
    setMealCategory(sessionInitialState.mealCategory);
    setCopyOptions(sessionInitialState.copyOptions);
    setSelectedCopyId(sessionInitialState.selectedCopyId);
    setEditedCopy(sessionInitialState.editedCopy);
    setIsAnalyzing(sessionInitialState.isAnalyzing);
    setCardLayoutMode(sessionInitialState.cardLayoutMode);
    setCaptureMode(sessionInitialState.captureMode);
    setMonitorSlotId(sessionInitialState.monitorSlotId);
    setMonitorAnalysis(sessionInitialState.monitorAnalysis);
    setPrivacyBlurEnabled(sessionInitialState.privacyBlurEnabled);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      imageDataUrls,
      sceneType,
      mealCategory,
      copyOptions,
      selectedCopyId,
      editedCopy,
      isAnalyzing,
      institutionName,
      institutionLogo,
      cardTheme,
      cardLayoutMode,
      captureMode,
      monitorSlotId,
      monitorAnalysis,
      privacyBlurEnabled,
      setImages,
      setMonitorCapture,
      setCopyOptions,
      setSelectedCopyId,
      setEditedCopy,
      setIsAnalyzing,
      setInstitutionName,
      setInstitutionLogo,
      setCardTheme,
      setCardLayoutMode,
      setMonitorAnalysis,
      resetSession,
    }),
    [
      imageDataUrls,
      sceneType,
      mealCategory,
      copyOptions,
      selectedCopyId,
      editedCopy,
      isAnalyzing,
      institutionName,
      institutionLogo,
      cardTheme,
      cardLayoutMode,
      captureMode,
      monitorSlotId,
      monitorAnalysis,
      privacyBlurEnabled,
      setImages,
      setMonitorCapture,
      setInstitutionName,
      setInstitutionLogo,
      resetSession,
    ]
  );

  if (!institutionLoaded) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
