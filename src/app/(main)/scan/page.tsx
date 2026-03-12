'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, ScanLine, Stethoscope, Lightbulb, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import {
  scanPetProblem,
  type AIDiseaseScannerOutput,
} from '@/ai/flows/ai-disease-scanner';
import Link from 'next/link';

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [petType, setPetType] = useState<'Dog' | 'Cat' | 'Bird' | 'Other'>('Dog');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIDiseaseScannerOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleScan = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image or video of the symptom.',
      });
      return;
    }
    if (!preview) {
        toast({
          variant: 'destructive',
          title: 'File not ready',
          description: 'Please wait for the file to load.',
        });
        return;
      }

    setIsLoading(true);
    setResult(null);

    try {
      const output = await scanPetProblem({
        mediaDataUri: preview,
        petType,
      });
      setResult(output);
    } catch (error: any) {
      console.error('AI Scan Error:', error);
      const isRateLimitError = error?.message?.includes('RESOURCE_EXHAUSTED') || error?.message?.includes('429');
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: isRateLimitError
          ? 'You have exceeded the request limit. Please wait a while and try again.'
          : 'The AI scanner could not analyze the image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="AI Pet Scanner" />
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Scan a Pet Problem</CardTitle>
            <CardDescription>
              Upload a photo of your pet's symptom (e.g., skin, eyes, wound)
              and our AI will analyze it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pet-type">Pet Type</Label>
              <Select
                value={petType}
                onValueChange={(value: 'Dog' | 'Cat' | 'Bird' | 'Other') => setPetType(value)}
              >
                <SelectTrigger id="pet-type">
                  <SelectValue placeholder="Select pet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dog">Dog</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Bird">Bird</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture">Symptom Photo</Label>
              <div className="flex items-center gap-4">
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
                <label htmlFor="picture">
                  <Button asChild variant="outline" className="cursor-pointer">
                      <div>
                        <Upload className="h-4 w-4" />
                      </div>
                  </Button>
                </label>
              </div>
            </div>
            {preview && (
              <div className="flex justify-center">
                <Image
                  src={preview}
                  alt="Symptom preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover border"
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleScan} disabled={isLoading || !file} className="w-full h-12 text-lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ScanLine className="mr-2 h-5 w-5" />
                  Scan with AI
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {result && (
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>AI Scan Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="font-bold">Possible Issue: {result.possibleDisease}</AlertTitle>
                <AlertDescription>{result.explanation}</AlertDescription>
              </Alert>
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle className="font-bold">Suggested Care</AlertTitle>
                <AlertDescription>
                    <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: result.suggestedCareSteps.replace(/\n/g, '<br />') }} />
                </AlertDescription>
              </Alert>
               <Alert variant="destructive">
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                    This is an AI-generated suggestion and not a professional diagnosis. Please consult a veterinarian for accurate medical advice.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
                <Link href="/vet-consult" className="w-full">
                    <Button variant="secondary" className="w-full">
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Find a Veterinarian
                    </Button>
                </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
