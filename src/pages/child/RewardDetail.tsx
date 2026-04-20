import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Gift } from 'lucide-react';
import { toast } from 'sonner';
import type { Id } from "convex/_generated/dataModel";
import { useIsOnline } from '@/components/shared/OfflineBanner';

export default function ChildRewardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isOnline = useIsOnline();

  const me = useQuery(api.users.getMe);
  const childStats = useQuery(api.users.getChildStats, me ? { childId: me._id } : "skip");
  const rewards = useQuery(api.rewards.listForChild);
  const redemptions = useQuery(api.rewardRedemptions.listForChild);

  const requestRedemption = useMutation(api.rewardRedemptions.request);

  const reward = rewards?.find(r => r._id === id);

  const canAfford = (childStats?.tokenBalance ?? 0) >= (reward?.tokenCost ?? 0);
  const existing = redemptions?.find(
    r => r.rewardId === id && r.status === 'pending'
  );

  const isLoading = me === undefined || childStats === undefined || rewards === undefined || redemptions === undefined;

  const handleRedeem = async () => {
    if (!id) return;
    try {
      await requestRedemption({ rewardId: id as Id<"rewards"> });
      toast.success('Reward requested! 🎁');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to request reward');
    }
  };

  if (isLoading) {
    return (
      <PageContainer
        action={<Button variant="ghost" size="sm" onClick={() => navigate('/child/rewards')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
      >
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Gift size={32} className="text-accent" />
            </div>
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-6 w-24 mx-auto" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!reward) return <PageContainer title="Not Found"><p>Reward not found.</p></PageContainer>;

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
              <TokenBadge amount={childStats?.tokenBalance ?? 0} size="sm" />
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
                    style={{ width: `${Math.min(((childStats?.tokenBalance ?? 0) / reward.tokenCost) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need {reward.tokenCost - (childStats?.tokenBalance ?? 0)} more tokens
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {existing ? (
          <Card className="border border-warning/20 bg-warning/5">
            <CardContent className="p-4 text-center">
              <p className="font-semibold">Request Pending ⏳</p>
              <p className="text-sm text-muted-foreground mt-1">Waiting for caregiver approval</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Button
              className="w-full h-12 text-base font-semibold"
              disabled={!canAfford || !isOnline}
              onClick={handleRedeem}
            >
              {canAfford
                ? 'Request Reward'
                : `Need ${reward.tokenCost - (childStats?.tokenBalance ?? 0)} more tokens`}
            </Button>
            {!isOnline && (
              <p className="text-xs text-muted-foreground text-center mt-2">You're offline — connect to submit</p>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
