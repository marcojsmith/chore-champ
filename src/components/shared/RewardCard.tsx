import type { Reward } from '@/mocks/data';
import { Card, CardContent } from '@/components/ui/card';
import { TokenBadge } from './TokenBadge';
import { cn } from '@/lib/utils';

interface RewardCardProps {
  reward: Reward;
  childBalance?: number;
  onClick?: () => void;
}

export function RewardCard({ reward, childBalance, onClick }: RewardCardProps) {
  const canAfford = childBalance !== undefined ? childBalance >= reward.tokenCost : undefined;

  return (
    <Card
      className={cn(
        'border card-hover cursor-pointer',
        canAfford === false && 'opacity-70',
        !reward.isActive && 'opacity-50',
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {reward.imageEmoji && (
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl shrink-0">
              {reward.imageEmoji}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{reward.title}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{reward.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <TokenBadge amount={reward.tokenCost} size="sm" />
              {canAfford === false && childBalance !== undefined && (
                <span className="text-xs text-muted-foreground">
                  Need {reward.tokenCost - childBalance} more
                </span>
              )}
              {canAfford === true && (
                <span className="text-xs text-success font-medium">Can afford!</span>
              )}
            </div>
          </div>
        </div>
        {canAfford === false && childBalance !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-accent h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min((childBalance / reward.tokenCost) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
