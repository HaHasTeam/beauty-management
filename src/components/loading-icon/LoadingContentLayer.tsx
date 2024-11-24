import { HtmlHTMLAttributes, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import LoadingIcon from '.'

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  label?: string
}

const LoadingContentLayer = ({ label, className }: Props) => {
  const loadingRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      })
    }
  }, [])
  return (
    <div className={cn('size-full flex justify-center items-center bg-primary/30 absolute', className)}>
      <div ref={loadingRef}>
        <LoadingIcon label={label} color='black' />
      </div>
    </div>
  )
}

export default LoadingContentLayer
