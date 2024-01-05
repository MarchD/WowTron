import { useState } from 'react';
import {
  FolderRequest,
  FolderResponse,
  ItemType,
} from '../../types';
import { getFolder } from '../../api/folder';

export const useFolder = (): [((data: FolderRequest) => Promise<FolderResponse>), {
  isLoading: boolean;
  error: string;
  data: ItemType | null;
}] => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performFolder = async (data: FolderRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: FolderResponse = await getFolder(data);
      setIsLoading(false);
      setData(response);
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      throw error;
    }
  };

  return [performFolder, { isLoading, error, data }];
}

export default useFolder;
