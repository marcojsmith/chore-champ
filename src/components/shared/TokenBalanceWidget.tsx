import { Card, CardContent } from '@/components/ui/card';
import { Coins, TrendingUp } from 'lucide-react';

interface TokenBalanceWidgetProps {
  available: number;
  reserved: number;
  totalEarned: number;
  totalSpent: number;
  earnedThisWeek: number;
}

export function TokenBalanceWidget({ available, reserved, totalEarned, totalSpent, earnedThisWeek }: TokenBalanceWidgetProps) {
  return (
    <Card className="border bg-gradient-to-br from-token-gold/10 to-token-gold/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-token-gold/20 text-token-gold flex items-center justify-center">
            <Coins size={16} />
          </div>
          <p className="font-display font-semibold text-sm">Token Balance</p>
        </div>
        <div className="flex items-end gap-1 mb-4">
          <span className="text-3xl font-bold font-display text-token-gold">{available}</span>
          <span className="text-sm text-muted-foreground mb-1">available</span>
          {reserved > 0 && (
            <span className="text-sm text-muted-foreground mb-1 ml-2">({reserved} reserved)</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-background/60 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Earned Total</p>
            <p className="font-bold text-sm">{totalEarned}</p>
          </div>
          <div className="bg-background/60 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Spent Total</p>
            <p className="font-bold text-sm">{totalSpent}</p>
          </div>
          <div className="bg-background/60 rounded-lg p-2">
            <div className="flex items-center justify-center gap-0.5 text-success">
              <TrendingUp size={10} />
              <p className="text-xs">This Week</p>
            </div>
            <p className="font-bold text-sm text-success">+{earnedThisWeek}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
