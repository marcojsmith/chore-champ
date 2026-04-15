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
import { rewardCategories } from '@/lib/constants';
import { toast } from 'sonner';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  tokenCost: z.number().min(1, 'Must be at least 1'),
  category: z.string().min(1, 'Category required'),
  imageEmoji: z.string().optional(),
  stockQuantity: z.number().optional(),
  eligibleChildIds: z.array(z.string()),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function RewardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const childrenList = useQuery(api.users.listChildren) ?? [];
  const reward = useQuery(api.rewards.get, id ? { rewardId: id as Id<"rewards"> } : "skip");
  const updateReward = useMutation(api.rewards.update);
  const [loaded, setLoaded] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tokenCost: 20, isActive: true, eligibleChildIds: [], imageEmoji: '🎁' },
  });

  useEffect(() => {
    if (reward && !loaded) {
      reset({
        title: reward.title,
        description: reward.description ?? '',
        tokenCost: reward.tokenCost,
        category: reward.category,
        imageEmoji: reward.imageEmoji,
        stockQuantity: reward.stockQuantity,
        eligibleChildIds: reward.eligibleChildIds ?? [],
        isActive: reward.isActive,
      });
      setLoaded(true);
    }
  }, [reward, loaded, reset]);

  const watchAll = watch();

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    try {
      await updateReward({
        rewardId: id as Id<"rewards">,
        title: data.title,
        description: data.description ?? '',
        tokenCost: data.tokenCost,
        category: data.category,
        imageEmoji: data.imageEmoji,
        stockQuantity: data.stockQuantity,
        eligibleChildIds: data.eligibleChildIds as unknown as never[],
      });
      toast.success('Reward updated!');
      navigate(`/app/rewards/${id}`);
    } catch {
      toast.error('Failed to update reward');
    }
  };

  if (reward === undefined) {
    return <PageContainer title="Loading..."><p>Loading...</p></PageContainer>;
  }

  return (
    <PageContainer
      title="Edit Reward"
      action={<Button variant="ghost" size="sm" onClick={() => navigate(`/app/rewards/${id}`)}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Reward Details</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} className="mt-1" placeholder="30 Min Extra Screen Time" />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} className="mt-1" placeholder="What this reward includes..." />
            </div>
            <div>
              <Label>Category</Label>
              <Select onValueChange={(v) => { if (v) setValue('category', v as string); }}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {rewardCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="tokenCost">Token Cost</Label>
              <Input id="tokenCost" type="number" {...register('tokenCost', { valueAsNumber: true })} className="mt-1" />
              {errors.tokenCost && <p className="text-xs text-destructive mt-1">{errors.tokenCost.message}</p>}
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity (optional)</Label>
              <Input id="stock" type="number" {...register('stockQuantity', { valueAsNumber: true })} className="mt-1" placeholder="Unlimited" />
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors">
              <ImagePlus size={24} className="mx-auto mb-2" />
              <p className="text-sm">Upload reward image (coming soon)</p>
              <p className="text-xs">Or use emoji below</p>
            </div>
            <div>
              <Label>Reward Emoji</Label>
              <Select onValueChange={(v) => { if (v) setValue('imageEmoji', v as string); }}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select emoji" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="🎁">🎁 Gift</SelectItem>
                  <SelectItem value="🍦">🍦 Ice Cream</SelectItem>
                  <SelectItem value="🎮">🎮 Game Time</SelectItem>
                  <SelectItem value="📱">📱 Screen Time</SelectItem>
                  <SelectItem value="🎬">🎬 Movie</SelectItem>
                  <SelectItem value="🍕">🍕 Pizza</SelectItem>
                  <SelectItem value="🧸">🧸 Toy</SelectItem>
                  <SelectItem value="⭐">⭐ Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Eligible Children</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {childrenList.map(child => (
                <label key={child._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                  <Checkbox
                    checked={watchAll.eligibleChildIds?.includes(child._id)}
                    onCheckedChange={(checked) => {
                      const current = watchAll.eligibleChildIds || [];
                      if (checked) {
                        setValue('eligibleChildIds', [...current, child._id]);
                      } else {
                        setValue('eligibleChildIds', current.filter((id: string) => id !== child._id));
                      }
                    }}
                  />
                  <span className="text-lg">{child.avatar}</span>
                  <span className="text-sm font-medium">{child.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">Available for children to request</p>
              </div>
              <Switch checked={watch('isActive')} onCheckedChange={v => setValue('isActive', v)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => navigate(`/app/rewards/${id}`)}>Cancel</Button>
        </div>
      </form>
    </PageContainer>
  );
}
