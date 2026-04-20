import { useState, useRef } from 'react';
import '@/types';
import { useNavigate } from 'react-router-dom';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { choreCategories } from '@/lib/constants';
import { ArrowLeft, Mic, MicOff, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsOnline } from '@/components/shared/OfflineBanner';

type ParsedChore = {
  title: string;
  description: string;
  category: string;
  recurrence: 'once' | 'daily' | 'weekly' | 'monthly';
  baseTokens: number;
  dueTime: string;
  assigneeName: string | null;
};

type Step = 'record' | 'parsing' | 'confirm';

export default function VoiceCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('record');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsed, setParsed] = useState<ParsedChore | null>(null);
  const [assignedChildIds, setAssignedChildIds] = useState<string[]>([]);
  const recognitionRef = useRef<unknown>(null);
  const isOnline = useIsOnline();

  const children = useQuery(api.users.listChildren) ?? [];
  const parseVoice = useAction(api.voice.parseVoiceCommand);
  const createChore = useMutation(api.chores.create);

  const hasSpeechAPI = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = () => {
    if (!hasSpeechAPI) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let full = '';
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript;
      }
      setTranscript(full);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    (recognitionRef.current as { stop?: () => void })?.stop?.();
    setIsListening(false);
  };

  const handleParse = async () => {
    if (!transcript.trim()) {
      toast.error('Please record or type a command first');
      return;
    }
    setStep('parsing');
    try {
      const result = await parseVoice({
        transcript,
        childNames: children.map(c => c.name),
      });
      setParsed(result);
      if (result.assigneeName) {
        const match = children.find(c => c.name.toLowerCase().includes(result.assigneeName!.toLowerCase()));
        if (match) setAssignedChildIds([match._id]);
      }
      setStep('confirm');
    } catch {
      toast.error('Failed to parse command. Please try again.');
      setStep('record');
    }
  };

  const handleCreate = async () => {
    if (!parsed) return;
    try {
      await createChore({
        title: parsed.title,
        description: parsed.description,
        category: parsed.category,
        recurrence: parsed.recurrence,
        isRequired: true,
        approvalMode: 'auto',
        photoProofRequired: false,
        baseTokens: parsed.baseTokens,
        earlyCompletionBonus: false,
        earlyBonusValue: 0,
        streakBonus: false,
        streakBonusValue: 0,
        assignedChildIds: assignedChildIds as unknown as Id<'users'>[],
        dueTime: parsed.dueTime,
      });
      toast.success('Chore created!');
      navigate('/app/chores');
    } catch {
      toast.error('Failed to create chore');
    }
  };

  const reset = () => {
    setStep('record');
    setTranscript('');
    setParsed(null);
    setAssignedChildIds([]);
    setIsListening(false);
    (recognitionRef.current as { stop?: () => void })?.stop?.();
  };

  return (
    <PageContainer
      title="Voice Create"
      action={<Button variant="ghost" size="sm" onClick={() => navigate('/app/chores')}><ArrowLeft size={16} className="mr-1" /> Back</Button>}
    >
      {step === 'record' && (
        <div className="space-y-6 max-w-lg">
          <Card className="border">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {hasSpeechAPI
                  ? 'Press the mic and say something like: "Create a daily chore for John to wash the dishes at 6pm"'
                  : 'Type your chore command below'}
              </p>

              {hasSpeechAPI && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    'mx-auto flex h-20 w-20 items-center justify-center rounded-full transition-all',
                    isListening
                      ? 'bg-destructive text-destructive-foreground animate-pulse'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                </button>
              )}

              {isListening && (
                <p className="text-xs text-muted-foreground animate-pulse">Listening...</p>
              )}

              {(transcript || !hasSpeechAPI) && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    {hasSpeechAPI ? 'Transcript (edit if needed)' : 'Your command'}
                  </Label>
                  <Textarea
                    value={transcript}
                    onChange={e => setTranscript(e.target.value)}
                    placeholder='e.g. "Create a daily chore for Emma to clean her room at 5pm, worth 10 tokens"'
                    className="min-h-[80px] text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            className="w-full h-12"
            onClick={handleParse}
            disabled={!transcript.trim() || !isOnline}
          >
            Parse Command
          </Button>
          {!isOnline && (
            <p className="text-xs text-muted-foreground text-center mt-2">You're offline — connect to submit</p>
          )}
        </div>
      )}

      {step === 'parsing' && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Parsing your command...</p>
        </div>
      )}

      {step === 'confirm' && parsed && (
        <div className="space-y-4 max-w-lg">
          <Card className="border border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" /> Chore Extracted — Review & Edit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  className="mt-1"
                  value={parsed.title}
                  onChange={e => setParsed({ ...parsed, title: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea
                  className="mt-1"
                  value={parsed.description}
                  onChange={e => setParsed({ ...parsed, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Category</Label>
                  <Select value={parsed.category || ''} onValueChange={v => setParsed({ ...parsed, category: String(v) })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {choreCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Recurrence</Label>
                  <Select value={parsed.recurrence || ''} onValueChange={v => setParsed({ ...parsed, recurrence: v as ParsedChore['recurrence'] })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Base Tokens</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={parsed.baseTokens}
                    onChange={e => setParsed({ ...parsed, baseTokens: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Due Time</Label>
                  <Input
                    type="time"
                    className="mt-1"
                    value={parsed.dueTime}
                    onChange={e => setParsed({ ...parsed, dueTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-2 block">Assign To</Label>
                <div className="space-y-1">
                  {children.map(child => (
                    <label key={child._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                      <Checkbox
                        checked={assignedChildIds.includes(child._id)}
                        onCheckedChange={checked => {
                          if (checked) {
                            setAssignedChildIds(prev => [...prev, child._id]);
                          } else {
                            setAssignedChildIds(prev => prev.filter(id => id !== child._id));
                          }
                        }}
                      />
                      <span className="text-lg">{child.avatar}</span>
                      <span className="text-sm font-medium">{child.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="flex-1 h-12" onClick={handleCreate} disabled={!isOnline}>
              Create Chore
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw size={16} className="mr-1" /> Redo
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}