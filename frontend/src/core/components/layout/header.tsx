import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/core/components/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { cn } from '@/core/utils/cn';
import Logo from '@/core/components/logo';
import { If } from '@/core/components/conditional/if';
import { Show } from '@/core/components/conditional/show';
import { useAuth } from '@/features/auth/auth.context';
import { getFirstName } from '@/core/utils/format-string';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle,
}) => {
  const { user } = useAuth();
  const firstName = getFirstName(user?.fullname || 'Usuário');
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isClientsPage = location.pathname === '/clients';
  const isSelectedClientsPage = location.pathname === '/clients/selected';

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Função para garantir que o botão de menu funcione
  const handleMenuClick = () => {
    if (onMenuToggle) {
      console.log("Menu toggle clicked"); // Para debug
      onMenuToggle();
    }
  };

  const menuItems = [
    { 
      label: 'Clientes', 
      path: '/clients',
      isActive: isClientsPage
    },
    { 
      label: 'Clientes selecionados', 
      path: '/clients/selected',
      isActive: isSelectedClientsPage
    }
  ];

  return (
    <header className={`
      bg-white shadow-sm py-3 px-4 sm:px-6 border-b min-h-[100px] 
      flex items-center w-full transition-all duration-300
      sticky top-0 z-30
    `}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleMenuClick} 
              >
                <Menu className="menu-icon" />
              </Button>
              <Logo className="h-8" />
        </div>
        
        <If condition={!isMobile}>
          <div className="flex-1 flex items-center justify-center transition-all duration-300">
            <nav className="flex gap-8">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={cn(
                    "text-base transition-colors hover:text-teddy-orange",
                    item.isActive
                      ? "text-teddy-orange font-medium border-b-2 border-teddy-orange"
                      : "border-b-2 border-transparent"
                  )}
                >
                  {item.label}
                </NavLink>
              ))}
              <button 
                onClick={handleLogout}
                className="text-base border-b-2 border-transparent transition-colors hover:text-teddy-orange"
              >
                Sair
              </button>
            </nav>
          </div>
        </If>
        
        <div className="flex items-center gap-4">
          <Show when={!!user}>
            <div className="text-sm md:text-base">
              <span className="text-gray-600">Olá, </span>
              <span className="font-semibold">{firstName}!</span>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
};

export default Header;
