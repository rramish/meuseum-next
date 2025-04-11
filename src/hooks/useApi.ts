import { useState, useCallback } from 'react';

interface UseApiReturn<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
}

export function useApi<T>(): UseApiReturn<T> {
  const [state, setState] = useState<{
    data: T | null;
    error: string | null;
    loading: boolean;
  }>({
    data: null,
    error: null,
    loading: false,
  });

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        ...options,
        headers: options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'API request failed');
      }

      setState({ data: result, error: null, loading: false });
    } catch (error) {
      setState({
        data: null,
        error: (error as Error).message || 'An error occurred',
        loading: false,
      });
    }
  }, []);

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    fetchData,
  };
}