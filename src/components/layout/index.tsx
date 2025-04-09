import * as React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Footer from '@/components/footer/FooterAdmin'
import Navbar from '@/components/navbar/NavbarAdmin'
import { routes } from '@/components/sidebar/routes'
import Sidebar from '@/components/sidebar/Sidebar'
import { OpenContext, UserContext, UserDetailsContext } from '@/contexts/layout'
import { TUser } from '@/types/user'
import { getActiveRoute } from '@/utils/navigation'

interface Props {
  children?: React.ReactNode
  user?: TUser
  userDetails?: TUser
}

const DashboardLayout: React.FC<Props> = (props: Props) => {
  const pathname = useLocation().pathname
  const [open, setOpen] = React.useState(false)
  return (
    <UserContext.Provider value={props.user}>
      <UserDetailsContext.Provider value={props.userDetails}>
        <OpenContext.Provider value={{ open, setOpen }}>
          <div className='flex h-full w-full'>
            <Sidebar routes={routes} setOpen={setOpen} open={open} />
            <div className='h-full w-full dark:bg-primary/10'>
              <main className={`mx-2.5 flex-none transition-all  md:pr-2 xl:ml-[328px]`}>
                <div className='mx-auto min-h-screen p-2 !pt-[90px] md:p-2 md:!pt-[118px]'>
                  {props.children || <Outlet />}
                </div>
                <Navbar brandText={getActiveRoute(routes, pathname)} />
                <div className='p-3'>
                  <Footer />
                </div>
              </main>
            </div>
          </div>
        </OpenContext.Provider>
      </UserDetailsContext.Provider>
    </UserContext.Provider>
  )
}

export default DashboardLayout
