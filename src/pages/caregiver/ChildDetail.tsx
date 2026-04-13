import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/shared/PageContainer';
import { MetricCard } from '@/components/shared/MetricCard';
import { TokenBalanceWidget } from '@/components/shared/TokenBalanceWidget';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { children, tokenSummaries, choreOccurrences, rewardRequests } from '@/mocks/data';
import { ArrowLeft, CheckCircle2, Flame, Target } from 'lucide-react';
import { format } from 'date-fns';

export default function ChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const child = children.find(c => c.id === id);
  if (!child) return <PageContainer title="Not Found"><p>Child not found.</p></PageContainer>;

  const summary = tokenSummaries.find(s => s.childId === child.id)!;
  const chores = choreOccurrences.filter(o => o.childId === child.id);
  const rewards = rewardRequests.filter(r => r.childId === child.id);

  return (
    <PageContainer
      title={child.name}
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/app/children')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{child.avatar}</span>
          <div>
            <h2 className="text-xl font-bold font-display">{child.name}</h2>
            <p className="text-muted-foreground">Age {child.age}</p>
            <div className="flex gap-2 mt-1">
              <StreakBadge streak={child.currentStreak} />
            </div>
          </div>
          <div className="ml-auto">
            <ProgressRing value={child.completionRate} size={64} strokeWidth={5}>
              <span className="text-sm font-bold">{child.completionRate}%</span>
            </ProgressRing>
          </div>
        </div>

        <TokenBalanceWidget
          available={summary.available}
          reserved={summary.reserved}
          totalEarned={summary.totalEarned}
          totalSpent={summary.totalSpent}
          earnedThisWeek={summary.earnedThisWeek}
        />

        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Completion" value={`${child.completionRate}%`} icon={<Target size={16} />} variant="primary" />
          <MetricCard title="Current Streak" value={child.currentStreak} icon={<Flame size={16} />} variant="streak" />
          <MetricCard title="Best Streak" value={child.longestStreak} icon={<CheckCircle2 size={16} />} variant="success" />
        </div>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Recent Chores</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {chores.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{o.choreTitle}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(o.dueDate), 'MMM d')}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Reward Requests</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {rewards.length === 0
              ? <p className="text-sm text-muted-foreground">No reward requests yet</p>
              : rewards.map(r => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{r.rewardTitle}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(r.requestedAt), 'MMM d')}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
