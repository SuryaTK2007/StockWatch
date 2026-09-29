import { useState, useEffect } from 'react';

export function useFetch<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    fetcher()
      .then(setData)
      .catch(() => setError('Failed to load data. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, deps);

  return { data, loading, error, reload: load };
}
