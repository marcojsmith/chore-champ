import { useState } from 'react';
import { useCurrentChild } from '@/hooks/useCurrentChild';
import { PageContainer } from '@/components/shared/PageContainer';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { notifications } from '@/mocks/data';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ChildNotifications() {
  const child = useCurrentChild();
  const [items, setItems] = useState(notifications.filter(n => n.userId === child.id));
  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All read!');
  };

  return (
    <PageContainer
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : undefined}
      action={
        unreadCount > 0
          ? <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck size={14} className="mr-1" /> Read all</Button>
          : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState icon={<Bell size={24} />} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-1">
          {items.map(n => <NotificationItem key={n.id} notification={n} />)}
        </div>
      )}
    </PageContainer>
  );
}
