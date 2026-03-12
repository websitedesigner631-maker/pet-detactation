import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import { pets, healthHistory } from '@/lib/data';
import PageHeader from '@/components/page-header';

export default function PetHistoryPage({ params }: { params: { id: string } }) {
  const pet = pets.find((p) => p.id === params.id);

  if (!pet) {
    notFound();
  }

  return (
    <div>
      <PageHeader title={`${pet.name}'s History`} />
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Health History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthHistory.map((event) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <HeartPulse className="h-4 w-4" />
                  </div>
                  <div className="w-px flex-grow bg-border" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.details}</p>
                </div>
              </div>
            ))}
             {healthHistory.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No health history events recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
