import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import MockImage from '@/assets/SidebarBadge.png'
import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'

function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className='min-h-screen bg-primary/10'>
      <header className='border-b bg-primary/90 text-white px-4 py-3 shadow-md'>
        <div className='flex items-center gap-2'>
          <img src={MockImage} alt='Shopee Logo' width={32} height={32} className='h-8 w-8 object-contain' />
          <span className='text-lg'>{t('header.registerBrand')}</span>
        </div>
      </header>

      <section className='py-32 '>
        <div className='container mx-auto'>
          <div className='grid items-center gap-8 lg:grid-cols-2'>
            <div className='flex flex-col items-center text-center lg:items-start lg:text-left'>
              <h1 className='my-6 text-pretty text-4xl font-bold lg:text-6xl'>
                Điểm đến kinh doanh cho mọi doanh nghiệp
              </h1>
              <p className='mb-8 max-w-xl text-muted-foreground lg:text-xl'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro
                facilis quo animi consequatur. Explicabo.
              </p>
              <div className='flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start'>
                <Button
                  type='button'
                  className='w-full sm:w-auto'
                  onClick={() => {
                    navigate(routesConfig[Routes.AUTH_LOGIN].path)
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full sm:w-auto'
                  onClick={() => {
                    navigate(routesConfig[Routes.AUTH_SIGN_UP].path)
                  }}
                >
                  Đăng ký
                  <ArrowUpRight className='ml-2 size-4' />
                </Button>
              </div>
            </div>
            <img
              src='https://www.shadcnblocks.com/images/block/placeholder-1.svg'
              alt='placeholder hero'
              className='max-h-96 w-full rounded-md object-cover'
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
