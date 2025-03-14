import React from 'react';
import LogoImage from '/assets/images/logo.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '' 
}) => {
  return (
    <img 
      src={LogoImage} 
      alt="Teddy Finance Logo" 
      className={`w-auto h-auto ${className}`}
      width={100}
      height={49}
    />
  );
};

export default Logo; 