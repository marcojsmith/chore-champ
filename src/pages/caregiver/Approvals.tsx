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
import { useIsOnline } from '@/components/shared/OfflineBanner';
import { Button } from '@/components/ui/button';

const tabs = ['Chores', 'Rewards', 'Suggestions'];

export default function Approvals() {
  const [activeTab, setActiveTab] = useState('Chores');
  const isOnline = useIsOnline();
  const [tokenValues, setTokenValues] = useState<Record<string, number>>({});

  const pendingChoresQuery = useQuery(api.choreOccurrences.listForCaregiver, { status: "pending_approval" });
  const pendingRewardsQuery = useQuery(api.rewardRedemptions.listPending);
  const pendingSuggestionsQuery = useQuery(api.requestedRewards.listPending);
  const chores = useQuery(api.chores.list);
  const children = useQuery(api.users.listChildren);

  const approveChore = useMutation(api.choreOccurrences.approve);
  const rejectChore = useMutation(api.choreOccurrences.reject);
  const approveReward = useMutation(api.rewardRedemptions.approve);
  const rejectReward = useMutation(api.rewardRedemptions.reject);
  const approveSuggestion = useMutation(api.requestedRewards.approve);
  const rejectSuggestion = useMutation(api.requestedRewards.reject);

  const choreMap = new Map((chores ?? []).map(c => [c._id, c] as const));
  const childMap = new Map((children ?? []).map(c => [c._id, c] as const));

  const pendingChores = pendingChoresQuery ?? [];
  const pendingRewards = pendingRewardsQuery ?? [];
  const pendingSuggestions = pendingSuggestionsQuery ?? [];

  const getTokenValue = (id: string) => tokenValues[id] ?? 10;
  const setTokenValue = (id: string, val: number) => setTokenValues(prev => ({ ...prev, [id]: val }));

  return (
    <PageContainer title="Approvals" subtitle={`${pendingChores.length + pendingRewards.length + pendingSuggestions.length} pending`}>
      <div className="flex gap-1 mb-4">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
            {tab}
            <span className="ml-1.5 bg-foreground/10 rounded-full px-1.5 py-0.5 text-[10px]">
              {tab === 'Chores' ? pendingChores.length : tab === 'Rewards' ? pendingRewards.length : pendingSuggestions.length}
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
                    if (!isOnline) return;
                    try {
                      await approveChore({ occurrenceId: o._id });
                      toast.success(`Approved "${chore?.title ?? 'chore'}" for ${child?.name ?? 'child'}`);
                    } catch (err: unknown) {
                      if (err instanceof Error) toast.error(err.message);
                    }
                  }}
                  onReject={async () => {
                    if (!isOnline) return;
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
                  if (!isOnline) return;
                  try {
                    await approveReward({ redemptionId: r.redemption._id });
                    toast.success(`Approved "${r.rewardTitle}" for ${r.childName}`);
                  } catch (err: unknown) {
                    if (err instanceof Error) toast.error(err.message);
                  }
                }}
                onReject={async () => {
                  if (!isOnline) return;
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

      {activeTab === 'Suggestions' && (
        pendingSuggestions.length === 0 ? (
          <EmptyState icon={<ClipboardCheck size={24} />} title="No suggestions" description="Children can suggest rewards they'd like to earn." />
        ) : (
          <div className="space-y-3">
            {pendingSuggestions.map(s => {
              return (
                <div key={s._id} className="rounded-xl border bg-card p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{s.childAvatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.childName}</p>
                      {s.description && <p className="text-xs text-muted-foreground mt-1">{s.description}</p>}
                      {s.category && <p className="text-xs text-muted-foreground">{s.category}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-xs font-medium text-muted-foreground shrink-0">Tokens</label>
                      <input
                        type="number"
                        min={1}
                        value={getTokenValue(s._id)}
                        onChange={e => setTokenValue(s._id, Number(e.target.value))}
                        className="w-20 h-8 rounded-md border bg-background px-2 text-sm"
                      />
                    </div>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      disabled={!isOnline}
                      onClick={async () => {
                        if (!isOnline) return;
                        try {
                          await rejectSuggestion({ suggestionId: s._id });
                          toast.error(`Rejected "${s.title}"`);
                        } catch (err: unknown) {
                          if (err instanceof Error) toast.error(err.message);
                        }
                      }}>
                      Decline
                    </Button>
                    <Button size="sm"
                      disabled={!isOnline}
                      onClick={async () => {
                        if (!isOnline) return;
                        try {
                          await approveSuggestion({ suggestionId: s._id, tokenValue: getTokenValue(s._id) });
                          toast.success(`Added "${s.title}" for ${getTokenValue(s._id)} tokens!`);
                        } catch (err: unknown) {
                          if (err instanceof Error) toast.error(err.message);
                        }
                      }}>
                      Approve
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </PageContainer>
  );
}