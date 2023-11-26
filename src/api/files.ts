import { fetchAPI } from './fetch';
import { FilesResponse } from '../types';

export const getFiles = async (): Promise<FilesResponse> => {
  return await fetchAPI('/files', { method: 'GET' });
}
