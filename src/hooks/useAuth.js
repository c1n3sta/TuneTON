// Authentication hook for self-hosted backend
import { useState, useEffect, createContext, useContext } from 'react';
import apiClient from '../utils/apiClient';

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real implementation, you would check for a stored session
        // For now, we'll just set loading to false
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Telegram authentication
  const signInWithTelegram = async (initData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.telegramAuth(initData);
      
      if (response.user) {
        setUser(response.user);
        // In a real implementation, you would store the session
        return { user: response.user };
      } else {
        throw new Error(response.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      setUser(null);
      // In a real implementation, you would clear the stored session
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  const value = {
    user,
    loading,
    error,
    signInWithTelegram,
    signOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}