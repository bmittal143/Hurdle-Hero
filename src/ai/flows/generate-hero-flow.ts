'use server';
/**
 * @fileOverview A flow for generating a hero character image based on a text prompt.
 *
 * - generateHero - A function that takes a prompt and returns an image data URI.
 * - GenerateHeroInput - The input type for the generateHero function.
 * - GenerateHeroOutput - The return type for the generateHero function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHeroInputSchema = z.object({
  prompt: z.string().describe('A description of the hero to generate.'),
});
export type GenerateHeroInput = z.infer<typeof GenerateHeroInputSchema>;

const GenerateHeroOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated hero image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateHeroOutput = z.infer<typeof GenerateHeroOutputSchema>;

export async function generateHero(input: GenerateHeroInput): Promise<GenerateHeroOutput> {
  return generateHeroFlow(input);
}

const generateHeroFlow = ai.defineFlow(
  {
    name: 'generateHeroFlow',
    inputSchema: GenerateHeroInputSchema,
    outputSchema: GenerateHeroOutputSchema,
  },
  async input => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a full-body 8-bit pixel art sprite of a video game character. The character should be facing right, suitable for a side-scrolling game. The background must be transparent. The character is: ${input.prompt}`,
      config: {
        aspectRatio: '9:16',
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return {
      imageDataUri: media.url,
    };
  }
);
