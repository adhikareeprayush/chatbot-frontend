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
    try {
      const response = await loginUser(email, password);
      setState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: getErrorMessage(error),
      }));
      return false;
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
      const response = await getCurrentUser();
      setState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
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
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
  };
};