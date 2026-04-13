import type { ReactNode } from 'react';

interface PageContainerProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function PageContainer({ title, subtitle, action, children }: PageContainerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          {title && <h1 className="font-display font-bold text-2xl">{title}</h1>}
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}
