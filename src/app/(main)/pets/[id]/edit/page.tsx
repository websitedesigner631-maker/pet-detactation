'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Pet } from '@/lib/types';

export default function EditPetPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const petId = params.id as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const petDocRef = useMemoFirebase(() => {
    if (!user || !firestore || !petId) return null;
    return doc(firestore, `users/${user.uid}/pets`, petId);
  }, [user, firestore, petId]);
  
  const { data: pet, loading: loadingPet } = useDoc<Pet>(petDocRef);

  const [formState, setFormState] = useState({
    name: '',
    petType: '',
    breed: '',
    age: '',
    weight: '',
  });

  useEffect(() => {
    if (pet) {
      setFormState({
        name: pet.name,
        petType: pet.petType,
        breed: pet.breed,
        age: String(pet.age),
        weight: String(pet.weight),
      });
    }
  }, [pet]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormState({ ...formState, [field]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !firestore || !petDocRef) {
          toast({ variant: 'destructive', title: 'An error occurred.' });
          return;
      }
      
      const { name, petType, breed, age, weight } = formState;

      if (!name || !petType || !breed || !age || !weight) {
          toast({ variant: 'destructive', title: 'Please fill out all fields.' });
          return;
      }

      setIsLoading(true);
      try {
          await updateDoc(petDocRef, {
              name,
              petType,
              breed,
              age: Number(age),
              weight: Number(weight),
          });
          toast({ title: 'Pet profile updated!' });
          router.push(`/pets/${petId}`);
      } catch (error) {
          console.error("Error updating pet: ", error);
          toast({ variant: 'destructive', title: 'Failed to update pet.' });
      } finally {
          setIsLoading(false);
      }
  }

  if (loadingPet) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }
  
  if (!pet) {
    return notFound();
  }

  return (
    <div>
      <PageHeader title={`Edit ${pet.name}`} />
      <div className="p-4">
        <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Pet Information</CardTitle>
            <CardDescription>Update your pet's details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet's Name</Label>
              <Input id="name" placeholder="e.g., Buddy" value={formState.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet-type">Pet Type</Label>
              <Select onValueChange={(value) => handleSelectChange('petType', value)} value={formState.petType}>
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
              <Label htmlFor="breed">Breed</Label>
              <Input id="breed" placeholder="e.g., Golden Retriever" value={formState.breed} onChange={handleInputChange}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input id="age" type="number" placeholder="e.g., 3" value={formState.age} onChange={handleInputChange}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" placeholder="e.g., 28" value={formState.weight} onChange={handleInputChange}/>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
        </form>
      </div>
    </div>
  );
}
