'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // This check will only run on the client side
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      router.replace('/dashboard');
    } else {
      router.replace('/welcome');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-start md:items-center min-h-screen py-0 md:py-4">
      <div className="relative w-full max-w-sm h-screen md:h-[calc(100vh-2rem)] md:max-h-[700px] bg-background text-foreground md:rounded-3xl shadow-2xl overflow-hidden border-background md:border-[10px] md:dark:border-neutral-800">
        <div className="p-4 space-y-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
