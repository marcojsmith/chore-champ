import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/react';
import { Bell, Menu, X, LayoutDashboard, ListChecks, Gift, ClipboardCheck, BarChart3, Users, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import Setup from '@/pages/caregiver/Setup';

const navItems = [
  { title: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { title: 'Chores', path: '/app/chores', icon: ListChecks },
  { title: 'Rewards', path: '/app/rewards', icon: Gift },
  { title: 'Approvals', path: '/app/approvals', icon: ClipboardCheck },
  { title: 'Reports', path: '/app/reports', icon: BarChart3 },
  { title: 'Children', path: '/app/children', icon: Users },
  { title: 'Settings', path: '/app/settings', icon: Settings },
];

export function CaregiverLayout() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const household = useQuery(api.households.getMyHousehold);

  if (household === null) {
    return <Setup />;
  }
  if (household === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentTitle = navItems.find(item => location.pathname.startsWith(item.path))?.title || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card flex flex-col transition-transform duration-300 lg:translate-x-0 shadow-sm border-r',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>

        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <Link to="/app/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm shadow-sm">
              ✨
            </div>
            <span className="font-display font-bold text-lg tracking-tight">ChoreChamp</span>
          </Link>
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-1">Navigation</p>
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px]',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon size={17} />
                <span className="flex-1">{item.title}</span>
                {active && <ChevronRight size={14} className="opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted transition-colors group">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-border" />
            ) : (
              <span className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold ring-2 ring-border">
                {user?.firstName?.[0] ?? '?'}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName ?? user?.firstName ?? 'User'}</p>
              <p className="text-xs text-muted-foreground">Caregiver</p>
            </div>
            <button
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-lg opacity-0 group-hover:opacity-100"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b h-14 flex items-center px-4 gap-3 shadow-sm">
          <button className="lg:hidden p-1.5 rounded-xl hover:bg-muted transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className="font-display font-bold text-lg flex-1">{currentTitle}</h1>
          <ThemeToggle />
          <Link to="/app/notifications" className="relative p-2 rounded-xl hover:bg-muted transition-colors">
            <Bell size={19} />
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}