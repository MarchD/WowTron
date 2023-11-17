import { Logo } from '../../components/icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useForm } from '../../hooks/useForm';
import { useCallback } from 'react';
import useLogin from '../../hooks/api/useLogin';
import { LoginRequest } from '../../types';

const Login = () => {
  const [login] = useLogin();
  const { values, onChange,handleSubmit} = useForm<LoginRequest>({
    initialValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = useCallback((data: LoginRequest) => {
    login(data).then(r => console.log(r))
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
      />

      <Input
        label="Password"
        name="password"
        value={values.password}
        onChange={onChange}
        className="mb-6"
        type="password"
      />

      <Button className="w-full h-10">Login</Button>
    </form>
  );
};

export default Login;
