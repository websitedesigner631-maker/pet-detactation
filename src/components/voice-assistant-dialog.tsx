'use client';

import { useState, useEffect, useRef } from 'react';
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

// Add this interface for cross-browser compatibility
interface IWindow extends Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

export default function VoiceAssistantDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [response, setResponse] = useState<{
    responseText: string;
    audioResponse: string;
  } | null>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { command: '', language: 'en' },
  });

  const selectedLanguage = watch('language');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as IWindow).SpeechRecognition ||
      (window as IWindow).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError(
        'Speech recognition is not supported in this browser. Please type your command.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after first detection of silence
    recognition.interimResults = true; // Get results as they are being recognized

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setValue('command', transcript, { shouldValidate: true });
    };

    recognition.onerror = (event) => {
      if (
        event.error === 'not-allowed' ||
        event.error === 'service-not-allowed'
      ) {
        setMicError(
          'Microphone access denied. Please enable it in your browser settings to use the voice feature.'
        );
      } else {
        setMicError(`An error occurred: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [setValue]);

  // Update recognition language when user changes it
  useEffect(() => {
    if (recognitionRef.current) {
      let lang = 'en-US';
      if (selectedLanguage === 'hi') lang = 'hi-IN';
      if (selectedLanguage === 'or') lang = 'or-IN';
      recognitionRef.current.lang = lang;
    }
  }, [selectedLanguage]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (isListening) recognitionRef.current?.stop();
      reset();
      setResponse(null);
      setMicError(null);
    }
    setIsOpen(open);
  };

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setMicError(null);
      setResponse(null);
      // clear command before listening
      setValue('command', '');
      setIsListening(true);
      recognitionRef.current?.start();
    }
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
    if (isListening) {
      recognitionRef.current?.stop();
    }
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await voiceAssistant(data);
      setResponse(result);
      playAudio(result.audioResponse);
    } catch (error: any) {
      console.error('Voice assistant error:', error);
      const isRateLimitError =
        error?.message?.includes('RESOURCE_EXHAUSTED') ||
        error?.message?.includes('429');
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
              Click the mic to speak, or type your question and press Ask.
            </DialogDescription>
          </DialogHeader>

          {micError && (
            <Alert variant="destructive">
              <Mic className="h-4 w-4" />
              <AlertTitle>Microphone Error</AlertTitle>
              <AlertDescription>{micError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="command">Your Question</Label>
              <div className="relative">
                <Controller
                  name="command"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="command"
                      placeholder={
                        isListening
                          ? 'Listening...'
                          : 'e.g., "My dog is not eating."'
                      }
                      {...field}
                      rows={3}
                      className="pr-12"
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleListen}
                  disabled={!recognitionRef.current}
                  className="absolute right-1 bottom-1 h-8 w-8 text-muted-foreground"
                  aria-label={
                    isListening ? 'Stop listening' : 'Start listening'
                  }
                >
                  {isListening ? (
                    <Mic className="h-5 w-5 text-destructive animate-pulse" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {errors.command && (
                <p className="text-sm text-destructive">
                  {errors.command.message}
                </p>
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
                  'Ask'
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
