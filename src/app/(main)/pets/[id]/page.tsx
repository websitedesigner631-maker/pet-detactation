import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MoreVertical,
  CheckCircle,
  FileText,
  User,
  PawPrint,
  Cake,
  Scale,
} from 'lucide-react';
import { pets } from '@/lib/data';
import PageHeader from '@/components/page-header';
import Link from 'next/link';

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-card">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-semibold">{label}</span>
    </div>
    <span className="text-muted-foreground">{value}</span>
  </div>
);

export default function PetProfilePage({ params }: { params: { id: string } }) {
  const pet = pets.find((p) => p.id === params.id);

  if (!pet) {
    notFound();
  }

  return (
    <div className="bg-muted/30">
      <PageHeader title="Pet Profile">
        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </PageHeader>

      <div className="p-4 space-y-5">
        <Card className="rounded-3xl overflow-hidden shadow-lg border-0">
          <div className="relative">
            <Image
              src={pet.avatarUrl}
              alt={pet.name}
              width={600}
              height={400}
              className="w-full h-80 object-cover"
              data-ai-hint={`${pet.breed}`}
              priority
            />
            <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm p-3 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold text-card-foreground">{pet.name}</h2>
              <p className="text-muted-foreground">{pet.breed}</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-green-200 bg-green-50/50 dark:bg-green-900/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-500 text-white h-9 w-9 flex items-center justify-center rounded-full">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-green-700 dark:text-green-300">Vaccinations Up to Date</p>
              <p className="text-sm text-muted-foreground">Last checked: Oct 12, 2023</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase text-muted-foreground px-2">
            General Information
          </h3>
          <div className="space-y-2">
            <InfoRow icon={User} label="Name" value={pet.name} />
            <InfoRow icon={PawPrint} label="Type" value={pet.petType} />
            <InfoRow icon={Cake} label="Age" value={`${pet.age} Years`} />
            <InfoRow icon={Scale} label="Weight" value={`${pet.weight} kg`} />
          </div>
        </div>
        
        <Link href={`/pets/${pet.id}/history`}>
          <Button size="lg" className="w-full h-14 text-lg rounded-xl shadow-md">
            <FileText className="mr-3" />
            View Medical History
          </Button>
        </Link>
      </div>
    </div>
  );
}
