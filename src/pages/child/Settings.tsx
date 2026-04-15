import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { PageContainer } from '@/components/shared/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { useClerk } from '@clerk/react';

const themes = [
  { id: 'default', label: 'Default', color: 'bg-primary' },
  { id: 'ocean', label: 'Ocean', color: 'bg-blue-500' },
  { id: 'forest', label: 'Forest', color: 'bg-green-500' },
  { id: 'sunset', label: 'Sunset', color: 'bg-orange-500' },
  { id: 'candy', label: 'Candy', color: 'bg-pink-500' },
];

export default function ChildSettings() {
  const me = useQuery(api.users.getMe);
  const childStats = useQuery(api.users.getChildStats, me ? { childId: me._id } : 'skip');
  const { signOut } = useClerk();

  const [notifications, setNotifications] = useState({
    choreReminders: true,
    approvalUpdates: true,
    rewards: true,
  });
  const [selectedTheme, setSelectedTheme] = useState('default');

  if (me === undefined || childStats === undefined || me === null) {
    return <PageContainer title="Settings">Loading...</PageContainer>;
  }

  return (
    <PageContainer title="Settings">
      <div className="space-y-4">
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center text-4xl">
                {me.avatar ?? '🐱'}
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">{me.name ?? 'Child'}</h2>
                <p className="text-sm text-muted-foreground">Age {me.age ?? 0}</p>
                <div className="flex items-center gap-2 mt-1">
                  <TokenBadge amount={childStats?.tokenBalance ?? 0} size="sm" />
                  <StreakBadge streak={childStats?.currentStreak ?? 0} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="chore-reminders" className="text-sm">Chore reminders</Label>
              <Switch
                id="chore-reminders"
                checked={notifications.choreReminders}
                onCheckedChange={v => setNotifications(prev => ({ ...prev, choreReminders: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="approval-updates" className="text-sm">Approval updates</Label>
              <Switch
                id="approval-updates"
                checked={notifications.approvalUpdates}
                onCheckedChange={v => setNotifications(prev => ({ ...prev, approvalUpdates: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rewards-notif" className="text-sm">New rewards</Label>
              <Switch
                id="rewards-notif"
                checked={notifications.rewards}
                onCheckedChange={v => setNotifications(prev => ({ ...prev, rewards: v }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Theme</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex gap-3">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`h-10 w-10 rounded-full ${theme.color} ${selectedTheme === theme.id ? 'ring-2 ring-offset-2 ring-primary' : ''}`} />
                  <span className="text-xs text-muted-foreground">{theme.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-4">
            <button
              onClick={() => signOut()}
              className="w-full text-center text-sm text-destructive font-medium py-1"
            >
              Sign Out
            </button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
