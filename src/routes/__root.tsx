import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import ClerkProvider from '../integrations/clerk/provider.tsx'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { ReactFlowProvider } from '@xyflow/react'

import { Provider } from 'jotai'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <ClerkProvider>
        <ReactFlowProvider>
            <Provider>
                <Header />
                <Outlet />
                <TanStackRouterDevtools />
            </Provider>
        </ReactFlowProvider>
      </ClerkProvider>
    </>
  ),
})
