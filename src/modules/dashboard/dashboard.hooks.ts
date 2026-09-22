import { useQuery } from '@tanstack/react-query';
import { fetchReadiness } from './dashboard.api';

export function useReadiness() {
  return useQuery({
    queryKey: ['health', 'ready'],
    queryFn: fetchReadiness,
    refetchInterval: 30_000,
  });
}