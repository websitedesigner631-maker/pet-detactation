import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone } from 'lucide-react';
import { vetServices } from '@/lib/data';
import PageHeader from '@/components/page-header';

export default function NearbyServicesPage() {
  return (
    <div>
      <PageHeader title="Nearby Pet Services" />
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground px-2">
          Find veterinary clinics, shops, and other services near you.
        </p>
        {vetServices.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="text-lg">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>
                  {service.address} ({service.distance})
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{service.phone}</span>
              </div>
              <a href={`tel:${service.phone}`}>
                <Button variant="outline" className="mt-2 w-full">
                  Call Now
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
