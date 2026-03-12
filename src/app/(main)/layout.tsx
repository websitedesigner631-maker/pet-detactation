import BottomNav from '@/components/bottom-nav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
