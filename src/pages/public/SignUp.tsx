import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@clerk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'At least 8 characters'),
  householdName: z.string().min(2, 'Household name required'),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useSignUp();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error: createError } = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ').slice(1).join(' ') || undefined,
        unsafeMetadata: { householdName: data.householdName },
      });
      if (createError) { toast.error(createError.message ?? 'Sign up failed'); return; }
      const { error: finalError } = await signUp.finalize();
      if (finalError) {
        // Email verification may be required
        navigate('/sign-in');
        return;
      }
      toast.success('Welcome to ChoreChamp! 🎉');
      navigate('/app/dashboard');
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      toast.error(clerkErr.errors?.[0]?.message ?? 'Sign up failed');
    }
  };

  return (
    <div className="container max-w-md py-16 animate-fade-in">
      <Card className="border">
        <CardHeader className="text-center">
          <span className="text-3xl mb-2">✨</span>
          <CardTitle className="font-display text-2xl">Create your household</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Set up ChoreChamp for your family</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="Sarah" {...register('name')} className="mt-1" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="householdName">Household Name</Label>
              <Input id="householdName" placeholder="The Johnson Family" {...register('householdName')} className="mt-1" />
              {errors.householdName && <p className="text-xs text-destructive mt-1">{errors.householdName.message}</p>}
            </div>
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
              {isSubmitting ? 'Creating...' : 'Create Household'}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
