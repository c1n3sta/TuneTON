import { supabase } from './supabase'

type ApiResponse<T = any> = {
  data?: T
  error?: {
    message: string
    details?: any
  }
}

export async function callApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const apiUrl = import.meta.env.VITE_API_URL
  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession()
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`
        }),
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed')
    }

    return { data }
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error)
    return {
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }
    }
  }
}

// Example usage:
// const { data, error } = await callApi<{ message: string }>('/hello')
// if (error) console.error(error)
// console.log(data?.message)
