'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Calendar, Clock, PawPrint, Loader2, Info, ShieldAlert } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Appointment, User as AppUser } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function VetAppointmentCard({ appointment }: { appointment: Appointment }) {
  const appointmentDate = appointment.appointmentDateTime.toDate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src={appointment.ownerPhotoUrl || ''} alt={appointment.ownerName} />
                <AvatarFallback>{appointment.ownerName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-lg">{appointment.ownerName}</CardTitle>
                <CardDescription>Pet: <span className="font-semibold">{appointment.petName}</span></CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{format(appointmentDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{format(appointmentDate, 'p')}</span>
        </div>
        <div className="flex items-start text-sm">
          <PawPrint className="mr-2 h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
          <div>
            <span className="font-medium">Reason:</span>
            <p className="text-muted-foreground">{appointment.reasonForVisit}</p>
          </div>
        </div>
      </CardContent>
      <div className="p-4 pt-0">
         <Badge>{appointment.status}</Badge>
      </div>
    </Card>
  );
}

function VetBookings() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userProfile, loading: loadingProfile } = useDoc<AppUser>(userDocRef);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!userProfile?.vetId || !firestore) return null;
    return query(collection(firestore, `veterinarians/${userProfile.vetId}/appointments`), orderBy('appointmentDateTime', 'desc'));
  }, [userProfile, firestore]);

  const { data: appointments, loading: loadingAppointments } = useCollection<Appointment>(appointmentsQuery);

  const loading = loadingProfile || loadingAppointments;
  
  if (loading) {
    return (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (!userProfile?.vetId) {
      return (
          <div className="p-4">
              <Card className="text-center py-10 bg-destructive/10 border-destructive/20">
                <CardHeader>
                  <div className="mx-auto bg-destructive/20 rounded-full p-3 w-fit">
                    <ShieldAlert className="h-8 w-8 text-destructive" />
                  </div>
                  <CardTitle className="text-destructive">Not a Veterinarian</CardTitle>
                  <CardDescription className="text-destructive/80">
                    Your account is not associated with a veterinarian profile.
                  </CardDescription>
                </CardHeader>
              </Card>
          </div>
      )
  }

  return (
    <div className="p-4 space-y-4">
      {appointments && appointments.length > 0 ? (
        appointments.map((appt) => <VetAppointmentCard key={appt.id} appointment={appt} />)
      ) : (
        <Card className="text-center py-10">
          <CardHeader>
              <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                  <Info className="h-8 w-8 text-muted-foreground" />
              </div>
            <CardTitle>No Bookings</CardTitle>
            <CardDescription>You do not have any upcoming appointments.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}


export default function VeterinarianBookingsPage() {
  return (
    <div>
      <PageHeader title="My Bookings" />
      <VetBookings />
    </div>
  );
}
