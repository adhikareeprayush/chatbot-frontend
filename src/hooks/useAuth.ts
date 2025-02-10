import { useState, useCallback } from 'react';
import { User, AuthState } from '../types';
import { loginUser, registerUser, getCurrentUser } from '../utils/api';
import { getErrorMessage } from '../utils/errorMessages';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const response = await loginUser(email, password);
    console.log("Response from login: ", response)

    if(response) {
      console.log("Response from login: ", response.data)
      setState({
        user: null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      console.log(state);
      return true;
    }
    else {
      // console.log("Error from login: ", response.message)
      throw new Error(response|| 'Login failed');
    }
  }, []);

  const register = useCallback(async (data: {
    fullname: string;
    email: string;
    username: string;
    password: string;
  }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await registerUser(data);
      if (response.success) {
        setState(prev => ({ ...prev, isLoading: false }));
        return true;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: getErrorMessage(error),
      }));
      throw error;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // get accessToken from local storage
      const accessToken = localStorage.getItem('chatAccessToken');
      
      if (!accessToken) {
        throw new Error('Access token not found');
      }
      else {
        const response = await getCurrentUser();
        setState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const logout = useCallback(() => {
    setState(initialState);
    localStorage.removeItem('chatAccessToken');
    localStorage.removeItem('chatRefreshToken');
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
  };
};