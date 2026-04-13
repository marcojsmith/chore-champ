import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'primary' | 'success' | 'streak' | 'warning' | 'info' | 'destructive' | 'accent' | 'default';
  subtitle?: string;
}

const variantClasses: Record<NonNullable<MetricCardProps['variant']>, string> = {
  primary:     'bg-primary/10 text-primary',
  success:     'bg-success/10 text-success',
  streak:      'bg-streak/10 text-streak',
  warning:     'bg-warning/10 text-warning',
  info:        'bg-info/10 text-info',
  destructive: 'bg-destructive/10 text-destructive',
  accent:      'bg-accent/10 text-accent',
  default:     'bg-muted text-muted-foreground',
};

export function MetricCard({ title, value, icon, variant = 'default', subtitle }: MetricCardProps) {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center mb-3', variantClasses[variant])}>
          {icon}
        </div>
        <p className="text-2xl font-bold font-display">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
