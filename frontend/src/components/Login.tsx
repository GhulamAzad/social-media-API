import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import useLocalStorage from "../hooks/useLocalStorage";
import { login } from "../services/authService";
import Button from "./shared/Button";
import { TextInput } from "./shared/TextInput";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

interface LoginFormInputs extends z.infer<typeof loginSchema> {}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [_, setToken] = useLocalStorage("token");
  const { mutate, isLoading } = useMutation(login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data;
    mutate(
      { email, password },
      {
        onSuccess(data: any) {
          console.log(data);
          setToken(data?.token);
          toast.success("Successfully Login!");
          navigate("/");
        },
        onError(err: any) {
          toast.error(err?.message);
        },
      }
    );
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Log in to your account
          </h2>
        </div>
        <form
          className='mt-8 space-y-6'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label htmlFor='username' className='sr-only'>
              Username
            </label>
            <TextInput
              id='email'
              {...register("email", { required: true })}
              type='text'
              autoComplete='email'
              required
              className={errors.email ? "border-red-500" : ""}
              placeholder='Email'
            />
            {errors.email && (
              <p className='text-red-500 text-sm  my-1'>
                {errors.email?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>
            <TextInput
              id='password'
              {...register("password", { required: true })}
              type='password'
              autoComplete='current-password'
              required
              className={errors.password ? "border-red-500" : ""}
              placeholder='Password'
            />
            {errors.password && (
              <p className='text-red-500 text-sm my-1'>
                {errors.password?.message}
              </p>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-sm'>
              <Link
                to={"/register"}
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button variant='full' disabled={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
