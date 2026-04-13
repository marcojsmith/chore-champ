import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/shared/PageContainer';
import { ChildProfileCard } from '@/components/shared/ChildProfileCard';
import { children } from '@/mocks/data';

export default function ChildrenList() {
  const navigate = useNavigate();
  return (
    <PageContainer title="Children" subtitle={`${children.length} children in your household`}>
      <div className="grid sm:grid-cols-2 gap-3">
        {children.map(child => (
          <ChildProfileCard key={child.id} child={child} onClick={() => navigate(`/app/children/${child.id}`)} />
        ))}
      </div>
    </PageContainer>
  );
}
