import type { Child } from '@/mocks/data';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressRing } from './ProgressRing';
import { StreakBadge } from './StreakBadge';
import { tokenSummaries } from '@/mocks/data';
import { TokenBadge } from './TokenBadge';

interface ChildProfileCardProps {
  child: Child;
  onClick?: () => void;
}

export function ChildProfileCard({ child, onClick }: ChildProfileCardProps) {
  const summary = tokenSummaries.find(s => s.childId === child.id);
  return (
    <Card className="border card-hover cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{child.avatar}</span>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-base">{child.name}</p>
            <p className="text-xs text-muted-foreground">Age {child.age}</p>
          </div>
          <ProgressRing value={child.completionRate} size={48} strokeWidth={4}>
            <span className="text-[10px] font-bold">{child.completionRate}%</span>
          </ProgressRing>
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge streak={child.currentStreak} />
          {summary && <TokenBadge amount={summary.available} size="sm" />}
        </div>
      </CardContent>
    </Card>
  );
}
