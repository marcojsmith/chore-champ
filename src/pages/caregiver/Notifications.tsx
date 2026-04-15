import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { type Notification } from '@/mocks/data';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function CaregiverNotifications() {
  const notifications = useQuery(api.notifications.listMine);
  const markAllReadMutation = useMutation(api.notifications.markAllRead);

  const markAllRead = async () => {
    try {
      await markAllReadMutation();
      toast.success('All notifications marked as read');
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  const items = (notifications ?? []) as Array<{
    _id: string;
    title: string;
    body: string;
    read: boolean;
    _creationTime: number;
    type: string;
  }>;
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <PageContainer
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
      action={
        unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck size={14} className="mr-1" /> Mark all read
          </Button>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState icon={<Bell size={24} />} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-1">
          {items.map(n => {
            const notifId = n._id;
            const notifCreatedAt = new Date(n._creationTime).toISOString();
            const notificationType: Notification['type'] = 
              n.type === 'chore_completed' || n.type === 'chore_approved' || n.type === 'chore_rejected' ||
              n.type === 'reward_requested' || n.type === 'reward_approved' || n.type === 'reward_rejected' ||
              n.type === 'reminder'
                ? n.type as Notification['type']
                : 'reminder';
            return <NotificationItem key={notifId} notification={{
              id: notifId,
              userId: '',
              title: n.title,
              body: n.body,
              read: n.read,
              createdAt: notifCreatedAt,
              type: notificationType,
            }} />;
          })}
        </div>
      )}
    </PageContainer>
  );
}
