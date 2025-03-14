import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import Logo from '@/core/components/logo';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLoginContainer } from './container';
import { If } from '@/core/components/conditional/if';

const Login = () => {
  const { states, handlers, actions, form } = useLoginContainer();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teddy-gray animate-fade-in">
      <div className="mb-8 scale-110">
        <Logo />
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-center mb-8">
            Faça seu login
          </h2>

          <form
            onSubmit={form.handleSubmit(actions.onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Input
                placeholder="Usuário ou email"
                {...form.register('identifier')}
                error={form.errors.identifier?.message}
                className="h-12 border-gray-200 rounded-md input-transition"
                autoComplete="username"
              />

              <div className="relative">
                <Input
                  type={states.showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  {...form.register('password')}
                  error={form.errors.password?.message}
                  className="h-12 border-gray-200 rounded-md input-transition pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={handlers.togglePasswordVisibility}
                  tabIndex={-1}
                >
                  <If condition={states.showPassword}>
                    <EyeOff size={18} />
                  </If>
                  <If condition={!states.showPassword}>
                    <Eye size={18} />
                  </If>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-teddy-orange hover:bg-teddy-orange/90 text-white rounded-md font-medium text-lg teddy-button"
              disabled={states.isLoading}
            >
              {states.isLoading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Não tem uma conta?
                <Link
                  to="/register"
                  className="ml-1 text-teddy-orange hover:underline"
                >
                  Cadastre-se
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
