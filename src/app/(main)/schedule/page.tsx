'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  PlusCircle,
  Trash2,
} from 'lucide-react';
import {
  generatePetSchedule,
  type GeneratePetScheduleOutput,
} from '@/ai/flows/generate-pet-schedule';
import PageHeader from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import type { Pet, ScheduleItem, ScheduleItemCategory } from '@/lib/types';
import { LucideIcon } from 'lucide-react';
import { useCollection, useUser, useFirestore } from '@/firebase';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';

const categoryIcons: { [key: string]: LucideIcon } = {
  Feeding: Bone,
  Exercise: Activity,
  Grooming: BookHeart,
  Training: Train,
  Health: Stethoscope,
  Other: Sparkles,
};

const scheduleCategories: ScheduleItemCategory[] = [
  'Feeding',
  'Exercise',
  'Grooming',
  'Training',
  'Health',
  'Other',
];

function AIGenerator({ pets, loadingPets }: { pets: Pet[] | null, loadingPets: boolean }) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] =
    useState<GeneratePetScheduleOutput | null>(null);
  const { toast } = useToast();

   useEffect(() => {
    if (pets && pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);


  const handleGenerateSchedule = async () => {
    if (!selectedPetId) {
      toast({
        variant: 'destructive',
        title: 'No pet selected',
        description: 'Please select a pet to generate a schedule for.',
      });
      return;
    }

    const pet = pets?.find((p) => p.id === selectedPetId);
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
    } catch (error: any) {
      console.error('Schedule Generation Error:', error);
      const isRateLimitError =
        error?.message?.includes('RESOURCE_EXHAUSTED') ||
        error?.message?.includes('429');
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: isRateLimitError
          ? 'You have exceeded the request limit. Please wait a while and try again.'
          : 'The AI could not generate a schedule. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPet = pets?.find((p) => p.id === selectedPetId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create with AI</CardTitle>
          <CardDescription>
            Select your pet and let our AI generate a personalized weekly care
            schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingPets ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : (pets && pets.length > 0 && selectedPet) ? (
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
            <p className="text-muted-foreground text-center">
              Please add a pet first.
            </p>
          )}
        </CardContent>
        <CardFooter>
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
        </CardFooter>
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
  );
}

function ManualSchedule({ pets, loadingPets }: { pets: Pet[] | null, loadingPets: boolean }) {
  const { user, loading: loadingUser } = useUser();
  const firestore = useFirestore();
  const { data: manualSchedule, loading: loadingSchedule } = useCollection<ScheduleItem>(`users/${user?.uid}/schedule`, { orderBy: ['createdAt', 'desc'] });
  
  const [newItem, setNewItem] = useState({
    title: '',
    time: '',
    category: 'Feeding' as ScheduleItemCategory,
    petId: '',
  });

  useEffect(() => {
    if (pets && pets.length > 0 && !newItem.petId) {
      setNewItem(prev => ({...prev, petId: pets[0].id}));
    }
  }, [pets, newItem.petId]);
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.time || !newItem.petId) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill out all fields to add a schedule item.',
      });
      return;
    }
    if (!firestore || !user) return;

    try {
      await addDoc(collection(firestore, `users/${user.uid}/schedule`), {
        ...newItem,
        createdAt: new Date(),
      });
      setNewItem({
        title: '',
        time: '',
        category: 'Feeding',
        petId: newItem.petId,
      });
      toast({
        title: 'Item Added',
        description: `${newItem.title} has been added to your schedule.`,
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add item.'})
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!firestore || !user) return;
    try {
      await deleteDoc(doc(firestore, `users/${user.uid}/schedule`, id));
      toast({
        title: 'Item Removed',
        description: 'The schedule item has been removed.',
      });
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: 'Could not remove item.'})
    }
  };

  const petsWithSchedules = pets?.filter((pet) =>
    manualSchedule?.some((item) => item.petId === pet.id)
  );
  
  const isLoading = loadingPets || loadingUser || loadingSchedule;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a Schedule Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pet">Pet</Label>
            <Select
              value={newItem.petId}
              onValueChange={(value) => handleInputChange('petId', value)}
              disabled={!pets || pets.length === 0}
            >
              <SelectTrigger id="pet">
                <SelectValue placeholder="Select a pet" />
              </SelectTrigger>
              <SelectContent>
                {pets?.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={newItem.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Morning walk"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time / Frequency</Label>
            <Input
              id="time"
              value={newItem.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              placeholder="e.g., 7:00 AM"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newItem.category}
              onValueChange={(value: ScheduleItemCategory) =>
                handleInputChange('category', value)
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {scheduleCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAddItem}
            className="w-full"
            disabled={!pets || pets.length === 0 || isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add to Schedule
          </Button>
        </CardFooter>
      </Card>
      
      {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin"/>}

      {!isLoading && manualSchedule && manualSchedule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Custom Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {petsWithSchedules?.map((pet) => (
              <div key={pet.id}>
                <h3 className="font-bold text-lg mb-2">{pet.name}'s Schedule</h3>
                <div className="space-y-3">
                  {manualSchedule
                    .filter((item) => item.petId === pet.id)
                    .map((item) => {
                      const Icon = categoryIcons[item.category] || Sparkles;
                      return (
                        <div
                          key={item.id}
                          className="flex gap-4 items-start p-3 rounded-lg bg-card border"
                        >
                          <div className="flex-shrink-0 h-10 w-10 mt-1 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.time}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SchedulePage() {
  const { user } = useUser();
  const { data: pets, loading: loadingPets } = useCollection<Pet>(`users/${user?.uid}/pets`);

  return (
    <div>
      <PageHeader title="Pet Schedule" />
      <div className="p-4">
        <Tabs defaultValue="ai-generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-generator">AI Generator</TabsTrigger>
            <TabsTrigger value="my-schedule">My Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="ai-generator" className="mt-6">
            <AIGenerator pets={pets} loadingPets={loadingPets} />
          </TabsContent>
          <TabsContent value="my-schedule" className="mt-6">
            <ManualSchedule pets={pets} loadingPets={loadingPets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
