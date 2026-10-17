import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: T = await response.json();
        setState({ data: json, loading: false, error: null });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setState({ data: null, loading: false, error: message });
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return state;
}
