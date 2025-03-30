'use client'

import { useQuery } from '@tanstack/react-query'
import { Box, Plus, Store } from 'lucide-react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

import CardSection from '@/components/card-section'
import ProductListDialog from '@/components/dialog/ProductListDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProductFilterApi } from '@/network/apis/product'
import { getUserProfileApi } from '@/network/apis/user'
import type { voucherCreateSchema } from '@/schemas'
import { VoucherApplyTypeEnum } from '@/types/enum'
import type { IResponseProduct } from '@/types/product'

import ProductAppliesTable from './product-apply-table-ui'

function VoucherProductsCard({ form }: { form: UseFormReturn<z.infer<typeof voucherCreateSchema>> }) {
  const [open, setOpen] = useState(false)
  const { data: useProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
    select: (data) => data.data
  })
  const brandId = useProfileData?.brands?.[0]?.id ?? undefined
  const { data: productData, isLoading } = useQuery({
    queryKey: [getProductFilterApi.queryKey, { brandId: brandId }],
    queryFn: getProductFilterApi.fn,
    enabled: !!useProfileData,
    select: (data) => data.data.items
  })

  // This function is called when the user confirms product selection in the dialog
  const handleProductSelection = (productsId: string[]) => {
    // Update the form with the confirmed selection
    form.setValue('selectedProducts', productsId)
  }

  const handleTypeChange = (value: string) => {
    const applyType = VoucherApplyTypeEnum.ALL == value ? VoucherApplyTypeEnum.ALL : VoucherApplyTypeEnum.SPECIFIC
    form.setValue('applyType', applyType)

    // Clear selected products when switching to ALL
    if (value === VoucherApplyTypeEnum.ALL) {
      form.setValue('selectedProducts', [])
    }
  }

  // Ensure selectedProducts is always an array
  const selectedProductIds = form.getValues('selectedProducts') || []

  // Get the selected products data for display in the table
  const selectedProducts =
    productData?.filter((product: IResponseProduct) => selectedProductIds.includes(product.id || '')) || []

  return (
    <>
      <ProductListDialog
        open={open}
        onOpenChange={setOpen}
        onDone={handleProductSelection}
        products={productData || []}
        form={form}
        isLoading={isLoading}
      />
      <CardSection title={'Sản phẩm áp dụng'}>
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>3. Sản phẩm áp dụng</h3>

          <Tabs value={form.watch('applyType')} onValueChange={handleTypeChange} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='ALL' className='flex items-center justify-center'>
                <Store className='h-4 w-4 mr-2' />
                Tất cả sản phẩm
              </TabsTrigger>
              <TabsTrigger value='SPECIFIC' className='flex items-center justify-center'>
                <Box className='h-4 w-4 mr-2' />
                Sản phẩm cụ thể
              </TabsTrigger>
            </TabsList>
            <TabsContent value='ALL' className='mt-4'>
              <p className='text-sm text-muted-foreground'>
                Voucher sẽ được áp dụng cho tất cả sản phẩm trong cửa hàng của bạn.
              </p>
            </TabsContent>
            <TabsContent value='SPECIFIC' className='mt-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Badge variant='secondary'>{selectedProductIds.length}</Badge>
                  <span className='text-sm text-muted-foreground'>sản phẩm được chọn</span>
                </div>
                <Button type='button' size='sm' className='flex items-center' onClick={() => setOpen(true)}>
                  <Plus className='h-4 w-4 mr-1' />
                  Chọn sản phẩm
                </Button>
              </div>
              <div className='py-8'>
                {/* Only show products that have been confirmed via the dialog */}
                <ProductAppliesTable list={selectedProducts} isLoading={isLoading} form={form} isDialog={false} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardSection>
    </>
  )
}

export default VoucherProductsCard
