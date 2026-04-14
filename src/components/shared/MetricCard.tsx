import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'primary' | 'success' | 'streak' | 'warning' | 'info' | 'destructive' | 'accent' | 'default';
  subtitle?: string;
}

const variantClasses: Record<NonNullable<MetricCardProps['variant']>, { icon: string; border: string; value: string }> = {
  primary:     { icon: 'bg-primary/15 text-primary',       border: 'border-primary/20',      value: 'text-primary' },
  success:     { icon: 'bg-success/15 text-success',       border: 'border-success/20',      value: 'text-success' },
  streak:      { icon: 'bg-streak/15 text-streak',         border: 'border-streak/20',       value: 'text-streak' },
  warning:     { icon: 'bg-warning/15 text-warning',       border: 'border-warning/20',      value: 'text-warning' },
  info:        { icon: 'bg-info/15 text-info',             border: 'border-info/20',         value: 'text-info' },
  destructive: { icon: 'bg-destructive/15 text-destructive', border: 'border-destructive/20', value: 'text-destructive' },
  accent:      { icon: 'bg-accent/15 text-accent-foreground', border: 'border-accent/20',    value: 'text-accent-foreground' },
  default:     { icon: 'bg-muted text-muted-foreground',   border: 'border-border',          value: 'text-foreground' },
};

export function MetricCard({ title, value, icon, variant = 'default', subtitle }: MetricCardProps) {
  const classes = variantClasses[variant];
  return (
    <div
      className={cn('bg-card rounded-xl p-4 border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col items-center text-center card-base', classes.border)}
    >
      <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center mb-3', classes.icon)}>
        {icon}
      </div>
      <p className={cn('text-2xl font-bold font-display leading-none', classes.value)}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1.5 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}