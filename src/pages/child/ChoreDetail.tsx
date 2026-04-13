import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { choreTemplates, choreOccurrences } from '@/mocks/data';
import { ArrowLeft, Camera, Clock, CheckCircle2, ImagePlus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ChildChoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const occurrence = choreOccurrences.find(o => o.id === id);
  if (!occurrence) return <PageContainer title="Not Found"><p>Chore not found.</p></PageContainer>;

  const chore = choreTemplates.find(c => c.id === occurrence.choreTemplateId);
  if (!chore) return <PageContainer title="Not Found"><p>Chore template not found.</p></PageContainer>;

  const handleComplete = () => {
    setSubmitted(true);
    toast.success('Chore completed! 🎉 Great job!');
  };

  const canComplete = occurrence.status === 'due' || occurrence.status === 'overdue';

  return (
    <PageContainer
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/child/chores')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold font-display">{chore.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={submitted ? 'pending_approval' : occurrence.status} />
            <StatusBadge status={chore.isRequired ? 'required' : 'optional'} />
          </div>
        </div>

        <Card className="border">
          <CardContent className="p-4">
            <p className="text-muted-foreground">{chore.description}</p>
            <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={14} /> Due {format(new Date(occurrence.dueDate), 'h:mm a')}
              </span>
              {chore.photoProofRequired && (
                <span className="flex items-center gap-1"><Camera size={14} /> Photo required</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-token-gold/20 bg-token-gold/5">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">Token Reward</p>
            <div className="flex items-center gap-3">
              <TokenBadge amount={chore.baseTokens} />
              {chore.earlyCompletionBonus && (
                <span className="text-xs text-success">+{chore.earlyBonusValue} early bonus</span>
              )}
              {chore.streakBonus && (
                <span className="text-xs text-streak">+{chore.streakBonusValue} streak bonus</span>
              )}
            </div>
          </CardContent>
        </Card>

        {chore.photoProofRequired && !submitted && (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors">
            <ImagePlus size={32} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Upload Photo Proof</p>
            <p className="text-xs">Take a photo to prove completion</p>
          </div>
        )}

        {submitted ? (
          <Card className="border border-success/20 bg-success/5">
            <CardContent className="p-6 text-center">
              <CheckCircle2 size={48} className="mx-auto text-success mb-3" />
              <h3 className="font-display font-bold text-lg">Great job! 🎉</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {chore.approvalMode === 'manual'
                  ? 'Waiting for caregiver approval...'
                  : 'Your tokens have been awarded!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleComplete}
            disabled={!canComplete}
          >
            <CheckCircle2 size={18} className="mr-2" /> Complete Chore
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
