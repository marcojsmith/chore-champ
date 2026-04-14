import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { children, rewardCategories } from '@/mocks/data';
import { toast } from 'sonner';
import { ArrowLeft, ImagePlus } from 'lucide-react';

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  tokenCost: z.number().min(1, 'Must be at least 1'),
  category: z.string().min(1, 'Category required'),
  stockQuantity: z.number().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function RewardCreate() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tokenCost: 20, isActive: true },
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 500));
    toast.success('Reward created! 🎁');
    navigate('/app/rewards');
  };

  return (
    <PageContainer
      title="Create Reward"
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/app/rewards')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
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
              <p className="text-sm">Upload reward image</p>
              <p className="text-xs">Click to browse or drag and drop</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Eligible Children</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {children.map(child => (
                <label key={child.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                  <Checkbox defaultChecked />
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
          <Button type="submit" className="flex-1">Create Reward</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/app/rewards')}>Cancel</Button>
        </div>
      </form>
    </PageContainer>
  );
}
