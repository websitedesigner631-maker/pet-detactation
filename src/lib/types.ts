import type { LucideIcon } from 'lucide-react';
import type { DocumentData, Timestamp } from 'firebase/firestore';

export interface Pet extends DocumentData {
  id: string;
  name: string;
  petType: 'Dog' | 'Cat' | 'Bird' | 'Other';
  breed: string;
  age: number;
  weight: number;
  avatarUrl: string;
};

export interface MedicalRecord extends DocumentData {
  id: string;
  petId: string;
  recordType: string;
  title: string;
  date: Timestamp;
  description: string;
  fileUrl?: string;
  nextDueDate?: Timestamp;
  veterinarianId?: string;
}

export interface AIScanResult extends DocumentData {
  id: string;
  petId: string;
  scanDate: Timestamp;
  mediaUrl: string;
  detectedProblems: string[];
  explanation: string;
  suggestedCareSteps: string;
  confidenceScore?: number;
}

export type HealthHistoryEvent = {
  id: string;
  date: Date;
  type: 'Scan' | 'Record';
  title: string;
  details: string;
  source: MedicalRecord | AIScanResult;
};

export interface Reminder extends DocumentData {
  id: string;
  ownerId: string;
  petId: string;
  type: 'Vaccination' | 'Feeding' | 'Medication' | 'Checkup' | 'Other';
  scheduledDateTime: Timestamp;
  description: string;
  isCompleted: boolean;
  recurrencePattern?: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
}

export interface FoodGuideEntry extends DocumentData {
    id: string;
    foodName: string;
    category: string;
    safetyRating: 'Safe' | 'Moderation' | 'Harmful';
    generalDescription: string;
    petTypeCompatibility: string[];
    breedConsiderations?: string;
    ageConsiderations?: string;
    nutritionalBenefits?: string;
    risks?: string;
}

export interface ServiceLocation extends DocumentData {
  id: string;
  name: string;
  type: 'VeterinaryClinic' | 'AnimalHospital' | 'PetShop' | 'GroomingCenter' | 'AnimalShelter';
  address: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  email?: string;
  websiteUrl?: string;
  operatingHours?: string;
  description?: string;
}

export interface User extends DocumentData {
  id: string;
  name: string;
  email: string;
  languagePreference: string;
  vetId?: string;
}

export interface Veterinarian extends DocumentData {
  id: string;
  name: string;
  specialties: string[];
  profileImageUrl: string;
  email: string;
}

export interface Appointment extends DocumentData {
  id:string;
  petId: string;
  petName: string;
  ownerId: string;
  ownerName: string;
  ownerPhotoUrl: string | null;
  veterinarianId: string;
  veterinarianName: string;
  appointmentDateTime: Timestamp;
  reasonForVisit: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
}

export type EmergencyResource = {
  id: string;
  type: 'First Aid' | 'Hospital';
  title: string;
  content: string;
  phone?: string;
}

export interface LostPetReport extends DocumentData {
  id: string;
  petName: string;
  petPhotoUrl: string;
  lastSeen: string;
  description: string;
  contact: string;
  reporterId: string;
  createdAt: Timestamp;
}

export type ScheduleItemCategory = 'Feeding' | 'Exercise' | 'Grooming' | 'Training' | 'Health' | 'Other';

export interface ScheduleItem extends DocumentData {
    id: string;
    title: string;
    time: string;
    category: ScheduleItemCategory;
    petId: string;
    createdAt: Timestamp;
};
