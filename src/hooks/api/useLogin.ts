import { useState } from 'react';
import { login } from '../../api/login';
import { LoginRequest, LoginResponse } from '../../types';

export const useLogin = (): [((data: LoginRequest) => Promise<LoginResponse>), {
  isLoading: boolean;
  error: string
}] => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogin = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: LoginResponse = await login(data);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      throw error;
    }
  };

  return [performLogin, { isLoading, error }];
}

export default useLogin;
