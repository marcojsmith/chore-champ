import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { ChoreCardSkeleton } from '@/components/shared/skeletons';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = ['Today', 'Upcoming', 'Overdue', 'Completed'];

export default function MyChores() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Today');

  const occurrences = useQuery(api.choreOccurrences.listForChild, {});

  const filtered = occurrences?.filter(o => {
    if (activeTab === 'Today') return o.status === 'due' || o.status === 'in_progress';
    if (activeTab === 'Upcoming') return o.status === 'scheduled';
    if (activeTab === 'Overdue') return o.status === 'overdue';
    if (activeTab === 'Completed') return o.status === 'approved';
    return true;
  }) ?? [];

  const isLoading = occurrences === undefined;

  return (
    <PageContainer title="My Chores">
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
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <ChoreCardSkeleton />
          <ChoreCardSkeleton />
          <ChoreCardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ListChecks size={24} />}
          title="No chores here"
          description={activeTab === 'Completed' ? 'Complete some chores to see them here!' : "You're all caught up!"}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <div
              key={o._id}
              className="rounded-xl border bg-card p-4 card-base cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/child/chores/${o._id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Chore #{String(o.choreId).slice(-6)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due {new Date(o.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full font-medium',
                    o.status === 'due' || o.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                    o.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                    o.status === 'scheduled' ? 'bg-muted text-muted-foreground' :
                    'bg-success/10 text-success'
                  )}>
                    {o.status}
                  </span>
                  {o.tokensEarned != null && (
                    <p className="text-xs font-medium text-accent mt-1">{o.tokensEarned} tokens</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
