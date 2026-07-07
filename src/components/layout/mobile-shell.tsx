import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/80 to-white">
      <div
        className={cn(
          "mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-8 pt-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
