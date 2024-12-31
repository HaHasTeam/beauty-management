import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useId } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { voucherCreateSchema } from '@/schemas'
import { IProductTable } from '@/types/product'
import ProductAppliesTable from '@/views/dashboard/voucher-management/product-apply-table-ui'

import { Form } from '../ui/form'

const FormSchema = z.object({
  selectedProducts: z.array(z.string()),
  searchQuery: z.string().optional()
})

type FormValues = z.infer<typeof FormSchema>

interface ProductListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (selectedProducts: string[]) => void
  products: IProductTable[]
  form: UseFormReturn<z.infer<typeof voucherCreateSchema>>
  isLoading: boolean
  // isDialog: boolean
}

export default function ProductListDialog({
  open,
  onOpenChange,
  onDone,
  products,
  isLoading,
  form: parentForm
}: ProductListDialogProps) {
  const formId = useId()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedProducts: []
    }
  })
  const handleDone = () => {
    onDone(form.getValues('selectedProducts'))
    onOpenChange(false)
  }

  const handleProductSelect = (productId: string) => {
    const currentSelected = form.getValues('selectedProducts')
    const newSelected = currentSelected.includes(productId)
      ? currentSelected.filter((id) => id !== productId)
      : [...currentSelected, productId]
    form.setValue('selectedProducts', newSelected)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className='sm:max-w-[1200px]'
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Apply Products</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' id={formId}>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search products'
                className='pl-9'
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className=''>
              <ProductAppliesTable
                list={products}
                isLoading={isLoading}
                form={parentForm}
                isDialog={true}
                handleProductSelect={handleProductSelect}
              />
            </div>
            {/* <div className='border rounded-lg'>
              <div className='grid grid-cols-[auto,1fr,auto,auto] gap-4 p-3 border-b bg-muted/50'>
                <div className='w-6' />
                <div>Products</div>
                <div className='text-right'>Total available</div>
                <div className='text-right'>Price</div>
              </div>

              <div className='max-h-[300px] overflow-y-auto'>
                {products?.map((product) => (
                  <div className='' key={product.id}>
                    {product.productClassifications.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className='grid grid-cols-[auto,1fr,auto,auto] gap-4 p-3 items-center hover:bg-muted/50 cursor-pointer'
                        >
                          <Checkbox
                            checked={form.watch('selectedProducts').includes(product.id)}
                            onCheckedChange={() => handleProductSelect(product.id)}
                          />
                          <div className='flex items-center gap-2'>
                            <div className='w-8 h-8 rounded bg-muted flex items-center justify-center'>
                              <Image className='w-4 h-4 text-muted-foreground' />
                            </div>
                            <span>{product.name}</span>
                          </div>
                          <div className='text-right'>{item.quantity}</div>
                          <div className='text-right'>{item.price}</div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div> */}

            <DialogFooter className='flex items-center justify-between sm:justify-between'>
              <div className='text-sm text-muted-foreground'>
                {form.watch('selectedProducts').length} product
                {form.watch('selectedProducts').length !== 1 ? 's' : ''} selected
              </div>
              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type='button' onClick={handleDone}>
                  Done
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
