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

  const parsedResponse = await response.json();

  if (!response.ok) {
    throw parsedResponse.error;
  }
  return parsedResponse;
};
