'use client'

export default function Footer() {
  return (
    <div className='z-[3] flex flex-col items-center justify-between mt-auto pb-[30px] md:px-0 lg:flex-row'>
      <ul className='flex flex-row'>
        <li className='mr-4 md:mr-[44px]'>
          <a className='text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm' target='_blank'>
            Terms & Conditions
          </a>
        </li>
        <li className='mr-4 md:mr-[44px]'>
          <a className='text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm' target='_blank'>
            Privacy Policy
          </a>
        </li>
        <li className='mr-4 md:mr-[44px]'>
          <a className='text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm' target='_blank'>
            License
          </a>
        </li>
        <li>
          <a className='text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm' target='_blank'>
            Refund Policy
          </a>
        </li>
      </ul>
    </div>
  )
}
