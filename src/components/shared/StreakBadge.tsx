import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  if (streak === 0) return null;
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full text-xs font-semibold px-2 py-0.5 bg-streak/15 text-streak',
      className,
    )}>
      🔥 {streak}
    </span>
  );
}
