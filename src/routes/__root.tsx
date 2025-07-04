import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import ClerkProvider from '../integrations/clerk/provider.tsx'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'

import { Provider } from 'jotai'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <ClerkProvider>
        <Provider>
        <Header />

        <Outlet />
        <TanStackRouterDevtools />

        <TanStackQueryLayout />
        </Provider>
      </ClerkProvider>
    </>
  ),
})
