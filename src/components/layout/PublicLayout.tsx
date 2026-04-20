import { Outlet, Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-base">
              ✨
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ChoreChamp</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/sign-in">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted">
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="text-sm font-semibold bg-primary text-primary-foreground rounded-lg px-5 py-2 hover:bg-primary/90 transition-colors shadow-sm">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="border-t py-8 bg-card/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-display font-semibold text-foreground mb-1">ChoreChamp</p>
          <p>© 2024 ChoreChamp. Making chores fun for the whole family.</p>
        </div>
      </footer>
    </div>
  );
}