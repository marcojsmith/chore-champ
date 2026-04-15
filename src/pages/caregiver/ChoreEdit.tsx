import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { choreCategories } from '@/lib/constants';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category required'),
  recurrence: z.enum(['once', 'daily', 'weekly', 'monthly']),
  isRequired: z.boolean(),
  approvalMode: z.enum(['auto', 'manual']),
  photoProofRequired: z.boolean(),
  baseTokens: z.number().min(1, 'Must be at least 1'),
  earlyCompletionBonus: z.boolean(),
  earlyBonusValue: z.number().min(0),
  streakBonus: z.boolean(),
  streakBonusValue: z.number().min(0),
  dueTime: z.string(),
  assignedChildIds: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

export default function ChoreEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const children = useQuery(api.users.listChildren) ?? [];
  const chore = useQuery(api.chores.get, id ? { choreId: id as Id<"chores"> } : "skip");
  const updateChore = useMutation(api.chores.update);
  const [loaded, setLoaded] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      recurrence: 'daily',
      isRequired: true,
      approvalMode: 'auto',
      photoProofRequired: false,
      baseTokens: 5,
      earlyCompletionBonus: false,
      earlyBonusValue: 2,
      streakBonus: false,
      streakBonusValue: 3,
      dueTime: '17:00',
      assignedChildIds: [],
    },
  });

  useEffect(() => {
    if (chore && !loaded) {
      reset({
        title: chore.title,
        description: chore.description ?? '',
        category: chore.category,
        recurrence: chore.recurrence as FormData['recurrence'],
        isRequired: chore.isRequired,
        approvalMode: chore.approvalMode as FormData['approvalMode'],
        photoProofRequired: chore.photoProofRequired,
        baseTokens: chore.baseTokens,
        earlyCompletionBonus: chore.earlyCompletionBonus,
        earlyBonusValue: chore.earlyBonusValue,
        streakBonus: chore.streakBonus,
        streakBonusValue: chore.streakBonusValue,
        dueTime: chore.dueTime,
        assignedChildIds: chore.assignedChildIds ?? [],
      });
      setLoaded(true);
    }
  }, [chore, loaded, reset]);

  const watchAll = watch();

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    try {
      await updateChore({
        choreId: id as Id<"chores">,
        title: data.title,
        description: data.description ?? '',
        category: data.category,
        recurrence: data.recurrence,
        isRequired: data.isRequired,
        approvalMode: data.approvalMode,
        photoProofRequired: data.photoProofRequired,
        baseTokens: data.baseTokens,
        earlyCompletionBonus: data.earlyCompletionBonus,
        earlyBonusValue: data.earlyBonusValue,
        streakBonus: data.streakBonus,
        streakBonusValue: data.streakBonusValue,
        assignedChildIds: data.assignedChildIds as unknown as never[],
        dueTime: data.dueTime,
      });
      toast.success('Chore updated!');
      navigate(`/app/chores/${id}`);
    } catch {
      toast.error('Failed to update chore');
    }
  };

  if (chore === undefined) {
    return <PageContainer title="Loading..."><p>Loading...</p></PageContainer>;
  }

  return (
    <PageContainer
      title="Edit Chore"
      action={
        <Button variant="ghost" size="sm" onClick={() => navigate(`/app/chores/${id}`)}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        {/* Basic info */}
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} className="mt-1" placeholder="Make Your Bed" />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} className="mt-1" placeholder="Instructions for the chore..." />
            </div>
            <div>
              <Label>Category</Label>
              <Select onValueChange={(v) => { if (v) setValue('category', v as string); }}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {choreCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Assign To</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {children.map(child => (
                <label key={child._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                  <Checkbox
                    checked={watchAll.assignedChildIds?.includes(child._id)}
                    onCheckedChange={(checked) => {
                      const current = watchAll.assignedChildIds || [];
                      if (checked) {
                        setValue('assignedChildIds', [...current, child._id]);
                      } else {
                        setValue('assignedChildIds', current.filter((id: string) => id !== child._id));
                      }
                    }}
                  />
                  <span className="text-lg">{child.avatar}</span>
                  <span className="text-sm font-medium">{child.name}</span>
                  {child.age && <span className="text-xs text-muted-foreground">Age {child.age}</span>}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label>Recurrence</Label>
              <Select onValueChange={v => setValue('recurrence', v as FormData['recurrence'])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">One-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueTime">Due Time</Label>
              <Input id="dueTime" type="time" {...register('dueTime')} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Rules</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Required Chore</p>
                <p className="text-xs text-muted-foreground">Must be completed</p>
              </div>
              <Switch checked={watchAll.isRequired} onCheckedChange={v => setValue('isRequired', v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Manual Approval</p>
                <p className="text-xs text-muted-foreground">Caregiver must approve</p>
              </div>
              <Switch checked={watchAll.approvalMode === 'manual'} onCheckedChange={v => setValue('approvalMode', v ? 'manual' : 'auto')} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Photo Proof Required</p>
                <p className="text-xs text-muted-foreground">Child must upload a photo</p>
              </div>
              <Switch checked={watchAll.photoProofRequired} onCheckedChange={v => setValue('photoProofRequired', v)} />
            </div>
          </CardContent>
        </Card>

        {/* Tokens */}
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Token Rewards</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label htmlFor="baseTokens">Base Tokens</Label>
              <Input id="baseTokens" type="number" {...register('baseTokens', { valueAsNumber: true })} className="mt-1" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Early Completion Bonus</p>
                <p className="text-xs text-muted-foreground">Extra tokens for finishing early</p>
              </div>
              <Switch checked={watchAll.earlyCompletionBonus} onCheckedChange={v => setValue('earlyCompletionBonus', v)} />
            </div>
            {watchAll.earlyCompletionBonus && (
              <div>
                <Label htmlFor="earlyBonusValue">Early Bonus Tokens</Label>
                <Input id="earlyBonusValue" type="number" {...register('earlyBonusValue', { valueAsNumber: true })} className="mt-1" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Streak Bonus</p>
                <p className="text-xs text-muted-foreground">Bonus for consecutive completions</p>
              </div>
              <Switch checked={watchAll.streakBonus} onCheckedChange={v => setValue('streakBonus', v)} />
            </div>
            {watchAll.streakBonus && (
              <div>
                <Label htmlFor="streakBonusValue">Streak Bonus Tokens</Label>
                <Input id="streakBonusValue" type="number" {...register('streakBonusValue', { valueAsNumber: true })} className="mt-1" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border border-primary/20 bg-primary/5">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Preview</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <p><strong>{watchAll.title || 'Untitled Chore'}</strong></p>
              <p className="text-muted-foreground">
                {watchAll.recurrence} · {watchAll.isRequired ? 'Required' : 'Optional'} · {watchAll.approvalMode === 'manual' ? 'Manual approval' : 'Auto-approve'}
              </p>
              <div className="flex gap-2 items-center">
                <TokenBadge amount={watchAll.baseTokens || 0} size="sm" />
                {watchAll.earlyCompletionBonus && <span className="text-xs text-success">+{watchAll.earlyBonusValue} early</span>}
                {watchAll.streakBonus && <span className="text-xs text-streak">+{watchAll.streakBonusValue} streak</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => navigate(`/app/chores/${id}`)}>Cancel</Button>
        </div>
      </form>
    </PageContainer>
  );
}
