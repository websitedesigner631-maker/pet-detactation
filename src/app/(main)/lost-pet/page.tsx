import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search } from 'lucide-react';
import { lostPetReports } from '@/lib/data';
import type { LostPetReport } from '@/lib/types';
import PageHeader from '@/components/page-header';

function LostPetCard({ report }: { report: LostPetReport }) {
  return (
    <Card>
      <CardContent className="p-4 flex gap-4">
        <Image
          src={report.petPhotoUrl}
          alt={`Lost pet ${report.petName}`}
          width={100}
          height={100}
          className="rounded-lg object-cover"
          data-ai-hint="lost pet"
        />
        <div className="space-y-1">
          <h3 className="font-bold text-lg">
            Lost: {report.petName}
          </h3>
          <p className="text-sm text-muted-foreground">
            <strong>Last Seen:</strong> {report.lastSeen}
          </p>
          <p className="text-sm text-muted-foreground">{report.description}</p>
          <a href={`tel:${report.contact}`}>
            <Button variant="link" className="p-0 h-auto">
              Contact Owner: {report.contact}
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LostPetPage() {
  return (
    <div>
      <PageHeader title="Lost Pet Alert" />
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Report a Lost Pet</CardTitle>
            <CardDescription>
              Fill out this form to alert nearby users.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="pet-name">Pet's Name</Label>
              <Input id="pet-name" placeholder="e.g., Buddy" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="photo">Pet's Photo</Label>
              <Input id="photo" type="file" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="last-seen">Last Seen Location</Label>
              <Input id="last-seen" placeholder="e.g., Central Park" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., Brown terrier, blue collar..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit Report
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Search /> Nearby Lost Pets</h2>
            {lostPetReports.map((report) => (
                <LostPetCard key={report.id} report={report} />
            ))}
        </div>
      </div>
    </div>
  );
}
