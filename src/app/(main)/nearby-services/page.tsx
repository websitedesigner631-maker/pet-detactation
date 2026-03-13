'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Loader2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { ServiceLocation } from '@/lib/types';

export default function NearbyServicesPage() {
  const firestore = useFirestore();
  const servicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'serviceLocations');
  }, [firestore]);

  const { data: vetServices, loading } = useCollection<ServiceLocation>(servicesQuery);

  return (
    <div>
      <PageHeader title="Nearby Pet Services" />
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground px-2">
          Find veterinary clinics, shops, and other services near you.
        </p>
        {loading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin"/></div>}
        {!loading && vetServices && vetServices.length > 0 ? (
            vetServices.map((service) => (
            <Card key={service.id}>
                <CardHeader>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>
                    {service.address}
                    </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{service.contactNumber}</span>
                </div>
                <a href={`tel:${service.contactNumber}`}>
                    <Button variant="outline" className="mt-2 w-full">
                    Call Now
                    </Button>
                </a>
                </CardContent>
            </Card>
            ))
        ) : !loading && (
            <p className="text-center text-muted-foreground py-8">No services found.</p>
        )}
      </div>
    </div>
  );
}
