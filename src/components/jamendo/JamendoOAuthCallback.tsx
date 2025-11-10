import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const JamendoOAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // In a real implementation, you would exchange the code for an access token
      // and store it in your application state or local storage
      console.log('Received authorization code:', code);
      
      // For now, we'll just navigate back to the home page
      navigate('/');
    } else {
      // Handle error case
      console.error('No authorization code found in callback URL');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Processing Jamendo authorization...</p>
      </div>
    </div>
  );
};

export default JamendoOAuthCallback;