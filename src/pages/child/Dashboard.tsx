import { useCurrentChild } from '@/hooks/useCurrentChild';
import { PageContainer } from '@/components/shared/PageContainer';
import { MetricCard } from '@/components/shared/MetricCard';
import { TokenBalanceWidget } from '@/components/shared/TokenBalanceWidget';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { ChoreCard } from '@/components/shared/ChoreCard';
import { RewardCard } from '@/components/shared/RewardCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { choreTemplates, choreOccurrences, rewards, tokenSummaries } from '@/mocks/data';
import { CheckCircle2, AlertTriangle, ListChecks, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChildDashboard() {
  const child = useCurrentChild();
  const navigate = useNavigate();

  const summary = tokenSummaries.find(s => s.childId === child.id) ?? tokenSummaries[0];
  const myOccurrences = choreOccurrences.filter(o => o.childId === child.id);
  const todayDue = myOccurrences.filter(o => o.status === 'due');
  const overdue = myOccurrences.filter(o => o.status === 'overdue');
  const completed = myOccurrences.filter(o => ['completed', 'approved'].includes(o.status));
  const myRewards = rewards.filter(r => r.eligibleChildIds.includes(child.id));

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold font-display">Hey {child.name}! 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your day at a glance</p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <TokenBalanceWidget
            available={summary.available}
            reserved={summary.reserved}
            totalEarned={summary.totalEarned}
            totalSpent={summary.totalSpent}
            earnedThisWeek={summary.earnedThisWeek}
          />
        </div>

        <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <StreakBadge streak={child.currentStreak} />
          <span className="text-xs text-muted-foreground">Best: {child.longestStreak} days</span>
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
              {overdue.map(o => {
                const template = choreTemplates.find(c => c.id === o.choreTemplateId);
                if (!template) return null;
                return (
                  <ChoreCard key={o.id} chore={template} occurrence={o} compact onClick={() => navigate(`/child/chores/${o.id}`)} />
                );
              })}
            </CardContent>
          </Card>
        )}

        {todayDue.length > 0 && (
          <Card className="border animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">Today's Chores</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {todayDue.map(o => {
                const template = choreTemplates.find(c => c.id === o.choreTemplateId);
                if (!template) return null;
                return (
                  <ChoreCard
                    key={o.id}
                    chore={template}
                    occurrence={o}
                    compact
                    onClick={() => navigate(`/child/chores/${o.id}`)}
                  />
                );
              })}
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
            {myRewards.slice(0, 3).map(r => (
              <RewardCard
                key={r.id}
                reward={r}
                childBalance={child.tokenBalance}
                onClick={() => navigate(`/child/rewards/${r.id}`)}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
