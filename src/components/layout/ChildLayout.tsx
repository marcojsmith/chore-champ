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
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b h-14 flex items-center px-4 gap-3 shadow-sm">
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20" />
        ) : (
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold ring-2 ring-primary/20">
            {user?.firstName?.[0] ?? '?'}
          </span>
        )}
        <h1 className="font-display font-bold text-lg flex-1">{currentTitle}</h1>
        <Link to="/child/notifications" className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell size={19} />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-24 max-w-lg mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t shadow-nav-top">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {bottomNavItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[60px] min-h-[44px] relative"
              >
                <div className={cn(
                  'flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200',
                  active ? 'bg-primary text-primary-foreground shadow-sm scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}>
                  <item.icon size={19} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={cn(
                  'text-[10px] transition-colors',
                  active ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}