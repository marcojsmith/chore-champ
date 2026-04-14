import type { Child } from '@/mocks/data';
import { ProgressRing } from './ProgressRing';
import { StreakBadge } from './StreakBadge';
import { tokenSummaries } from '@/mocks/data';
import { TokenBadge } from './TokenBadge';
import { cn } from '@/lib/utils';

interface ChildProfileCardProps {
  child: Child;
  onClick?: () => void;
}

export function ChildProfileCard({ child, onClick }: ChildProfileCardProps) {
  const summary = tokenSummaries.find(s => s.childId === child.id);
  return (
    <div
      className={cn(
        'bg-card border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20',
      )}
      style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.07)' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-2xl border border-primary/10 shrink-0">
          {child.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-base leading-tight">{child.name}</p>
          <p className="text-xs text-muted-foreground">Age {child.age}</p>
        </div>
        <ProgressRing value={child.completionRate} size={44} strokeWidth={4}>
          <span className="text-[9px] font-bold text-foreground">{child.completionRate}%</span>
        </ProgressRing>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <StreakBadge streak={child.currentStreak} />
        {summary && <TokenBadge amount={summary.available} size="sm" />}
      </div>
    </div>
  );
}