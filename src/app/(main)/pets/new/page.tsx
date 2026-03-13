'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { PlusCircle, Loader2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function NewPetPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    petType: '',
    breed: '',
    age: '',
    weight: '',
    avatarUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormState({ ...formState, [field]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !firestore) {
          toast({ variant: 'destructive', title: 'You must be logged in to add a pet.' });
          return;
      }
      
      const { name, petType, breed, age, weight } = formState;

      if (!name || !petType || !breed || !age || !weight) {
          toast({ variant: 'destructive', title: 'Please fill out all fields.' });
          return;
      }

      setIsLoading(true);
      try {
          await addDoc(collection(firestore, `users/${user.uid}/pets`), {
              ownerId: user.uid,
              name,
              petType,
              breed,
              age: Number(age),
              weight: Number(weight),
              // In a real app, you would handle image uploads. For now, a placeholder.
              avatarUrl: `https://picsum.photos/seed/${name}/400/400`
          });
          toast({ title: 'Pet added successfully!' });
          router.push('/pets');
      } catch (error) {
          console.error("Error adding pet: ", error);
          toast({ variant: 'destructive', title: 'Failed to add pet.' });
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <div>
      <PageHeader title="Add a New Pet" />
      <div className="p-4">
        <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Pet Information</CardTitle>
            <CardDescription>Tell us about your new friend.</CardDescription>
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
             <div className="space-y-2">
              <Label htmlFor="avatar">Upload Photo</Label>
              <Input id="avatar" type="file" disabled/>
               <p className="text-xs text-muted-foreground">File uploads coming soon.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Save Pet Profile
            </Button>
          </CardFooter>
        </Card>
        </form>
      </div>
    </div>
  );
}
