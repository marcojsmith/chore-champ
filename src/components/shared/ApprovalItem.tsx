import type { ChoreOccurrence, RewardRequest } from '@/mocks/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TokenBadge } from './TokenBadge';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface ChoreApprovalItemProps {
  occurrence: ChoreOccurrence;
  onApprove: () => void;
  onReject: () => void;
}

export function ChoreApprovalItem({ occurrence, onApprove, onReject }: ChoreApprovalItemProps) {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-medium text-sm">{occurrence.choreTitle}</p>
            <p className="text-xs text-muted-foreground">
              {occurrence.childName} · completed {occurrence.completedAt ? format(new Date(occurrence.completedAt), 'MMM d, h:mm a') : '—'}
            </p>
          </div>
          {occurrence.tokensEarned != null && <TokenBadge amount={occurrence.tokensEarned} size="sm" />}
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground" onClick={onApprove}>
            <Check size={14} className="mr-1" /> Approve
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10" onClick={onReject}>
            <X size={14} className="mr-1" /> Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface RewardApprovalItemProps {
  request: RewardRequest;
  onApprove: () => void;
  onReject: () => void;
}

export function RewardApprovalItem({ request, onApprove, onReject }: RewardApprovalItemProps) {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-medium text-sm">{request.rewardTitle}</p>
            <p className="text-xs text-muted-foreground">
              {request.childName} · requested {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
            </p>
          </div>
          <TokenBadge amount={request.tokenCost} size="sm" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground" onClick={onApprove}>
            <Check size={14} className="mr-1" /> Approve
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10" onClick={onReject}>
            <X size={14} className="mr-1" /> Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
