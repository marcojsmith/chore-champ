import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentChild } from '@/hooks/useCurrentChild';
import { PageContainer } from '@/components/shared/PageContainer';
import { ChoreCard } from '@/components/shared/ChoreCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { choreTemplates, choreOccurrences } from '@/mocks/data';
import { ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = ['Today', 'Upcoming', 'Overdue', 'Completed'];

export default function MyChores() {
  const child = useCurrentChild();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Today');

  const myOccurrences = choreOccurrences.filter(o => o.childId === child.id);

  const filtered = myOccurrences.filter(o => {
    if (activeTab === 'Today') return o.status === 'due' || o.status === 'pending';
    if (activeTab === 'Upcoming') return o.status === 'scheduled';
    if (activeTab === 'Overdue') return o.status === 'overdue';
    if (activeTab === 'Completed') return o.status === 'completed' || o.status === 'approved';
    return true;
  });

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

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ListChecks size={24} />}
          title="No chores here"
          description={activeTab === 'Completed' ? 'Complete some chores to see them here!' : "You're all caught up!"}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(o => {
            const template = choreTemplates.find(c => c.id === o.choreTemplateId);
            if (!template) return null;
            return (
              <ChoreCard
                key={o.id}
                chore={template}
                occurrence={o}
                onClick={() => navigate(`/child/chores/${o.id}`)}
              />
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
