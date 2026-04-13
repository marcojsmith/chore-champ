import { PageContainer } from '@/components/shared/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { household } from '@/mocks/data';
import { Download, Smartphone } from 'lucide-react';

const notificationItems = ['Chore completions', 'Reward requests', 'Streak milestones', 'Daily summary'];

export default function CaregiverSettings() {
  return (
    <PageContainer title="Settings">
      <div className="space-y-4 max-w-2xl">
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Household</CardTitle></CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div>
              <Label>Household Name</Label>
              <Input defaultValue={household.name} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Members</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {household.caregivers.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <span className="text-xl">{c.avatar}</span>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Caregiver</p>
                </div>
              </div>
            ))}
            {household.children.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <span className="text-xl">{c.avatar}</span>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Child, age {c.age}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2">Add Member</Button>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Notifications</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-3">
            {notificationItems.map(item => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-dashed">
          <CardContent className="p-4 text-center">
            <Smartphone size={24} className="mx-auto mb-2 text-muted-foreground" />
            <p className="font-display font-semibold">Install App</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Add ChoreChamp to your home screen for the best experience</p>
            <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Install</Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
