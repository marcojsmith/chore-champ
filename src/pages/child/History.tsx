import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const TYPE_LABELS: Record<string, string> = {
  chore_earned: "Chore",
  reward_spent: "Reward",
  bonus: "Bonus",
  adjustment: "Adjustment",
};

export default function ChildHistory() {
  const me = useQuery(api.users.getMe);
  const childStats = useQuery(api.users.getChildStats, me ? { childId: me._id } : "skip");
  const completedChores = useQuery(api.choreOccurrences.listForChild, { status: "approved" });
  const redemptions = useQuery(api.rewardRedemptions.listForChild);
  const ledger = useQuery(api.tokenLedger.listForChild, { limit: 50 });

  const isLoading = me === undefined || childStats === undefined || completedChores === undefined || redemptions === undefined || ledger === undefined;

  if (isLoading) {
    return (
      <PageContainer title="History">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-40 mt-6" />
          <div className="space-y-2">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="History">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-card border text-center">
            <p className="text-xs text-muted-foreground uppercase">Total Earned</p>
            <p className="text-lg font-bold text-success">{childStats?.totalEarned ?? 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-card border text-center">
            <p className="text-xs text-muted-foreground uppercase">Total Spent</p>
            <p className="text-lg font-bold text-destructive">{childStats?.totalSpent ?? 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-card border text-center">
            <p className="text-xs text-muted-foreground uppercase">Chores Done</p>
            <p className="text-lg font-bold text-primary">{completedChores?.length ?? 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-card border text-center">
            <p className="text-xs text-muted-foreground uppercase">Rewards Claimed</p>
            <p className="text-lg font-bold text-accent">{redemptions?.length ?? 0}</p>
          </div>
        </div>

        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mt-6">
          Token Activity
        </h2>
        {(!ledger || ledger.length === 0)
          ? <p className="text-sm text-muted-foreground">No token activity yet</p>
          : ledger.map(entry => (
            <div key={entry._id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${entry.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {entry.amount >= 0 ? '+' : ''}{entry.amount}
                </span>
                <div>
                  <p className="text-sm font-medium">{TYPE_LABELS[entry.type] ?? entry.type}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(entry._creationTime), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <TokenBadge amount={Math.abs(entry.amount)} size="sm" />
            </div>
          ))
        }

        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mt-6">
          Completed Chores
        </h2>
        {(!completedChores || completedChores.length === 0)
          ? <p className="text-sm text-muted-foreground">No completed chores yet</p>
          : completedChores.map(o => (
            <div key={o._id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
              <div>
                <p className="text-sm font-medium">Chore #{String(o.choreId).slice(-6)}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(o.dueDate), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex items-center gap-2">
                {o.tokensEarned != null && <TokenBadge amount={o.tokensEarned} size="sm" />}
                <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">Approved</span>
              </div>
            </div>
          ))
        }

        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mt-6">
          Reward Requests
        </h2>
        {(!redemptions || redemptions.length === 0)
          ? <p className="text-sm text-muted-foreground">No reward requests yet</p>
          : redemptions.map(r => (
            <div key={r._id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
              <div>
                <p className="text-sm font-medium">Reward #{String(r.rewardId).slice(-6)}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(r._creationTime), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex items-center gap-2">
                <TokenBadge amount={r.tokenCost} size="sm" />
                <span className={r.status === 'approved' ? 'text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium' :
                  r.status === 'rejected' ? 'text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium' :
                  'text-xs px-2 py-1 rounded-full bg-warning/10 text-warning font-medium'}>
                  {r.status}
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </PageContainer>
  );
}
