import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { rewardCategories } from '@/lib/constants';
import { useIsOnline } from '@/components/shared/OfflineBanner';

export default function RewardSuggest() {
  const navigate = useNavigate();
  const isOnline = useIsOnline();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const suggest = useMutation(api.requestedRewards.suggest);

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error('Please enter a title'); return; }
    setSubmitting(true);
    try {
      await suggest({ title: title.trim(), description: description.trim(), category: category || undefined });
      toast.success('Suggestion sent to your caregiver!');
      navigate('/child/rewards');
    } catch {
      toast.error('Failed to send suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Suggest a Reward"
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/child/rewards')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      <div className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="title">What do you want?</Label>
          <Input id="title" className="mt-1" placeholder="e.g. Extra screen time, New game..." value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Why do you want it? (optional)</Label>
          <Textarea id="description" className="mt-1" placeholder="Tell your caregiver more..." value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <Label>Category (optional)</Label>
          <Select value={category} onValueChange={(v) => setCategory(String(v))}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {rewardCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full h-12" onClick={handleSubmit} disabled={!title.trim() || submitting || !isOnline}>
          {submitting ? 'Sending...' : 'Send Suggestion'}
        </Button>
        {!isOnline && <p className="text-xs text-muted-foreground text-center">You're offline — connect to submit</p>}
      </div>
    </PageContainer>
  );
}