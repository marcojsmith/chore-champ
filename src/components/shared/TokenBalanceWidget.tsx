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
    <div
      className="rounded-lg p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, oklch(0.82 0.19 82) 0%, oklch(0.75 0.16 72) 100%)',
        boxShadow: 'var(--shadow-token-gold)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 -translate-y-1/2 translate-x-1/4"
        style={{ background: 'oklch(1 0 0)' }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 translate-y-1/2 -translate-x-1/4"
        style={{ background: 'oklch(1 0 0)' }} />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-white/25 flex items-center justify-center backdrop-blur-sm">
            <Coins size={16} className="text-white" />
          </div>
          <p className="font-display font-semibold text-sm text-white/90">Token Balance</p>
        </div>

        <div className="mb-4">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-display text-white leading-none relative">
              {available}
              <span className="absolute inset-0 token-shimmer pointer-events-none" aria-hidden="true" />
            </span>
            <span className="text-white/70 text-sm mb-1">available</span>
          </div>
          {reserved > 0 && (
            <p className="text-white/60 text-xs mt-1">{reserved} tokens reserved for pending rewards</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 rounded-lg p-2.5 backdrop-blur-sm text-center">
            <p className="text-white/70 text-[10px] font-medium uppercase tracking-wide">Earned</p>
            <p className="font-bold text-white text-sm mt-0.5">{totalEarned}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-2.5 backdrop-blur-sm text-center">
            <p className="text-white/70 text-[10px] font-medium uppercase tracking-wide">Spent</p>
            <p className="font-bold text-white text-sm mt-0.5">{totalSpent}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-2.5 backdrop-blur-sm text-center">
            <div className="flex items-center justify-center gap-0.5">
              <TrendingUp size={9} className="text-white/80" />
              <p className="text-white/70 text-[10px] font-medium uppercase tracking-wide">Week</p>
            </div>
            <p className="font-bold text-white text-sm mt-0.5">+{earnedThisWeek}</p>
          </div>
        </div>
      </div>
    </div>
  );
}