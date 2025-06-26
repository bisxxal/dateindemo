'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'


type Props = { children: React.ReactNode }

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      // staleTime: 60 * 5000
      // staleTime: 10
    }
  }
})

const ReactQueryProvider = ({ children }: Props) => {
  return (<QueryClientProvider client={client}>
    <SessionProvider>{children}</SessionProvider>
  </QueryClientProvider>)
}

export default ReactQueryProvider