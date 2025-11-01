// Jamendo API Proxy Function
// This function proxies requests to Jamendo API to avoid CORS issues

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

// Handle CORS preflight
function handleOptions(): Response {
  return new Response('ok', { headers: corsHeaders });
}

// Get environment variables
const JAMENDO_CLIENT_ID = Deno.env.get('JAMENDO_CLIENT_ID') || '8ed40859';

console.log("Jamendo Proxy Function started");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }
  
  try {
    // Get the request URL and method
    const url = new URL(req.url);
    const jamendoEndpoint = url.searchParams.get('endpoint');
    const jamendoParams = url.searchParams.get('params') || '{}';
    
    console.log('Jamendo proxy request:', { endpoint: jamendoEndpoint, params: jamendoParams });

    // Validate endpoint
    if (!jamendoEndpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse parameters
    let params;
    try {
      params = JSON.parse(jamendoParams);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid params JSON' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build Jamendo API URL
    const jamendoBaseUrl = 'https://api.jamendo.com/v3.0';
    const jamendoUrl = new URL(`${jamendoBaseUrl}/${jamendoEndpoint}`);
    
    // Add client ID to all requests
    jamendoUrl.searchParams.append('client_id', JAMENDO_CLIENT_ID);
    jamendoUrl.searchParams.append('format', 'json');
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          jamendoUrl.searchParams.append(key, value.join('+'));
        } else {
          jamendoUrl.searchParams.append(key, value.toString());
        }
      }
    });

    console.log('Making Jamendo API request:', jamendoUrl.toString());

    // Make request to Jamendo API
    const response = await fetch(jamendoUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jamendo API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Jamendo API error: ${response.status}`, 
          details: errorText 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get response data
    const data = await response.json();
    console.log('Jamendo API response received');

    // Return the data with proper CORS headers
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Jamendo proxy error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});