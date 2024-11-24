import { RouteObject } from 'react-router-dom'

import Auth from '@/views/auth'
import Home from '@/views/home'
import { ForwardLink } from '@/views/others'

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/verify-email',
    element: <ForwardLink forwardEndpoint='/auth/email-verification' />
  },
  {
    path: '/auth/*',
    element: <Auth />
  }
]
