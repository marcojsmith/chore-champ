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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ArrowLeft, CheckCircle2, Coins, Flame, Target } from 'lucide-react';

export default function ChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const childData = useQuery(api.users.getChild, id ? { childId: id as Id<"users"> } : "skip");
  const tokenLedger = useQuery(api.tokenLedger.listForChildById, id ? { childId: id as Id<"users">, limit: 20 } : "skip");

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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Coins size={16} />
              Token History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!tokenLedger || tokenLedger.length === 0 ? (
              <EmptyState title="No token history" description="Token activity will appear here." />
            ) : (
              <div className="space-y-2">
                {tokenLedger.map((entry) => {
                  const isPositive = entry.amount > 0;
                  const typeColors: Record<string, string> = {
                    chore_earned: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                    reward_spent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    bonus: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                    adjustment: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                  };
                  return (
                    <div key={entry._id} className="flex items-center justify-between py-2 border-b last:border-0 gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${typeColors[entry.type] || typeColors.adjustment}`}>
                          {entry.type.replace("_", " ")}
                        </span>
                        <span className="text-sm truncate">{entry.note || entry.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium whitespace-nowrap ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {isPositive ? "+" : ""}{entry.amount}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(entry._creationTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
