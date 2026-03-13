'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Shield, Bell, LogOut, Loader2, Calendar, UserCog } from 'lucide-react';
import PageHeader from '@/components/page-header';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'rraghabbarik@gmail.com';

const ProfileMenuItem = ({
  icon: Icon,
  label,
  href,
  disabled = false,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  disabled?: boolean;
}) => (
  <Link href={href} className={disabled ? 'pointer-events-none' : ''}>
    <div className={`flex items-center p-3 rounded-lg ${disabled ? 'opacity-50' : 'hover:bg-muted/50 cursor-pointer transition-colors'}`}>
      <Icon className="h-5 w-5 mr-4 text-muted-foreground" />
      <span>{label}</span>
      {disabled && <span className="text-xs ml-auto text-muted-foreground"> (Soon)</span>}
    </div>
  </Link>
);

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      toast({ title: "Logged out successfully."});
      router.push('/login');
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to log out." });
    }
  };

  if (loading) {
    return (
        <div className="p-4 flex justify-center items-center h-full">
            <Loader2 className="h-10 w-10 animate-spin"/>
        </div>
    )
  }

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div>
      <PageHeader title="Profile" />
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200/200`} alt="User" />
            <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{user?.displayName}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        
        {isAdmin && (
             <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-2">
                    <ProfileMenuItem icon={UserCog} label="Admin Dashboard" href="/admin" />
                </CardContent>
            </Card>
        )}

        <Card>
          <CardContent className="p-2">
            <ProfileMenuItem icon={User} label="Account Information" href="/profile/account" disabled />
            <Separator />
            <ProfileMenuItem icon={Calendar} label="My Appointments" href="/appointments" />
            <Separator />
            <ProfileMenuItem icon={Bell} label="Notifications" href="/profile/notifications" disabled />
             <Separator />
            <ProfileMenuItem icon={Shield} label="Privacy & Security" href="/profile/security" disabled />
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-2">
                <ProfileMenuItem icon={Settings} label="Settings" href="/profile/settings" disabled/>
            </CardContent>
        </Card>

        <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
        </Button>
      </div>
    </div>
  );
}
