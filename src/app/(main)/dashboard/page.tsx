'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ScanLine,
  Stethoscope,
  CookingPot,
  MapPin,
  Search,
  Calendar,
  HeartPulse,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import VoiceAssistantDialog from '@/components/voice-assistant-dialog';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';

const featureLinks: {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
}[] = [
  { href: '/scan', icon: ScanLine, label: 'AI Scanner' },
  { href: '/vet-consult', icon: Stethoscope, label: 'Vet Consult' },
  { href: '/food-guide', icon: CookingPot, label: 'Food Guide' },
  { href: '/nearby-services', icon: MapPin, label: 'Nearby' },
  { href: '/lost-pet', icon: Search, label: 'Lost Pet' },
  { href: '/schedule', icon: Calendar, label: 'Schedule' },
];

function FeatureButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 text-center"
    >
      <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl text-primary">
        <Icon className="w-10 h-10" />
      </div>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </Link>
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

  useEffect(() => {
    if (!loadingProfile && userProfile?.vetId) {
      router.replace('/veterinarian/bookings');
    }
  }, [loadingProfile, userProfile, router]);

  if (loadingProfile || userProfile?.vetId) {
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

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <Link href="/emergency">
            <Button
              variant="destructive"
              className="w-full h-16 text-lg rounded-xl shadow-lg"
            >
              <HeartPulse className="mr-3 h-7 w-7" />
              Emergency Help
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-y-6 gap-x-4">
        {featureLinks.map((link) => (
          <FeatureButton key={link.href} {...link} />
        ))}
      </div>

      <VoiceAssistantDialog />
    </div>
  );
}
