'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Bell, Pill, Syringe, Stethoscope, Bone, Loader2, Info, LucideIcon } from 'lucide-react';
import type { Pet, Reminder } from '@/lib/types';
import PageHeader from '@/components/page-header';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

const reminderIcons: { [key: string]: LucideIcon } = {
  Vaccination: Syringe,
  Feeding: Bone,
  Medication: Pill,
  Checkup: Stethoscope,
  Other: Bell,
};

function ReminderCard({ reminder }: { reminder: Reminder }) {
  const Icon = reminderIcons[reminder.type] || Bell;
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold">{reminder.description}</p>
          <p className="text-sm text-muted-foreground">{format(reminder.scheduledDateTime.toDate(), 'PPP p')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RemindersPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

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

  const remindersQuery = useMemoFirebase(() => {
    if (!user || !firestore || !selectedPetId) return null;
    return query(collection(firestore, `users/${user.uid}/pets/${selectedPetId}/reminders`), orderBy('scheduledDateTime', 'asc'));
  }, [user, firestore, selectedPetId]);

  const { data: reminders, loading: loadingReminders } = useCollection<Reminder>(remindersQuery);
  
  const isLoading = loadingPets || loadingReminders;

  return (
    <div>
      <PageHeader title="Health Reminders">
        <Button size="sm" disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </PageHeader>
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Select a Pet</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPets ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <Select onValueChange={setSelectedPetId} value={selectedPetId ?? ''} disabled={!pets || pets.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pet to see reminders" />
                </SelectTrigger>
                <SelectContent>
                  {pets?.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        <h2 className="text-lg font-semibold pt-4">Upcoming Reminders</h2>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && reminders && reminders.length > 0 && (
          reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))
        )}

        {!isLoading && (!reminders || reminders.length === 0) && (
          <Card className="text-center py-10">
            <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                    <Info className="h-8 w-8 text-muted-foreground" />
                </div>
              <CardTitle>No Reminders Found</CardTitle>
              <CardDescription>
                {selectedPetId ? 'There are no upcoming reminders for this pet.' : 'Please select a pet to view reminders.'}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
