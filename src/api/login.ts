import { fetchAPI } from './fetch';
import { LoginRequest, LoginResponse } from '../types'

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  return await fetchAPI('/login', { body, method: 'POST' });
}
