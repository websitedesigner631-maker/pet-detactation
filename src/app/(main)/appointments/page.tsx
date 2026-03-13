'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Calendar, Clock, Stethoscope, Loader2, Info } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Appointment } from '@/lib/types';

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const appointmentDate = appointment.appointmentDateTime.toDate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">With {appointment.veterinarianName}</CardTitle>
        <CardDescription>For your pet: <span className="font-semibold">{appointment.petName}</span></CardDescription>
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
          <Stethoscope className="mr-2 h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
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

export default function AppointmentsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const appointmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/appointments`), orderBy('appointmentDateTime', 'desc'));
  }, [user, firestore]);

  const { data: appointments, loading } = useCollection<Appointment>(appointmentsQuery);

  return (
    <div>
      <PageHeader title="My Appointments" />
      <div className="p-4 space-y-4">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {!loading && appointments && appointments.length > 0 && (
          appointments.map((appt) => <AppointmentCard key={appt.id} appointment={appt} />)
        )}
        {!loading && (!appointments || appointments.length === 0) && (
          <Card className="text-center py-10">
            <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                    <Info className="h-8 w-8 text-muted-foreground" />
                </div>
              <CardTitle>No Appointments</CardTitle>
              <CardDescription>You haven't booked any appointments yet.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
