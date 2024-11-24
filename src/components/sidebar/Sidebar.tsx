import { PropsWithChildren, useContext } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { HiX } from 'react-icons/hi'
import { HiBolt, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { renderThumb, renderTrack, renderView } from '@/components/scrollbar/Scrollbar'
import Links from '@/components/sidebar/components/Links'
import SidebarCard from '@/components/sidebar/components/SidebarCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Routes, routesConfig } from '@/configs/routes'
import { OpenContext } from '@/contexts/layout'
import { useStore } from '@/stores/store'
import { IRoute } from '@/types/types'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[]
  [x: string]: unknown
}

function Sidebar(props: SidebarProps) {
  const { routes } = props
  const { open, setOpen } = useContext(OpenContext)
  const router = useNavigate()
  const { userProfile } = useStore(
    useShallow((state) => {
      return {
        userProfile: state.user
      }
    })
  )
  const handleLogout = () => {
    router(routesConfig[Routes.AUTH_LOGIN].getPath())
  }
  // SIDEBAR
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
                className='absolute top-4 block cursor-pointer text-zinc-200 dark:text-white/40 xl:hidden'
                onClick={() => setOpen(false)}
              >
                <HiX />
              </span>
              <div className={`mt-8 flex items-center justify-center gap-1`}>
                <div className='me-2 flex h-[40px] w-[40px] items-center justify-center rounded-md bg-primary text-white dark:bg-accent dark:text-zinc-950'>
                  <HiBolt className='h-5 w-5' />
                </div>
                <h5 className='text-xl font-bold leading-5 text-primary dark:text-white'>Allure Portal</h5>
                <Badge
                  variant='outline'
                  color='primary'
                  className='my-auto w-max px-1 py-0.5 text-zinc-950 dark:border-none dark:bg-zinc-800 dark:text-white text-xs'
                >
                  {userProfile.role}
                </Badge>
              </div>
              <div className='mb-8 mt-8 h-px bg-zinc-200 dark:bg-white/10' />
              {/* Nav item */}
              <ul>
                <Links routes={routes} />
              </ul>
            </div>
            {/* Free Horizon Card    */}
            <div className='mb-9 mt-7'>
              <div className='flex justify-center'>
                <SidebarCard />
              </div>

              {/* Sidebar profile info */}
              <div className='mt-5 flex w-full items-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 bg-accent/20'>
                <a href='/dashboard/profile-settings'>
                  <Avatar className='min-h-10 min-w-10'>
                    <AvatarImage src={''} />
                    <AvatarFallback className='font-bold'>A</AvatarFallback>
                  </Avatar>
                </a>
                <a href='/dashboard/profile-settings'>
                  <p className='ml-2 mr-3 flex items-center text-sm font-semibold leading-none text-zinc-950 dark:text-white'>
                    {'Allure'}
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

// PROPS

export default Sidebar
