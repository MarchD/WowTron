import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

interface FormOptions<T> {
  initialValues: T;
}

interface UseFormReturn<T> {
  values: T;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (cb: (values: T) => void) => (event: FormEvent<HTMLFormElement>) => void;
}

export function useForm<T extends Partial<Record<string, any>>>(options?: FormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>({} as T);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues(current => ({
      ...current,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback((cb: (v: T) => void) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    cb(values);
  }, [values]);

  return {
    values,
    onChange,
    handleSubmit
  };
}
