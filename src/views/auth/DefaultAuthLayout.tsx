import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

import AuthBG from '@/assets/auth-bg.jpg'

interface DefaultAuthLayoutProps extends PropsWithChildren {
  children: JSX.Element
}

export default function DefaultAuthLayout(props: DefaultAuthLayoutProps) {
  const { children } = props
  const { t } = useTranslation()

  return (
    <div className='relative min-h-screen p-4'>
      {/* Background Image and Overlay */}
      <div className='absolute inset-0 z-10'>
        <img src={AuthBG} className='w-full h-full object-cover' alt='background' />
        <div className='absolute inset-0 bg-black/30'></div> {/* Overlay */}
      </div>

      {/* Back Link */}
      <Link to='/' className='absolute top-4 left-4 w-fit text-white hover:text-gray-200 z-10'>
        <div className='flex w-fit items-center'>
          <FaChevronLeft className='mr-2 h-[13px] w-[8px]' />
          <p className='ml-0 text-sm'>{t('authLayout.backToWebsite')}</p>
        </div>
      </Link>

      {/* Centered Content Box */}
      <div className='border-2 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card/95 backdrop-blur-xl text-card-foreground rounded-lg shadow-2xl p-8'>
        {children}
      </div>
    </div>
  )
}
