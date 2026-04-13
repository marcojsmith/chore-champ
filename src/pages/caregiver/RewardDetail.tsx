import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/shared/PageContainer';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { rewards, rewardRequests, children } from '@/mocks/data';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function RewardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reward = rewards.find(r => r.id === id);

  if (!reward) return <PageContainer title="Not Found"><p>Reward not found.</p></PageContainer>;

  const requests = rewardRequests.filter(r => r.rewardId === reward.id);
  const eligible = children.filter(c => reward.eligibleChildIds.includes(c.id));

  return (
    <PageContainer
      title={reward.title}
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/app/rewards')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      <div className="space-y-4 max-w-2xl">
        <Card className="border">
          <CardContent className="p-4 space-y-3">
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
            {eligible.map(c => (
              <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <span>{c.avatar}</span>
                <span className="text-sm">{c.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Redemption History</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {requests.length === 0
              ? <p className="text-sm text-muted-foreground">No redemptions yet</p>
              : requests.map(r => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{r.childName}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(r.requestedAt), 'MMM d, h:mm a')}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            }
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1"><Edit size={14} className="mr-1" /> Edit</Button>
          <Button variant="outline" className="flex-1 text-destructive"><Trash2 size={14} className="mr-1" /> Delete</Button>
        </div>
      </div>
    </PageContainer>
  );
}
