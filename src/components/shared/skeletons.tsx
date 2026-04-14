import { Skeleton } from '@/components/ui/skeleton';

export function ChoreCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 card-base">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-4/5" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function RewardCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-1.5 w-full rounded-full mt-3" />
    </div>
  );
}

export function MetricBarSkeleton() {
  return (
    <div className="flex overflow-x-auto divide-x divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center py-4 px-2 gap-1 shrink-0 min-w-[90px]"
        >
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

export function ChildProfileCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-4 card-base">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-11 w-11 rounded-full" />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function NotificationItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-2 w-1/4" />
      </div>
    </div>
  );
}