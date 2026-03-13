'use client';

import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Veterinarian } from '@/lib/types';
import PageHeader from '@/components/page-header';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function VeterinarianProfilePage() {
  const params = useParams();
  const vetId = params.id as string;
  const firestore = useFirestore();

  const vetDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'veterinarians', vetId);
  }, [firestore, vetId]);

  const { data: vet, loading } = useDoc<Veterinarian>(vetDocRef);

  if (loading) {
    return (
      <div>
        <PageHeader title="Veterinarian Profile" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!vet) {
    return notFound();
  }

  return (
    <div>
      <PageHeader title="My Profile" />
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader className="items-center">
            <Image
              src={vet.profileImageUrl}
              alt={vet.name}
              width={100}
              height={100}
              className="rounded-full border-4 border-primary"
              data-ai-hint="person"
            />
            <CardTitle>{vet.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">{vet.email}</p>
            <div className="flex justify-center flex-wrap gap-2 mt-4">
              {vet.specialties.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
