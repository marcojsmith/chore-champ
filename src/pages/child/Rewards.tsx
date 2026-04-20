import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { RewardCardSkeleton } from '@/components/shared/skeletons';
import { EmptyState } from '@/components/shared/EmptyState';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const tabs = ['All', 'Affordable', 'Requested', 'My Suggestions'];

export default function ChildRewards() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const me = useQuery(api.users.getMe);
  const childStats = useQuery(api.users.getChildStats, me ? { childId: me._id } : "skip");
  const rewards = useQuery(api.rewards.listForChild);
  const redemptions = useQuery(api.rewardRedemptions.listForChild);
  const mySuggestions = useQuery(api.requestedRewards.listMine);

  const myRequests = redemptions?.filter(r => r.status === 'pending') ?? [];
  const requestedIds = new Set(myRequests.map(r => r.rewardId));

  const filtered = rewards?.filter(r => {
    if (activeTab === 'Affordable') return r.tokenCost <= (childStats?.tokenBalance ?? 0);
    if (activeTab === 'Requested') return requestedIds.has(r._id);
    return true;
  }) ?? [];

  const isLoading = me === undefined || childStats === undefined || rewards === undefined || redemptions === undefined;

  return (
    <PageContainer title="Rewards">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
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
        <Button variant="outline" size="sm" className="shrink-0 ml-2" onClick={() => navigate('/child/rewards/suggest')}>
          + Suggest
        </Button>
      </div>

      {activeTab === 'My Suggestions' && (
        <>
          {mySuggestions === undefined ? (
            <div className="space-y-3"><RewardCardSkeleton /><RewardCardSkeleton /></div>
          ) : mySuggestions.length === 0 ? (
            <EmptyState icon={<Gift size={24} />} title="No suggestions yet" description="Suggest a reward you'd like to earn!" />
          ) : (
            <div className="space-y-3">
              {mySuggestions.map(s => (
                <div key={s._id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.description}</p>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full font-medium shrink-0',
                      s.status === 'pending' ? 'bg-warning/10 text-warning' :
                      s.status === 'approved' ? 'bg-success/10 text-success' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {s.status === 'pending' ? 'Pending' : s.status === 'approved' ? `Approved · ${s.assignedTokenValue} tokens` : 'Declined'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab !== 'My Suggestions' && (
        isLoading ? (
          <div className="space-y-3">
            <RewardCardSkeleton />
            <RewardCardSkeleton />
            <RewardCardSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Gift size={24} />}
            title="No rewards here"
            description={activeTab === 'Affordable' ? 'Keep earning tokens!' : activeTab === 'Requested' ? 'No pending requests' : 'No rewards available'}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <div
                key={r._id}
                className="rounded-xl border bg-card p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/child/rewards/${r._id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    {r.imageEmoji ? <span className="text-xl">{r.imageEmoji}</span> : <Gift size={20} className="text-accent" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        (childStats?.tokenBalance ?? 0) >= r.tokenCost ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                      )}>
                        {r.tokenCost} tokens
                      </span>
                      {requestedIds.has(r._id) && (
                        <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning font-medium">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </PageContainer>
  );
}