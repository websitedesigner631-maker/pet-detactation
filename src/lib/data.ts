import type { Reminder, HealthHistoryEvent, VetService, EmergencyResource, FoodGuideItem } from './types';
import { Syringe, Bell, Pill, Stethoscope, Bone } from 'lucide-react';

export const pets = [];
export const healthHistory: HealthHistoryEvent[] = [];
export const lostPetReports = [];

export const reminders: Reminder[] = [
  { id: '1', title: 'Buddy\'s Dinner Time', time: '18:00', icon: Bone, petId: '1' },
  { id: '2', title: 'Lucy\'s Flea Medication', time: '09:00 on 1st of month', icon: Pill, petId: '2' },
  { id: '3', title: 'Annual Vet Checkup', time: '2024-09-15 11:00', icon: Stethoscope },
  { id: '4', title: 'Buddy\'s Rabies Booster', time: '2024-05-20', icon: Syringe, petId: '1' },
];

export const vetServices: VetService[] = [
    { id: '1', name: 'Happy Paws Clinic', type: 'Clinic', address: '123 Vet Street, Yourtown', phone: '123-456-7890', distance: '1.2 km' },
    { id: '2', name: 'City Animal Hospital', type: 'Hospital', address: '456 Main Avenue, Yourtown', phone: '123-456-7891', distance: '3.5 km' },
    { id: '3', name: 'The Pet Pantry', type: 'Shop', address: '789 Pet Lane, Yourtown', phone: '123-456-7892', distance: '2.1 km' },
    { id: '4', name: 'Posh Pups Grooming', type: 'Grooming', address: '101 Pamper Road, Yourtown', phone: '123-456-7893', distance: '4.0 km' },
    { id: '5', name: 'Safe Haven Animal Shelter', type: 'Shelter', address: '202 Rescue Way, Yourtown', phone: '123-456-7894', distance: '5.8 km' },
];

export const emergencyResources: EmergencyResource[] = [
    {id: 'e1', type: 'Hospital', title: '24/7 Emergency Animal Hospital', content: '456 Main Avenue, Yourtown. Open all hours for critical emergencies.', phone: '123-456-7891'},
    {id: 'e2', type: 'First Aid', title: 'Pet Choking First Aid', content: '1. Open pet\'s mouth, check for objects. 2. If visible, try to remove with fingers or pliers. 3. If not, perform Heimlich maneuver for pets. Call vet immediately.'},
    {id: 'e3', type: 'First Aid', title: 'Bleeding Control', content: '1. Apply firm, direct pressure to the wound with a clean cloth. 2. If bleeding is severe, elevate the limb. 3. Do not remove the cloth; add more layers if needed. Go to the nearest vet.'},
];

export const foodGuideItems: FoodGuideItem[] = [
    {id: 'f1', name: 'Carrots', description: 'Good for teeth, low in calories, and a good source of fiber and vitamins.', category: 'Safe', imageUrl: 'https://picsum.photos/seed/carrots/300/200' },
    {id: 'f2', name: 'Cooked Chicken', description: 'A great source of protein. Serve plain without bones, skin, or seasoning.', category: 'Safe', imageUrl: 'https://picsum.photos/seed/chicken/300/200' },
    {id: 'f3', name: 'Chocolate', description: 'Highly toxic to dogs and cats. Can cause vomiting, seizures, and death.', category: 'Avoid', imageUrl: 'https://picsum.photos/seed/chocolate/300/200' },
    {id: 'f4', name: 'Grapes & Raisins', description: 'Can cause acute kidney failure in dogs. Keep them away at all times.', category: 'Avoid', imageUrl: 'https://picsum.photos/seed/grapes/300/200' },
    {id: 'f5', name: 'Puppy Diet', description: 'Puppies need more calories and protein. Feed high-quality puppy food 3-4 times a day.', category: 'Diet Suggestion', imageUrl: 'https://picsum.photos/seed/puppy/300/200' },
    {id: 'f6', name: 'Senior Cat Diet', description: 'Older cats may need fewer calories and more easily digestible protein. Look for senior cat formulas.', category: 'Diet Suggestion', imageUrl: 'https://picsum.photos/seed/seniorcat/300/200' },
];
