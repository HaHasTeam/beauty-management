'use client'

import { useQuery } from '@tanstack/react-query'
import { Box, ListPlus, Store } from 'lucide-react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

import ProductListDialog from '@/components/dialog/ProductListDialog'
import FormLabel from '@/components/form-label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
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

  const handleProductSelection = (productsId: string[]) => {
    form.setValue('selectedProducts', productsId)
  }

  // Ensure selectedProducts is always an array
  const selectedProductIds = form.watch('selectedProducts') || []

  // Get the selected products data for display in the table
  const selectedProducts =
    productData?.filter((product: IResponseProduct) => selectedProductIds.includes(product.id || '')) || []

  const applyType = form.watch('applyType')

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
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Box /> Sản phẩm áp dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='applyType'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Áp dụng cho sản phẩm cụ thể?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === VoucherApplyTypeEnum.SPECIFIC}
                      onCheckedChange={(checked) => {
                        const newApplyType = checked ? VoucherApplyTypeEnum.SPECIFIC : VoucherApplyTypeEnum.ALL
                        field.onChange(newApplyType)
                        // Clear selected products when switching to ALL
                        if (!checked) {
                          form.setValue('selectedProducts', [])
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {applyType === VoucherApplyTypeEnum.ALL && (
              <p className='text-sm text-muted-foreground'>
                <Store className='h-4 w-4 mr-1.5 inline-block align-text-bottom' />
                Voucher sẽ được áp dụng cho tất cả sản phẩm trong cửa hàng của bạn.
              </p>
            )}

            {applyType === VoucherApplyTypeEnum.SPECIFIC && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between bg-muted/30 rounded-lg p-2'>
                  <div className='flex items-center space-x-2 p-2 bg-muted/90 rounded-lg'>
                    <Badge variant='destructive'>{selectedProductIds.length}</Badge>
                    <span className='text-sm text-muted-foreground'>sản phẩm được chọn</span>
                  </div>
                  <Button type='button' size='sm' className='flex items-center' onClick={() => setOpen(true)}>
                    <ListPlus className='h-4 w-4 mr-1' />
                    Thêm sản phẩm
                  </Button>
                </div>
                <div className=''>
                  <ProductAppliesTable list={selectedProducts} isLoading={isLoading} form={form} isDialog={false} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default VoucherProductsCard
