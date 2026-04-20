import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { PageContainer } from '@/components/shared/PageContainer';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TokenBadge } from '@/components/shared/TokenBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Clock, CheckCircle2, ImagePlus, X, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useIsOnline } from '@/components/shared/OfflineBanner';

export default function ChildChoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isOnline = useIsOnline();

  const submitChore = useMutation(api.choreOccurrences.submit);
  const getUploadUrl = useMutation(api.choreOccurrences.generateUploadUrl);
  const occurrences = useQuery(api.choreOccurrences.listForChildEnriched, {}) ?? [];
  const occurrence = occurrences.find(o => o._id === id);
  const suggestions = useQuery(api.rewards.getSmartSuggestions);

  if (!occurrence) return <PageContainer title="Loading..."><p>Loading...</p></PageContainer>;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleComplete = async () => {
    try {
      if (occurrence.photoProofRequired && !photoFile) {
        toast.error('Please upload a photo');
        return;
      }

      if (photoFile) {
        const uploadUrl = await getUploadUrl({});
        const result = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': photoFile.type },
          body: photoFile,
        });
        const { storageId } = await result.json() as { storageId: Id<'_storage'> };
        await submitChore({ occurrenceId: occurrence._id, photoStorageId: storageId });
      } else {
        await submitChore({ occurrenceId: occurrence._id });
      }
      setSubmitted(true);
      toast.success('Chore completed! 🎉 Great job!');
    } catch {
      toast.error('Failed to submit chore');
    }
  };

  const canComplete = occurrence.status === 'due' || occurrence.status === 'overdue' || occurrence.status === 'in_progress';

  return (
    <PageContainer
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/child/chores')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold font-display">{occurrence.choreTitle}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={submitted ? 'pending_approval' : occurrence.status} />
          </div>
        </div>

        <Card className="border">
          <CardContent className="p-4">
            <p className="text-muted-foreground">{occurrence.choreDescription}</p>
            <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={14} /> Due {format(new Date(occurrence.dueDate), 'h:mm a')}
              </span>
              {occurrence.photoProofRequired && (
                <span className="flex items-center gap-1"><Camera size={14} /> Photo required</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-token-gold/20 bg-token-gold/5">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">Token Reward</p>
            <div className="flex items-center gap-3">
              <TokenBadge amount={occurrence.baseTokens} />
            </div>
          </CardContent>
        </Card>

        {occurrence.photoProofRequired && !submitted && (
          <>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="Photo preview" className="max-h-48 mx-auto rounded-lg" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <>
                  <ImagePlus size={32} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">Upload Photo Proof</p>
                  <p className="text-xs">Tap to take or upload a photo</p>
                </>
              )}
            </div>
          </>
        )}

        {submitted ? (
          <>
            <Card className="border border-success/20 bg-success/5">
              <CardContent className="p-6 text-center">
                <CheckCircle2 size={48} className="mx-auto text-success mb-3" />
                <h3 className="font-display font-bold text-lg">Great job! 🎉</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {occurrence.approvalMode === 'manual'
                    ? 'Waiting for caregiver approval...'
                    : 'Your tokens have been awarded!'}
                </p>
              </CardContent>
            </Card>
            {suggestions && (
              <div className="space-y-3">
                {suggestions.affordable.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 text-success">Rewards you can get now</p>
                    <div className="space-y-2">
                      {suggestions.affordable.slice(0, 3).map(r => (
                        <div
                          key={r._id}
                          className="rounded-lg border bg-card p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => navigate(`/child/rewards/${r._id}`)}
                        >
                          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            {r.imageEmoji ? <span className="text-base">{r.imageEmoji}</span> : <Gift size={16} className="text-accent" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{r.title}</p>
                          </div>
                          <span className="text-xs font-medium text-accent shrink-0">{r.tokenCost} tokens</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {suggestions.nearMiss.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">Almost there</p>
                    <div className="space-y-2">
                      {suggestions.nearMiss.slice(0, 3).map(r => (
                        <div
                          key={r._id}
                          className="rounded-lg border bg-card p-3 flex items-center gap-3 opacity-70"
                        >
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            {r.imageEmoji ? <span className="text-base">{r.imageEmoji}</span> : <Gift size={16} className="text-muted-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{r.title}</p>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground shrink-0">+{r.tokensNeeded} more</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleComplete}
              disabled={!canComplete || !isOnline}
            >
              <CheckCircle2 size={18} className="mr-2" /> Complete Chore
            </Button>
            {!isOnline && (
              <p className="text-xs text-muted-foreground text-center mt-2">You're offline — connect to submit</p>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
