import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatDate } from '@/lib/utils'
import { PreOrderStatusEnum, TPreOrder } from '@/types/pre-order'

import { getStatusIcon } from './helper'

interface ViewPreOrderDetailsSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  preOrder?: TPreOrder
}

export function ViewPreOrderDetailsSheet({ preOrder, ...props }: ViewPreOrderDetailsSheetProps) {
  if (!preOrder) return null

  const statusIcon = getStatusIcon(preOrder.status || PreOrderStatusEnum.WAITING)

  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-2xl'>Pre-Order Details</SheetTitle>
        </SheetHeader>

        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>General Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Product</p>
                <p className='font-medium'>{preOrder.product.name}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Status</p>
                <Badge className={`${statusIcon.bgColor} ${statusIcon.textColor}`}>{preOrder.status}</Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Start Time</p>
                <p className='font-medium'>{formatDate(preOrder.startTime)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>End Time</p>
                <p className='font-medium'>{formatDate(preOrder.endTime)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Created At</p>
                <p className='font-medium'>{formatDate(preOrder.createdAt)}</p>
              </div>
            </div>
          </div>

          {preOrder.productClassifications && preOrder.productClassifications.length > 0 && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Product Classifications</h3>
              <div className='space-y-2'>
                {preOrder.productClassifications.map((classification, index) => (
                  <div key={index} className='bg-muted p-3 rounded-md'>
                    <div className='grid grid-cols-2 gap-2'>
                      <div>
                        <p className='text-sm text-muted-foreground'>Title</p>
                        <p className='font-medium'>{classification.title}</p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>Quantity</p>
                        <p className='font-medium'>{classification.quantity}</p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>Price</p>
                        <p className='font-medium'>${classification.price}</p>
                      </div>
                      {classification.sku && (
                        <div>
                          <p className='text-sm text-muted-foreground'>SKU</p>
                          <p className='font-medium'>{classification.sku}</p>
                        </div>
                      )}
                      {classification.color && (
                        <div>
                          <p className='text-sm text-muted-foreground'>Color</p>
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-4 h-4 rounded-full border'
                              style={{ backgroundColor: classification.color }}
                            />
                            <p className='font-medium'>{classification.color}</p>
                          </div>
                        </div>
                      )}
                      {classification.size && (
                        <div>
                          <p className='text-sm text-muted-foreground'>Size</p>
                          <p className='font-medium'>{classification.size}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {preOrder.product.description && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Product Description</h3>
              <p className='text-sm'>{preOrder.product.description}</p>
            </div>
          )}

          {preOrder.product.images && preOrder.product.images.length > 0 && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Product Images</h3>
              <div className='grid grid-cols-3 gap-2'>
                {preOrder.product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.fileUrl}
                    alt={`Product image ${index + 1}`}
                    className='w-full h-auto rounded-md object-cover aspect-square'
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
