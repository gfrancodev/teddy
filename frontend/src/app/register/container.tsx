import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { RegisterFormValues, registerSchema } from '../../schemas/register';

export const useRegisterContainer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser, isMutating } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      password: ''
    }
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: RegisterFormValues) => {
      setIsSubmitting(true);
      try {
        await registerUser(data as Auth.RegisterDTO);
        toast.success('Cadastro realizado com sucesso!');
      } catch (error) {
        toast.error('Falha no cadastro. Por favor, tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [registerUser]
  );

  return {
    states: {
      showPassword,
      isLoading: isSubmitting || isMutating
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