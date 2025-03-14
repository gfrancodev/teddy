import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { useAuth } from '@/features/auth/auth.context';
import Logo from '@/core/components/logo';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Schema de validação para registro
const registerSchema = z.object({
  fullname: z.string()
    .min(3, 'Nome completo deve ter no mínimo 3 caracteres')
    .max(100, 'Nome completo deve ter no máximo 100 caracteres')
    .trim(),
  username: z.string()
    .min(3, 'Nome de usuário deve ter no mínimo 3 caracteres')
    .max(50, 'Nome de usuário deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscores')
    .trim(),
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres')
    .trim(),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
    )
    .trim()
}).strict();

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: registerUser, isLoading } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      password: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data as Auth.RegisterDTO);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teddy-gray animate-fade-in">
      <div className="mb-8 scale-110">
        <Logo />
      </div>
      
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-center mb-8">
            Crie sua conta
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                placeholder="Nome completo"
                {...register('fullname')}
                error={errors.fullname?.message}
                className="h-12 border-gray-200 rounded-md input-transition"
              />
              
              <Input
                placeholder="Nome de usuário"
                {...register('username')}
                error={errors.username?.message}
                className="h-12 border-gray-200 rounded-md input-transition"
              />
              
              <Input
                type="email"
                placeholder="Email"
                {...register('email')}
                error={errors.email?.message}
                className="h-12 border-gray-200 rounded-md input-transition"
              />
              
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  {...register('password')}
                  error={errors.password?.message}
                  className="h-12 border-gray-200 rounded-md input-transition pr-10"
                  autoComplete="new-password"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-teddy-orange hover:bg-teddy-orange/90 text-white rounded-md font-medium text-lg teddy-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Já tem uma conta? 
                <Link 
                  to="/login" 
                  className="ml-1 text-teddy-orange hover:underline"
                >
                  Faça login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 