import { fetchAPI } from './fetch';
import { FilesResponse, FolderRequest } from '../types';

export const getFolder = async ({folderId}: FolderRequest): Promise<FilesResponse> => {
  return await fetchAPI(`/folders/${folderId}`, { method: 'GET' });
}
