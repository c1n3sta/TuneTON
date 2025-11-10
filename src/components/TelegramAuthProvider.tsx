import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loginWithTelegram, logout, getCurrentUser } from '../utils/telegramAuth';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  is_premium?: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    hint_color?: string;
    bg_color?: string;
    text_color?: string;
    header_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (button_id: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: { text?: string }, callback?: (qr_text: string) => boolean) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (clipboardText: string) => void) => void;
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
}

interface TelegramAuthContextType {
  tg: TelegramWebApp | null;
  user: TelegramUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isDarkMode: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const TelegramAuthContext = createContext<TelegramAuthContextType>({
  tg: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isDarkMode: true,
  login: async () => {},
  logout: async () => {}
});

export const useTelegramAuth = () => {
  const context = useContext(TelegramAuthContext);
  if (!context) {
    throw new Error('useTelegramAuth must be used within a TelegramAuthProvider');
  }
  return context;
};

interface TelegramAuthProviderProps {
  children: ReactNode;
}

export default function TelegramAuthProvider({ children }: TelegramAuthProviderProps) {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then Telegram WebApp, then default to true
    const savedTheme = localStorage.getItem('tuneton_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check if we're in Telegram WebApp
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      return (window as any).Telegram.WebApp.colorScheme === 'dark';
    }
    return true; // Default to dark mode
  });

  useEffect(() => {
    const initializeTelegramWebApp = async () => {
      try {
        // Check if we're running in Telegram Web App environment
        if (typeof window !== 'undefined') {
          const telegramWebApp = (window as any).Telegram?.WebApp;
          
          if (telegramWebApp) {
            setTg(telegramWebApp);
            
            // Initialize the web app
            telegramWebApp.ready();
            
            // Set theme
            const isDark = telegramWebApp.colorScheme === 'dark';
            setIsDarkMode(isDark);
            
            // Apply theme to document
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            
            // Configure the web app appearance
            telegramWebApp.expand();
            telegramWebApp.headerColor = isDark ? '#0d1117' : '#ffffff';
            telegramWebApp.backgroundColor = isDark ? '#0d1117' : '#ffffff';
            
            // Get user data
            if (telegramWebApp.initDataUnsafe?.user) {
              const telegramUser = telegramWebApp.initDataUnsafe.user;
              setUser(telegramUser);
              setIsAuthenticated(true);
              
              console.log('Telegram user authenticated:', {
                id: telegramUser.id,
                first_name: telegramUser.first_name,
                username: telegramUser.username,
                is_premium: telegramUser.is_premium
              });
            } else {
              console.warn('No user data available from Telegram WebApp');
              // Check if user is already authenticated via Supabase
              const currentUser = await getCurrentUser();
              if (currentUser?.user_metadata) {
                setUser(currentUser.user_metadata as TelegramUser);
                setIsAuthenticated(true);
              } else {
                setError('No user data available from Telegram');
              }
            }
            
            // Listen for theme changes
            telegramWebApp.onEvent?.('themeChanged', () => {
              const newIsDark = telegramWebApp.colorScheme === 'dark';
              setIsDarkMode(newIsDark);
              
              if (newIsDark) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            });
            
            // Listen for viewport changes
            telegramWebApp.onEvent?.('viewportChanged', (data: any) => {
              console.log('Viewport changed:', data);
            });
            
            // Configure haptic feedback
            if (telegramWebApp.HapticFeedback) {
              // Provide haptic feedback when app loads
              telegramWebApp.HapticFeedback.impactOccurred('light');
            }
            
          } else {
            // Check if user is already authenticated via Supabase
            const currentUser = await getCurrentUser();
            if (currentUser?.user_metadata) {
              setUser(currentUser.user_metadata as TelegramUser);
              setIsAuthenticated(true);
            } else {
              setError('Telegram WebApp is not available');
            }
          }
        }
      } catch (err) {
        console.error('Error initializing Telegram WebApp:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Telegram WebApp');
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize immediately if Telegram script is already loaded
    if ((window as any).Telegram?.WebApp) {
      initializeTelegramWebApp();
      return () => {}; // Return empty cleanup function
    } else {
      // Wait for Telegram script to load
      const checkTelegram = setInterval(() => {
        if ((window as any).Telegram?.WebApp) {
          clearInterval(checkTelegram);
          initializeTelegramWebApp();
        }
      }, 100);

      // Fallback timeout
      const fallbackTimeout = setTimeout(() => {
        clearInterval(checkTelegram);
        if (!tg) {
          setError('Telegram WebApp failed to load');
        }
      }, 2000);

      return () => {
        clearInterval(checkTelegram);
        clearTimeout(fallbackTimeout);
      };
    }
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loginWithTelegram();
      // After successful login, refresh user data
      const currentUser = await getCurrentUser();
      if (currentUser?.user_metadata) {
        setUser(currentUser.user_metadata as TelegramUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  // Provide haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
    if (tg?.HapticFeedback) {
      if (type === 'success' || type === 'error' || type === 'warning') {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    }
  };

  // Add haptic feedback to context
  const contextValue: TelegramAuthContextType = {
    tg,
    user,
    isAuthenticated,
    isLoading,
    error,
    isDarkMode,
    login: handleLogin,
    logout: handleLogout
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading TunTON...</p>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-medium">Connection Error</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
            <button 
              onClick={handleLogin}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TelegramAuthContext.Provider value={contextValue}>
      {children}
    </TelegramAuthContext.Provider>
  );
}

export { TelegramAuthProvider, TelegramAuthContext };
export type { TelegramUser, TelegramWebApp, TelegramAuthContextType };