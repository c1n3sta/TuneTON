import { useState, useEffect } from "react";
import { jamendoAPI } from "../utils/jamendo-api";
import { Button } from "./ui/button-component";
import { Input } from "./ui/input";

export default function SearchDebugPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Searching for:", searchQuery);
      const results = await jamendoAPI.textSearch(searchQuery, 10);
      console.log("Search results:", results);
      setSearchResults(results.results);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <h1 className="text-2xl font-bold mb-6">Search Debug Page</h1>
      
      <div className="mb-6 flex gap-2">
        <Input
          placeholder="Enter search query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/20 text-destructive rounded">
          Error: {error}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Results ({searchResults.length})</h2>
        
        {searchResults.map((track) => (
          <div key={track.id} className="p-4 border rounded-lg">
            <h3 className="font-medium">{track.name}</h3>
            <p className="text-sm text-muted-foreground">{track.artist_name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Duration: {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
            </p>
            {track.album_image && (
              <img 
                src={track.album_image} 
                alt={track.name} 
                className="mt-2 w-16 h-16 rounded"
              />
            )}
          </div>
        ))}
        
        {searchResults.length === 0 && !isLoading && (
          <p className="text-muted-foreground">No results found</p>
        )}
      </div>
    </div>
  );
}