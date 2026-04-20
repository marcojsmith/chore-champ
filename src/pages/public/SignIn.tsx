import { SignIn } from '@clerk/react';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-start py-16 min-h-[calc(100vh-8rem)]">
      <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/app/dashboard" />
    </div>
  );
}