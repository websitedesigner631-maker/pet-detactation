import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Phone, Hospital, BookHeart } from 'lucide-react';
import { emergencyResources } from '@/lib/data';
import PageHeader from '@/components/page-header';

const firstAidItems = emergencyResources.filter((r) => r.type === 'First Aid');
const hospitals = emergencyResources.filter((r) => r.type === 'Hospital');

export default function EmergencyPage() {
  return (
    <div>
      <PageHeader title="Emergency Help" />
      <div className="p-4 space-y-6">
        <a href="tel:123-456-7891" className="block">
          <Button
            variant="destructive"
            className="w-full h-20 text-xl rounded-xl shadow-lg"
          >
            <Phone className="mr-4 h-8 w-8" />
            One-Click Vet Call
          </Button>
        </a>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="text-destructive" />
              Emergency Hospitals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="p-3 bg-card rounded-lg border"
              >
                <h3 className="font-bold">{hospital.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {hospital.content}
                </p>
                {hospital.phone && (
                  <a href={`tel:${hospital.phone}`}>
                    <Button variant="link" className="p-0 h-auto mt-1">
                      Call Now: {hospital.phone}
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookHeart />
              First Aid Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {firstAidItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="font-semibold text-left">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
