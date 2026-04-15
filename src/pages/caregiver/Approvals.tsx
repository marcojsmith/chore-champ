import { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { ChoreApprovalItem, RewardApprovalItem } from '@/components/shared/ApprovalItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { type ChoreStatus, type RewardRequestStatus } from '@/mocks/data';
import { ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const tabs = ['Chores', 'Rewards'];

export default function Approvals() {
  const [activeTab, setActiveTab] = useState('Chores');

  const pendingChoresQuery = useQuery(api.choreOccurrences.listForCaregiver, { status: "pending_approval" });
  const pendingRewardsQuery = useQuery(api.rewardRedemptions.listPending);
  const chores = useQuery(api.chores.list);
  const children = useQuery(api.users.listChildren);

  const approveChore = useMutation(api.choreOccurrences.approve);
  const rejectChore = useMutation(api.choreOccurrences.reject);
  const approveReward = useMutation(api.rewardRedemptions.approve);
  const rejectReward = useMutation(api.rewardRedemptions.reject);

  const choreMap = new Map((chores ?? []).map(c => [c._id, c] as const));
  const childMap = new Map((children ?? []).map(c => [c._id, c] as const));

  const pendingChores = pendingChoresQuery ?? [];
  const pendingRewards = pendingRewardsQuery ?? [];

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
            {pendingChores.map(o => {
              const chore = choreMap.get(o.choreId);
              const child = childMap.get(o.childId);
              return (
                <ChoreApprovalItem key={o._id} occurrence={{
                  id: o._id,
                  choreTemplateId: o.choreId,
                  choreTitle: chore?.title ?? String(o.choreId),
                  childId: o.childId,
                  childName: child?.name ?? String(o.childId),
                  status: o.status as ChoreStatus,
                  dueDate: new Date(o.dueDate).toISOString(),
                  completedAt: o.completedAt ? new Date(o.completedAt).toISOString() : undefined,
                  tokensEarned: o.tokensEarned,
                  photoStorageId: o.photoStorageId,
                }}
                  onApprove={async () => {
                    try {
                      await approveChore({ occurrenceId: o._id });
                      toast.success(`Approved "${chore?.title ?? 'chore'}" for ${child?.name ?? 'child'}`);
                    } catch (err: unknown) {
                      if (err instanceof Error) toast.error(err.message);
                    }
                  }}
                  onReject={async () => {
                    try {
                      await rejectChore({ occurrenceId: o._id });
                      toast.error(`Rejected "${chore?.title ?? 'chore'}" for ${child?.name ?? 'child'}`);
                    } catch (err: unknown) {
                      if (err instanceof Error) toast.error(err.message);
                    }
                  }}
                />
              );
            })}
          </div>
        )
      )}

      {activeTab === 'Rewards' && (
        pendingRewards.length === 0 ? (
          <EmptyState icon={<ClipboardCheck size={24} />} title="All caught up!" description="No reward requests need approval." />
        ) : (
          <div className="space-y-3">
            {pendingRewards.map(r => (
              <RewardApprovalItem key={r.redemption._id} request={{
                id: r.redemption._id,
                rewardId: r.redemption.rewardId,
                rewardTitle: r.rewardTitle,
                childId: r.redemption.childId,
                childName: r.childName,
                status: r.redemption.status as RewardRequestStatus,
                requestedAt: r.redemption._creationTime ? new Date(r.redemption._creationTime).toISOString() : new Date().toISOString(),
                tokenCost: r.redemption.tokenCost,
              }}
                onApprove={async () => {
                  try {
                    await approveReward({ redemptionId: r.redemption._id });
                    toast.success(`Approved "${r.rewardTitle}" for ${r.childName}`);
                  } catch (err: unknown) {
                    if (err instanceof Error) toast.error(err.message);
                  }
                }}
                onReject={async () => {
                  try {
                    await rejectReward({ redemptionId: r.redemption._id });
                    toast.error(`Rejected "${r.rewardTitle}" for ${r.childName}`);
                  } catch (err: unknown) {
                    if (err instanceof Error) toast.error(err.message);
                  }
                }}
              />
            ))}
          </div>
        )
      )}
    </PageContainer>
  );
}
