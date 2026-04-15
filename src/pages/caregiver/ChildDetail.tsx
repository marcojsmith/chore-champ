import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { PageContainer } from '@/components/shared/PageContainer';
import { MetricCard } from '@/components/shared/MetricCard';
import { TokenBalanceWidget } from '@/components/shared/TokenBalanceWidget';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Flame, Target } from 'lucide-react';

export default function ChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const childData = useQuery(api.users.getChild, id ? { childId: id as Id<"users"> } : "skip");

  if (!id) return <PageContainer title="Not Found"><p>Child not found.</p></PageContainer>;
  
  if (childData === undefined) {
    return <PageContainer title="Loading..."><div className="animate-pulse">Loading...</div></PageContainer>;
  }

  if (!childData) return <PageContainer title="Not Found"><p>Child not found.</p></PageContainer>;

  const { user: child, stats } = childData;

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
            <p className="text-muted-foreground">Age {child.age ?? 'N/A'}</p>
            <div className="flex gap-2 mt-1">
              <StreakBadge streak={stats?.currentStreak ?? 0} />
            </div>
          </div>
          <div className="ml-auto">
            <ProgressRing value={stats?.completionRate ?? 0} size={64} strokeWidth={5}>
              <span className="text-sm font-bold">{stats?.completionRate ?? 0}%</span>
            </ProgressRing>
          </div>
        </div>

        <TokenBalanceWidget
          available={stats?.tokenBalance ?? 0}
          reserved={stats?.tokensReserved ?? 0}
          totalEarned={stats?.totalEarned ?? 0}
          totalSpent={stats?.totalSpent ?? 0}
          earnedThisWeek={stats?.earnedThisWeek ?? 0}
        />

        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Completion" value={`${stats?.completionRate ?? 0}%`} icon={<Target size={16} />} variant="primary" />
          <MetricCard title="Current Streak" value={stats?.currentStreak ?? 0} icon={<Flame size={16} />} variant="streak" />
          <MetricCard title="Best Streak" value={stats?.longestStreak ?? 0} icon={<CheckCircle2 size={16} />} variant="success" />
        </div>
      </div>
    </PageContainer>
  );
}
