import { blogSlugEnum, externalLinks, Routes } from '@/configs/routes'

export default function Footer() {
  return (
    <div className='flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 xl:flex-row'>
      <p className='mb-4 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 sm:!mb-0 md:text-lg'>
        <span className='mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:!mb-0 md:text-sm'>
          ©{new Date().getFullYear()} Allure team. All Rights Reserved.
        </span>
      </p>
      <div>
        <ul className='flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10'>
          <li>
            <a
              target='blank'
              href={externalLinks + '/' + Routes.BLOG}
              className='text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400'
            >
              Blogs
            </a>
          </li>
          <li>
            <a
              target='blank'
              href={externalLinks + '/' + Routes.BLOG + '/' + blogSlugEnum.platformPrivacy}
              className='text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400'
            >
              Allure Policy
            </a>
          </li>
          <li>
            <a
              target='blank'
              href={externalLinks + '/' + Routes.BLOG + '/' + blogSlugEnum.privacyPolicy}
              className='text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400'
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              target='blank'
              href={externalLinks + '/' + Routes.BLOG + '/' + blogSlugEnum.termsAndConditions}
              className='text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400'
            >
              Terms & Conditions
            </a>
          </li>
          <li>
            <a
              target='blank'
              href={externalLinks + '/' + Routes.BLOG + '/' + blogSlugEnum.returnCondition}
              className='text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400'
            >
              Return & Refund Policy
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
