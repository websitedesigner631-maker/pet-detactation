import type { LucideIcon } from 'lucide-react';

export type Pet = {
  id: string;
  name: string;
  petType: 'Dog' | 'Cat' | 'Bird' | 'Other';
  breed: string;
  age: number;
  weight: number;
  avatarUrl: string;
  vaccinations: Vaccination[];
  medicalRecords: MedicalRecord[];
};

export type Vaccination = {
  id: string;
  vaccine: string;
  date: string;
  nextDueDate?: string;
};

export type MedicalRecord = {
  id: string;
  title: string;
  date: string;
  fileUrl: string;
  notes: string;
};

export type HealthHistoryEvent = {
  id: string;
  date: string;
  type: 'Scan' | 'Vet Visit' | 'Vaccination' | 'Medication';
  title: string;
  details: string;
};

export type Reminder = {
  id: string;
  title: string;
  time: string;
  icon: LucideIcon;
  petId?: string;
};

export type FoodGuideItem = {
  id: string;
  name: string;
  description: string;
  category: 'Safe' | 'Avoid' | 'Diet Suggestion';
  imageUrl: string;
};

export type VetService = {
  id:string;
  name: string;
  type: 'Clinic' | 'Hospital' | 'Shop' | 'Grooming' | 'Shelter';
  address: string;
  phone: string;
  distance: string;
};

export type EmergencyResource = {
  id: string;
  type: 'First Aid' | 'Hospital';
  title: string;
  content: string;
  phone?: string;
}

export type LostPetReport = {
  id: string;
  petName: string;
  petPhotoUrl: string;
  lastSeen: string;
  description: string;
  contact: string;
}
