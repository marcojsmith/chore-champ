import type { Notification } from '@/mocks/data';
import { cn } from '@/lib/utils';
import { Bell, CheckCircle2, Gift, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeIcon: Record<Notification['type'], React.ReactNode> = {
  chore_completed: <CheckCircle2 size={14} className="text-success" />,
  chore_approved:  <CheckCircle2 size={14} className="text-primary" />,
  reward_requested:<Gift size={14} className="text-accent" />,
  reward_approved: <Gift size={14} className="text-success" />,
  reminder:        <Clock size={14} className="text-warning" />,
};

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50',
        !notification.read && 'bg-primary/5',
      )}
    >
      <div className="mt-0.5 shrink-0">
        {typeIcon[notification.type] ?? <Bell size={14} className="text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm', !notification.read && 'font-semibold')}>{notification.title}</p>
        <p className="text-xs text-muted-foreground truncate">{notification.body}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
      )}
    </button>
  );
}
