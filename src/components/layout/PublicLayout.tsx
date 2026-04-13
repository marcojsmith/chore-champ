import { Outlet, Link } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="font-display font-bold text-lg">ChoreChamp</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/sign-in">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">Sign In</button>
            </Link>
            <Link to="/sign-up">
              <button className="text-sm font-medium bg-primary text-primary-foreground rounded-lg px-4 py-1.5 hover:bg-primary/90 transition-colors">Get Started</button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © 2024 ChoreChamp. Making chores fun for the whole family.
        </div>
      </footer>
    </div>
  );
}
