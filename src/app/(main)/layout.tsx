'use client';
import BottomNav from '@/components/bottom-nav';
import { useAuthGuard } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthGuard();

  if (loading || !user) {
    return (
      <div className="flex justify-center items-start md:items-center min-h-screen py-0 md:py-4">
        <div className="relative w-full max-w-md h-screen md:h-[calc(100vh-2rem)] md:max-h-[800px] bg-background text-foreground md:rounded-3xl shadow-2xl overflow-hidden border-background md:border-[10px] md:dark:border-neutral-800">
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

  return (
    <div className="flex justify-center items-start md:items-center min-h-screen py-0 md:py-4">
      <div className="relative w-full max-w-md h-screen md:h-[calc(100vh-2rem)] md:max-h-[800px] bg-background text-foreground md:rounded-3xl shadow-2xl overflow-hidden border-background md:border-[10px] md:dark:border-neutral-800">
        <div className="h-full flex flex-col">
          <main className="flex-1 overflow-y-auto pb-20">{children}</main>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
