import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Shield, Bell, LogOut } from 'lucide-react';
import PageHeader from '@/components/page-header';
import Link from 'next/link';

const ProfileMenuItem = ({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) => (
  <Link href={href}>
    <div className="flex items-center p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
      <Icon className="h-5 w-5 mr-4 text-muted-foreground" />
      <span>{label}</span>
    </div>
  </Link>
);

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="Profile" />
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user/200/200" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">Alex Doe</h2>
            <p className="text-muted-foreground">alex.doe@example.com</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-2">
            <ProfileMenuItem icon={User} label="Account Information" href="/profile/account" />
            <Separator />
            <ProfileMenuItem icon={Bell} label="Notifications" href="/profile/notifications" />
             <Separator />
            <ProfileMenuItem icon={Shield} label="Privacy & Security" href="/profile/security" />
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-2">
                <ProfileMenuItem icon={Settings} label="Settings" href="/profile/settings" />
            </CardContent>
        </Card>

        <Button variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
        </Button>
      </div>
    </div>
  );
}
