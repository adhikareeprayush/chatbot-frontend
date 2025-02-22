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

export const startChat = async (userId: string): Promise<ApiResponse> => {
  console.log(userId);
  const response = await fetch(`${API_BASE_URL}/chat/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to start chat');
  }

  const responseData = await response.json();
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

export const getChatHistory = async (userId: string, sessionId: string ) => {
  const response = await axios.get(`${API_BASE_URL}/chat/${userId}/${sessionId}`)


  if(!response) {
    throw new Error('Failed to get chat history');
  }
  return response.data;
}

  export const getChatHistories = async (userId: string): Promise<ApiResponse> => {
    // console.log(localStorage.getItem('chatAccessToken'));
    const response = await axios.get(`${API_BASE_URL}/chat/history/${userId}`);

    if (!response) {
      throw new Error('Failed to get chat histories');
    }

    return response.data;
  }


  export const getCurrentUser = async (): Promise<ApiResponse> => {

  const response = await axios.get(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('chatAccessToken')}`,
    },
  });
  
  
  if (!response) {
    throw new Error('Failed to get current user');
  }

  return response.data;
};

// Chat APIs
export const sendChatMessage = async (prompt: string, userId: string, sessionId: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ prompt, userId, sessionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response');
  }

  return response.json();
};