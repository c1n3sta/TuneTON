import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginWithTelegram, logout } from '../utils/telegramAuth';

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
  login: async () => { },
  logout: async () => { }
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const initializeTelegramWebApp = async (): Promise<void> => {
      if (isCancelled || hasInitialized) return;

      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (!isCancelled) {
            setError('Initialization timeout. Please refresh the page.');
            setIsLoading(false);
            setHasInitialized(true);
          }
        }, 10000); // 10 second timeout

        // Check if we're running in Telegram Web App environment
        if (typeof window !== 'undefined') {
          const telegramWebApp = (window as any).Telegram?.WebApp;

          if (telegramWebApp) {
            if (!isCancelled) {
              setTg(telegramWebApp);
            }

            // Initialize the web app
            telegramWebApp.ready();

            // Set theme
            const isDark = telegramWebApp.colorScheme === 'dark';
            if (!isCancelled) {
              setIsDarkMode(isDark);
            }

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
              if (!isCancelled) {
                setUser(telegramUser);
                setIsAuthenticated(true);
              }

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
                if (!isCancelled) {
                  setUser(currentUser.user_metadata as TelegramUser);
                  setIsAuthenticated(true);
                }
              } else {
                // Try to automatically login if initData is available but no user is authenticated
                if (telegramWebApp.initData) {
                  console.log('Attempting automatic login with Telegram initData');
                  try {
                    await handleLogin();
                  } catch (loginError) {
                    console.error('Automatic login failed:', loginError);
                    if (!isCancelled) {
                      setError(loginError instanceof Error ? loginError.message : 'Failed to authenticate');
                    }
                  }
                } else if (!isCancelled) {
                  setError('No user data available from Telegram');
                }
              }
            }

            // Listen for theme changes
            telegramWebApp.onEvent?.('themeChanged', () => {
              if (isCancelled) return;
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
            // Development mode - create mock data
            console.log('Running in development mode - using mock Telegram data');

            // Check if user is already authenticated via Supabase
            const currentUser = await getCurrentUser();
            if (currentUser?.user_metadata) {
              if (!isCancelled) {
                setUser(currentUser.user_metadata as TelegramUser);
                setIsAuthenticated(true);
                setIsLoading(false);
                setHasInitialized(true);
              }
              return;
            }

            const mockTg = {
              initData: '',
              initDataUnsafe: {
                user: {
                  id: 12345,
                  first_name: 'Dev User',
                  username: 'devuser',
                  is_premium: false
                }
              },
              version: '7.0',
              platform: 'web',
              colorScheme: 'dark' as const,
              themeParams: {
                bg_color: '#0d1117',
                text_color: '#ffffff',
                button_color: '#0088cc',
                button_text_color: '#ffffff'
              },
              isExpanded: true,
              viewportHeight: window.innerHeight,
              viewportStableHeight: window.innerHeight,
              isClosingConfirmationEnabled: false,
              headerColor: '#0d1117',
              backgroundColor: '#0d1117',
              BackButton: {
                isVisible: false,
                show: () => { },
                hide: () => { },
                onClick: () => { },
                offClick: () => { }
              },
              MainButton: {
                text: '',
                color: '#0088cc',
                textColor: '#ffffff',
                isVisible: false,
                isProgressVisible: false,
                isActive: false,
                setText: () => { },
                onClick: () => { },
                offClick: () => { },
                show: () => { },
                hide: () => { },
                enable: () => { },
                disable: () => { },
                showProgress: () => { },
                hideProgress: () => { },
                setParams: () => { }
              },
              HapticFeedback: {
                impactOccurred: () => { },
                notificationOccurred: () => { },
                selectionChanged: () => { }
              },
              showPopup: () => { },
              showAlert: () => { },
              showConfirm: () => { },
              showScanQrPopup: () => { },
              closeScanQrPopup: () => { },
              readTextFromClipboard: () => { },
              ready: () => { },
              expand: () => { },
              close: () => { },
              sendData: () => { },
              switchInlineQuery: () => { },
              openLink: () => { },
              openTelegramLink: () => { },
              openInvoice: () => { }
            } as TelegramWebApp;

            if (!isCancelled) {
              setTg(mockTg);
              setUser(mockTg.initDataUnsafe.user!);
              setIsAuthenticated(true);
              setIsDarkMode(true);
              document.documentElement.classList.add('dark');
            }
          }
        }
      } catch (err) {
        console.error('Error initializing Telegram WebApp:', err);
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to initialize Telegram WebApp');
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (!isCancelled) {
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    };

    // Initialize immediately if Telegram script is already loaded
    if ((window as any).Telegram?.WebApp) {
      initializeTelegramWebApp();
    } else {
      // Wait for Telegram script to load
      let checkCount = 0;
      const maxChecks = 50; // Max 5 seconds (50 * 100ms)

      const checkTelegram = setInterval(() => {
        checkCount++;
        if ((window as any).Telegram?.WebApp) {
          clearInterval(checkTelegram);
          initializeTelegramWebApp();
        } else if (checkCount >= maxChecks) {
          clearInterval(checkTelegram);
          // Fallback for development mode
          initializeTelegramWebApp();
        }
      }, 100);

      // Cleanup function
      return () => {
        isCancelled = true;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        clearInterval(checkTelegram);
      };
    }

    // Cleanup function
    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hasInitialized]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Add timeout for login process
      const loginTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout. Please try again.')), 15000)
      );

      await Promise.race([
        loginWithTelegram(),
        loginTimeout
      ]);

      // After successful login, refresh user data
      const currentUser = await getCurrentUser();
      if (currentUser?.user_metadata) {
        setUser(currentUser.user_metadata as TelegramUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);

      // Provide more specific error handling
      if (errorMessage.includes('Telegram WebApp not available')) {
        setError('Please open this app from Telegram to continue.');
      } else if (errorMessage.includes('invalid hash')) {
        setError('Authentication data is invalid. Please restart the app.');
      } else if (errorMessage.includes('Rate limit exceeded')) {
        setError('Too many login attempts. Please try again later.');
      }
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

  // Show loading state while initializing
  if (isLoading && !hasInitialized) {
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
        <div className="text-center space-y-4 p-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-medium">Connection Error</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                Refresh Page
              </button>
            </div>
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

export { TelegramAuthContext, TelegramAuthProvider };
export type { TelegramAuthContextType, TelegramUser, TelegramWebApp };

