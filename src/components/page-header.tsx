'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PageHeaderProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, className, children }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-background/80 backdrop-blur-sm border-b">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 -ml-2 mr-2"
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <div className="ml-auto">{children}</div>
    </header>
  );
}
