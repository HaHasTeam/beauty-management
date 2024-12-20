import { Box, Plus, Store } from 'lucide-react'
import { useState } from 'react'

import CardSection from '@/components/card-section'
import ProductListDialog from '@/components/dialog/ProductListDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function VoucherProductsCard() {
  const [selectedType, setSelectedType] = useState<'all' | 'specific'>('all')
  const [productCount] = useState(0)
  const [open, setOpen] = useState(false)

  const handleProductSelection = () => {
    // console.log('Selected products:', selectedProducts)
    // Handle the selected products
  }
  const handleTypeChange = (value: string) => {
    setSelectedType(value)
  }
  return (
    <>
      <ProductListDialog open={open} onOpenChange={setOpen} onDone={handleProductSelection} />
      <CardSection title={'Sản phẩm áp dụng'}>
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>3. Sản phẩm áp dụng</h3>

          <Tabs value={selectedType} onValueChange={handleTypeChange} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='all' className='flex items-center justify-center'>
                <Store className='h-4 w-4 mr-2' />
                Tất cả sản phẩm
              </TabsTrigger>
              <TabsTrigger value='specific' className='flex items-center justify-center'>
                <Box className='h-4 w-4 mr-2' />
                Sản phẩm cụ thể
              </TabsTrigger>
            </TabsList>
            <TabsContent value='all' className='mt-4'>
              <p className='text-sm text-muted-foreground'>
                Voucher sẽ được áp dụng cho tất cả sản phẩm trong cửa hàng của bạn.
              </p>
            </TabsContent>
            <TabsContent value='specific' className='mt-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Badge variant='secondary'>{productCount}</Badge>
                  <span className='text-sm text-muted-foreground'>sản phẩm được chọn</span>
                </div>
                <Button type='button' size='sm' className='flex items-center' onClick={() => setOpen(true)}>
                  <Plus className='h-4 w-4 mr-1' />
                  Chọn sản phẩm
                </Button>
              </div>
              {productCount === 0 && (
                <div className='flex flex-col items-center justify-center py-8 text-center mt-4 bg-muted rounded-lg'>
                  <Box className='h-12 w-12 text-muted-foreground mb-2 opacity-50' />
                  <p className='text-muted-foreground'>Vui lòng chọn sản phẩm</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardSection>
    </>
  )
}

export default VoucherProductsCard
