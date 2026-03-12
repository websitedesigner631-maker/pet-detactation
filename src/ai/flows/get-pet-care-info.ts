'use server';
/**
 * @fileOverview A Genkit flow for fetching detailed pet breed information and care guides.
 *
 * - getPetCareInfo - A function that returns care information for a given pet breed.
 * - PetCareInfoInput - The input type for the getPetCareInfo function.
 * - PetCareInfoOutput - The return type for the getPetCareInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const PetCareInfoInputSchema = z.object({
  petType: z.string().describe('The type of pet (e.g., Dog, Cat).'),
  breed: z.string().describe('The breed of the pet.'),
});
export type PetCareInfoInput = z.infer<typeof PetCareInfoInputSchema>;

export const PetCareInfoOutputSchema = z.object({
  breedInfo: z.string().describe('A general description of the pet breed, including history, temperament, and size.'),
  careGuide: z.object({
    diet: z.string().describe('Dietary recommendations and feeding schedule.'),
    exercise: z.string().describe('Daily exercise requirements and suitable activities.'),
    grooming: z.string().describe('Grooming needs, including brushing, bathing, and nail trimming.'),
    commonHealthIssues: z.string().describe('Common health issues for the breed and preventive care tips.'),
  }),
});
export type PetCareInfoOutput = z.infer<typeof PetCareInfoOutputSchema>;

export async function getPetCareInfo(input: PetCareInfoInput): Promise<PetCareInfoOutput> {
  return getPetCareInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPetCareInfoPrompt',
  input: { schema: PetCareInfoInputSchema },
  output: { schema: PetCareInfoOutputSchema },
  prompt: `You are a world-renowned veterinarian and pet care expert. A user has a {{petType}} of the breed "{{breed}}".

Provide a comprehensive but easy-to-understand guide for this pet. Your response must include:
1.  **Breed Info**: A general description of the breed, covering its history, temperament, and average size/weight.
2.  **Care Guide**:
    *   **Diet**: What kind of food is best? How much and how often should they be fed?
    *   **Exercise**: How much activity do they need daily? What are some good activities for them?
    *   **Grooming**: How often do they need brushing, bathing, or other grooming?
    *   **Common Health Issues**: What are some common health problems for this breed to watch out for?

Generate a detailed and helpful response.
`,
});

const getPetCareInfoFlow = ai.defineFlow(
  {
    name: 'getPetCareInfoFlow',
    inputSchema: PetCareInfoInputSchema,
    outputSchema: PetCareInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
