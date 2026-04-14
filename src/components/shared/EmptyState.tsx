import type { ReactNode } from 'react';

type EmptyVariant = 'chores' | 'notifications' | 'done' | 'rewards' | 'default';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

const illustrations: Record<EmptyVariant, ReactNode> = {
  chores: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-2">
      <circle cx="32" cy="32" r="28" fill="currentColor" fillOpacity="0.08" />
      <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M32 16v4M32 44v4M16 32h4M44 32h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-2">
      <circle cx="32" cy="32" r="28" fill="currentColor" fillOpacity="0.08" />
      <path d="M32 20a10 10 0 0 1 10 10v6l3 4H19l3-4v-6a10 10 0 0 1 10-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M29 44a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  done: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-2">
      <circle cx="32" cy="32" r="28" fill="currentColor" fillOpacity="0.1" />
      <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d="M24 18l2 2-2 2M40 18l2 2-2 2M32 12v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  ),
  rewards: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-2">
      <circle cx="32" cy="32" r="28" fill="currentColor" fillOpacity="0.08" />
      <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M32 26v12M26 32h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-2">
      <circle cx="32" cy="32" r="28" fill="currentColor" fillOpacity="0.08" />
      <path d="M32 28v8M32 40v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
};

const defaults: Record<EmptyVariant, { title: string; description: string }> = {
  chores:        { title: 'Nothing on the list yet',  description: 'Add a chore to get started!' },
  notifications: { title: 'All quiet here',           description: 'Enjoy the calm.' },
  done:          { title: "You're all done!",          description: 'Go enjoy your day.' },
  rewards:       { title: 'No rewards yet',            description: 'Complete chores to earn tokens.' },
  default:       { title: 'Nothing here',              description: '' },
};

export function EmptyState({ variant = 'default', title, description, action, icon }: EmptyStateProps) {
  const d = defaults[variant];
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      {icon ?? illustrations[variant]}
      <h3 className="font-display font-semibold text-base text-foreground">{title ?? d.title}</h3>
      {(description ?? d.description) && (
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description ?? d.description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
