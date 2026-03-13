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
      <div className="relative w-full md:max-w-xs h-svh md:h-[calc(100vh-2rem)] md:max-h-[550px] bg-neutral-900 text-foreground md:rounded-3xl shadow-2xl overflow-hidden border-background md:border-[10px] md:dark:border-neutral-800">
        
        <Image
          src="https://picsum.photos/seed/pets-welcome-4/800/1200"
          alt="A happy pet looking up"
          fill
          className="object-cover"
          data-ai-hint="dog portrait"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="relative h-full flex flex-col justify-end text-white p-8 space-y-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full w-fit">
              <PawPrint className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Smart Pet Care
            </h1>
            <p className="text-lg text-white/90">
              The intelligent assistant for happy, healthy pets.
            </p>
            <div className="pt-6 w-full">
                <Button onClick={handleGetStarted} size="lg" className="w-full h-14 text-lg rounded-xl shadow-lg bg-white text-primary hover:bg-white/90">
                    Get Started
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
}
