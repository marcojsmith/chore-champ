import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'At least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useSignIn();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error: createError } = await signIn.create({ identifier: data.email });
      if (createError) { toast.error(createError.message ?? 'Sign in failed'); return; }
      const { error: pwError } = await signIn.password({ password: data.password });
      if (pwError) { toast.error(pwError.message ?? 'Sign in failed'); return; }
      const { error: finalError } = await signIn.finalize();
      if (finalError) { toast.error(finalError.message ?? 'Sign in failed'); return; }
      toast.success('Welcome back!');
      navigate('/app/dashboard');
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      toast.error(clerkErr.errors?.[0]?.message ?? 'Sign in failed');
    }
  };

  return (
    <div className="container max-w-md py-16 animate-fade-in">
      <Card className="border">
        <CardHeader className="text-center">
          <span className="text-3xl mb-2">✨</span>
          <CardTitle className="font-display text-2xl">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your ChoreChamp account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="parent@family.com" {...register('email')} className="mt-1" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} className="mt-1" />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
