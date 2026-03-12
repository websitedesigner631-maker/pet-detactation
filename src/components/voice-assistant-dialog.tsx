'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mic, Bot, Volume2, Loader2, Languages } from 'lucide-react';
import { voiceAssistant } from '@/ai/flows/voice-assistant';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  command: z.string().min(1, 'Please enter a command or question.'),
  language: z.enum(['en', 'hi', 'or']).default('en'),
});

type FormData = z.infer<typeof formSchema>;

export default function VoiceAssistantDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    responseText: string;
    audioResponse: string;
  } | null>(null);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { command: '', language: 'en' },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setResponse(null);
    }
    setIsOpen(open);
  };

  const playAudio = (audioDataUri: string) => {
    const audio = new Audio(audioDataUri);
    audio.play().catch((e) => {
      console.error('Audio playback failed:', e);
      toast({
        variant: 'destructive',
        title: 'Playback Error',
        description: 'Could not play the audio response.',
      });
    });
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await voiceAssistant(data);
      setResponse(result);
      playAudio(result.audioResponse);
    } catch (error: any) {
      console.error('Voice assistant error:', error);
      const isRateLimitError = error?.message?.includes('RESOURCE_EXHAUSTED') || error?.message?.includes('429');
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: isRateLimitError
          ? 'You have exceeded the request limit. Please wait a while and try again.'
          : 'Could not get a response from the assistant.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-20 h-16 w-16 rounded-full shadow-lg"
        aria-label="Open Voice Assistant"
      >
        <Mic className="h-8 w-8" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot /> Voice Assistant
            </DialogTitle>
            <DialogDescription>
              Ask a question and get a spoken response.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="command">Your Question</Label>
              <Controller
                name="command"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="command"
                    placeholder="e.g., 'My dog is not eating.'"
                    {...field}
                  />
                )}
              />
              {errors.command && (
                <p className="text-sm text-destructive">{errors.command.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Languages className="h-4 w-4" /> Response Language
              </Label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en" id="en" />
                      <Label htmlFor="en">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hi" id="hi" />
                      <Label htmlFor="hi">Hindi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="or" id="or" />
                      <Label htmlFor="or">Odia</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Answer...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" /> Ask
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>

          {response && (
            <div className="mt-4">
              <Alert>
                <AlertTitle className="flex items-center justify-between">
                  AI Response
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => playAudio(response.audioResponse)}
                    aria-label="Play audio response"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </AlertTitle>
                <AlertDescription>{response.responseText}</AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
