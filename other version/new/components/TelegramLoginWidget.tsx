import { useEffect, useState } from 'react'
import { loginWithTelegramWidget } from '../utils/telegramAuth'

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnAuth: (user: any) => void;
    };
  }
}

export function TelegramLoginWidget() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Telegram Login Widget callback
    window.TelegramLoginWidget = {
      dataOnAuth: async (user) => {
        try {
          setLoading(true)
          setError(null)
          await loginWithTelegramWidget(user)
        } catch (err: any) {
          console.error('Telegram widget login error:', err)
          setError(err.message || 'Authentication failed')
        } finally {
          setLoading(false)
        }
      }
    }

    // Cleanup
    return () => {
      delete window.TelegramLoginWidget
    }
  }, [])

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
        data-telegram-login="YourBotUsername"
        data-size="large"
        data-onauth="TelegramLoginWidget.dataOnAuth(user)"
        data-request-access="write"
      ></script>
      
      {loading && (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2">Signing in...</span>
        </div>
      )}
    </div>
  )
}

export default TelegramLoginWidget