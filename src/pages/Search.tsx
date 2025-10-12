import React, { useState } from 'react';
import type { Track } from '../api/client';
import { apiClient } from '../api/client';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await apiClient.searchTracks(searchQuery);
      setTracks(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <form onSubmit={handleSubmit} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search tracks, artists, or albums"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-12"
          />
          <Button type="submit" variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <SearchIcon className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track) => (
              <div key={track.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">No Image</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No results found
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Search for music
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;