import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { MetricCard } from '@/components/shared/MetricCard';
import { TokenBalanceWidget } from '@/components/shared/TokenBalanceWidget';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, ListChecks, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChildDashboard() {
  const navigate = useNavigate();

  const me = useQuery(api.users.getMe);
  const childStats = useQuery(api.users.getChildStats, me ? { childId: me._id } : "skip");
  const occurrences = useQuery(api.choreOccurrences.listForChild, {});
  const rewards = useQuery(api.rewards.listForChild);

  const todayDue = occurrences?.filter(o => o.status === "due" || o.status === "in_progress") ?? [];
  const overdue = occurrences?.filter(o => o.status === "overdue") ?? [];
  const completed = occurrences?.filter(o => o.status === "approved") ?? [];
  const myRewards = rewards?.slice(0, 3) ?? [];

  const isLoading = me === undefined || childStats === undefined || occurrences === undefined || rewards === undefined;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-32 bg-muted rounded-xl animate-pulse" />
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-20 bg-muted rounded-lg animate-pulse" />
            <div className="h-20 bg-muted rounded-lg animate-pulse" />
            <div className="h-20 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </PageContainer>
    );
  }

  const childName = me?.name ?? "there";

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold font-display">Hey {childName}! 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your day at a glance</p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <TokenBalanceWidget
            available={childStats?.tokenBalance ?? 0}
            reserved={childStats?.tokensReserved ?? 0}
            totalEarned={childStats?.totalEarned ?? 0}
            totalSpent={childStats?.totalSpent ?? 0}
            earnedThisWeek={childStats?.earnedThisWeek ?? 0}
          />
        </div>

        <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <StreakBadge streak={childStats?.currentStreak ?? 0} />
          <span className="text-xs text-muted-foreground">Best: {childStats?.longestStreak ?? 0} days</span>
        </div>

        <div className="grid grid-cols-3 gap-2 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <MetricCard title="Due" value={todayDue.length} icon={<ListChecks size={16} />} variant="primary" />
          <MetricCard title="Done" value={completed.length} icon={<CheckCircle2 size={16} />} variant="success" />
          <MetricCard title="Overdue" value={overdue.length} icon={<AlertTriangle size={16} />} variant="destructive" />
        </div>

        {overdue.length > 0 && (
          <Card className="border border-destructive/20 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2 text-destructive">
                <AlertTriangle size={16} /> Overdue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {overdue.map(o => (
                <div
                  key={o._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/child/chores/${o._id}`)}
                >
                  <div>
                    <p className="text-sm font-medium">Chore #{String(o.choreId).slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">Due {new Date(o.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs font-medium text-destructive">Overdue</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {todayDue.length > 0 && (
          <Card className="border animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">Today's Chores</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {todayDue.map(o => (
                <div
                  key={o._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/child/chores/${o._id}`)}
                >
                  <div>
                    <p className="text-sm font-medium">Chore #{String(o.choreId).slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">Due {new Date(o.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs font-medium text-primary">{o.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {todayDue.length === 0 && overdue.length === 0 && (
          <EmptyState variant="done" />
        )}

        <Card className="border animate-fade-in-up" style={{ animationDelay: '240ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Trophy size={16} className="text-accent" /> Available Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {myRewards.map(r => (
              <div
                key={r._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/child/rewards/${r._id}`)}
              >
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  {r.imageEmoji ? <span className="text-xl">{r.imageEmoji}</span> : <Trophy size={20} className="text-accent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.tokenCost} tokens</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
