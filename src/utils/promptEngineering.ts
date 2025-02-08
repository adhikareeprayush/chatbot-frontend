import { Settings } from '../types';

const formatInstructions = {
  default: '',
  bullet: 'Format your response as a bulleted list where appropriate.',
  paragraph: 'Format your response in clear, well-structured paragraphs.',
  stepByStep: 'Format your response as numbered steps.',
};

const personalityInstructions = {
  default: '',
  professional: 'Respond in a professional and formal manner.',
  friendly: 'Respond in a friendly and conversational tone.',
  concise: 'Provide brief, direct answers without unnecessary details.',
};

export const formatPrompt = (prompt: string, settings: Settings): string => {
  const formatInstruction = formatInstructions[settings.responseFormat];
  const personalityInstruction = personalityInstructions[settings.aiPersonality];
  
  let engineeredPrompt = prompt;

  if (formatInstruction || personalityInstruction) {
    engineeredPrompt = `
      Instructions: ${formatInstruction} ${personalityInstruction}
      User Query: ${prompt}
    `;
  }

  return engineeredPrompt;
};