'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PageHeader from '@/components/page-header';
import type { Pet } from '@/lib/types';
import { cn } from '@/lib/utils';

function BookAppointmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const vetId = searchParams.get('vetId');
  const vetName = searchParams.get('vetName');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [reason, setReason] = useState('');

  const petsCollection = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/pets`);
  }, [user, firestore]);
  
  const { data: pets, loading: loadingPets } = useCollection<Pet>(petsCollection);
  
  useEffect(() => {
    if (pets && pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !vetId || !selectedPetId || !date) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill out all fields.' });
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedPet = pets?.find(p => p.id === selectedPetId);
      if (!selectedPet) {
        toast({ variant: 'destructive', title: 'Pet not found.' });
        setIsLoading(false);
        return;
      }
      
      const [hours, minutes] = time.split(':').map(Number);
      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(hours, minutes);

      await addDoc(collection(firestore, `users/${user.uid}/appointments`), {
        ownerId: user.uid,
        petId: selectedPetId,
        petName: selectedPet.name,
        veterinarianId: vetId,
        veterinarianName: vetName,
        appointmentDateTime: Timestamp.fromDate(appointmentDateTime),
        reasonForVisit: reason,
        status: 'Scheduled',
      });

      toast({ title: 'Appointment Booked!', description: `Your appointment with ${vetName} is confirmed.` });
      router.push('/appointments');

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({ variant: 'destructive', title: 'Booking Failed', description: 'Could not book the appointment. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Book Appointment" />
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>You are booking an appointment with <span className="font-bold">{vetName}</span>.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pet">For Pet</Label>
                {loadingPets ? <Loader2 className="animate-spin" /> : (
                  <Select onValueChange={setSelectedPetId} value={selectedPetId} disabled={!pets || pets.length === 0}>
                    <SelectTrigger id="pet">
                      <SelectValue placeholder="Select a pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets?.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea id="reason" placeholder="e.g., Annual checkup, not eating..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || !selectedPetId || loadingPets}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Appointment'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookAppointmentForm />
        </Suspense>
    )
}
