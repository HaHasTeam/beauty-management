import { FolderTree, Tag } from 'lucide-react'

import { ICategory } from '@/types/category'
import { IResponseProduct } from '@/types/product'

interface ProductCategoryCellProps {
  product: IResponseProduct
}

export function ProductCategoryCell({ product }: ProductCategoryCellProps) {
  const category = product.category as ICategory
  const parentCategory = category?.parentCategory as ICategory

  // If no category, show a placeholder
  if (!category) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-1.5'>
        <Tag className='h-4 w-4 mr-1.5 text-muted-foreground' />
        <span className='italic'>No category</span>
      </div>
    )
  }

  const hasParent = !!parentCategory

  return (
    <div className='w-full bg-card rounded-md'>
      <div className='p-1.5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500/10 text-blue-600 rounded-md'>
              <FolderTree className='h-4 w-4' />
            </div>
            <div className='flex flex-col'>
              <div className='text-xs font-medium text-foreground truncate max-w-[180px]'>{category.name}</div>
              {hasParent && (
                <div className='text-[10px] text-muted-foreground truncate max-w-[180px]'>
                  Parent: {parentCategory.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
