import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Play, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { jamendoAPI, JamendoTrack, getTuneTONRecommendations, testJamendoAPI } from '../utils/jamendo-api';

export default function JamendoTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'working' | 'failed'>('unknown');
  const [tracks, setTracks] = useState<JamendoTrack[]>([]);
  const [recommendations, setRecommendations] = useState<{
    popular: JamendoTrack[];
    trending: JamendoTrack[];
    lofi: JamendoTrack[];
    remixable: JamendoTrack[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Test basic API connectivity
  const testAPI = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Testing Jamendo API...');
      const isWorking = await testJamendoAPI();
      setApiStatus(isWorking ? 'working' : 'failed');
      
      if (isWorking) {
        console.log('API test successful');
      } else {
        setError('API test failed - using mock data');
      }
    } catch (err) {
      console.error('API test error:', err);
      setError(`API test failed: ${err}`);
      setApiStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Get popular tracks
  const fetchPopularTracks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching popular tracks...');
      const result = await jamendoAPI.getPopularTracks(5);
      setTracks(result.results);
      console.log('Popular tracks fetched:', result.results.length);
    } catch (err) {
      console.error('Failed to fetch popular tracks:', err);
      setError(`Failed to fetch tracks: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get TuneTON recommendations
  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching TuneTON recommendations...');
      const recs = await getTuneTONRecommendations();
      setRecommendations(recs);
      console.log('Recommendations fetched:', recs);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError(`Failed to fetch recommendations: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-test on mount
  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Jamendo API Test Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* API Status */}
            <div className="flex items-center gap-2">
              <span className="font-medium">API Status:</span>
              {apiStatus === 'unknown' && <Badge variant="secondary">Unknown</Badge>}
              {apiStatus === 'working' && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Working
                </Badge>
              )}
              {apiStatus === 'failed' && (
                <Badge className="bg-red-500 text-white">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Failed (Using Mock Data)
                </Badge>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={testAPI} disabled={isLoading} variant="outline">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test API
              </Button>
              <Button onClick={fetchPopularTracks} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Get Popular Tracks
              </Button>
              <Button onClick={fetchRecommendations} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Get Recommendations
              </Button>
              <Button 
                onClick={() => {
                  jamendoAPI.resetApiAvailability();
                  setApiStatus('unknown');
                  setError(null);
                }}
                variant="outline"
              >
                Reset API
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Tracks */}
        {tracks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Popular Tracks ({tracks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tracks.map((track) => (
                  <div key={track.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div 
                      className="w-12 h-12 bg-cover bg-center rounded-lg border"
                      style={{ backgroundImage: `url('${track.image || track.album_image}')` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{track.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{track.artist_name}</p>
                      <p className="text-xs text-muted-foreground">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</p>
                    </div>
                    <div className="flex gap-2">
                      {track.musicinfo?.tags?.genres?.slice(0, 2).map((genre, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{genre}</Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(recommendations).map(([category, categoryTracks]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} ({categoryTracks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryTracks.slice(0, 3).map((track) => (
                      <div key={track.id} className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-8 h-8 bg-cover bg-center rounded border"
                          style={{ backgroundImage: `url('${track.image || track.album_image}')` }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{track.name}</p>
                          <p className="text-muted-foreground truncate">{track.artist_name}</p>
                        </div>
                      </div>
                    ))}
                    {categoryTracks.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{categoryTracks.length - 3} more tracks
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Client ID:</strong> 8ed40859</p>
              <p><strong>API Base URL:</strong> https://api.jamendo.com/v3.0</p>
              <p><strong>Mock Data Available:</strong> Yes (4 tracks)</p>
              <p><strong>CORS Support:</strong> Should work from browser</p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">How to use:</p>
                <ol className="list-decimal list-inside text-blue-700 space-y-1 mt-2">
                  <li>Click "Test API" to check connectivity</li>
                  <li>Click "Get Popular Tracks" to fetch real data</li>
                  <li>Click "Get Recommendations" to test the full integration</li>
                  <li>Check browser console for detailed logs</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}