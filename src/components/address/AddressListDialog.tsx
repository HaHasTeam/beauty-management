import { PlusCircle } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup } from '@/components/ui/radio-group'
import { CreateOrderSchema } from '@/schemas/order.schema'
import { IAddress } from '@/types/address'

import Empty from '../empty/Empty'
import { ScrollArea } from '../ui/scroll-area'
import AddAddressDialog from './AddAddressDialog'
import AddressItem from './AddressItem'

interface AddressListDialogProps {
  form: UseFormReturn<z.infer<typeof CreateOrderSchema>>
  triggerComponent: React.ReactElement<unknown>
  addresses?: IAddress[]
  chosenAddress?: IAddress | null
  defaultAddress?: IAddress | null
  setChosenAddress?: Dispatch<SetStateAction<IAddress | null>>
}
export default function AddressListDialog({
  form,
  triggerComponent,
  addresses,
  chosenAddress,
  defaultAddress,
  setChosenAddress
}: AddressListDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [selectedAddressId, setSelectedAddress] = useState(defaultAddress?.id ?? '')

  const handleConfirm = () => {
    if (selectedAddressId) {
      form.setValue('addressId', selectedAddressId)
      const customChosenAddress = addresses?.find((address) => address.id === selectedAddressId) ?? null
      setChosenAddress?.(customChosenAddress)
    }
    setOpen(false) // Close the dialog
  }

  useEffect(() => {
    if (!chosenAddress && defaultAddress) {
      setSelectedAddress(defaultAddress?.id ?? '')
      setChosenAddress?.(defaultAddress)
      form.setValue('addressId', defaultAddress?.id ?? '')
    }
  }, [addresses, defaultAddress, chosenAddress, setChosenAddress, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className='max-w-md sm:max-w-xl lg:max-w-3xl'>
        <DialogHeader>
          <div className='flex justify-between items-center px-3'>
            <DialogTitle>{t('address.chooseAddress')}</DialogTitle>
            <AddAddressDialog
              triggerComponent={
                <Button
                  className='text-primary border-primary hover:text-primary hover:bg-primary/15'
                  variant='outline'
                >
                  <PlusCircle /> {t('address.addNewAddress')}
                </Button>
              }
            />
          </div>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Address List */}
          {addresses && addresses?.length > 0 ? (
            <ScrollArea className='h-72 w-full'>
              <div className='px-0 sm:px-3 py-2 space-y-4 w-full'>
                <RadioGroup className='w-full' value={selectedAddressId} onValueChange={setSelectedAddress}>
                  <div className='space-y-3 w-full'>
                    {addresses?.map((address) => (
                      <div key={address?.id} className='w-full'>
                        <AddressItem address={address} selectedAddressId={selectedAddressId} />
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </ScrollArea>
          ) : (
            <Empty title={t('empty.address.title')} description={t('empty.address.description')} />
          )}
        </div>

        <DialogFooter>
          <div className='flex justify-end gap-2 w-full'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              {t('dialog.cancel')}
            </Button>
            <Button onClick={handleConfirm}>{t('dialog.ok')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
