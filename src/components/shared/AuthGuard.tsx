import { useAuth } from '@clerk/react';
import { Navigate } from 'react-router-dom';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  return <>{children}</>;
}