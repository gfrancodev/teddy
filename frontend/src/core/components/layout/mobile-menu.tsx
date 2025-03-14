import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sheet, SheetContent } from '@/core/components/sheet';
import { If } from '@/core/components/conditional/if';
import { For } from '@/core/components/conditional/for';
import Logo from '../logo';
import { useAuth } from '@/features/auth/auth.context';
import { LogOut } from 'lucide-react';

import HomeIcon from '@/core/icons/home.svg?react';
import ClientIcon from '@/core/icons/client.svg?react';
import ProductIcon from '@/core/icons/product.svg?react';

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const menuItems = [
    { 
      icon: <HomeIcon />,
      activeIcon: <HomeIcon />,
      label: 'Home', 
      path: '/home',
      matchPaths: ['/home']
    },
    { 
      icon: <ClientIcon />,
      activeIcon: <ClientIcon />,
      label: 'Clientes', 
      path: '/clients',
      matchPaths: ['/'],
      subItems: [
        {
          icon: <ClientIcon />,
          activeIcon: <ClientIcon />,
          label: 'Clientes Selecionados',
          path: '/clients/selected',
        }
      ]
    },
    { 
      icon: <ProductIcon />,
      activeIcon: <ProductIcon />,
      label: 'Produtos', 
      path: '/products'
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-64 p-0 bg-white">
        <div className="flex flex-col h-full">
          <div className="flex flex-row justify-center items-center w-[260px] h-[128px] bg-teddy-darkgray-light backdrop-blur-[16px]">
            <Logo className="ml-1" />
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-6 pl-10 pt-10">
              <For each={menuItems}>
                {(item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => {
                        const isParentActive = isActive || (item.matchPaths && item.matchPaths.includes(location.pathname));
                        const hasActiveChild = item.subItems?.some(subItem => location.pathname === subItem.path);
                        return `
                          flex items-center gap-5 transition-all duration-200 py-2
                          ${(isParentActive || hasActiveChild) ? "border-r-4 border-teddy-orange" : ""}
                        `;
                      }}
                    >
                      {({ isActive }) => {
                        const isActiveRoute = isActive || (item.matchPaths && item.matchPaths.includes(location.pathname));
                        const hasActiveChild = item.subItems?.some(subItem => location.pathname === subItem.path);
                        return (
                          <>
                            <span className="flex-shrink-0">
                              {(isActiveRoute || hasActiveChild) ? item.activeIcon : item.icon}
                            </span>
                            <span className={`font-medium ${(isActiveRoute || hasActiveChild) ? 'text-teddy-orange' : 'text-gray-800'}`}>
                              {item.label}
                            </span>
                          </>
                        );
                      }}
                    </NavLink>

                    <If condition={!!item.subItems}>
                      <ul className="ml-6 mt-2 space-y-2">
                        <For each={item.subItems || []}>
                          {(subItem, subIndex) => (
                            <li key={`${index}-${subIndex}`}>
                              <NavLink
                                to={subItem.path}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => `
                                  flex items-center gap-3 transition-all duration-200 py-1
                                  ${isActive ? "border-r-4 border-teddy-orange text-teddy-orange" : "text-gray-600"}
                                `}
                              >
                                <span className="flex-shrink-0 w-4 h-4">
                                  {subItem.icon}
                                </span>
                                <span className="text-sm">{subItem.label}</span>
                              </NavLink>
                            </li>
                          )}
                        </For>
                      </ul>
                    </If>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-5 py-2 text-gray-800 hover:text-teddy-orange transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
