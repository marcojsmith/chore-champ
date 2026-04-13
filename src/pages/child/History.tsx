import { useCurrentChild } from '@/hooks/useCurrentChild';
import { PageContainer } from '@/components/shared/PageContainer';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { choreOccurrences, rewardRequests } from '@/mocks/data';
import { format } from 'date-fns';

export default function ChildHistory() {
  const child = useCurrentChild();

  const chores = choreOccurrences.filter(
    o => o.childId === child.id && ['completed', 'approved'].includes(o.status)
  );
  const rewards = rewardRequests.filter(r => r.childId === child.id);

  return (
    <PageContainer title="History">
      <div className="space-y-4">
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Completed Chores
        </h2>
        {chores.length === 0
          ? <p className="text-sm text-muted-foreground">No completed chores yet</p>
          : chores.map(o => (
            <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
              <div>
                <p className="text-sm font-medium">{o.choreTitle}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(o.dueDate), 'MMM d')}</p>
              </div>
              <div className="flex items-center gap-2">
                {o.tokensEarned != null && <TokenBadge amount={o.tokensEarned} size="sm" />}
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))
        }

        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mt-6">
          Reward Requests
        </h2>
        {rewards.length === 0
          ? <p className="text-sm text-muted-foreground">No reward requests yet</p>
          : rewards.map(r => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
              <div>
                <p className="text-sm font-medium">{r.rewardTitle}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(r.requestedAt), 'MMM d')}</p>
              </div>
              <div className="flex items-center gap-2">
                <TokenBadge amount={r.tokenCost} size="sm" />
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))
        }
      </div>
    </PageContainer>
  );
}
