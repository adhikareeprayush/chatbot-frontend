export const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect to the server. Please check your internet connection.',
  API_KEY: 'Invalid or missing API key. Please check your configuration.',
  RATE_LIMIT: 'Too many requests. Please try again in a moment.',
  SERVER: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  DEFAULT: 'Something went wrong. Please try again.',
} as const;

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return ERROR_MESSAGES.API_KEY;
    }
    if (error.message.includes('network')) {
      return ERROR_MESSAGES.NETWORK;
    }
    return error.message;
  }
  return ERROR_MESSAGES.DEFAULT;
};