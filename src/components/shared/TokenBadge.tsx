import { cn } from '@/lib/utils';

interface TokenBadgeProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TokenBadge({ amount, size = 'md', className }: TokenBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-semibold bg-token-gold/15 text-token-gold',
      size === 'sm' && 'text-xs px-2 py-0.5',
      size === 'md' && 'text-sm px-2.5 py-1',
      size === 'lg' && 'text-base px-3 py-1.5',
      className,
    )}>
      🪙 {amount}
    </span>
  );
}
