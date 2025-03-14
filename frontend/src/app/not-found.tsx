
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/core/components/button";
import Logo from "@/core/components/logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teddy-gray p-4 animate-fade-in">
      <div className="mb-8">
        <Logo />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 max-w-md w-full text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-teddy-orange mb-4">404</h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6">Oops! Página não encontrada</p>
        
        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Button 
          asChild
          className="w-full sm:w-auto bg-teddy-orange hover:bg-teddy-orange/90 text-white teddy-button"
        >
          <Link to="/">Voltar para Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
