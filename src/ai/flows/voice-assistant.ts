'use server';
/**
 * @fileOverview A Genkit flow for handling voice commands, interpreting them, and generating spoken responses.
 *
 * - voiceAssistant - A function that processes a voice command and returns a spoken audio response.
 * - VoiceAssistantInput - The input type for the voiceAssistant function.
 * - VoiceAssistantOutput - The return type for the voiceAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

// Helper function to convert PCM to WAV, copied from the provided example
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Define Input Schema
const VoiceAssistantInputSchema = z.object({
  command: z.string().describe('The voice command or question from the user.').optional(),
  language: z.enum(['en', 'hi', 'or']).default('en').describe('The desired language for the response (English, Hindi, or Odia).'),
  mode: z.enum(['greet', 'respond']).default('respond').describe('Determines if the assistant should greet the user or respond to a command.'),
});
export type VoiceAssistantInput = z.infer<typeof VoiceAssistantInputSchema>;

// Define Output Schema
const VoiceAssistantOutputSchema = z.object({
  responseText: z.string().describe('The text of the generated response.'),
  audioResponse: z.string().describe('The spoken response as a base64 encoded WAV audio data URI.'),
});
export type VoiceAssistantOutput = z.infer<typeof VoiceAssistantOutputSchema>;

// Implement the Flow Logic
const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceAssistantInputSchema,
    outputSchema: VoiceAssistantOutputSchema,
  },
  async (input) => {
    let textToSpeak: string;

    if (input.mode === 'greet') {
        const greetings = {
            en: 'How can I help your pet today?',
            hi: 'मैं आज आपके पालतू जानवर की कैसे मदद कर सकता हूँ?',
            or: 'ମୁଁ ଆଜି ଆପଣଙ୍କ ପୋଷା ଜନ୍ତୁକୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
        };
        textToSpeak = greetings[input.language];
    } else {
        if (!input.command) {
            throw new Error('A command is required when in respond mode.');
        }
        // Generate text response first
        const textGenPrompt = `You are a helpful and friendly pet care assistant for the "Smart Pet Care" mobile app.
Your goal is to provide simple, concise, and easy-to-understand answers to pet owners' questions or commands.
Respond in the specified language. If you cannot fulfill a request, politely state that you cannot.

User Command: "${input.command}"
Desired Response Language: "${input.language}"

Please provide your simple response in ${input.language}:`;
      
      const llmResponse = await ai.generate({
          prompt: textGenPrompt,
      });
      textToSpeak = llmResponse.text;
    }
    
    if (!textToSpeak) {
      throw new Error('Failed to get a text response from the AI.');
    }

    // Convert the text response to audio using TTS model
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      prompt: textToSpeak,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
    });

    if (!media) {
      throw new Error('No audio media returned from TTS.');
    }

    // The returned media URL is a data URI, extract base64 data
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    // Convert PCM audio buffer to WAV format
    const audioWavBase64 = await toWav(audioBuffer);

    return {
      responseText: textToSpeak,
      audioResponse: 'data:audio/wav;base64,' + audioWavBase64,
    };
  }
);

// Wrapper Function
export async function voiceAssistant(input: VoiceAssistantInput): Promise<VoiceAssistantOutput> {
  return voiceAssistantFlow(input);
}
