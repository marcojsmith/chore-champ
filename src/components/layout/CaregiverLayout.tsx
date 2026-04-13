import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/react';
import { Bell, Menu, X, LayoutDashboard, ListChecks, Gift, ClipboardCheck, BarChart3, Users, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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

  const currentTitle = navItems.find(item => location.pathname.startsWith(item.path))?.title || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r flex flex-col transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-14 px-4 border-b">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="font-display font-bold text-lg">ChoreChamp</span>
          </Link>
          <button className="lg:hidden p-1" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon size={18} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                {user?.firstName?.[0] ?? '?'}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName ?? user?.firstName ?? 'User'}</p>
              <p className="text-xs text-muted-foreground">Caregiver</p>
            </div>
            <button onClick={() => signOut()} className="text-muted-foreground hover:text-foreground">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 glass border-b h-14 flex items-center px-4 gap-3">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className="font-display font-bold text-lg flex-1">{currentTitle}</h1>
          <Link to="/app/notifications" className="relative p-2 rounded-lg hover:bg-muted">
            <Bell size={20} />
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
