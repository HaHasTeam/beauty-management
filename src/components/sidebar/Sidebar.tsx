import { type PropsWithChildren, useContext } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { HiX } from 'react-icons/hi'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import logo from '@/assets/images/logo.png'
import { renderThumb, renderTrack, renderView } from '@/components/scrollbar/Scrollbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Routes, routesConfig } from '@/configs/routes'
import { OpenContext } from '@/contexts/layout'
import { useToast } from '@/hooks/useToast'
import { useStore } from '@/stores/store'
import { UserRoleEnum } from '@/types/role'
import type { IRoute } from '@/types/types'

import RoleTag from '../account/RoleTag'
import ImageWithFallback from '../image/ImageWithFallback'
import { SidebarLinks } from './components/Links'
import SidebarDocs from './components/SidebarCard'

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[]
  [x: string]: unknown
}

function Sidebar(props: SidebarProps) {
  const { routes } = props
  const { open, setOpen } = useContext(OpenContext)
  const router = useNavigate()
  const { successToast } = useToast()
  const { userProfile, resetAuth } = useStore(
    useShallow((state) => {
      return {
        userProfile: state.user,
        resetAuth: state.resetAuth
      }
    })
  )

  // Get the user's role
  const userRole = userProfile?.role as UserRoleEnum

  // Filter routes based on user role
  const filteredRoutes = routes.filter((route) => {
    // If no roles are specified, show to everyone
    if (!route.roles) return true

    // Otherwise, check if the user's role is in the allowed roles
    return route.roles.includes(userRole)
  })

  const handleLogout = () => {
    resetAuth()
    successToast({
      message: 'You have been successfully logged out',
      description: 'Thank you for using our service. See you again soon!'
    })
    router(routesConfig[Routes.AUTH_LOGIN].getPath())
  }

  return (
    <div
      className={`lg:!z-99 fixed !z-[99] min-h-full w-[300px] transition-all md:!z-[99] xl:!z-0 ${
        props.variant === 'auth' ? 'xl:hidden' : 'xl:block'
      } ${open ? '' : '-translate-x-[120%] xl:translate-x-[unset]'}`}
    >
      <Card
        className={`m-3 ml-3 h-[96.5vh] w-full overflow-hidden !rounded-lg border-zinc-200 pe-4 dark:border-zinc-800 sm:my-4 sm:mr-4 md:m-5 md:mr-[-50px]`}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <div className='flex h-full flex-col justify-between'>
            <div>
              <span
                className='absolute top-4 block cursor-pointer text-zinc-500 dark:text-white/40 xl:hidden'
                onClick={() => setOpen(false)}
              >
                <HiX />
              </span>
              <div className={`mt-8 flex items-center justify-center gap-1`}>
                <div className='me-2 flex h-[40px] w-[40px] items-center justify-center rounded-md bg-primary text-white dark:bg-accent dark:text-zinc-950'>
                  <ImageWithFallback
                    src={logo || '/placeholder.svg'}
                    alt={'logo'}
                    fallback={fallBackImage}
                    className=''
                  />
                </div>
                <h5 className='text-xl font-bold leading-5 text-primary dark:text-white'>Allure Portal</h5>
              </div>
              <div className='w-full flex justify-center mt-2'>
                <div className='w-fit'>
                  <RoleTag role={(userProfile?.role as UserRoleEnum | 'BRAND' | 'MODERATOR') || UserRoleEnum.MANAGER} />
                </div>
              </div>
              <div className='mb-8 mt-8 h-px bg-zinc-200 dark:bg-white/10' />
              {/* Nav item */}
              <ul>
                {/* Pass the filtered routes instead of all routes */}
                <SidebarLinks routes={filteredRoutes} />
              </ul>
            </div>
            {/* Free Horizon Card    */}
            <div className='mb-9 mt-7'>
              <div className='flex justify-center'>
                <SidebarDocs />
              </div>

              {/* Sidebar profile info */}
              <div className='mt-5 flex w-full items-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 bg-accent/20'>
                <a href='/dashboard/profile-settings'>
                  <Avatar className='min-h-10 min-w-10'>
                    <AvatarImage src={userProfile?.avatar ?? ''} />
                    <AvatarFallback className='font-bold'>
                      {userProfile?.username?.charAt(0).toUpperCase() ?? 'A'}
                    </AvatarFallback>
                  </Avatar>
                </a>
                <a href='/dashboard/profile-settings'>
                  <p className='ml-2 mr-3 flex items-center text-sm font-semibold leading-none text-zinc-950 dark:text-white'>
                    {userProfile?.username || 'Allure'}
                  </p>
                </a>
                <Button
                  onClick={handleLogout}
                  variant='outline'
                  className='ml-auto flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full p-0 text-center text-sm font-medium hover:dark:text-white'
                  type='submit'
                >
                  <HiOutlineArrowRightOnRectangle
                    className='h-4 w-4 stroke-2 text-zinc-950 dark:text-white'
                    width='16px'
                    height='16px'
                    color='inherit'
                  />
                </Button>
              </div>
            </div>
          </div>
        </Scrollbars>
      </Card>
    </div>
  )
}

export default Sidebar
