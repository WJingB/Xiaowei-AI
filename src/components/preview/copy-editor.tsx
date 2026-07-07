"use client";

import { Textarea } from "@/components/ui/textarea";

interface CopyEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CopyEditor({ value, onChange, disabled }: CopyEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">手动修改</label>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="选择上方文案后，可在此二次编辑..."
        disabled={disabled}
      />
    </div>
  );
}
