'use client';

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FoodGuideEntry } from '@/lib/types';
import PageHeader from '@/components/page-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

function FoodCard({ item }: { item: FoodGuideEntry }) {
  return (
    <Card className="overflow-hidden">
      <Image
        src={`https://picsum.photos/seed/${item.foodName}/300/200`}
        alt={item.foodName}
        width={300}
        height={200}
        className="w-full h-32 object-cover"
        data-ai-hint={`food ${item.foodName}`}
      />
      <CardHeader>
        <CardTitle>{item.foodName}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{item.generalDescription}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default function FoodGuidePage() {
  const firestore = useFirestore();
  const foodGuideQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'foodGuideEntries');
  }, [firestore]);

  const { data: foodGuideItems, loading } = useCollection<FoodGuideEntry>(foodGuideQuery);

  const safeFoods = foodGuideItems?.filter((i) => i.safetyRating === 'Safe') ?? [];
  const cautionFoods = foodGuideItems?.filter((i) => i.safetyRating === 'Moderation') ?? [];
  const avoidFoods = foodGuideItems?.filter((i) => i.safetyRating === 'Harmful') ?? [];

  return (
    <div>
      <PageHeader title="Pet Food Guide" />
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="safe">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="safe" className="py-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Safe</TabsTrigger>
              <TabsTrigger value="caution" className="py-2 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Caution</TabsTrigger>
              <TabsTrigger value="avoid" className="py-2 flex items-center gap-2"><Shield className="h-4 w-4" /> Avoid</TabsTrigger>
            </TabsList>
            <TabsContent value="safe" className="mt-4 space-y-4">
              {safeFoods.map((item) => <FoodCard key={item.id} item={item} />)}
              {safeFoods.length === 0 && <p className="text-center text-muted-foreground pt-8">No safe foods listed.</p>}
            </TabsContent>
            <TabsContent value="caution" className="mt-4 space-y-4">
              {cautionFoods.map((item) => <FoodCard key={item.id} item={item} />)}
              {cautionFoods.length === 0 && <p className="text-center text-muted-foreground pt-8">No foods listed for moderation.</p>}
            </TabsContent>
            <TabsContent value="avoid" className="mt-4 space-y-4">
              {avoidFoods.map((item) => <FoodCard key={item.id} item={item} />)}
              {avoidFoods.length === 0 && <p className="text-center text-muted-foreground pt-8">No harmful foods listed.</p>}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
