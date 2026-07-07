import type { CardThemeId } from "@/types";

export interface CardTheme {
  id: CardThemeId;
  name: string;
  preview: string;
  headerGradient: string;
  headerText: string;
  bodyBg: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  footerBorder: string;
  logoBg: string;
  logoText: string;
}

export const CARD_THEMES: Record<CardThemeId, CardTheme> = {
  "warm-orange": {
    id: "warm-orange",
    name: "暖阳橙",
    preview: "bg-gradient-to-br from-orange-500 to-amber-400",
    headerGradient: "bg-gradient-to-r from-orange-500 to-amber-400",
    headerText: "text-white",
    bodyBg: "bg-white",
    textColor: "text-gray-700",
    accentColor: "text-orange-600",
    borderColor: "ring-black/5",
    footerBorder: "border-orange-100",
    logoBg: "bg-orange-100",
    logoText: "text-orange-600",
  },
  "fresh-green": {
    id: "fresh-green",
    name: "清新绿",
    preview: "bg-gradient-to-br from-emerald-500 to-teal-400",
    headerGradient: "bg-gradient-to-r from-emerald-500 to-teal-400",
    headerText: "text-white",
    bodyBg: "bg-emerald-50/30",
    textColor: "text-gray-700",
    accentColor: "text-emerald-600",
    borderColor: "ring-emerald-100",
    footerBorder: "border-emerald-100",
    logoBg: "bg-emerald-100",
    logoText: "text-emerald-600",
  },
  "elegant-purple": {
    id: "elegant-purple",
    name: "典雅紫",
    preview: "bg-gradient-to-br from-violet-500 to-purple-400",
    headerGradient: "bg-gradient-to-r from-violet-500 to-purple-400",
    headerText: "text-white",
    bodyBg: "bg-violet-50/30",
    textColor: "text-gray-700",
    accentColor: "text-violet-600",
    borderColor: "ring-violet-100",
    footerBorder: "border-violet-100",
    logoBg: "bg-violet-100",
    logoText: "text-violet-600",
  },
  "classic-blue": {
    id: "classic-blue",
    name: "经典蓝",
    preview: "bg-gradient-to-br from-blue-500 to-sky-400",
    headerGradient: "bg-gradient-to-r from-blue-500 to-sky-400",
    headerText: "text-white",
    bodyBg: "bg-sky-50/30",
    textColor: "text-gray-700",
    accentColor: "text-blue-600",
    borderColor: "ring-blue-100",
    footerBorder: "border-blue-100",
    logoBg: "bg-blue-100",
    logoText: "text-blue-600",
  },
  "playful-pink": {
    id: "playful-pink",
    name: "活力粉",
    preview: "bg-gradient-to-br from-rose-400 to-pink-400",
    headerGradient: "bg-gradient-to-r from-rose-400 to-pink-400",
    headerText: "text-white",
    bodyBg: "bg-rose-50/30",
    textColor: "text-gray-700",
    accentColor: "text-rose-500",
    borderColor: "ring-rose-100",
    footerBorder: "border-rose-100",
    logoBg: "bg-rose-100",
    logoText: "text-rose-500",
  },
};

export const CARD_THEME_LIST = Object.values(CARD_THEMES);
