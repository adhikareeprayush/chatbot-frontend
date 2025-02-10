import { ApiResponse } from '../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// User APIs
export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  // save the accessToken and refreshToken in local storage
  const responseData = await response.json();
  console.log("Response.json: ", responseData);
  localStorage.setItem('chatAccessToken', responseData.data.accessToken);
  localStorage.setItem('chatRefreshToken', responseData.data.refreshToken);

  // console.log("Access Token: ", localStorage.getItem('chatAccessToken'));
  // console.log("Refresh Token: ", localStorage.getItem('chatRefreshToken'));

  console.log("Response Data: ", responseData);
  return responseData;
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
  // const response = await fetch(`${API_BASE_URL}/users/me`, {
  //   method: "GET",
  //   mode: "cors",
  //   credentials: "include",
  // });

  const response = await axios.get(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('chatAccessToken')}`,
    },
  });
  
  // console.log("Current user response: ", response);
  
  if (!response) {
    throw new Error('Failed to get current user');
  }

  console.log("From getCurrentUser: ", response.data);
  return response.data;
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