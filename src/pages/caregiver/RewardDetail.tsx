import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { PageContainer } from '@/components/shared/PageContainer';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RewardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reward = useQuery(api.rewards.get, id ? { rewardId: id as Id<"rewards"> } : "skip");
  const childrenList = useQuery(api.users.listChildren) ?? [];
  const redemptionHistory = useQuery(api.rewardRedemptions.listByRewardId, id ? { rewardId: id as Id<"rewards"> } : "skip") ?? [];
  const setActive = useMutation(api.rewards.setActive);

  if (!reward) return <PageContainer title="Loading..."><p>Loading...</p></PageContainer>;

  const eligible = childrenList.filter(c => 
    reward.eligibleChildIds?.length === 0 || reward.eligibleChildIds?.includes(c._id)
  );

  const handleDelete = async () => {
    if (!reward) return;
    try {
      await setActive({ rewardId: reward._id, isActive: false });
      toast.success('Reward deleted');
      navigate('/app/rewards');
    } catch {
      toast.error('Failed to delete reward');
    }
  };

  return (
    <PageContainer
      title={reward.title}
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/app/rewards')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      <div className="space-y-4 max-w-2xl">
        <Card className="border">
          <CardContent className="p-4 space-y-3">
            {reward.imageEmoji && <span className="text-4xl">{reward.imageEmoji}</span>}
            <p className="text-muted-foreground">{reward.description}</p>
            <div className="flex items-center gap-3">
              <TokenBadge amount={reward.tokenCost} />
              <span className="text-sm text-muted-foreground">{reward.category}</span>
              {reward.stockQuantity !== undefined && (
                <span className="text-sm text-muted-foreground">{reward.stockQuantity} in stock</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Eligible Children</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {eligible.length === 0 
              ? <p className="text-sm text-muted-foreground">All children eligible</p>
              : eligible.map(c => (
                <div key={c._id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <span>{c.avatar}</span>
                  <span className="text-sm">{c.name}</span>
                </div>
              ))
            }
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Redemption History</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {redemptionHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No redemptions yet</p>
            ) : (
              redemptionHistory.map(redemption => {
                const child = childrenList.find(c => c._id === redemption.childId);
                return (
                  <div key={redemption._id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{child?.avatar ?? '👤'}</span>
                      <span className="text-sm font-medium">{child?.name ?? 'Unknown'}</span>
                      <StatusBadge status={redemption.status} />
                    </div>
                    <div className="text-right">
                      {redemption.resolvedAt ? (
                        <span className="text-xs text-muted-foreground block">{formatDate(redemption.resolvedAt)}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground block">Pending</span>
                      )}
                      <TokenBadge amount={redemption.tokenCost} size="sm" />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1"><Edit size={14} className="mr-1" /> Edit</Button>
          <Button variant="outline" className="flex-1 text-destructive" onClick={handleDelete}><Trash2 size={14} className="mr-1" /> Delete</Button>
        </div>
      </div>
    </PageContainer>
  );
}
