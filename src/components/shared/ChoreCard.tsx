import type { ChoreTemplate, ChoreOccurrence } from '@/mocks/data';
import { Card, CardContent } from '@/components/ui/card';
import { TokenBadge } from './TokenBadge';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';
import { Clock, Repeat } from 'lucide-react';

const recurrenceLabel: Record<ChoreTemplate['recurrence'], string> = {
  once: 'One-time', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly',
};

interface ChoreCardProps {
  chore: ChoreTemplate;
  occurrence?: ChoreOccurrence;
  compact?: boolean;
  onClick?: () => void;
}

export function ChoreCard({ chore, occurrence, compact, onClick }: ChoreCardProps) {
  if (compact && occurrence) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted border border-transparent hover:border-border/50 transition-all duration-150 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{chore.title}</p>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
            <Clock size={11} /> Due {chore.dueTime}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <StatusBadge status={occurrence.status} />
          <TokenBadge amount={chore.baseTokens} size="sm" />
        </div>
      </button>
    );
  }

  return (
    <Card
      className={cn('rounded-xl border card-hover cursor-pointer', !chore.isActive && 'opacity-60')}
      onClick={onClick}
      style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm truncate">{chore.title}</p>
              {!chore.isActive && (
                <span className="text-[10px] bg-muted text-muted-foreground rounded-full px-2 py-0.5 shrink-0">Archived</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate mb-2">{chore.description}</p>
            <div className="flex flex-wrap gap-2 items-center">
              {occurrence ? (
                <StatusBadge status={occurrence.status} />
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Repeat size={11} /> {recurrenceLabel[chore.recurrence]}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={11} /> {chore.dueTime}
                  </span>
                  <span className={cn(
                    'text-[10px] rounded-full px-2 py-0.5',
                    chore.isRequired ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    {chore.isRequired ? 'Required' : 'Optional'}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <TokenBadge amount={chore.baseTokens} size="sm" />
            {!occurrence && (
              <span className="text-[10px] text-muted-foreground">
                {chore.assignedChildIds.length} child{chore.assignedChildIds.length !== 1 ? 'ren' : ''}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
