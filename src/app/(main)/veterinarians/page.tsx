import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/page-header';
import { veterinarians } from '@/lib/data';

export default function VeterinariansPage() {
  // In a real app, you would fetch this data from Firestore.
  // For now, we are using mock data.
  return (
    <div>
      <PageHeader title="Find a Veterinarian" />
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground px-2">
          Choose a vet to book an appointment with.
        </p>
        {veterinarians.map((vet) => (
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
        ))}
      </div>
    </div>
  );
}
