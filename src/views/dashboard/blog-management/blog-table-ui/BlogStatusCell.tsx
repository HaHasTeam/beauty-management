'use client'

import { CheckCircle2, CircleMinus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { BlogEnum } from '@/types/enum'

interface BlogStatusCellProps {
  status: BlogEnum | string | undefined | null
}

export const BlogStatusCell = ({ status }: BlogStatusCellProps) => {
  if (!status) {
    return <span className='text-xs text-muted-foreground italic'>-</span>
  }

  switch (status) {
    case BlogEnum.PUBLISHED:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Published</span>
        </Badge>
      )

    case BlogEnum.UN_PUBLISHED:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <CircleMinus className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Unpublished</span>
        </Badge>
      )

    default:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <span className='whitespace-nowrap'>Unknown</span>
        </Badge>
      )
  }
}
