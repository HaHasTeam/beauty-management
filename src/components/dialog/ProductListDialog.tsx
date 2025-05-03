'use client'

import { useEffect, useState } from 'react'
import type { FieldPath, UseFormReturn } from 'react-hook-form'
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

// Helper function to safely extract the array of product IDs
function getProductIdsArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value && typeof value === 'object' && value !== null) {
    // Check if it has a selectedProducts property that is an array
    const objValue = value as Record<string, unknown>
    if ('selectedProducts' in objValue && Array.isArray(objValue.selectedProducts)) {
      return objValue.selectedProducts
    }
  }

  return []
}

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
      const rawValue = form.getValues('selectedProducts')
      const selectedProducts = getProductIdsArray(rawValue)
      setLocalSelectedProducts(selectedProducts)
    }
  }, [form, open])

  const handleProductSelect = (productId: string) => {
    // Check if the product is already in the array using strict equality
    const productIndex = localSelectedProducts.findIndex((id) => id === productId)
    const isAlreadySelected = productIndex !== -1

    // Create a new array based on selection state
    let newSelection: string[]
    if (isAlreadySelected) {
      newSelection = [...localSelectedProducts]
      newSelection.splice(productIndex, 1)
    } else {
      newSelection = [...localSelectedProducts, productId]
    }

    setLocalSelectedProducts(newSelection)
  }

  // Only apply selection when user clicks Done/Confirm
  const handleDone = () => {
    onDone(localSelectedProducts)
    onOpenChange(false)
  }

  // Cancel without applying changes
  const handleCancel = () => {
    const rawValue = form.getValues('selectedProducts')
    const selectedProducts = getProductIdsArray(rawValue)
    setLocalSelectedProducts(selectedProducts)
    onOpenChange(false)
  }

  // Type for our form values
  type FormValues = z.infer<typeof voucherCreateSchema>

  // Create a modified form object that works with our local state
  const localForm: UseFormReturn<FormValues> = {
    ...form,
    getValues: ((name?: FieldPath<FormValues>) => {
      if (name === 'selectedProducts') {
        return localSelectedProducts as unknown as FormValues[keyof FormValues]
      }
      return form.getValues(name as FieldPath<FormValues>)
    }) as UseFormReturn<FormValues>['getValues'],

    setValue: ((name: FieldPath<FormValues>, value: unknown) => {
      if (name === 'selectedProducts') {
        setLocalSelectedProducts(value as string[])
        return form
      }
      return form.setValue(name, value as string | number | boolean | undefined)
    }) as UseFormReturn<FormValues>['setValue'],

    watch: ((name?: FieldPath<FormValues>) => {
      if (name === 'selectedProducts') {
        return localSelectedProducts as unknown as FormValues[keyof FormValues]
      }
      return form.watch(name as FieldPath<FormValues>)
    }) as UseFormReturn<FormValues>['watch']
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
      <DialogContent className='sm:max-w-[80%] max-h-[80vh] overflow-y-auto'>
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
            form={localForm}
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
