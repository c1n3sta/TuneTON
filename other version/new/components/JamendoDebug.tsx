import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, RefreshCw, TestTube } from 'lucide-react';
import { jamendoAPI, testJamendoAPI, debugJamendoAPI, getTuneTONRecommendations } from '../utils/jamendo-api';

export default function JamendoDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'available' | 'unavailable'>('unknown');

  const handleDebugAPI = async () => {
    setIsLoading(true);
    setDebugResult(null);
    
    try {
      const result = await debugJamendoAPI();
      setDebugResult(result);
      setApiStatus(result ? 'available' : 'unavailable');
    } catch (error) {
      console.error('Debug failed:', error);
      setDebugResult({ error: error.message });
      setApiStatus('unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAPI = async () => {
    setIsLoading(true);
    
    try {
      const isWorking = await testJamendoAPI();
      setApiStatus(isWorking ? 'available' : 'unavailable');
      console.log('API test result:', isWorking);
    } catch (error) {
      console.error('Test failed:', error);
      setApiStatus('unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const recommendations = await getTuneTONRecommendations();
      console.log('Recommendations:', recommendations);
      setDebugResult(recommendations);
    } catch (error) {
      console.error('Recommendations failed:', error);
      setDebugResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAPI = () => {
    jamendoAPI.resetApiAvailability();
    setApiStatus('unknown');
    setDebugResult(null);
    console.log('Jamendo API availability reset');
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Jamendo API Debug Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">API Status:</span>
              <Badge variant={
                apiStatus === 'available' ? 'default' : 
                apiStatus === 'unavailable' ? 'destructive' : 
                'secondary'
              }>
                {apiStatus === 'available' && 'Available'}
                {apiStatus === 'unavailable' && 'Unavailable'}
                {apiStatus === 'unknown' && 'Unknown'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                (Current: {jamendoAPI.isApiAvailable() ? 'Available' : 'Unavailable'})
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Speed Parameter Fix Applied:</strong> Using correct values [verylow, low, medium, high, veryhigh] instead of [slow, fast, medium]
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleDebugAPI} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Debug API Call
            </Button>

            <Button 
              onClick={handleTestAPI} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Test API
            </Button>

            <Button 
              onClick={handleGetRecommendations} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Get Recommendations
            </Button>

            <Button 
              onClick={handleResetAPI} 
              disabled={isLoading}
              variant="secondary"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset API
            </Button>
          </div>

          {debugResult && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Debug Result:</h4>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-64">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}