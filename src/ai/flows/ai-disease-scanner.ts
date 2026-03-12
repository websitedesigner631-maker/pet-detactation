'use server';
/**
 * @fileOverview An AI agent for scanning pet symptoms from media (photo/video) and providing diagnosis and care steps.
 *
 * - scanPetProblem - A function that handles the pet symptom analysis process.
 * - AIDiseaseScannerInput - The input type for the scanPetProblem function.
 * - AIDiseaseScannerOutput - The return type for the scanPetProblem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIDiseaseScannerInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A photo or video of a pet's symptom, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  petType: z.enum(['Dog', 'Cat', 'Bird', 'Other']).optional().describe('The type of pet, if known, to help contextualize the diagnosis.'),
});
export type AIDiseaseScannerInput = z.infer<typeof AIDiseaseScannerInputSchema>;

const AIDiseaseScannerOutputSchema = z.object({
  possibleDisease: z.string().describe('The possible disease or health issue detected.'),
  explanation: z.string().describe('A simple explanation of the detected problem.'),
  suggestedCareSteps: z.string().describe('Immediate suggested care steps.'),
});
export type AIDiseaseScannerOutput = z.infer<typeof AIDiseaseScannerOutputSchema>;

export async function scanPetProblem(input: AIDiseaseScannerInput): Promise<AIDiseaseScannerOutput> {
  return aiDiseaseScannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDiseaseScannerPrompt',
  input: { schema: AIDiseaseScannerInputSchema },
  output: { schema: AIDiseaseScannerOutputSchema },
  prompt: `You are an expert AI veterinarian assistant designed to help pet owners identify potential health issues based on provided media.
  Analyze the uploaded {{petType}}'s photo/video to detect possible problems.
  Focus on common issues like skin infections, wounds, eye infections, ear infections, parasites, swelling, or injuries.

  Based on the media, provide:
  1. The most probable disease or health issue detected.
  2. A simple, easy-to-understand explanation of the problem.
  3. Clear, immediate suggested care steps the pet owner can take.

  Input Media: {{media url=mediaDataUri}}
  {{#if petType}}
  Pet Type: {{petType}}
  {{/if}}`,
});

const aiDiseaseScannerFlow = ai.defineFlow(
  {
    name: 'aiDiseaseScannerFlow',
    inputSchema: AIDiseaseScannerInputSchema,
    outputSchema: AIDiseaseScannerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
