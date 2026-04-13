import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/shared/PageContainer';
import { RewardCard } from '@/components/shared/RewardCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { rewards } from '@/mocks/data';
import { Plus, Search, Gift } from 'lucide-react';

export default function RewardsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = rewards.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer
      title="Rewards"
      subtitle={`${rewards.length} rewards available`}
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

      {filtered.length === 0 ? (
        <EmptyState icon={<Gift size={24} />} title="No rewards found" description="Create rewards for your children to earn." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map(reward => (
            <RewardCard key={reward.id} reward={reward} onClick={() => navigate(`/app/rewards/${reward.id}`)} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
