'use client';

import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="dark-mode" className="font-semibold">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Reduces eye strain in low light.</p>
              </div>
              <Switch id="dark-mode" disabled />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
             <CardDescription>Choose your preferred language for the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select defaultValue="en">
                <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
                    <SelectItem value="fr" disabled>Français (Coming Soon)</SelectItem>
                </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
