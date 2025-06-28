'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Создаем QueryClient с настройками для крипто-сайта
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 30, // 30 минут
      refetchOnWindowFocus: false,
              retry: (failureCount, error: unknown) => {
        // Не повторяем запросы если статус 404 или 401
        if (error && typeof error === 'object' && 'response' in error) {
          const responseError = error as { response?: { status?: number } };
          if (responseError.response?.status === 404 || responseError.response?.status === 401) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 