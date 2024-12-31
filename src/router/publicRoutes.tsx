import { RouteObject } from 'react-router-dom'

import Auth from '@/views/auth'
import CallVideo from '@/views/call-video'
import EnterCall from '@/views/enterCall'
import Home from '@/views/home'
import { ForwardLink } from '@/views/others'
import RegisterBrand from '@/views/register-brand'

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/register',
    element: <RegisterBrand />
  },
  {
    path: '/room/:roomId',
    element: <CallVideo />
  },
  {
    path: '/enter',
    element: <EnterCall />
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
