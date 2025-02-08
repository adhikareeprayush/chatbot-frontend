import { Settings } from '../types';

const formatInstructions = {
  default: 'Provide a natural response without any prefixes.',
  bullet: 'Format your response as a bulleted list where appropriate.',
  paragraph: 'Format your response in clear, well-structured paragraphs.',
  stepByStep: 'Format your response as numbered steps.',
};

const personalityInstructions = {
  default: 'Respond directly without any prefixes like "BOT:" or "ASSISTANT:".',
  professional: 'Maintain a professional tone without any prefixes.',
  friendly: 'Keep a conversational tone without any prefixes.',
  concise: 'Be brief and direct without any prefixes.',
};

export const formatPrompt = (prompt: string, settings: Settings): string => {
  const formatInstruction = formatInstructions[settings.responseFormat];
  const personalityInstruction = personalityInstructions[settings.aiPersonality];
  
  return `
Important: Respond directly without using any prefixes like "BOT:", "ASSISTANT:", or similar markers.

${formatInstruction}
${personalityInstruction}

Query: ${prompt}
`;
};

export const cleanResponse = (response: string): string => {
  // Remove common prefixes
  return response
    .replace(/^(BOT|ASSISTANT|AI|SYSTEM):\s*/i, '')
    .replace(/^["']|["']$/g, '') // Remove quotes
    .trim();
};