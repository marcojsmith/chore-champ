import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { ChoreCard } from '@/components/shared/ChoreCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChoreCardSkeleton } from '@/components/shared/skeletons';
import { Plus, Search, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = ['All', 'Required', 'Optional', 'Active', 'Archived'];

export default function ChoresList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const chores = useQuery(api.chores.list);

  const filtered = (chores ?? []).filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'Required') return c.isRequired;
    if (activeTab === 'Optional') return !c.isRequired;
    if (activeTab === 'Active') return c.isActive;
    if (activeTab === 'Archived') return !c.isActive;
    return true;
  });

  return (
    <PageContainer
      title="Chores"
      subtitle={`${(chores ?? []).length} chore templates`}
      action={
        <Button onClick={() => navigate('/app/chores/new')} size="sm">
          <Plus size={16} className="mr-1" /> New Chore
        </Button>
      }
    >
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search chores..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {chores === undefined ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <ChoreCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<ListChecks size={24} />} title="No chores found" description="Try adjusting your filters or create a new chore." />
      ) : (
        <div className="space-y-3">
          {filtered.map(chore => (
            <ChoreCard key={chore._id} chore={{ id: chore._id, title: chore.title, description: chore.description, category: chore.category, recurrence: chore.recurrence, isRequired: chore.isRequired, approvalMode: chore.approvalMode, photoProofRequired: chore.photoProofRequired, baseTokens: chore.baseTokens, earlyCompletionBonus: chore.earlyCompletionBonus, earlyBonusValue: chore.earlyBonusValue, streakBonus: chore.streakBonus, streakBonusValue: chore.streakBonusValue, assignedChildIds: chore.assignedChildIds as unknown as string[], isActive: chore.isActive, dueTime: chore.dueTime }} onClick={() => navigate(`/app/chores/${chore._id}`)} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
