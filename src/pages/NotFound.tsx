import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="font-display text-6xl font-bold text-muted-foreground">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Link to="/" className="text-primary hover:underline text-sm">Go home</Link>
      </div>
    </div>
  );
}
