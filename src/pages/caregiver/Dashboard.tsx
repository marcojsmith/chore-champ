import { PageContainer } from '@/components/shared/PageContainer';
import { MetricCard } from '@/components/shared/MetricCard';
import { ChildProfileCard } from '@/components/shared/ChildProfileCard';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardMetrics, children, choreOccurrences, weeklyCompletionData, monthlyTokenData, notifications as allNotifications, tokenSummaries } from '@/mocks/data';
import { ListChecks, CheckCircle2, AlertTriangle, ClipboardCheck, Gift, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const recentActivity = allNotifications.filter(n => n.userId === 'cg1').slice(0, 5);

  // Suppress unused var — kept for future pending UI
  void choreOccurrences;

  return (
    <PageContainer title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <MetricCard title="Due Today" value={dashboardMetrics.choresDueToday} icon={<ListChecks size={18} />} variant="primary" />
        <MetricCard title="Completed" value={dashboardMetrics.choresCompletedToday} icon={<CheckCircle2 size={18} />} variant="success" />
        <MetricCard title="Overdue" value={dashboardMetrics.overdueChores} icon={<AlertTriangle size={18} />} variant="destructive" />
        <MetricCard title="Approvals" value={dashboardMetrics.pendingApprovals} icon={<ClipboardCheck size={18} />} variant="warning" />
        <MetricCard title="Reward Requests" value={dashboardMetrics.pendingRewardRequests} icon={<Gift size={18} />} variant="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Children</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid sm:grid-cols-2 gap-3">
                {children.map(child => (
                  <ChildProfileCard key={child.id} child={child} onClick={() => navigate(`/app/children/${child.id}`)} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Weekly Completion</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} className="stroke-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="stroke-muted-foreground" />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Completed" />
                    <Bar dataKey="value2" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Assigned" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Monthly Token Earnings</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTokenData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} className="stroke-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="stroke-muted-foreground" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--token-gold))" strokeWidth={2} dot={{ fill: 'hsl(var(--token-gold))' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Token Balances</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {children.map(child => {
                const summary = tokenSummaries.find(s => s.childId === child.id);
                return (
                  <div key={child.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{child.avatar}</span>
                      <span className="text-sm font-medium">{child.name}</span>
                    </div>
                    <TokenBadge amount={summary?.available ?? 0} size="sm" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity size={16} />
                <CardTitle className="font-display text-base">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {recentActivity.map(n => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
