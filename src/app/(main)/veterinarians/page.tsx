'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/page-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Veterinarian } from '@/lib/types';
import { Loader2 } from 'lucide-react';


export default function VeterinariansPage() {
  const firestore = useFirestore();
  
  const vetsCollection = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'veterinarians');
  }, [firestore]);
  
  const { data: veterinarians, loading } = useCollection<Veterinarian>(vetsCollection);

  return (
    <div>
      <PageHeader title="Find a Veterinarian" />
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground px-2">
          Choose a vet to book an appointment with.
        </p>

        {loading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>}

        {!loading && veterinarians && veterinarians.length > 0 ? (
            veterinarians.map((vet) => (
            <Card key={vet.id}>
                <CardContent className="p-4 flex gap-4">
                <Image
                    src={vet.profileImageUrl}
                    alt={`Dr. ${vet.name}`}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-primary/20 object-cover aspect-square"
                    data-ai-hint="veterinarian person"
                />
                <div className="flex-grow space-y-2">
                    <h3 className="font-bold text-lg">{vet.name}</h3>
                    <div className="flex flex-wrap gap-1">
                    {vet.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">{specialty}</Badge>
                    ))}
                    </div>
                    <Link href={`/book-appointment?vetId=${vet.id}&vetName=${encodeURIComponent(vet.name)}`}>
                    <Button className="w-full mt-2">Book Now</Button>
                    </Link>
                </div>
                </CardContent>
            </Card>
            ))
        ) : !loading && (
            <p className="text-center text-muted-foreground py-8">No veterinarians available at the moment.</p>
        )}
      </div>
    </div>
  );
}
