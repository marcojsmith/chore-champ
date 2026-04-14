import type { ChoreStatus, RewardRequestStatus } from '@/mocks/data';
import { cn } from '@/lib/utils';

type Status = ChoreStatus | RewardRequestStatus | 'required' | 'optional';

const config: Record<Status, { label: string; className: string; pulse?: boolean }> = {
  scheduled:        { label: 'Scheduled',         className: 'bg-muted text-muted-foreground' },
  due:              { label: 'Due',                className: 'bg-info/15 text-info' },
  pending:          { label: 'Pending',            className: 'bg-muted text-muted-foreground' },
  in_progress:      { label: 'In Progress',       className: 'bg-info/15 text-info' },
  completed:        { label: 'Completed',          className: 'bg-success/15 text-success' },
  pending_approval: { label: 'Needs Approval',    className: 'bg-warning/15 text-warning' },
  approved:         { label: 'Approved',           className: 'bg-success/15 text-success' },
  rejected:         { label: 'Rejected',           className: 'bg-destructive/15 text-destructive' },
  overdue:          { label: 'Overdue',            className: 'bg-destructive/15 text-destructive', pulse: true },
  expired:          { label: 'Expired',            className: 'bg-muted text-muted-foreground' },
  required:         { label: 'Required',           className: 'bg-primary/10 text-primary' },
  optional:         { label: 'Optional',           className: 'bg-muted text-muted-foreground' },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, className, pulse } = config[status] ?? config.pending;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', className)}>
      {pulse && <span className="overdue-pulse h-1.5 w-1.5 rounded-full bg-destructive shrink-0" aria-hidden="true" />}
      {label}
    </span>
  );
}
