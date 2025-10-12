import { useEffect } from 'react'
import { useTelegramAuth } from '../hooks/useTelegramAuth'

export function TelegramLoginButton() {
  const { user, loading, error, login, isAuthenticated } = useTelegramAuth()

  useEffect(() => {
    // Initialize Telegram WebApp
    // @ts-ignore
    window.Telegram?.WebApp?.expand()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        {user.user_metadata?.photo_url && (
          <img 
            src={user.user_metadata.photo_url} 
            alt="Profile" 
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <div className="font-medium">
            {user.user_metadata?.first_name} {user.user_metadata?.last_name}
          </div>
          <div className="text-sm text-gray-500">
            @{user.user_metadata?.username || 'user'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {loading ? 'Signing in...' : 'Sign in with Telegram'}
    </button>
  )
}

export default TelegramLoginButton
