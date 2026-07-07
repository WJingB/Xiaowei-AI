import { Skeleton } from "@/components/ui/skeleton";

export function CopyLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        AI 正在分析图片，生成文案中...
      </div>
      {[1, 2, 3].map((item) => (
        <div key={item} className="space-y-2 rounded-2xl border p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}
