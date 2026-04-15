import { useNavigate } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { ChildProfileCard } from '@/components/shared/ChildProfileCard';
import { ChildProfileCardSkeleton } from '@/components/shared/skeletons';

export default function ChildrenList() {
  const navigate = useNavigate();
  const children = useQuery(api.users.listChildren);

  return (
    <PageContainer 
      title="Children" 
      subtitle={`${(children ?? []).length} children in your household`}
      action={
        <Button variant="default" size="sm" onClick={() => navigate('/app/children/new')}>
          Add Child
        </Button>
      }
    >
      {children === undefined ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3].map(i => <ChildProfileCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {children.map(child => (
            <ChildProfileCard key={child._id} child={{ id: child._id, name: child.name, age: child.age ?? 0, avatar: child.avatar, currentStreak: 0, longestStreak: 0, completionRate: 0 }} onClick={() => navigate(`/app/children/${child._id}`)} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
