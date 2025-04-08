'use client'

import { useEffect, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { voucherCreateSchema } from '@/schemas'
import type { IResponseProduct } from '@/types/product'
import ProductAppliesTable from '@/views/dashboard/voucher-management/product-apply-table-ui'

export default function ProductListDialog({
  open,
  onOpenChange,
  onDone,
  products,
  form,
  isLoading
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (selectedProducts: string[]) => void
  products: IResponseProduct[]
  form: UseFormReturn<z.infer<typeof voucherCreateSchema>>
  isLoading: boolean
}) {
  // Local state to track selected products in the dialog
  // This is separate from the form state until user confirms
  const [localSelectedProducts, setLocalSelectedProducts] = useState<string[]>([])

  // Initialize local selection when dialog opens
  useEffect(() => {
    if (open) {
      setLocalSelectedProducts(form.getValues('selectedProducts') || [])
    }
  }, [form, open])

  const handleProductSelect = (productId: string) => {
    setLocalSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  // Only apply selection when user clicks Done/Confirm
  const handleDone = () => {
    onDone(localSelectedProducts)
    onOpenChange(false)
  }

  // Cancel without applying changes
  const handleCancel = () => {
    setLocalSelectedProducts(form.getValues('selectedProducts') || [])
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          // If dialog is closing without confirmation, reset local selection
          handleCancel()
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className='sm:max-w-[800px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Chọn sản phẩm</DialogTitle>
          <DialogDescription>
            Chọn các sản phẩm mà voucher này có thể áp dụng. Bạn có thể chọn nhiều sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <ProductAppliesTable
            isLoading={isLoading}
            list={products}
            form={
              {
                ...form,
                getValues: () => ({ selectedProducts: localSelectedProducts }),
                setValue: (name, value) => {
                  if (name === 'selectedProducts') {
                    setLocalSelectedProducts(value as string[])
                  }
                }
              } as UseFormReturn<z.infer<typeof voucherCreateSchema>>
            }
            isDialog={true}
            handleProductSelect={handleProductSelect}
          />
        </div>

        <DialogFooter>
          <div className='flex items-center justify-between w-full'>
            <div className='text-sm text-muted-foreground'>Đã chọn {localSelectedProducts.length} sản phẩm</div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={handleCancel}>
                Hủy
              </Button>
              <Button onClick={handleDone}>Xác nhận</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
