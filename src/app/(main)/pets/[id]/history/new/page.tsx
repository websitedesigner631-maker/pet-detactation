'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlusCircle, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function NewMedicalRecordPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const petId = params.id as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState('');
  const [nextDueDate, setNextDueDate] = useState<Date | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }

    if (!title || !recordType || !date || !description) {
      toast({ variant: 'destructive', title: 'Please fill out all required fields.' });
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(firestore, `users/${user.uid}/pets/${petId}/medicalRecords`), {
        petId,
        title,
        recordType,
        description,
        date: Timestamp.fromDate(date),
        ...(nextDueDate && { nextDueDate: Timestamp.fromDate(nextDueDate) }),
      });
      toast({ title: 'Medical record added successfully!' });
      router.push(`/pets/${petId}/history`);
    } catch (error) {
      console.error("Error adding medical record: ", error);
      toast({ variant: 'destructive', title: 'Failed to add record.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Medical Record" />
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Record Details</CardTitle>
              <CardDescription>Add a new health event for your pet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Annual Checkup" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="recordType">Record Type</Label>
                    <Select onValueChange={setRecordType} value={recordType}>
                        <SelectTrigger id="recordType">
                        <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Vaccination">Vaccination</SelectItem>
                        <SelectItem value="LabReport">Lab Report</SelectItem>
                        <SelectItem value="Prescription">Prescription</SelectItem>
                        <SelectItem value="VetNote">Vet Note</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                  <Label>Date of Event</Label>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description / Notes</Label>
                <Textarea id="description" placeholder="Notes from the vet, test results, etc." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
                <div className="space-y-2">
                  <Label>Next Due Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !nextDueDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nextDueDate ? format(nextDueDate, "PPP") : <span>Pick a due date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={nextDueDate} onSelect={setNextDueDate} />
                    </PopoverContent>
                  </Popover>
                </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Save Record
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
