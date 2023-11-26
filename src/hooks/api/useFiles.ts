import { useEffect, useMemo, useState } from 'react';
import { FileType } from '../../types';
import { getFiles } from '../../api/files';

export const useFiles = (): {
  isLoading: boolean;
  error: string;
  data: FileType[] | null
} => {
  const [data,setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getFiles()
    .then(r => {
      setData(r);
      setIsLoading(false);
    })
    .catch((e) => {
        setIsLoading(false);
        setError(e);
        throw e;
    })
  }, []);

  return useMemo(() => ({ isLoading, error, data }), [isLoading, error, data]);
}

export default useFiles;
