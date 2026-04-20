import { useQuery, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "convex/_generated/api";
import { PageContainer } from '@/components/shared/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, CheckCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Id } from "convex/_generated/dataModel";

type NotificationWithMeta = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: 'chore_completed' | 'chore_approved' | 'chore_rejected' | 'reward_requested' | 'reward_approved' | 'reward_rejected' | 'reminder';
};

export default function ChildNotifications() {
  const navigate = useNavigate();
  const notifications = useQuery(api.notifications.listMine);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  const items: NotificationWithMeta[] = notifications?.map(n => ({
    id: n._id,
    title: n.title,
    body: n.body,
    read: n.read,
    createdAt: format(new Date(n._creationTime), 'MMM d, h:mm a'),
    type: n.type,
  })) ?? [];

  const unreadCount = items.filter(n => !n.read).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markRead({ notificationId: id as Id<"notifications"> });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success('All marked as read!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark all as read');
    }
  };

  if (notifications === undefined) {
    return (
      <PageContainer
        title="Notifications"
        subtitle="Loading..."
        action={
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors" title="Close">
            <X size={18} />
          </button>
        }
      >
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : undefined}
      action={
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}><CheckCheck size={14} className="mr-1" /> Read all</Button>
          )}
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors" title="Close">
            <X size={18} />
          </button>
        </div>
      }
    >
      {items.length === 0 ? (
        <EmptyState icon={<Bell size={24} />} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-1">
          {items.map(n => (
            <div
              key={n.id}
              className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => !n.read && handleMarkRead(n.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
