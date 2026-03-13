'use client';

import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage how you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="push-notifications" className="font-semibold">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts on your device.</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="email-notifications" className="font-semibold">Email Notifications</Label>
                 <p className="text-sm text-muted-foreground">Get summaries and alerts via email.</p>
              </div>
              <Switch id="email-notifications" />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="appointment-reminders" className="font-semibold">Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">Alerts for upcoming appointments.</p>
              </div>
              <Switch id="appointment-reminders" defaultChecked />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="medication-reminders" className="font-semibold">Medication Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders to give pet medication.</p>
              </div>
              <Switch id="medication-reminders" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
