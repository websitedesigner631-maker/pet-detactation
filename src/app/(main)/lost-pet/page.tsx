'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import type { LostPetReport } from '@/lib/types';
import PageHeader from '@/components/page-header';
import { useCollection, useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

function LostPetCard({ report }: { report: LostPetReport }) {
  return (
    <Card>
      <CardContent className="p-4 flex gap-4">
        {report.petPhotoUrl && (
          <Image
            src={report.petPhotoUrl}
            alt={`Lost pet ${report.petName}`}
            width={100}
            height={100}
            className="rounded-lg object-cover"
            data-ai-hint="lost pet"
          />
        )}
        <div className="space-y-1">
          <h3 className="font-bold text-lg">Lost: {report.petName}</h3>
          <p className="text-sm text-muted-foreground">
            <strong>Last Seen:</strong> {report.lastSeen}
          </p>
          <p className="text-sm text-muted-foreground">{report.description}</p>
          <a href={`tel:${report.contact}`}>
            <Button variant="link" className="p-0 h-auto">
              Contact Owner: {report.contact}
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LostPetPage() {
  const { data: lostPetReports, loading } = useCollection<LostPetReport>('lostPetReports', { orderBy: ['createdAt', 'desc'], limit: 20});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [formState, setFormState] = useState({
    petName: '',
    lastSeen: '',
    description: '',
    contact: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'You must be logged in to report a lost pet.'});
        return;
    }
    if (!formState.petName || !formState.lastSeen || !formState.description || !formState.contact) {
        toast({ variant: 'destructive', title: 'Please fill all fields.'});
        return;
    }
    setIsSubmitting(true);
    try {
        await addDoc(collection(firestore, 'lostPetReports'), {
            ...formState,
            reporterId: user.uid,
            createdAt: serverTimestamp(),
            // In a real app, you would handle image uploads and get a URL.
            // For now, we'll use a placeholder.
            petPhotoUrl: `https://picsum.photos/seed/${Date.now()}/300/300`
        });
        toast({ title: 'Report submitted successfully!'});
        setFormState({ petName: '', lastSeen: '', description: '', contact: '' });
    } catch (error) {
        console.error("Error submitting report: ", error);
        toast({ variant: 'destructive', title: 'Failed to submit report.'});
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div>
      <PageHeader title="Lost Pet Alert" />
      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Report a Lost Pet</CardTitle>
            <CardDescription>
              Fill out this form to alert nearby users.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="petName">Pet's Name</Label>
              <Input id="petName" placeholder="e.g., Buddy" value={formState.petName} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastSeen">Last Seen Location</Label>
              <Input id="lastSeen" placeholder="e.g., Central Park" value={formState.lastSeen} onChange={handleInputChange}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., Brown terrier, blue collar..."
                value={formState.description} onChange={handleInputChange}
              />
            </div>
             <div className="space-y-1">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" placeholder="e.g., 555-123-4567" value={formState.contact} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Submit Report
            </Button>
          </CardFooter>
        </Card>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Search /> Nearby Lost Pets
          </h2>
          {loading && <div className='text-center'><Loader2 className="h-6 w-6 animate-spin" /></div>}
          {!loading && lostPetReports && lostPetReports.length > 0 ? (
            lostPetReports.map((report) => (
              <LostPetCard key={report.id} report={report} />
            ))
          ) : (
            !loading && <p className='text-center text-muted-foreground'>No lost pets reported nearby.</p>
          )}
        </div>
      </div>
    </div>
  );
}
