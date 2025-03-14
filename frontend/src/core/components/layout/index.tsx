import React, { useState } from 'react';
import AppSidebar from './sidebar';
import { cn } from '@/core/utils/cn';
import { useIsMobile } from '@/core/hooks/use-mobile';
import MobileMenu from './mobile-menu';
import Header from './header';
import { Menu } from 'lucide-react';
import { Button } from '../button';
import Logo from '@/core/components/logo';
import { useAuth } from '@/features/auth/auth.context';
import { getFirstName } from '@/core/utils/format-string';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const { user } = useAuth();
  const firstName = getFirstName(user?.fullname || 'Usuário');
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="min-h-screen bg-teddy-gray">
      {!isMobile && (
        <AppSidebar 
          collapsed={sidebarCollapsed} 
          onCollapsedChange={setSidebarCollapsed} 
        />
      )}
      {isMobile && <MobileMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} />}
      
      <main 
        className={cn(
          "transition-all duration-300 min-h-screen bg-teddy-gray",
          className
        )}
      >
        {isMobile ? (
          <header className="sticky top-0 z-30 bg-white shadow-sm py-3 px-4 border-b">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="mr-2">
                <Menu size={24} />
              </Button>
              <Logo />
              <div className="text-sm">
                <span className="text-gray-600">Olá, </span>
                <span className="font-semibold">{firstName}!</span>
              </div>
            </div>
          </header>
        ) : (
          <Header 
            onMenuToggle={toggleSidebar} 
          />
        )}
        <div className="container mx-auto p-4 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
