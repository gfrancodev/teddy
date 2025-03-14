import { Toaster } from "sonner";
import { TooltipProvider } from "@/core/components/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./app/login/page";
import Clients from "./app/client/page";
import SelectedClients from "./app/client/selected/page";
import NotFound from "./app/not-found";
import Layout from "./core/components/layout";
import { AuthProvider } from "./features/auth/auth.context";
import Register from "./app/register/page";
import { ClientProvider } from "./features/client/client.context";
import { useAuth } from "./features/auth/auth.context";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster richColors position="top-center" />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<PrivateRoute />}>
                <Route element={
                  <Layout>
                    <ClientProvider>
                      <Outlet />
                    </ClientProvider>
                  </Layout>
                }>
                  <Route index element={<Navigate to="/clients" replace />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/selected" element={<SelectedClients />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default App;
