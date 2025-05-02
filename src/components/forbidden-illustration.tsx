import type { FC } from 'react'

interface ForbiddenIllustrationProps {
  className?: string
}

export const ForbiddenIllustration: FC<ForbiddenIllustrationProps> = ({ className = 'w-64 h-64' }) => {
  return (
    <svg className={className} viewBox='0 0 500 500' fill='none' xmlns='http://www.w3.org/2000/svg'>
      {/* Background circle */}
      <circle cx='250' cy='250' r='200' fill='#FEF3C7' />

      {/* Inner circle */}
      <circle cx='250' cy='250' r='150' fill='#FDE68A' fillOpacity='0.7' />

      {/* Warning sign with rounded corners */}
      <path
        d='M250 150C236 150 224 158 218 170L143 300C137 312 137 326 143 338C149 350 161 358 175 358H325C339 358 351 350 357 338C363 326 363 312 357 300L282 170C276 158 264 150 250 150Z'
        fill='#FBBF24'
        stroke='#F59E0B'
        strokeWidth='8'
        strokeLinejoin='round'
      />

      {/* Exclamation mark */}
      <path d='M250 200V250' stroke='#F59E0B' strokeWidth='16' strokeLinecap='round' />
      <circle cx='250' cy='280' r='10' fill='#F59E0B' />

      {/* Decorative elements */}
      <path d='M150 350H350' stroke='#F59E0B' strokeWidth='8' strokeLinecap='round' />
      <path d='M175 375H325' stroke='#F59E0B' strokeWidth='6' strokeLinecap='round' />
      <path d='M200 400H300' stroke='#F59E0B' strokeWidth='4' strokeLinecap='round' />

      {/* Add a friendly face to the warning sign */}
      <circle cx='210' cy='230' r='8' fill='#F59E0B' />
      <circle cx='290' cy='230' r='8' fill='#F59E0B' />
      <path d='M220 320C220 320 250 300 280 320' stroke='#F59E0B' strokeWidth='6' strokeLinecap='round' />
    </svg>
  )
}
