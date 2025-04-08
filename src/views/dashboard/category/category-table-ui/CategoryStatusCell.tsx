import { CheckCircle2, CircleMinus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { CategoryStatusEnum, ICategory } from '@/types/category'

interface CategoryStatusCellProps {
  category: ICategory
}

export function CategoryStatusCell({ category }: CategoryStatusCellProps) {
  const { status } = category

  switch (status) {
    case CategoryStatusEnum.ACTIVE:
      return (
        <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700 gap-1'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Active</span>
        </Badge>
      )

    case CategoryStatusEnum.INACTIVE:
      return (
        <Badge variant='outline' className='border-gray-200 bg-gray-50 text-gray-700 gap-1'>
          <CircleMinus className='h-3.5 w-3.5' />
          <span className='whitespace-nowrap'>Inactive</span>
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
