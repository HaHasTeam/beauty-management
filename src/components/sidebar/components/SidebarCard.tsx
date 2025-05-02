'use client'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import SidebarImage from '@/assets/SidebarBadge.png'
import ImageWithFallback from '@/components/image/ImageWithFallback'
import { Button } from '@/components/ui/button'

export default function SidebarDocs() {
  return (
    <div className='relative flex flex-col items-center rounded-lg border border-zinc-200 px-3 py-4 dark:border-white/10'>
      <ImageWithFallback
        fallback={fallBackImage}
        width='54'
        height='30'
        className='w-[54px]'
        src={SidebarImage || '/placeholder.svg'}
        alt=''
      />
      <div className='mb-3 flex w-full flex-col pt-4'>
        <p className='mb-2.5 text-center text-lg font-bold text-zinc-950 dark:text-white'>Start your journey</p>
        <p className='text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 focus:dark:!bg-white/20 active:dark:!bg-white/20'>
          Explore Allure Portal and see what you can do with it. Get started with the free version.
        </p>
      </div>{' '}
      <a target='_blank' href='#' rel='noreferrer'>
        <Button className='mt-auto flex h-full w-[200px] items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium'>
          Learn More
        </Button>
      </a>
    </div>
  )
}
