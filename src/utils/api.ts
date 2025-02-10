import { ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// User APIs
export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for handling cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const registerUser = async (data: {
  fullname: string;
  email: string;
  username: string;
  password: string;
}): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const result = await response.json();

  // After successful registration, automatically log in the user
  if (result.success) {
    try {
      await loginUser(data.email, data.password);
    } catch (error) {
      console.error('Auto-login after registration failed:', error);
    }
  }

  return result;
};

export const getCurrentUser = async (): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  return response.json();
};

// Chat APIs
export const sendChatMessage = async (prompt: string, userId: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ prompt, userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response');
  }

  return response.json();
};