import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // FIX: Use isLoading instead of loading
  const { isAuthenticated, isLoading } = useTelegramAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // FIX: Use isLoading instead of loading
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to onboarding');
      navigate('/onboarding');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // FIX: Use isLoading instead of loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}