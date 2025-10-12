import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { handleOAuthCallback, logout } from '../../utils/jamendoAuth';

interface JamendoOAuthCallbackProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onBack?: () => void;
}

export default function JamendoOAuthCallback({ onSuccess, onError, onBack }: JamendoOAuthCallbackProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');
        const state = urlParams.get('state');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          throw new Error(`OAuth authorization failed: ${errorParam}`);
        }

        if (!authorizationCode) {
          throw new Error('No authorization code received from Jamendo');
        }

        console.log('Processing Jamendo OAuth callback with code:', authorizationCode);

        // Exchange authorization code for access token
        const success = await handleOAuthCallback(authorizationCode, state || '');

        if (success) {
          setIsSuccess(true);
          setIsProcessing(false);
          
          // Redirect back to Telegram after a short delay
          setTimeout(() => {
            onSuccess?.();
            // For Telegram Mini App, we might want to close this window
            // or redirect back to the main app
            redirectBackToTelegram();
          }, 2000);
        } else {
          throw new Error('Failed to exchange authorization code for token');
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setIsProcessing(false);
        onError?.(errorMessage);
      }
    };

    // Only process if we're on the callback page
    if (window.location.pathname.includes('/oauth/jamendo') || window.location.search.includes('code=')) {
      processOAuthCallback();
    } else {
      setIsProcessing(false);
      setError('Invalid OAuth callback URL');
    }
  }, [onSuccess, onError]);

  const redirectBackToTelegram = () => {
    // For Telegram Mini App, we can use several methods to redirect back:
    
    // Option 1: Close the current window (if opened as popup)
    if (window.opener) {
      window.close();
      return;
    }

    // Option 2: Redirect to Telegram Mini App URL
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.close();
      return;
    }

    // Option 3: Redirect to your main app URL
    window.location.href = '/';
  };

  const handleManualRedirect = () => {
    if (isSuccess) {
      redirectBackToTelegram();
    } else {
      onBack?.();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Jamendo Authorization</h1>
          <p className="text-muted-foreground">
            {isProcessing && 'Processing your Jamendo authorization...'}
            {isSuccess && 'Authorization Successful!'}
            {error && 'Authorization Failed'}
          </p>
        </div>

        {isProcessing && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Please wait while we connect to Jamendo...</p>
          </div>
        )}

        {isSuccess && (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Authorization Successful!
            </h3>
            <p className="text-muted-foreground mb-6">
              Your Jamendo account has been connected to TuneTON.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-green-800 mb-2">You can now:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Access your personal playlists</li>
                <li>• Save favorite tracks</li>
                <li>• Create custom playlists</li>
                <li>• Sync your music preferences</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Redirecting back to TuneTON...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-6">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Authorization Failed
            </h3>
            <p className="text-muted-foreground mb-4">
              We couldn't connect your Jamendo account.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground mb-6">
              <p>This might be because:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                <li>You denied permission</li>
                <li>The authorization expired</li>
                <li>Network connection issues</li>
                <li>Invalid redirect URL configuration</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            onClick={handleManualRedirect}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              isSuccess 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {isSuccess ? 'Continue to TuneTON' : 'Back to App'}
          </button>
          
          {error && (
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        {/* Instructions for developers */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">For Developers:</h4>
          <p className="text-muted-foreground">
            This page handles the OAuth callback from Jamendo. 
            Make sure your redirect URL in Jamendo Developer Console 
            points to: <code className="bg-background px-1 rounded">
              {window.location.origin}/oauth/jamendo
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}