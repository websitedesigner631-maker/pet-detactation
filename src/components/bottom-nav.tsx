'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Calendar, User, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/pets', icon: Heart, label: 'Pets' },
  { href: '/appointments', icon: Stethoscope, label: 'Appointments' },
  { href: '/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-card border-t border-border/80 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = (item.href === '/dashboard' && pathname === '/dashboard') || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-20 text-muted-foreground transition-colors duration-200',
                isActive ? 'text-primary' : 'hover:text-primary/80'
              )}
            >
              <item.icon className="h-7 w-7" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
