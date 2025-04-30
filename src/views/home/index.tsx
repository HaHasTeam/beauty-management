import { ArrowUpRight, Shield, Sparkles, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import BeautyProducs from '@/assets/images/beauty-products.jpg'
import fallBackImage from '@/assets/images/fallBackImage.jpg'
import MockImage from '@/assets/SidebarBadge.png'
import ImageWithFallback from '@/components/image/ImageWithFallback'
import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'

function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className='min-h-screen bg-gradient-to-b from-primary/5 to-primary/10'>
      <header className='border-b bg-primary/90 text-white px-4 py-3 shadow-md sticky top-0 z-10'>
        <div className='container mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <ImageWithFallback
              fallback={fallBackImage}
              src={MockImage || '/placeholder.svg'}
              alt={t('header.logo')}
              width={32}
              height={32}
              className='h-8 w-8 object-contain rounded-full shadow-sm transition-transform hover:scale-110'
            />
            <span className='text-lg font-semibold'>{t('header.allureBeauty')}</span>
          </div>
        </div>
      </header>

      <section className='py-16 md:py-24 lg:py-32'>
        <div className='container mx-auto px-4'>
          <div className='grid items-center gap-8 lg:grid-cols-2'>
            <div className='flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1'>
              <div className='inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4'>
                {t('home.badge')}
              </div>
              <h1 className='my-6 text-pretty text-4xl font-bold lg:text-6xl  text-primary'>{t('home.title')}</h1>
              <p className='mb-8 max-w-xl text-muted-foreground lg:text-xl'>{t('home.description')}</p>
              <div className='flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start'>
                <Button
                  type='button'
                  className='w-full sm:w-auto text-base font-medium px-6 py-6 transition-all hover:shadow-lg hover:translate-y-[-2px]'
                  onClick={() => {
                    navigate(routesConfig[Routes.AUTH_LOGIN].path)
                  }}
                >
                  {t('home.login')}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full sm:w-auto text-base font-medium px-6 py-6 transition-all hover:shadow-lg hover:translate-y-[-2px]'
                  onClick={() => {
                    navigate(routesConfig[Routes.AUTH_SIGN_UP].path)
                  }}
                >
                  {t('home.register')}
                  <ArrowUpRight className='ml-2 size-4' />
                </Button>
              </div>
            </div>
            <div className='relative order-1 lg:order-2'>
              <div className='absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-primary-foreground opacity-30 blur-xl'></div>
              <ImageWithFallback
                fallback={fallBackImage}
                src={BeautyProducs}
                alt={t('home.heroImageAlt')}
                className='w-full rounded-xl shadow-2xl object-cover aspect-video relative z-10 transition-all hover:scale-[1.02] duration-300'
              />
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>{t('home.featuresTitle')}</h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>{t('home.featuresSubtitle')}</p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-primary/5 p-6 rounded-xl hover:shadow-lg transition-all'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4'>
                <Shield className='text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>{t('home.feature1Title')}</h3>
              <p className='text-muted-foreground'>{t('home.feature1Description')}</p>
            </div>
            <div className='bg-primary/5 p-6 rounded-xl hover:shadow-lg transition-all'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4'>
                <UserCheck className='text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>{t('home.feature2Title')}</h3>
              <p className='text-muted-foreground'>{t('home.feature2Description')}</p>
            </div>
            <div className='bg-primary/5 p-6 rounded-xl hover:shadow-lg transition-all'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4'>
                <Sparkles className='text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>{t('home.feature3Title')}</h3>
              <p className='text-muted-foreground'>{t('home.feature3Description')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 bg-primary/5'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-6'>{t('home.problemTitle')}</h2>
            <p className='text-lg mb-8'>{t('home.problemDescription')}</p>
            <div className='p-6 bg-white rounded-xl shadow-md'>
              <h3 className='text-xl font-semibold mb-4'>{t('home.solutionTitle')}</h3>
              <p className='text-muted-foreground'>{t('home.solutionDescription')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
