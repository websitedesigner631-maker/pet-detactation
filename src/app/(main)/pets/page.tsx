import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Dog, Cat, Bird } from 'lucide-react';
import { pets } from '@/lib/data';
import type { Pet } from '@/lib/types';
import PageHeader from '@/components/page-header';

const petIcons = {
  Dog: <Dog className="h-6 w-6 text-muted-foreground" />,
  Cat: <Cat className="h-6 w-6 text-muted-foreground" />,
  Bird: <Bird className="h-6 w-6 text-muted-foreground" />,
  Other: <div className="h-6 w-6" />, // Placeholder
};

function PetCard({ pet }: { pet: Pet }) {
  return (
    <Link href={`/pets/${pet.id}`} className="block">
      <Card className="hover:bg-primary/5 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <Image
            src={pet.avatarUrl}
            alt={pet.name}
            width={64}
            height={64}
            className="rounded-full border-2 border-primary/20 object-cover aspect-square"
            data-ai-hint={`${pet.breed}`}
          />
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">{pet.breed}</p>
          </div>
          {petIcons[pet.petType]}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function PetsPage() {
  return (
    <div>
      <PageHeader title="My Pets">
        <Link href="/pets/new">
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Pet
          </Button>
        </Link>
      </PageHeader>
      <div className="p-4 space-y-4">
        {pets.length > 0 ? (
          pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
        ) : (
          <Card className="text-center py-10">
            <CardHeader>
              <CardTitle>No Pets Yet</CardTitle>
              <CardDescription>
                Add your pet to get started with personalized care.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pets/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Pet
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
