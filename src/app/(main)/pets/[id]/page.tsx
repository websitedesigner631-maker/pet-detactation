'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  MoreVertical,
  CheckCircle,
  FileText,
  User,
  PawPrint,
  Cake,
  Scale,
  BookHeart,
  Activity,
  HeartPulse,
  Sparkles,
  Bone,
  BrainCircuit,
  Loader2,
} from 'lucide-react';
import { pets } from '@/lib/data';
import PageHeader from '@/components/page-header';
import Link from 'next/link';
import { getPetCareInfo, type PetCareInfoOutput } from '@/ai/flows/get-pet-care-info';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-card">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-semibold">{label}</span>
    </div>
    <span className="text-muted-foreground">{value}</span>
  </div>
);

function CareGuide({ careInfo, breed }: { careInfo: PetCareInfoOutput, breed: string }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Breed & Care Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
              <h3 className="font-semibold text-lg mb-2">About the {breed}</h3>
              <p className="text-sm text-muted-foreground">{careInfo.breedInfo}</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="diet">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center gap-2"><Bone /> Diet</div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground prose-sm">
                  {careInfo.careGuide.diet}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="exercise">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center gap-2"><Activity /> Exercise</div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground prose-sm">
                  {careInfo.careGuide.exercise}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="grooming">
              <AccordionTrigger className="font-semibold">
               <div className="flex items-center gap-2"><BookHeart /> Grooming</div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground prose-sm">
                  {careInfo.careGuide.grooming}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="health">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center gap-2"><HeartPulse /> Common Health Issues</div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground prose-sm">
                  {careInfo.careGuide.commonHealthIssues}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    );
  }

export default function PetProfilePage({ params }: { params: { id: string } }) {
  const [careInfo, setCareInfo] = useState<PetCareInfoOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const pet = pets.find((p) => p.id === params.id);

  if (!pet) {
    notFound();
  }
  
  const handleGenerateCareGuide = async () => {
    setIsLoading(true);
    setCareInfo(null);
    try {
      const result = await getPetCareInfo({ petType: pet.petType, breed: pet.breed });
      setCareInfo(result);
      toast({
        title: "Care Guide Generated!",
        description: `AI-powered care info for the ${pet.breed} breed is ready.`,
      });
    } catch (e) {
      console.error("Failed to get pet care info:", e);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "The AI could not generate the care guide. This may be due to rate limits. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-muted/30">
      <PageHeader title="Pet Profile">
        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </PageHeader>

      <div className="p-4 space-y-5">
        <Card className="rounded-3xl overflow-hidden shadow-lg border-0">
          <div className="relative">
            <Image
              src={pet.avatarUrl}
              alt={pet.name}
              width={600}
              height={400}
              className="w-full h-80 object-cover"
              data-ai-hint={`${pet.breed}`}
              priority
            />
            <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm p-3 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold text-card-foreground">{pet.name}</h2>
              <p className="text-muted-foreground">{pet.breed}</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-green-200 bg-green-50/50 dark:bg-green-900/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-500 text-white h-9 w-9 flex items-center justify-center rounded-full">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-green-700 dark:text-green-300">Vaccinations Up to Date</p>
              <p className="text-sm text-muted-foreground">Last checked: Oct 12, 2023</p>
            </div>
          </CardContent>
        </Card>

        {careInfo ? (
            <CareGuide careInfo={careInfo} breed={pet.breed} />
        ) : (
            <Button onClick={handleGenerateCareGuide} disabled={isLoading} className="w-full h-14 text-lg rounded-xl shadow-md">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-3 animate-spin" />
                        Generating Guide...
                    </>
                ) : (
                    <>
                        <BrainCircuit className="mr-3" />
                        Generate AI Breed Guide
                    </>
                )}
            </Button>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase text-muted-foreground px-2">
            General Information
          </h3>
          <div className="space-y-2">
            <InfoRow icon={User} label="Name" value={pet.name} />
            <InfoRow icon={PawPrint} label="Type" value={pet.petType} />
            <InfoRow icon={Cake} label="Age" value={`${pet.age} Years`} />
            <InfoRow icon={Scale} label="Weight" value={`${pet.weight} kg`} />
          </div>
        </div>
        
        <Link href={`/pets/${pet.id}/history`}>
          <Button size="lg" className="w-full h-14 text-lg rounded-xl shadow-md">
            <FileText className="mr-3" />
            View Medical History
          </Button>
        </Link>
      </div>
    </div>
  );
}
