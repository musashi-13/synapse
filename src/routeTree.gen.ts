/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as ChatRouteImport } from './routes/chat'
import { Route as IndexRouteImport } from './routes/index'
import { Route as TestChatRouteImport } from './routes/test.chat'
import { Route as ChatConvidRouteImport } from './routes/chat_.$convid'

const ChatRoute = ChatRouteImport.update({
  id: '/chat',
  path: '/chat',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const TestChatRoute = TestChatRouteImport.update({
  id: '/test/chat',
  path: '/test/chat',
  getParentRoute: () => rootRouteImport,
} as any)
const ChatConvidRoute = ChatConvidRouteImport.update({
  id: '/chat_/$convid',
  path: '/chat/$convid',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/chat': typeof ChatRoute
  '/chat/$convid': typeof ChatConvidRoute
  '/test/chat': typeof TestChatRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/chat': typeof ChatRoute
  '/chat/$convid': typeof ChatConvidRoute
  '/test/chat': typeof TestChatRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/chat': typeof ChatRoute
  '/chat_/$convid': typeof ChatConvidRoute
  '/test/chat': typeof TestChatRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/chat' | '/chat/$convid' | '/test/chat'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/chat' | '/chat/$convid' | '/test/chat'
  id: '__root__' | '/' | '/chat' | '/chat_/$convid' | '/test/chat'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ChatRoute: typeof ChatRoute
  ChatConvidRoute: typeof ChatConvidRoute
  TestChatRoute: typeof TestChatRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/chat': {
      id: '/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/test/chat': {
      id: '/test/chat'
      path: '/test/chat'
      fullPath: '/test/chat'
      preLoaderRoute: typeof TestChatRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/chat_/$convid': {
      id: '/chat_/$convid'
      path: '/chat/$convid'
      fullPath: '/chat/$convid'
      preLoaderRoute: typeof ChatConvidRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ChatRoute: ChatRoute,
  ChatConvidRoute: ChatConvidRoute,
  TestChatRoute: TestChatRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
