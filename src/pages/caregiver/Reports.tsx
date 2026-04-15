import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
import type { Id } from 'convex/_generated/dataModel';

const COLORS = ['var(--color-success)', 'var(--color-primary)', 'var(--color-destructive)', 'var(--color-muted-foreground)'];

export default function Reports() {
  const [childFilter, setChildFilter] = useState<"all" | string>("all");
  const children = useQuery(api.users.listChildren) ?? [];

  const childId = childFilter === "all" ? undefined : (childFilter as Id<"users">);

  const reportsData = useQuery(api.choreOccurrences.getReportsData, { days: 30, childId });

  const weeklyCompletionData = reportsData?.weeklyCompletion?.map(d => ({
    label: d.label,
    value: d.completed,
    value2: d.total,
  })) ?? [];

  const monthlyTokenData = reportsData?.weeklyTokens?.map(d => ({
    label: d.label,
    value: d.value,
  })) ?? [];

  const completionBreakdown = reportsData?.statusBreakdown?.map(d => ({
    label: d.label,
    value: d.value,
  })) ?? [];

  const topChores = reportsData?.topChores ?? [];

  const isLoading = reportsData === undefined;

  return (
    <PageContainer title="Reports" subtitle="Track progress and trends">
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <Label className="text-xs">Child</Label>
          <Select value={childFilter} onValueChange={(v) => { if (v) setChildFilter(v); }}>
            <SelectTrigger className="w-36 mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {children.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border">
              <CardHeader className="pb-3"><CardTitle className="text-base font-display skeleton h-4 w-32" /></CardHeader>
              <CardContent className="pt-0"><div className="h-48 skeleton rounded" /></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-display">Completion Trends</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Completed" />
                    <Bar dataKey="value2" fill="var(--color-muted)" radius={[4, 4, 0, 0]} name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-display">Token Earnings</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTokenData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="var(--color-token-gold)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-display">Completion Breakdown</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={completionBreakdown} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={70} label={({ name }: { name?: string | number }) => String(name ?? '')}>
                      {completionBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-display">Top Completed Chores</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-3">
              {topChores.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${(c.count / (topChores[0]?.count || 1)) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{c.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}