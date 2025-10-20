import { useTelegramAuth as useTelegramAuthContext, type TelegramAuthContextType } from '../components/TelegramAuthProvider';

// Type guard for Telegram WebApp
const isTelegramWebAppAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         window.Telegram !== undefined && 
         window.Telegram.WebApp !== undefined;
};

// Re-export the hook from TelegramAuthProvider for backward compatibility
export function useTelegramAuth(): TelegramAuthContextType {
  return useTelegramAuthContext();
}