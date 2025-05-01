'use client'

import { Home, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { ForbiddenIllustration } from '@/components/forbidden-illustration'
import { Button } from '@/components/ui/button'

const Forbidden403Public = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const state = location.state as { from?: { pathname: string }; statusCode?: number } | null
  const fromPath = state?.from?.pathname || 'unknown page'
  const statusCode = state?.statusCode || 403

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 px-4 py-12 md:py-20'>
      <div className='mx-auto max-w-4xl'>
        <div className='relative mb-8 flex flex-col items-center md:mb-12 md:flex-row md:items-start md:justify-between'>
          <div className='order-2 mt-8 text-center md:order-1 md:mt-0 md:max-w-md md:text-left'>
            <span className='inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800'>
              {t('forbidden.public.error')} {statusCode}
            </span>

            <h1 className='mt-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl'>
              {t('forbidden.public.accessDenied')}
            </h1>

            <div className='mt-4 h-1 w-16 rounded bg-amber-400 md:mt-6'></div>

            <p className='mt-6 text-lg text-gray-600'>{t('forbidden.public.noPermission')}</p>
            <p className='mt-2 text-gray-600'>{t('forbidden.public.contactSupport')}</p>

            {fromPath !== 'unknown page' && (
              <div className='mt-6 rounded-lg bg-white p-3 text-sm text-gray-500 shadow-sm'>
                <p className='font-medium'>{t('forbidden.public.attemptedAccess')}</p>
                <code className='block overflow-x-auto whitespace-nowrap p-1 font-mono text-xs'>{fromPath}</code>
              </div>
            )}
          </div>

          <div className='order-1 md:order-2'>
            <div className='relative'>
              <div className='absolute -inset-4 rounded-full bg-amber-200 opacity-50 blur-xl'></div>
              <ForbiddenIllustration className='relative h-48 w-48 md:h-64 md:w-64' />
            </div>
          </div>
        </div>

        <div className='mt-8 flex flex-col gap-4 md:flex-row md:gap-6'>
          <Button asChild size='lg' className='bg-amber-500 text-white hover:bg-amber-600'>
            <Link to='/' className='flex items-center justify-center gap-2'>
              <Home size={18} />
              {t('forbidden.public.goToHome')}
            </Link>
          </Button>

          <Button variant='ghost' size='lg' className='hover:bg-amber-50' onClick={() => window.history.back()}>
            <RefreshCw size={18} className='mr-2' />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Forbidden403Public
