"use client";

import { cn } from "@/lib/utils";
import { MEAL_CATEGORY_CONFIG, type MealCategory } from "@/types";

interface MealCategoryPickerProps {
  value: MealCategory | null;
  onChange: (category: MealCategory) => void;
}

export function MealCategoryPicker({ value, onChange }: MealCategoryPickerProps) {
  const categories = Object.entries(MEAL_CATEGORY_CONFIG) as [
    MealCategory,
    (typeof MEAL_CATEGORY_CONFIG)[MealCategory],
  ][];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">选择餐次</p>
      <div className="grid grid-cols-3 gap-2">
        {categories.map(([key, config]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "rounded-xl border px-2 py-3 text-center text-xs transition-all active:scale-[0.98]",
              value === key
                ? "border-orange-400 bg-orange-50 text-orange-700 ring-2 ring-orange-200"
                : "border-border bg-white hover:border-orange-200"
            )}
          >
            <span className="block text-lg">{config.emoji}</span>
            <span className="mt-1 block font-medium">{config.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
