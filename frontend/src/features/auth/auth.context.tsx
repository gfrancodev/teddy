import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { JSONStorage } from '@brushy/localstorage';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from './auth.service';
import { HttpProvider } from '@/core/providers/http.provider';
import { toast } from 'sonner';
import { AUTH_ME_KEY, AUTH_USER_KEY } from '@/core/constants/tokens.constants';

const userStorage = new JSONStorage(AUTH_USER_KEY);
const httpProvider = new HttpProvider();
const authService = new AuthService(httpProvider);

const AuthContext = createContext<Auth.ContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const storedUser = userStorage.getJSON<Auth.UserResponse | null>('data');
  const isTokenValid = authService.isAuthenticated();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<Auth.UserResponse, Error>({
    queryKey: [AUTH_ME_KEY],
    queryFn: async () => {
      try {
        const fetchedUser = await authService.me();
        userStorage.updateJSON('data', fetchedUser, {
          ttl: 24 * 60 * 60 * 1000,
        });
        return fetchedUser;
      } catch (error) {
        logout();
        throw error;
      }
    },
    initialData: storedUser || undefined,
    enabled: isTokenValid,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    console.log({ isTokenValid })
    if (!isTokenValid && !isPublicRoute) {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, isTokenValid, navigate]);

  const handleLogin = async (credentials: Auth.LoginDTO) => {
    setIsAuthenticating(true);
    try {
      const response = await authService.login(credentials);
      authService.setBearerToken(response.access_token);
      userStorage.setJSON('data', response.user, {
        ttl: 24 * 60 * 60 * 1000,
      });
      
      await queryClient.invalidateQueries({ queryKey: [AUTH_ME_KEY] });
      await queryClient.refetchQueries({ queryKey: [AUTH_ME_KEY] });
      
      toast.success('Login realizado com sucesso!', {
        dismissible: true,
        closeButton: true
      });
      navigate('/clients', { replace: true });
    } catch (error) {
      toast.error('Credenciais inválidas. Por favor, tente novamente.', {
        dismissible: true,
        closeButton: true
      });
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRegister = async (data: Auth.RegisterDTO) => {
    setIsAuthenticating(true);
    try {
      await authService.register(data);
      navigate('/login');
      toast.success('Cadastro realizado com sucesso! Por favor, faça login.', {
        dismissible: true,
        closeButton: true
      });
    } catch (error) {
      toast.error('Falha no cadastro. Por favor, tente novamente.', {
        dismissible: true,
        closeButton: true
      });
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    authService.logout();
    userStorage.remove('data');
    queryClient.removeQueries();

    navigate('/login', { replace: true });
    setTimeout(() => {
      toast.success('Logout realizado com sucesso!', {
        dismissible: true,
        closeButton: true
      });
    }, 100);
  };

  const updateUser = (updates: Partial<Auth.UserResponse>) => {
    const currentUser = userStorage.getJSON<Auth.UserResponse>('data');
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      userStorage.setJSON('data', updatedUser);
    }
  };

  const contextValue: Auth.ContextType = {
    user: user || null,
    isAuthenticated: isTokenValid && !!user,
    login: handleLogin,
    register: handleRegister,
    logout,
    updateUser,
    isLoading: false,
    isAuthenticating,
    error: error || null,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
