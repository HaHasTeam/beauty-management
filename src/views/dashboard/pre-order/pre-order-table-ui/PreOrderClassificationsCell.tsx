import { ChevronDown, ChevronUp, Image, Layers, Package } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { TPreOrder } from '@/types/pre-order'
import { formatCurrency, formatNumber } from '@/utils/number'
import { minifyString } from '@/utils/string'

interface PreOrderClassificationsCellProps {
  preOrder: TPreOrder
}

// Removing the multi-color function since we're using a single color theme

export function PreOrderClassificationsCell({ preOrder }: PreOrderClassificationsCellProps) {
  const [expanded, setExpanded] = useState(false)
  const classifications = preOrder.productClassifications

  // If no classifications, show a placeholder
  if (!classifications || classifications.length === 0) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-1.5'>
        <Package className='h-4 w-4 mr-1.5 text-muted-foreground' />
        <span className='italic'>No options</span>
      </div>
    )
  }

  const totalQuantity = classifications.reduce((sum, item) => sum + item.quantity, 0)
  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <div className='w-full bg-card rounded-md'>
      <div className='p-1.5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-md'>
              <Layers className='h-4 w-4' />
            </div>
            <div className='flex flex-col'>
              <div className='text-xs font-medium text-muted-foreground'>
                <span className='font-bold'>{classifications.length}</span> Class with{' '}
                <span className='font-bold'>{formatNumber(totalQuantity)}</span> units
              </div>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='h-6 w-6 p-0 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent'
            onClick={toggleExpanded}
          >
            {expanded ? <ChevronUp className='h-3.5 w-3.5' /> : <ChevronDown className='h-3.5 w-3.5' />}
          </Button>
        </div>

        {expanded && (
          <div className='mt-1.5 space-y-1.5 pl-6'>
            {classifications.map((classification, index) => (
              <div
                key={index}
                className='flex items-center space-x-1.5 p-1 rounded-md border bg-primary/5 hover:bg-primary/10 border-primary/10 hover:shadow-md transition-all'
              >
                <div className='h-8 w-8 rounded-md bg-white border border-border flex items-center justify-center overflow-hidden shadow-sm'>
                  {classification.images && classification.images.length > 0 ? (
                    <img
                      src={classification.images[0].fileUrl}
                      alt={classification.title}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <Image className='h-4 w-4 text-muted-foreground' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-medium truncate capitalize text-foreground'>{classification.title}</div>
                  <div className='text-[10px] text-muted-foreground'>SKU: {minifyString(classification.sku)}</div>
                </div>
                <div className='flex flex-col items-end min-w-[80px]'>
                  <div className='text-xs font-semibold text-primary'>{formatCurrency(classification.price)}</div>
                  <div className='text-xs text-secondary-foreground font-medium'>
                    {formatNumber(classification.quantity)} units
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
