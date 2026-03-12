import type { Pet, Reminder, HealthHistoryEvent, VetService, EmergencyResource, FoodGuideItem, LostPetReport } from './types';
import { Syringe, Bell, Pill, Stethoscope, Bone, Cat, Bird, Dog } from 'lucide-react';

export const pets: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    petType: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    weight: 28,
    avatarUrl: 'https://picsum.photos/seed/buddy/200/200',
    vaccinations: [
      { id: 'v1', vaccine: 'Rabies', date: '2023-05-20', nextDueDate: '2024-05-20' },
      { id: 'v2', vaccine: 'Distemper', date: '2023-05-20', nextDueDate: '2024-05-20' },
    ],
    medicalRecords: [
      { id: 'm1', title: 'Annual Checkup', date: '2024-01-15', fileUrl: '#', notes: 'Healthy, no issues.' },
    ],
  },
  {
    id: '2',
    name: 'Lucy',
    petType: 'Cat',
    breed: 'Siamese',
    age: 5,
    weight: 5,
    avatarUrl: 'https://picsum.photos/seed/lucy/200/200',
    vaccinations: [
      { id: 'v3', vaccine: 'FVRCP', date: '2023-09-10', nextDueDate: '2024-09-10' },
    ],
    medicalRecords: [],
  },
];

export const healthHistory: HealthHistoryEvent[] = [
    { id: 'h1', date: '2024-07-10', type: 'Scan', title: 'AI Skin Scan', details: 'Detected minor rash on belly. Suggested anti-fungal cream.' },
    { id: 'h2', date: '2024-06-22', type: 'Vet Visit', title: 'Follow-up for limp', details: 'Dr. Smith confirmed a mild sprain. Prescribed rest.' },
    { id: 'h3', date: '2024-05-20', type: 'Vaccination', title: 'Annual Booster Shots', details: 'Administered Rabies and Distemper vaccines.' },
    { id: 'h4', date: '2024-03-05', type: 'Medication', title: 'Flea & Tick Treatment', details: 'Applied monthly preventive treatment.' },
];

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

export const lostPetReports: LostPetReport[] = [
    {id: 'l1', petName: 'Max', petPhotoUrl: 'https://picsum.photos/seed/maxlost/300/300', lastSeen: 'Central Park, near the fountain', description: 'Brown terrier mix, very friendly, was wearing a blue collar. Went missing on July 15th around 4 PM.', contact: '555-123-4567'},
    {id: 'l2', petName: 'Whiskers', petPhotoUrl: 'https://picsum.photos/seed/whiskerslost/300/300', lastSeen: 'Oak Street neighborhood', description: 'Black and white domestic shorthair cat with a clipped ear. Very shy, do not chase. Missing since yesterday morning.', contact: '555-987-6543'},
];
