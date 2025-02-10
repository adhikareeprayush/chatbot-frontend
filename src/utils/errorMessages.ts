export const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect to the server. Please check your internet connection.',
  SERVER: 'Server error. Please try again later.',
  AUTH_REQUIRED: 'Please log in to continue.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  DEFAULT: 'Something went wrong. Please try again.',
} as const;

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return ERROR_MESSAGES.DEFAULT;
};