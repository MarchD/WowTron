import { Logo } from '../../components/icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useForm } from '../../hooks/useForm';
import { useCallback } from 'react';
import useLogin from '../../hooks/api/useLogin';
import { LoginRequest } from '../../types';
const { openMainWindow } = window.electron;

const Login = () => {
  const [login, { error }] = useLogin();
  const { values, onChange,handleSubmit} = useForm<LoginRequest>({
    initialValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = useCallback((data: LoginRequest) => {
    openMainWindow()

    login(data).then(r => {
      openMainWindow()
    })
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="m-auto max-w-[305px] w-full flex flex-col items-center">
      <Logo className="mb-10"/>

      <Input
        label="Username"
        value={values.username}
        name="username"
        onChange={onChange}
        className="mb-3"
        error={Boolean(error)}
      />

      <Input
        label="Password"
        name="password"
        value={values.password}
        onChange={onChange}
        className="mb-6"
        type="password"
        error={Boolean(error)}
      />

      <Button className="w-full h-10">Login</Button>

      {error && (
        <p className="mt-2 text-[13px] text-error">{error}</p>
      )}
    </form>
  );
};

export default Login;
