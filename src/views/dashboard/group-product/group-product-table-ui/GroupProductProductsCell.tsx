import { ChevronDown, ChevronUp, Image, Package } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { TGroupProduct } from '@/types/group-product'

interface GroupProductProductsCellProps {
  groupProduct: TGroupProduct
}

export function GroupProductProductsCell({ groupProduct }: GroupProductProductsCellProps) {
  const [expanded, setExpanded] = useState(false)
  const { products } = groupProduct

  // If no products, show a placeholder
  if (!products?.length) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-1.5'>
        <Package className='h-4 w-4 mr-1.5 text-muted-foreground' />
        <span className='italic'>No products</span>
      </div>
    )
  }

  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <div className='w-full bg-card rounded-md'>
      <div className='p-1.5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-md'>
              <Package className='h-4 w-4' />
            </div>
            <div className='flex flex-col'>
              <div className='text-xs font-medium text-muted-foreground'>
                <span className='font-bold'>{products.length}</span> Products
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
            {products.map((product) => (
              <div
                key={product.id}
                className='flex items-center space-x-1.5 p-1 rounded-md border bg-primary/5 hover:bg-primary/10 border-primary/10 hover:shadow-md transition-all'
              >
                <div className='h-8 w-8 rounded-md bg-white border border-border flex items-center justify-center overflow-hidden shadow-sm'>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].fileUrl} alt={product.name} className='h-full w-full object-cover' />
                  ) : (
                    <Image className='h-4 w-4 text-muted-foreground' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-medium truncate capitalize text-foreground'>{product.name}</div>
                  <div className='text-[10px] text-muted-foreground'>SKU: {product.sku || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
