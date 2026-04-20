import { SignUp } from '@clerk/react';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-start py-16 min-h-[calc(100vh-8rem)]">
      <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/setup" />
    </div>
  );
}