"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
} from "react";
import type { SceneType } from "@/types";

export interface ImagePickerHandle {
  open: (type: SceneType, multiple?: boolean) => void;
}

interface ImagePickerProps {
  onFilesSelect: (files: File[], type: SceneType) => void;
}

export const ImagePicker = forwardRef<ImagePickerHandle, ImagePickerProps>(
  function ImagePicker({ onFilesSelect }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const pendingTypeRef = useRef<SceneType | null>(null);
    const multipleRef = useRef(false);

    useImperativeHandle(ref, () => ({
      open(type: SceneType, multiple = true) {
        pendingTypeRef.current = type;
        multipleRef.current = multiple;
        if (inputRef.current) {
          inputRef.current.multiple = multiple;
          inputRef.current.click();
        }
      },
    }));

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      const type = pendingTypeRef.current;
      if (files.length > 0 && type) {
        onFilesSelect(files, type);
      }
      event.target.value = "";
      pendingTypeRef.current = null;
    };

    return (
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    );
  }
);
