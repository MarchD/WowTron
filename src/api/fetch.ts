import { BASE_URL } from '../constants';

export interface FetchOptions {
  body?: Record<string, any>;
  method: 'POST' | 'PUT' | 'GET' | 'DELETE';
}

export const fetchAPI = async (path: string, options: FetchOptions ) => {
  const mergedOptions: any = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options?.body && { body: JSON.stringify(options.body) })
  };

  const response = await fetch(`${BASE_URL}${path}`, mergedOptions);

  if (!response.ok) {
    throw new Error('Failed request');
  }

  return await response.json();
};
