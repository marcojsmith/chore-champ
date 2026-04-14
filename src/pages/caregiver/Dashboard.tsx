import { PageContainer } from '@/components/shared/PageContainer';
import { ChildProfileCard } from '@/components/shared/ChildProfileCard';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardMetrics, children, choreOccurrences, weeklyCompletionData, monthlyTokenData, notifications as allNotifications, tokenSummaries } from '@/mocks/data';
import { ListChecks, CheckCircle2, AlertTriangle, ClipboardCheck, Gift, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { cn } from '@/lib/utils';

const metrics = [
  { title: 'Due Today',       value: dashboardMetrics.choresDueToday,          icon: <ListChecks size={16} />,    color: 'text-primary' },
  { title: 'Completed',       value: dashboardMetrics.choresCompletedToday,     icon: <CheckCircle2 size={16} />,  color: 'text-success' },
  { title: 'Overdue',         value: dashboardMetrics.overdueChores,            icon: <AlertTriangle size={16} />, color: 'text-destructive' },
  { title: 'Approvals',       value: dashboardMetrics.pendingApprovals,         icon: <ClipboardCheck size={16} />,color: 'text-warning' },
  { title: 'Reward Requests', value: dashboardMetrics.pendingRewardRequests,    icon: <Gift size={16} />,          color: 'text-accent-foreground' },
];

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const recentActivity = allNotifications.filter(n => n.userId === 'cg1').slice(0, 5);

  // Suppress unused var — kept for future pending UI
  void choreOccurrences;

  return (
    <PageContainer title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      {/* Inline stats bar — single surface, no individual cards */}
      <div className="bg-card border rounded-lg overflow-hidden mb-6 card-base animate-fade-in-up relative">
        <div className="flex overflow-x-auto snap-x divide-x divide-border scrollbar-none">
          {metrics.map(m => (
            <div key={m.title} className={cn(
              'flex flex-col items-center justify-center py-4 px-2 gap-1 snap-start shrink-0 min-w-[90px]',
              m.title === 'Overdue' && Number(m.value) > 0 && 'bg-destructive/5'
            )}>
              <span className={`${m.color} mb-0.5`}>{m.icon}</span>
              <p className={`text-2xl font-bold font-display leading-none ${m.color}`}>{m.value}</p>
              <p className="text-[11px] text-muted-foreground text-center leading-tight">{m.title}</p>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent" aria-hidden="true" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Children — no outer card, just a section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Children</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {children.map(child => (
                <ChildProfileCard key={child.id} child={child} onClick={() => navigate(`/app/children/${child.id}`)} />
              ))}
            </div>
          </div>

          {/* Charts — one card, two charts side by side */}
          <Card className="border card-base animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <CardContent className="p-5">
              <div className="grid md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
                <div>
                  <p className="text-sm font-semibold mb-4">Weekly Completion</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyCompletionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="var(--color-primary)" radius={[3, 3, 0, 0]} name="Completed" />
                        <Bar dataKey="value2" fill="var(--color-muted)" radius={[3, 3, 0, 0]} name="Assigned" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="pt-6 md:pt-0 md:pl-6">
                  <p className="text-sm font-semibold mb-4">Monthly Token Earnings</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTokenData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="var(--color-token-gold)" strokeWidth={2} dot={{ fill: 'var(--color-token-gold)' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — one card for both sidebar sections */}
        <Card className="border card-base h-fit animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="font-display text-sm">Token Balances</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2.5">
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

          <div className="border-t px-6 pb-3 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-muted-foreground" />
              <p className="text-sm font-semibold">Recent Activity</p>
            </div>
            <div className="space-y-1">
              {recentActivity.map(n => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
