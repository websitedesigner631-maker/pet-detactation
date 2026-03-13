'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Trash2, ShieldAlert, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Veterinarian } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const ADMIN_EMAIL = 'rraghabbarik@gmail.com';

function AdminDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    specialties: '', // Comma-separated
    profileImageUrl: '',
    email: '',
  });

  const vetsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'veterinarians');
  }, [firestore]);

  const { data: veterinarians, loading: loadingVets } = useCollection<Veterinarian>(vetsCollection);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  };

  const handleAddVet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    if (!formState.name || !formState.specialties || !formState.email) {
      toast({ variant: 'destructive', title: 'Please fill all required fields.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'veterinarians'), {
        name: formState.name,
        email: formState.email,
        specialties: formState.specialties.split(',').map(s => s.trim()).filter(Boolean),
        profileImageUrl: formState.profileImageUrl || `https://picsum.photos/seed/${Date.now()}/200/200`,
      });
      toast({ title: 'Veterinarian Added' });
      setFormState({ name: '', specialties: '', profileImageUrl: '', email: '' });
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVet = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'veterinarians', id));
      toast({ title: 'Veterinarian Removed' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Veterinarian</CardTitle>
          <CardDescription>
            The veterinarian will need to sign up with the same email to access their dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAddVet}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Dr. Jane Doe" value={formState.name} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="dr.jane@example.com" value={formState.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties (comma-separated)</Label>
              <Input id="specialties" placeholder="Cardiology, Surgery" value={formState.specialties} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileImageUrl">Profile Image URL (Optional)</Label>
              <Input id="profileImageUrl" placeholder="https://..." value={formState.profileImageUrl} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Add Veterinarian
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Manage Veterinarians</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {loadingVets && <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {!loadingVets && veterinarians && veterinarians.length > 0 ? (
                veterinarians.map((vet) => (
                    <div key={vet.id} className="flex items-center gap-4 p-2 rounded-lg border">
                        <Image
                            src={vet.profileImageUrl}
                            alt={vet.name}
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                            data-ai-hint="person"
                        />
                        <div className="flex-grow">
                            <p className="font-bold">{vet.name}</p>
                            <p className="text-sm text-muted-foreground">{vet.email}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {vet.specialties.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteVet(vet.id)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                    </div>
                ))
            ) : !loadingVets && (
                <p className="text-center text-muted-foreground">No veterinarians found.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user?.email !== ADMIN_EMAIL) {
    return (
      <div>
        <PageHeader title="Access Denied" />
        <div className="p-4">
          <Card className="text-center py-10 bg-destructive/10 border-destructive/20">
            <CardHeader>
              <div className="mx-auto bg-destructive/20 rounded-full p-3 w-fit">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Access Denied</CardTitle>
              <CardDescription className="text-destructive/80">
                You do not have permission to view this page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Admin Dashboard" />
      <AdminDashboard />
    </div>
  );
}
