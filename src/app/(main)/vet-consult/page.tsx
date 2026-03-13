import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare, CalendarPlus } from 'lucide-react';
import PageHeader from '@/components/page-header';
import Link from 'next/link';

export default function VetConsultPage() {
  return (
    <div>
      <PageHeader title="Vet Consultation" />
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Connect with a professional veterinarian.
        </p>
        <Link href="tel:123-456-7890">
            <Card className="hover:bg-primary/5 transition-colors">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full text-primary">
                    <Phone className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold">Call a Veterinarian</h3>
                    <p className="text-muted-foreground">Immediate voice consultation</p>
                </div>
                <Button className="w-full">Call Now</Button>
            </CardContent>
            </Card>
        </Link>

        <Card className="opacity-50 cursor-not-allowed">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full text-muted-foreground">
                <MessageSquare className="w-10 h-10" />
            </div>
            <div className="space-y-1">
                <h3 className="text-xl font-bold">Chat with a Vet</h3>
                <p className="text-muted-foreground">Text-based consultation</p>
            </div>
            <Button disabled className="w-full">Coming Soon</Button>
          </CardContent>
        </Card>

        <Link href="/veterinarians">
          <Card className="hover:bg-primary/5 transition-colors">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full text-primary">
                  <CalendarPlus className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                  <h3 className="text-xl font-bold">Book Appointment</h3>
                  <p className="text-muted-foreground">Schedule an in-clinic visit</p>
              </div>
              <Button className="w-full">Find a Vet</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
