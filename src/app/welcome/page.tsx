'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PawPrint } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    router.push('/signup');
  };

  return (
    <div className="flex justify-center items-start md:items-center min-h-screen py-0 md:py-4">
      <div className="relative w-full max-w-sm h-screen md:h-[calc(100vh-2rem)] md:max-h-[700px] bg-background text-foreground md:rounded-3xl shadow-2xl overflow-hidden border-background md:border-[10px] md:dark:border-neutral-800">
        
        {/* Content Area */}
        <div className="h-full overflow-y-auto pb-28">
          <div className="flex flex-col justify-center items-center text-center p-4 sm:p-6 md:p-8 space-y-4">
            <div className="p-4 bg-primary/10 rounded-full mt-8">
              <PawPrint className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome to Smart Pet Care
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Your intelligent assistant for happy, healthy pets. Let's get you set up.
            </p>
            <Image
              src="https://picsum.photos/seed/welcome-pets/600/400"
              alt="A group of happy pets"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm aspect-[3/2] object-cover"
              data-ai-hint="happy pets"
            />
          </div>
        </div>

        {/* Fixed Button Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-background/80 backdrop-blur-sm border-t md:rounded-b-3xl">
          <Button onClick={handleGetStarted} size="lg" className="w-full h-14 text-lg rounded-xl shadow-md">
            Get Started
          </Button>
        </div>

      </div>
    </div>
  );
}
