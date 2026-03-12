import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Syringe, HeartPulse, Bone, Scale, Calendar } from 'lucide-react';
import { pets, healthHistory } from '@/lib/data';
import PageHeader from '@/components/page-header';

export default function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = pets.find((p) => p.id === params.id);

  if (!pet) {
    notFound();
  }

  return (
    <div>
      <PageHeader title={pet.name} />
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-6">
            <Image
              src={pet.avatarUrl}
              alt={pet.name}
              width={80}
              height={80}
              className="rounded-full border-4 border-primary/20 object-cover aspect-square"
              data-ai-hint={`${pet.breed}`}
            />
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-center w-full">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-bold">{pet.age} yrs</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-bold">{pet.weight} kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Breed</p>
                <p className="font-bold truncate">{pet.breed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="history">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Health History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthHistory.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <HeartPulse className="h-4 w-4" />
                      </div>
                      <div className="w-px flex-grow bg-border" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.details}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccines" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vaccination Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Next Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pet.vaccinations.map((vax) => (
                      <TableRow key={vax.id}>
                        <TableCell className="font-medium">{vax.vaccine}</TableCell>
                        <TableCell>{vax.date}</TableCell>
                        <TableCell>{vax.nextDueDate || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                    {pet.medicalRecords.length > 0 ? pet.medicalRecords.map(rec => (
                        <div key={rec.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                            <div>
                                <p className="font-semibold">{rec.title}</p>
                                <p className="text-sm text-muted-foreground">{rec.date}</p>
                            </div>
                            <FileText className="h-5 w-5 text-primary"/>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-4">No medical records uploaded.</p>
                    )}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
