import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { foodGuideItems } from '@/lib/data';
import type { FoodGuideItem } from '@/lib/types';
import PageHeader from '@/components/page-header';

function FoodCard({ item }: { item: FoodGuideItem }) {
  return (
    <Card className="overflow-hidden">
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={300}
        height={200}
        className="w-full h-32 object-cover"
        data-ai-hint={`food ${item.name}`}
      />
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default function FoodGuidePage() {
  const safeFoods = foodGuideItems.filter((i) => i.category === 'Safe');
  const avoidFoods = foodGuideItems.filter((i) => i.category === 'Avoid');
  const suggestions = foodGuideItems.filter((i) => i.category === 'Diet Suggestion');

  return (
    <div>
      <PageHeader title="Pet Food Guide" />
      <div className="p-4">
        <Tabs defaultValue="safe">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="safe" className="py-2">Safe Foods</TabsTrigger>
            <TabsTrigger value="avoid" className="py-2">Avoid</TabsTrigger>
            <TabsTrigger value="suggestions" className="py-2">Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="safe" className="mt-4 space-y-4">
            {safeFoods.map((item) => <FoodCard key={item.id} item={item} />)}
          </TabsContent>
          <TabsContent value="avoid" className="mt-4 space-y-4">
            {avoidFoods.map((item) => <FoodCard key={item.id} item={item} />)}
          </TabsContent>
          <TabsContent value="suggestions" className="mt-4 space-y-4">
            {suggestions.map((item) => <FoodCard key={item.id} item={item} />)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
