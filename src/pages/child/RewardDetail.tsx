import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCurrentChild } from '@/hooks/useCurrentChild';
import { PageContainer } from '@/components/shared/PageContainer';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { rewards, rewardRequests } from '@/mocks/data';
import { ArrowLeft, Gift } from 'lucide-react';
import { toast } from 'sonner';

export default function ChildRewardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const child = useCurrentChild();
  const [requested, setRequested] = useState(false);

  const reward = rewards.find(r => r.id === id);
  if (!reward) return <PageContainer title="Not Found"><p>Reward not found.</p></PageContainer>;

  const canAfford = child.tokenBalance >= reward.tokenCost;
  const existing = rewardRequests.find(
    r => r.rewardId === reward.id && r.childId === child.id && r.status === 'pending'
  );

  return (
    <PageContainer
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/child/rewards')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
            {reward.imageEmoji
              ? <span className="text-3xl">{reward.imageEmoji}</span>
              : <Gift size={32} className="text-accent" />
            }
          </div>
          <h1 className="text-2xl font-bold font-display">{reward.title}</h1>
          <TokenBadge amount={reward.tokenCost} size="lg" className="mt-2" />
        </div>

        <Card className="border">
          <CardContent className="p-4">
            <p className="text-muted-foreground">{reward.description}</p>
            <p className="text-sm text-muted-foreground mt-2">{reward.category}</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your balance</span>
              <TokenBadge amount={child.tokenBalance} size="sm" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Cost</span>
              <TokenBadge amount={reward.tokenCost} size="sm" />
            </div>
            {!canAfford && (
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${Math.min((child.tokenBalance / reward.tokenCost) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need {reward.tokenCost - child.tokenBalance} more tokens
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {requested || existing ? (
          <Card className="border border-warning/20 bg-warning/5">
            <CardContent className="p-4 text-center">
              <p className="font-semibold">Request Pending ⏳</p>
              <p className="text-sm text-muted-foreground mt-1">Waiting for caregiver approval</p>
            </CardContent>
          </Card>
        ) : (
          <Button
            className="w-full h-12 text-base font-semibold"
            disabled={!canAfford}
            onClick={() => { setRequested(true); toast.success('Reward requested! 🎁'); }}
          >
            {canAfford
              ? 'Request Reward'
              : `Need ${reward.tokenCost - child.tokenBalance} more tokens`}
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
