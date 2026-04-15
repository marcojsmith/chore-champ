import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { RewardCard } from '@/components/shared/RewardCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RewardCardSkeleton } from '@/components/shared/skeletons';
import { Plus, Search, Gift } from 'lucide-react';

export default function RewardsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const rewards = useQuery(api.rewards.list);

  const filtered = (rewards ?? []).filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer
      title="Rewards"
      subtitle={`${(rewards ?? []).length} rewards available`}
      action={
        <Button onClick={() => navigate('/app/rewards/new')} size="sm">
          <Plus size={16} className="mr-1" /> New Reward
        </Button>
      }
    >
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search rewards..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {rewards === undefined ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3].map(i => <RewardCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Gift size={24} />} title="No rewards found" description="Create rewards for your children to earn." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map(reward => (
            <RewardCard key={reward._id} reward={{
              id: reward._id,
              title: reward.title,
              description: reward.description,
              tokenCost: reward.tokenCost,
              category: reward.category,
              isActive: reward.isActive,
              imageEmoji: reward.imageEmoji,
              eligibleChildIds: reward.eligibleChildIds as unknown as string[],
              stockQuantity: reward.stockQuantity,
            }} onClick={() => navigate(`/app/rewards/${reward._id}`)} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
