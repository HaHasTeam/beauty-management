/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { type PropsWithChildren, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import NavLink from '@/components/link/NavLink'
import type { IRoute } from '@/types/types'

interface SidebarLinksProps extends PropsWithChildren {
  routes: IRoute[]
  [x: string]: any
}

export function SidebarLinks(props: SidebarLinksProps) {
  const pathname = useLocation().pathname
  const { routes } = props

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName)
    },
    [pathname]
  )

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      if (route.disabled) {
        return (
          <div
            key={key}
            className={`flex w-full max-w-full cursor-not-allowed items-center justify-between rounded-lg py-3 pl-8 font-medium`}
          >
            <div className='w-full items-center justify-center'>
              <div className='flex w-full items-center justify-center'>
                <div className={`text mr-3 mt-1.5 text-zinc-950 opacity-30 dark:text-white`}>{route.icon}</div>
                <p className={`mr-auto text-sm text-zinc-950 opacity-30 dark:text-white`}>{route.name}</p>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div key={key}>
            <div
              className={`flex w-full max-w-full items-center justify-between rounded-lg py-3 pl-8 ${
                activeRoute(route.path.toLowerCase())
                  ? 'bg-primary font-semibold text-white dark:bg-primary dark:text-white'
                  : 'font-medium text-zinc-950 dark:text-zinc-400'
              }`}
            >
              <NavLink to={route.layout ? route.layout + route.path : route.path} key={key} styles={{ width: '100%' }}>
                <div className='w-full items-center justify-center'>
                  <div className='flex w-full items-center justify-center'>
                    <div
                      className={`text mr-3 mt-1.5 ${
                        activeRoute(route.path.toLowerCase())
                          ? 'font-semibold text-white dark:text-white'
                          : 'text-zinc-950 dark:text-white'
                      } `}
                    >
                      {route.icon}
                    </div>
                    <p
                      className={`mr-auto text-sm ${
                        activeRoute(route.path.toLowerCase())
                          ? 'font-semibold text-white dark:text-white'
                          : 'font-medium text-zinc-950 dark:text-zinc-400'
                      }`}
                    >
                      {route.name}
                    </p>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>
        )
      }
    })
  }

  return <>{createLinks(routes)}</>
}

export default SidebarLinks
