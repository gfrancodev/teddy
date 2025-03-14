import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '@/core/components/logo';
import { cn } from '@/core/utils/cn';

import HomeIcon from '@/core/icons/home.svg?react';
import ClientIcon from '@/core/icons/client.svg?react';
import ProductIcon from '@/core/icons/product.svg?react';
import ArroyLeftCircleIcon from '@/core/icons/arrow-left-circle.svg?react';

interface AppSidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsed?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  onCollapsedChange,
  collapsed: externalCollapsed
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const location = useLocation();
  
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setInternalCollapsed(newCollapsedState);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsedState);
    }
  };

  const menuItems = [
    { 
      icon: <HomeIcon />, 
      label: 'Home', 
      path: '/home',
      activeIcon: <HomeIcon />,
      matchPaths: ['/home']
    },
    { 
      icon: <ClientIcon />, 
      label: 'Clientes', 
      path: '/clients',
      activeIcon: <ClientIcon />,
      matchPaths: ['/']
    },
    { 
      icon: <ProductIcon />, 
      label: 'Produtos', 
      path: '/products',
      activeIcon: <ProductIcon />,
    }
  ];

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out bg-white shadow-lg",
        collapsed ? "-translate-x-full" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-center items-center w-[260px] h-[128px] bg-teddy-darkgray-light backdrop-blur-[16px]">
          <Logo className="ml-1" />
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-6 pl-10 pt-10">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-5 transition-all duration-200 py-2",
                    ((isActive || (item.matchPaths && item.matchPaths.includes(location.pathname))) && !collapsed) && "border-r-4 border-teddy-orange",
                    collapsed && "justify-center"
                  )}
                >
                  {({ isActive }) => {
                    const isActiveRoute = isActive || (item.matchPaths && item.matchPaths.includes(location.pathname));
                    return (
                      <>
                        <span className="flex-shrink-0">
                          {isActiveRoute ? item.activeIcon : item.icon}
                        </span>
                        {!collapsed && (
                          <span className={`font-medium ${isActiveRoute ? 'text-teddy-orange' : 'text-gray-800'}`}>
                            {item.label}
                          </span>
                        )}
                      </>
                    );
                  }}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {!collapsed && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={toggleSidebar}
              className="p-3 rounded-full bg-teddy-darkgray text-white hover:bg-gray-700 transition-all duration-200 absolute -right-4 top-[106px] shadow-md"
            >
              <ArroyLeftCircleIcon  />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppSidebar;
