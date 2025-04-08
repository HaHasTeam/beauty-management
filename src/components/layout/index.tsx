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
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <UserContext.Provider value={props.user}>
      <UserDetailsContext.Provider value={props.userDetails}>
        <OpenContext.Provider value={{ open, setOpen }}>
          <div className='flex h-full w-full'>
            <Sidebar routes={routes} setOpen={setOpen} open={open} />
            <div className='h-full w-full dark:bg-primary/10'>
              <div
                className={`fixed right-3 top-0 z-40 h-3 w-[calc(100vw_-_6%)] backdrop-blur-xl transition-opacity duration-200 md:right-[30px] md:top-0 md:h-4 md:w-[calc(100vw_-_2%)] lg:w-[calc(100vw_-_6%)] xl:h-[20px] xl:w-[calc(100vw_-_364px)] 2xl:w-[calc(100vw_-_366px)] ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
              />
              <main className={`mx-2.5 flex-none transition-all md:pr-2 xl:ml-[328px]`}>
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
