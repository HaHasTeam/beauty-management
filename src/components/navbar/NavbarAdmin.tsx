import { useLocation, useParams } from 'react-router-dom'

import NavLink from '@/components/link/NavLink'
import { minifyString } from '@/utils/string'

import AdminNavbarLinks from './NavbarLinksAdmin'

export default function AdminNavbar(props: { brandText: string }) {
  const { brandText } = props

  const location = useLocation()
  const params = useParams()
  const isAddPath = location.pathname.split('/').includes('add')
  const isEditPath = !!params.id

  return (
    <nav
      className={`z-[50] fixed right-3 top-3 flex w-[calc(100vw_-_6%)] flex-row items-center justify-between rounded-lg bg-primary/20 dark:bg-primary/20 py-2 backdrop-blur-xl transition-all md:right-[30px] md:top-4 md:w-[calc(100vw_-_2%)] md:p-2 lg:w-[calc(100vw_-_6%)] xl:top-[20px] xl:w-[calc(100vw_-_364px)] 2xl:w-[calc(100vw_-_366px)]`}
    >
      <div className='ml-[6px]'>
        <div className='h-6 md:mb-2 md:w-[224px] md:pt-1'>
          <a
            className='hidden text-xs font-normal text-zinc-950 hover:underline dark:text-white dark:hover:text-white md:inline'
            href=''
          >
            Pages
            <span className='mx-1 text-xs text-zinc-950 hover:text-zinc-950 dark:text-white'> / </span>
          </a>
          <NavLink
            className='text-xs font-normal capitalize text-zinc-950 hover:underline dark:text-white dark:hover:text-white'
            to='#'
          >
            {brandText}
          </NavLink>
        </div>
        <p className='text-md shrink capitalize text-zinc-950 dark:text-white md:text-3xl'>
          <NavLink to='#' className='font-bold capitalize hover:text-zinc-950 dark:hover:text-white'>
            {isAddPath ? (
              `Add ${brandText}`
            ) : isEditPath ? (
              <span>
                {`Edit ${brandText}`}{' '}
                <span className='text-primary max-lg:text-sm truncate w-[100px]'>#{minifyString(params?.id)}</span>
              </span>
            ) : (
              brandText
            )}
          </NavLink>
        </p>
      </div>
      <div className='w-[154px] min-w-max md:ml-auto md:w-[unset]'>
        <AdminNavbarLinks />
      </div>
    </nav>
  )
}
