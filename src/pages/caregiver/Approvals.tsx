import { useState } from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { ChoreApprovalItem, RewardApprovalItem } from '@/components/shared/ApprovalItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { choreOccurrences, rewardRequests } from '@/mocks/data';
import { ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const tabs = ['Chores', 'Rewards'];

export default function Approvals() {
  const [activeTab, setActiveTab] = useState('Chores');

  const pendingChores = choreOccurrences.filter(o => o.status === 'pending_approval');
  const pendingRewards = rewardRequests.filter(r => r.status === 'pending');

  return (
    <PageContainer title="Approvals" subtitle={`${pendingChores.length + pendingRewards.length} pending`}>
      <div className="flex gap-1 mb-4">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
            {tab}
            <span className="ml-1.5 bg-foreground/10 rounded-full px-1.5 py-0.5 text-[10px]">
              {tab === 'Chores' ? pendingChores.length : pendingRewards.length}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'Chores' && (
        pendingChores.length === 0 ? (
          <EmptyState icon={<ClipboardCheck size={24} />} title="All caught up!" description="No chore completions need approval." />
        ) : (
          <div className="space-y-3">
            {pendingChores.map(o => (
              <ChoreApprovalItem key={o.id} occurrence={o}
                onApprove={() => toast.success(`Approved "${o.choreTitle}" for ${o.childName}`)}
                onReject={() => toast.error(`Rejected "${o.choreTitle}" for ${o.childName}`)}
              />
            ))}
          </div>
        )
      )}

      {activeTab === 'Rewards' && (
        pendingRewards.length === 0 ? (
          <EmptyState icon={<ClipboardCheck size={24} />} title="All caught up!" description="No reward requests need approval." />
        ) : (
          <div className="space-y-3">
            {pendingRewards.map(r => (
              <RewardApprovalItem key={r.id} request={r}
                onApprove={() => toast.success(`Approved "${r.rewardTitle}" for ${r.childName}`)}
                onReject={() => toast.error(`Rejected "${r.rewardTitle}" for ${r.childName}`)}
              />
            ))}
          </div>
        )
      )}
    </PageContainer>
  );
}
