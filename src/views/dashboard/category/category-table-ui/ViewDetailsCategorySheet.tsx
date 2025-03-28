import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatDate } from '@/lib/utils'
import { CategoryStatusEnum, ICategory, ICategoryDetail } from '@/types/category'

import { getStatusIcon } from './helper'

interface ViewDetailsCategorySheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  category?: ICategory
}

export function ViewDetailsCategorySheet({ category, ...props }: ViewDetailsCategorySheetProps) {
  if (!category) return null

  const statusIcon = getStatusIcon(category.status || CategoryStatusEnum.ACTIVE)

  // Function to render category details
  const renderCategoryDetails = (details: ICategoryDetail) => {
    return (
      <div className='grid grid-cols-2 gap-3'>
        {Object.entries(details).map(([key, field]) => (
          <div key={key} className='bg-muted p-3 rounded-md'>
            <p className='text-sm font-medium'>{field.label}</p>
            <p className='text-xs text-muted-foreground'>
              Type: {field.type}
              {field.required && ' (Required)'}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-2xl'>Category Details</SheetTitle>
        </SheetHeader>

        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>General Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Name</p>
                <p className='font-medium'>{category.name}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Level</p>
                <p className='font-medium'>{category.level}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Status</p>
                <Badge className={`${statusIcon.bgColor} ${statusIcon.textColor}`}>{category.status}</Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Created At</p>
                <p className='font-medium'>{formatDate(category.createdAt)}</p>
              </div>
            </div>
          </div>

          {category.detail && Object.keys(category.detail).length > 0 && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Field Details</h3>
              {renderCategoryDetails(category.detail)}
            </div>
          )}

          {category.parentCategory && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Parent Category</h3>
              <div className='bg-muted p-3 rounded-md'>
                <p className='font-medium'>{category.parentCategory.name}</p>
                <p className='text-xs text-muted-foreground'>Level: {category.parentCategory.level}</p>
              </div>
            </div>
          )}

          {category.subCategories && category.subCategories.length > 0 && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Sub Categories</h3>
              <div className='space-y-2'>
                {category.subCategories.map((subCategory) => (
                  <div key={subCategory.id} className='bg-muted p-3 rounded-md'>
                    <p className='font-medium'>{subCategory.name}</p>
                    <p className='text-xs text-muted-foreground'>Level: {subCategory.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
