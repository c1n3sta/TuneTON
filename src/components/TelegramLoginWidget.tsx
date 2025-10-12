import { useEffect, useState } from 'react';
import { loginWithTelegramWidget } from '../utils/telegramAuth';

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export function TelegramLoginWidget() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Telegram Login Widget callback
    window.onTelegramAuth = async (user) => {
      try {
        setLoading(true);
        setError(null);
        await loginWithTelegramWidget(user);
      } catch (err: any) {
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    // Cleanup
    return () => {
      if (window.onTelegramAuth) {
        window.onTelegramAuth = undefined;
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="TuneTON_bot"
        data-size="large"
        data-onauth="onTelegramAuth(user)"
        data-request-access="write"
      ></script>
      
      {loading && (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2">Signing in...</span>
        </div>
      )}
    </div>
  );
}

export default TelegramLoginWidget;