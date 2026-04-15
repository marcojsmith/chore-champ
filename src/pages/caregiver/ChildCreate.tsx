import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const AVATAR_OPTIONS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸', '🦄', '🐙', '🦋', '🌟'];

const schema = z.object({
  name: z.string().min(2),
  age: z.number().min(1).max(18),
  avatar: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function ChildCreate() {
  const navigate = useNavigate();
  const createChild = useMutation(api.users.createChild);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      age: 0,
      avatar: AVATAR_OPTIONS[0],
    },
  });

  const selectedAvatar = watch('avatar');

  const onSubmit = async (data: FormData) => {
    try {
      await createChild({
        name: data.name,
        age: data.age,
        avatar: data.avatar,
      });
      toast.success('Child added! 🎉');
      navigate('/app/children');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add child');
    }
  };

  return (
    <PageContainer
      title="Add Child"
      action={
        <Button variant="ghost" size="sm" onClick={() => navigate('/app/children')}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Child Info</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} className="mt-1" placeholder="Enter child name" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...register('age', { valueAsNumber: true })} className="mt-1" placeholder="1-18" />
              {errors.age && <p className="text-xs text-destructive mt-1">{errors.age.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Avatar</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setValue('avatar', emoji)}
                  className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                    selectedAvatar === emoji
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Add Child</Button>
      </form>
    </PageContainer>
  );
}