import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { useAuth } from '@clerk/react';
import { SignUp, SignIn } from '@clerk/react';
import { api } from 'convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function JoinHousehold() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [isAccepting, setIsAccepting] = useState(false);

  const inviteInfo = useQuery(api.invites.getInviteInfo, token ? { token } : 'skip');
  const acceptInvite = useMutation(api.invites.acceptInvite);

  const handleAccept = () => {
    if (!token || !inviteInfo || isAccepting) return;
    setIsAccepting(true);
    acceptInvite({ token })
      .then(() => {
        toast.success(`Welcome to ${inviteInfo.householdName}!`);
        navigate('/child/dashboard');
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to join household');
        setIsAccepting(false);
      });
  };

  if (!token) return <div className="flex justify-center py-16"><p>Invalid invite link.</p></div>;

  if (!isLoaded || inviteInfo === undefined) {
    return (
      <div className="flex justify-center items-center py-16 min-h-[calc(100vh-8rem)]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!inviteInfo || inviteInfo.isExpired || inviteInfo.isUsed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-[calc(100vh-8rem)] gap-4">
        <span className="text-4xl">🔗</span>
        <h1 className="font-display text-xl font-bold">Invite link invalid</h1>
        <p className="text-muted-foreground text-sm">
          {!inviteInfo ? 'This link does not exist.' : inviteInfo.isUsed ? 'This invite has already been used.' : 'This invite has expired.'}
        </p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center py-12 min-h-[calc(100vh-8rem)] gap-6">
        <div className="text-center">
          <span className="text-5xl">{inviteInfo.childAvatar}</span>
          <h1 className="font-display text-2xl font-bold mt-3">
            Hey {inviteInfo.childName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            You've been invited to join <strong>{inviteInfo.householdName}</strong> on ChoreChamp
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setMode('signup')}
            className={`px-4 py-1.5 rounded-full transition-colors ${mode === 'signup' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Create Account
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`px-4 py-1.5 rounded-full transition-colors ${mode === 'signin' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Sign In
          </button>
        </div>
        {mode === 'signup' ? (
          <SignUp routing="path" path={`/join/${token}`} fallbackRedirectUrl={`/join/${token}`} />
        ) : (
          <SignIn routing="path" path={`/join/${token}`} fallbackRedirectUrl={`/join/${token}`} />
        )}
      </div>
    );
  }

  if (isAccepting) {
    return (
      <div className="flex justify-center items-center py-16 min-h-[calc(100vh-8rem)]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-12 min-h-[calc(100vh-8rem)] gap-6">
      <div className="text-center">
        <span className="text-5xl">{inviteInfo.childAvatar}</span>
        <h1 className="font-display text-2xl font-bold mt-3">
          Hey {inviteInfo.childName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          You've been invited to join <strong>{inviteInfo.householdName}</strong> on ChoreChamp
        </p>
      </div>
      <Button onClick={handleAccept} size="lg">
        Join Household
      </Button>
    </div>
  );
}