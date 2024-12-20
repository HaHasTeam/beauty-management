import { Image, Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface Product {
  id: string
  name: string
  available: number
  price: number
  image?: string
}

interface ProductListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (selectedProducts: string[]) => void
}

export default function ProductListDialog({ open, onOpenChange, onDone }: ProductListDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - replace with your actual data
  const products: Product[] = [
    {
      id: '1',
      name: 'test Shirt',
      available: 111,
      price: 111111
    }
    // Add more products as needed
  ]

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const handleDone = () => {
    onDone(selectedProducts)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Edit products</DialogTitle>
        </DialogHeader>

        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search products'
            className='pl-9'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className='border rounded-lg'>
          <div className='grid grid-cols-[auto,1fr,auto,auto] gap-4 p-3 border-b bg-muted/50'>
            <div className='w-6' />
            <div>Products</div>
            <div className='text-right'>Total available</div>
            <div className='text-right'>Price</div>
          </div>

          <div className='max-h-[300px] overflow-y-auto'>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className='grid grid-cols-[auto,1fr,auto,auto] gap-4 p-3 items-center hover:bg-muted/50'
              >
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleSelectProduct(product.id)}
                />
                <div className='flex items-center gap-2'>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className='w-8 h-8 rounded object-cover' />
                  ) : (
                    <div className='w-8 h-8 rounded bg-muted flex items-center justify-center'>
                      <Image className='w-4 h-4 text-muted-foreground' />
                    </div>
                  )}
                  <span>{product.name}</span>
                </div>
                <div className='text-right'>{product.available}</div>
                <div className='text-right'>đ{product.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className='flex items-center justify-between sm:justify-between'>
          <div className='text-sm text-muted-foreground'>
            {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleDone}>Done</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
