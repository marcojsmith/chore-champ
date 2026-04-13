import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/shared/PageContainer';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { choreTemplates, choreOccurrences, children } from '@/mocks/data';
import { ArrowLeft, Edit, Copy, Archive, Clock, Camera, Repeat, Users } from 'lucide-react';
import { format } from 'date-fns';

const recurrenceLabels = { once: 'One-time', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

export default function ChoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chore = choreTemplates.find(c => c.id === id);

  if (!chore) return <PageContainer title="Chore Not Found"><p>This chore doesn't exist.</p></PageContainer>;

  const occurrences = choreOccurrences.filter(o => o.choreTemplateId === chore.id);
  const assignedChildren = children.filter(c => chore.assignedChildIds.includes(c.id));

  return (
    <PageContainer
      title={chore.title}
      action={
        <Button variant="ghost" size="sm" onClick={() => navigate('/app/chores')}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
      }
    >
      <div className="space-y-4 max-w-2xl">
        {/* Meta */}
        <Card className="border">
          <CardContent className="p-4 space-y-3">
            <p className="text-muted-foreground">{chore.description}</p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={chore.isRequired ? 'required' : 'optional'} />
              <span className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-2.5 py-0.5 text-muted-foreground">
                <Repeat size={12} /> {recurrenceLabels[chore.recurrence]}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-2.5 py-0.5 text-muted-foreground">
                <Clock size={12} /> Due by {chore.dueTime}
              </span>
              {chore.photoProofRequired && (
                <span className="inline-flex items-center gap-1 text-xs bg-info/10 rounded-full px-2.5 py-0.5 text-info">
                  <Camera size={12} /> Photo proof
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Token rules */}
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Token Rules</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Base reward</span>
              <TokenBadge amount={chore.baseTokens} size="sm" />
            </div>
            {chore.earlyCompletionBonus && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-success">Early completion bonus</span>
                <TokenBadge amount={chore.earlyBonusValue} size="sm" />
              </div>
            )}
            {chore.streakBonus && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-streak">Streak bonus</span>
                <TokenBadge amount={chore.streakBonusValue} size="sm" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned children */}
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2"><Users size={16} /> Assigned Children</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {assignedChildren.map(child => (
                <div key={child.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <span className="text-xl">{child.avatar}</span>
                  <span className="text-sm font-medium">{child.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent completions */}
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Recent Completions</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {occurrences.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completions yet</p>
            ) : (
              <div className="space-y-2">
                {occurrences.map(o => (
                  <div key={o.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{o.childName}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(o.dueDate), 'MMM d, h:mm a')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={o.status} />
                      {o.tokensEarned != null && <TokenBadge amount={o.tokensEarned} size="sm" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1"><Edit size={14} className="mr-1" /> Edit</Button>
          <Button variant="outline" className="flex-1"><Copy size={14} className="mr-1" /> Duplicate</Button>
          <Button variant="outline" className="flex-1 text-destructive"><Archive size={14} className="mr-1" /> Archive</Button>
        </div>
      </div>
    </PageContainer>
  );
}
