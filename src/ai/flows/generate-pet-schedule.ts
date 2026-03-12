'use server';
/**
 * @fileOverview A Genkit flow for generating a personalized pet care schedule.
 *
 * - generatePetSchedule - A function that creates a suggested schedule.
 * - GeneratePetScheduleInput - The input type for the generatePetSchedule function.
 * - GeneratePetScheduleOutput - The return type for the generatePetSchedule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePetScheduleInputSchema = z.object({
  petType: z.string().describe('The type of pet (e.g., Dog, Cat).'),
  breed: z.string().describe('The breed of the pet.'),
  age: z.number().describe('The age of the pet in years.'),
  activityLevel: z.enum(['Low', 'Medium', 'High']).optional().describe('The general activity level of the pet.'),
});
export type GeneratePetScheduleInput = z.infer<typeof GeneratePetScheduleInputSchema>;

const ScheduleItemSchema = z.object({
  title: z.string().describe('The name of the schedule item (e.g., "Morning Walk").'),
  time: z.string().describe('The suggested time or frequency (e.g., "7:00 AM", "Twice a day", "Weekly").'),
  category: z.enum(['Feeding', 'Exercise', 'Grooming', 'Training', 'Health', 'Other']).describe('The category of the task.'),
});

const GeneratePetScheduleOutputSchema = z.object({
  suggestedSchedule: z.array(ScheduleItemSchema).describe('An array of suggested schedule items for the pet.'),
});
export type GeneratePetScheduleOutput = z.infer<typeof GeneratePetScheduleOutputSchema>;


export async function generatePetSchedule(input: GeneratePetScheduleInput): Promise<GeneratePetScheduleOutput> {
  return generatePetScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePetSchedulePrompt',
  input: { schema: GeneratePetScheduleInputSchema },
  output: { schema: GeneratePetScheduleOutputSchema },
  prompt: `You are an AI pet care assistant that helps create optimal schedules.
  
A user needs a sample weekly schedule for their pet.

Pet Details:
- Type: {{petType}}
- Breed: {{breed}}
- Age: {{age}} years
{{#if activityLevel}}- Activity Level: {{activityLevel}}{{/if}}

Based on these details, generate a structured, sample weekly schedule. The schedule should be comprehensive, covering essential activities.

Categories to include are:
- Feeding
- Exercise (walks, playtime)
- Grooming (brushing, etc.)
- Training sessions
- Health (e.g., check teeth, monthly flea treatment reminder)
- Other (e.g., social time, rest)

Provide a list of schedule items with a title, a suggested time or frequency, and the appropriate category. Create at least 5 distinct schedule items.
`,
});

const generatePetScheduleFlow = ai.defineFlow(
  {
    name: 'generatePetScheduleFlow',
    inputSchema: GeneratePetScheduleInputSchema,
    outputSchema: GeneratePetScheduleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
