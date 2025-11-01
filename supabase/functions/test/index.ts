import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

serve(async (_req) => {
  // Simple test response
  return new Response(
    JSON.stringify({ message: 'Test function working!' }),
    { 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200
    }
  );
});