'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BrainCircuit,
  Loader2,
  Calendar,
  Bone,
  Activity,
  BookHeart,
  Stethoscope,
  Sparkles,
  Train,
} from 'lucide-react';
import {
  generatePetSchedule,
  type GeneratePetScheduleOutput,
} from '@/ai/flows/generate-pet-schedule';
import PageHeader from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { pets } from '@/lib/data';
import type { Pet } from '@/lib/types';
import { LucideIcon } from 'lucide-react';

const categoryIcons: { [key: string]: LucideIcon } = {
  Feeding: Bone,
  Exercise: Activity,
  Grooming: BookHeart,
  Training: Train,
  Health: Stethoscope,
  Other: Sparkles,
};

export default function SchedulePage() {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets.length > 0 ? pets[0].id : null);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<GeneratePetScheduleOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateSchedule = async () => {
    if (!selectedPetId) {
      toast({
        variant: 'destructive',
        title: 'No pet selected',
        description: 'Please select a pet to generate a schedule for.',
      });
      return;
    }

    const pet = pets.find((p) => p.id === selectedPetId);
    if (!pet) return;

    setIsLoading(true);
    setSchedule(null);

    try {
      const result = await generatePetSchedule({
        petType: pet.petType,
        breed: pet.breed,
        age: pet.age,
      });
      setSchedule(result);
      toast({
        title: 'Schedule Generated!',
        description: `A sample schedule for ${pet.name} has been created.`,
      });
    } catch (error) {
      console.error('Schedule Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'The AI could not generate a schedule. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <div>
      <PageHeader title="AI Schedule Generator" />
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a Pet Schedule</CardTitle>
            <CardDescription>
              Select your pet and let our AI generate a personalized weekly care schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pets.length > 0 && selectedPet ? (
              <Select
                value={selectedPet.id}
                onValueChange={(id) => setSelectedPetId(id)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet: Pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} - {pet.breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground text-center">Please add a pet first.</p>
            )}
          </CardContent>
          <CardContent>
            <Button
              onClick={handleGenerateSchedule}
              disabled={isLoading || !selectedPetId}
              className="w-full h-12 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  Generate AI Schedule
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {schedule && schedule.suggestedSchedule.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar /> Suggested Schedule for {selectedPet?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.suggestedSchedule.map((item, index) => {
                const Icon = categoryIcons[item.category] || Sparkles;
                return (
                  <div key={index} className="flex gap-4 items-start">
                     <div className="flex-shrink-0 h-10 w-10 mt-1 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
