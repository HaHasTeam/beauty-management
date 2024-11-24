import { useRoutes } from 'react-router-dom'

import { privateRoutes } from './privateRoutes'
import { publicRoutes } from './publicRoutes'

export default function RouterProvider() {
  return useRoutes([
    {
      path: '/',
      children: [...publicRoutes, ...privateRoutes]
    }
  ])
}
