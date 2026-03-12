import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { reminders } from '@/lib/data';
import type { Reminder } from '@/lib/types';
import PageHeader from '@/components/page-header';

function ReminderCard({ reminder }: { reminder: Reminder }) {
  const { icon: Icon } = reminder;
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold">{reminder.title}</p>
          <p className="text-sm text-muted-foreground">{reminder.time}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SchedulePage() {
  return (
    <div>
      <PageHeader title="Schedule">
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </PageHeader>
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground px-2">
          Upcoming reminders for your pets' health and schedule.
        </p>
        {reminders.map((reminder) => (
          <ReminderCard key={reminder.id} reminder={reminder} />
        ))}
      </div>
    </div>
  );
}
