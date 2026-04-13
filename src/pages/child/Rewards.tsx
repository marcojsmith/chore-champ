import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentChild } from '@/hooks/useCurrentChild';
import { PageContainer } from '@/components/shared/PageContainer';
import { RewardCard } from '@/components/shared/RewardCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { rewards, rewardRequests } from '@/mocks/data';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = ['All', 'Affordable', 'Requested'];

export default function ChildRewards() {
  const child = useCurrentChild();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const myRewards = rewards.filter(r => r.eligibleChildIds.includes(child.id) && r.isActive);
  const myRequests = rewardRequests.filter(r => r.childId === child.id && r.status === 'pending');
  const requestedIds = new Set(myRequests.map(r => r.rewardId));

  const filtered = myRewards.filter(r => {
    if (activeTab === 'Affordable') return child.tokenBalance >= r.tokenCost;
    if (activeTab === 'Requested') return requestedIds.has(r.id);
    return true;
  });

  return (
    <PageContainer title="Rewards">
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {tab}
            {tab === 'Requested' && myRequests.length > 0 && (
              <span className="ml-1.5 bg-warning text-warning-foreground text-xs rounded-full px-1.5 py-0.5">
                {myRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Gift size={24} />}
          title="No rewards here"
          description={activeTab === 'Affordable' ? 'Keep earning tokens!' : activeTab === 'Requested' ? 'No pending requests' : 'No rewards available'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <RewardCard
              key={r.id}
              reward={r}
              childBalance={child.tokenBalance}
              onClick={() => navigate(`/child/rewards/${r.id}`)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
