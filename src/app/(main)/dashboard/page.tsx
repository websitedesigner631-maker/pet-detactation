'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  ScanLine,
  Stethoscope,
  CookingPot,
  MapPin,
  Search,
  Calendar,
  HeartPulse,
  Loader2,
  Bell,
  Clock,
  PlusCircle,
  Info,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import VoiceAssistantDialog from '@/components/voice-assistant-dialog';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc, collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import type { Pet, Appointment } from '@/lib/types';
import { format } from 'date-fns';

const featureLinks: {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
}[] = [
  { href: '/scan', icon: ScanLine, label: 'AI Scanner' },
  { href: '/vet-consult', icon: Stethoscope, label: 'Vet Consult' },
  { href: '/reminders', icon: Bell, label: 'Reminders' },
  { href: '/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/food-guide', icon: CookingPot, label: 'Food Guide' },
  { href: '/nearby-services', icon: MapPin, label: 'Nearby' },
  { href: '/lost-pet', icon: Search, label: 'Lost Pet' },
  { href: '/emergency', icon: HeartPulse, label: 'Emergency', className: "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive" },
];

function FeatureButton({
  href,
  icon: Icon,
  label,
  className
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 text-center"
    >
      <div className={`flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary ${className}`}>
        <Icon className="w-8 h-8" />
      </div>
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </Link>
  );
}

function PetCarousel({ pets, loading }: { pets: Pet[] | null, loading: boolean }) {
    if (loading) {
        return <div className="h-40 flex justify-center items-center"><Loader2 className="animate-spin" /></div>
    }
    return (
        <Carousel opts={{
            align: "start",
            dragFree: true,
        }}
        className="-ml-4"
        >
            <CarouselContent>
                {pets && pets.map((pet) => (
                    <CarouselItem key={pet.id} className="basis-1/3">
                         <Link href={`/pets/${pet.id}`} className="block">
                            <div className="p-1">
                                <Card className="overflow-hidden group hover:border-primary">
                                    <Image
                                        src={pet.avatarUrl}
                                        alt={pet.name}
                                        width={150}
                                        height={150}
                                        className="aspect-square object-cover w-full group-hover:scale-105 transition-transform"
                                        data-ai-hint={pet.breed}
                                    />
                                    <div className="p-2 bg-card/80">
                                        <p className="font-bold text-sm truncate">{pet.name}</p>
                                    </div>
                                </Card>
                            </div>
                         </Link>
                    </CarouselItem>
                ))}
                 <CarouselItem className="basis-1/3">
                     <Link href="/pets/new" className="block">
                        <div className="p-1">
                            <Card className="overflow-hidden group hover:border-primary/50 border-dashed">
                                <div className="aspect-square w-full flex flex-col items-center justify-center bg-muted/50 group-hover:bg-muted">
                                    <PlusCircle className="h-8 w-8 text-muted-foreground mb-1"/>
                                    <p className="font-bold text-sm text-muted-foreground">Add Pet</p>
                                </div>
                            </Card>
                        </div>
                     </Link>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    )
}

function UpcomingAppointmentCard({ appointment }: { appointment: Appointment }) {
    const appointmentDate = appointment.appointmentDateTime.toDate();
    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardDescription>Upcoming Appointment</CardDescription>
                <CardTitle>{appointment.veterinarianName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(appointmentDate, 'EEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(appointmentDate, 'p')}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userProfile, isLoading: loadingProfile } = useDoc(userDocRef);

  const petsCollection = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/pets`);
  }, [user, firestore]);
  const { data: pets, loading: loadingPets } = useCollection<Pet>(petsCollection);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, `users/${user.uid}/appointments`),
        where('appointmentDateTime', '>', Timestamp.now()),
        orderBy('appointmentDateTime', 'asc'),
        limit(1)
    );
  }, [user, firestore]);
  const { data: upcomingAppointments, loading: loadingAppointments } = useCollection<Appointment>(appointmentsQuery);

  useEffect(() => {
    if (!loadingProfile && userProfile?.vetId) {
      router.replace('/veterinarian/bookings');
    }
  }, [loadingProfile, userProfile, router]);

  const isLoading = loadingProfile || userProfile?.vetId || loadingPets || loadingAppointments;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Hello, {user?.displayName?.split(' ')[0] || 'Pet Lover'}!
        </h1>
        <p className="text-muted-foreground">
          How can we help you and your furry friend today?
        </p>
      </header>

      <div>
        <h2 className="text-lg font-semibold mb-2">My Pets</h2>
        <PetCarousel pets={pets} loading={loadingPets} />
      </div>

      {upcomingAppointments && upcomingAppointments.length > 0 ? (
          <UpcomingAppointmentCard appointment={upcomingAppointments[0]} />
      ) : (
          <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-4 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                  <Info className="h-4 w-4" />
                  No upcoming appointments.
              </CardContent>
          </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {featureLinks.map((link) => (
            <FeatureButton key={link.href} {...link} />
            ))}
        </div>
      </div>


      <VoiceAssistantDialog />
    </div>
  );
}
