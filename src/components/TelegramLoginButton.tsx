import { useEffect } from 'react'
import { useTelegramAuth } from '../hooks/useTelegramAuth'

// Declare Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: any;
      }
    };
  }
}

export function TelegramLoginButton() {
  const { user, loading, error, login, isAuthenticated } = useTelegramAuth()

  useEffect(() => {
    // Initialize Telegram WebApp according to Telegram documentation
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      try {
        (window as any).Telegram.WebApp.ready()
        (window as any).Telegram.WebApp.expand()
      } catch (err) {
        console.error('Error initializing Telegram WebApp:', err)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground ml-2">Loading...</p>
      </div>
    )
  }

  if (error && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="space-y-2 text-center">
          <h2 className="font-medium text-lg">Authentication Error</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="pt-4 space-y-2 flex flex-col">
            <button
              onClick={login}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Reset and Restart
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        {user.user_metadata?.['photo_url'] && (
          <img 
            src={user.user_metadata['photo_url']} 
            alt="Profile" 
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <div className="font-medium">
            {user.user_metadata?.['first_name']} {user.user_metadata?.['last_name']}
          </div>
          <div className="text-sm text-gray-500">
            @{user.user_metadata?.['username'] || 'user'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      disabled={loading}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center space-x-2"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span>Sign in with Telegram</span>
        </>
      )}
    </button>
  )
}

export default TelegramLoginButton