import { useAuth } from '@clerk/react';
import { useQuery } from 'convex/react';
import { Navigate } from 'react-router-dom';
import { api } from 'convex/_generated/api';

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return <Spinner />;
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  return <>{children}</>;
}

export function RoleGuard({
  requiredRole,
  redirectTo,
  children
}: {
  requiredRole: 'caregiver' | 'child';
  redirectTo: string;
  children: React.ReactNode
}) {
  const me = useQuery(api.users.getMe);
  if (me === undefined) {
    return <Spinner />;
  }
  if (me === null) {
    return <Navigate to="/sign-in" replace />;
  }
  if (me.role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}