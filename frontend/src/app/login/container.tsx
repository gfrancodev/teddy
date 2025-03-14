import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/auth.context';
import { loginSchema, LoginFormValues } from './validator';
import { toast } from 'sonner';

export const useLoginContainer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticating } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      setIsSubmitting(true);
      try {
        await login(data as Auth.LoginDTO);
      } finally {
        setIsSubmitting(false);
      }
    },
    [login]
  );

  return {
    states: {
      showPassword,
      isLoading: isSubmitting || isAuthenticating
    },
    handlers: {
      togglePasswordVisibility,
    },
    actions: {
      onSubmit,
    },
    form: {
      register,
      handleSubmit,
      errors,
    },
  };
};
