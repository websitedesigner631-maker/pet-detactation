'use client';
import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse, ScanLine, Loader2, Info, PlusCircle } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { MedicalRecord, AIScanResult, HealthHistoryEvent } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function HistoryEventCard({ event }: { event: HealthHistoryEvent }) {
  const Icon = event.type === 'Record' ? HeartPulse : ScanLine;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div className="w-px flex-grow bg-border" />
      </div>
      <div className="pb-6 w-full">
        <p className="text-sm text-muted-foreground">{format(event.date, 'MMMM d, yyyy')}</p>
        <p className="font-semibold text-lg">{event.title}</p>
        <p className="text-sm text-muted-foreground">{event.details}</p>
      </div>
    </div>
  );
}

export default function PetHistoryPage() {
  const params = useParams();
  const petId = params.id as string;
  const { user } = useUser();
  const firestore = useFirestore();

  const medicalRecordsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/pets/${petId}/medicalRecords`), orderBy('date', 'desc'));
  }, [user, firestore, petId]);
  
  const scanResultsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/pets/${petId}/aiScanResults`), orderBy('scanDate', 'desc'));
  }, [user, firestore, petId]);

  const { data: medicalRecords, loading: loadingRecords } = useCollection<MedicalRecord>(medicalRecordsQuery);
  const { data: scanResults, loading: loadingScans } = useCollection<AIScanResult>(scanResultsQuery);

  const historyEvents = useMemo((): HealthHistoryEvent[] => {
    const events: HealthHistoryEvent[] = [];

    medicalRecords?.forEach(record => {
      events.push({
        id: record.id,
        date: record.date.toDate(),
        type: 'Record',
        title: record.title,
        details: record.description,
        source: record,
      });
    });

    scanResults?.forEach(scan => {
        events.push({
            id: scan.id,
            date: scan.scanDate.toDate(),
            type: 'Scan',
            title: `AI Scan: ${scan.detectedProblems[0] || 'Analysis'}`,
            details: scan.explanation,
            source: scan,
        });
    });

    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [medicalRecords, scanResults]);

  const loading = loadingRecords || loadingScans;

  if (!petId) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Pet Health History">
        <Link href={`/pets/${petId}/history/new`}>
            <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add Record
            </Button>
        </Link>
      </PageHeader>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>A chronological record of your pet's health events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {!loading && historyEvents.length > 0 && (
              historyEvents.map((event) => <HistoryEventCard key={event.type + event.id} event={event} />)
            )}
            {!loading && historyEvents.length === 0 && (
              <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
                <Info className="h-6 w-6"/>
                <p>No health history events recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
