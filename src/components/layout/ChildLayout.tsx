import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { Bell, Home, ListChecks, Gift, Clock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNavItems = [
  { title: 'Home', path: '/child/dashboard', icon: Home },
  { title: 'Chores', path: '/child/chores', icon: ListChecks },
  { title: 'Rewards', path: '/child/rewards', icon: Gift },
  { title: 'History', path: '/child/history', icon: Clock },
  { title: 'Settings', path: '/child/settings', icon: Settings },
];

export function ChildLayout() {
  const { user } = useUser();
  const location = useLocation();

  const currentTitle = bottomNavItems.find(item => location.pathname.startsWith(item.path))?.title || 'Home';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 glass border-b h-14 flex items-center px-4 gap-3">
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
            {user?.firstName?.[0] ?? '?'}
          </span>
        )}
        <h1 className="font-display font-bold text-lg flex-1">{currentTitle}</h1>
        <Link to="/child/notifications" className="relative p-2 rounded-lg hover:bg-muted">
          <Bell size={20} />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-20 max-w-lg mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {bottomNavItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors min-w-[56px]',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className={cn('text-[10px]', active && 'font-semibold')}>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
