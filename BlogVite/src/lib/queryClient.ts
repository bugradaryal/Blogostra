import axios from 'axios';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { getErrorDetail } from '../utils/error';

const shouldRetry = (failureCount: number, error: unknown) => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  return failureCount < 1 && (!status || status >= 500);
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => console.error(getErrorDetail(error)),
  }),
  mutationCache: new MutationCache({
    onError: (error) => console.error(getErrorDetail(error)),
  }),
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
