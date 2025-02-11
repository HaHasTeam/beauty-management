import { Edit2, MapPinCheckInside } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { CreateOrderSchema } from '@/schemas/order.schema'
import { IAddress } from '@/types/address'
import { AddressEnum } from '@/types/enum'

import AlertMessage from '../alert/AlertMessage'
import AddressListDialog from './AddressListDialog'

interface AddressSectionProps {
  form: UseFormReturn<z.infer<typeof CreateOrderSchema>>
  addresses: IAddress[]
}
export default function AddressSection({ form, addresses }: AddressSectionProps) {
  const { t } = useTranslation()
  const defaultAddress = addresses?.find((address) => address.isDefault === true) ?? null

  const [chosenAddress, setChosenAddress] = useState<IAddress | null>(null)
  return (
    <div className="w-full mx-auto shadow-sm bg-white rounded-md">
      <div className="w-full space-y-1">
        <div className="p-4 space-y-3">
          {/* Delivery Section */}
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-center">
              <MapPinCheckInside className="w-5 h-5" />
              <h2 className="text-lg text-muted-foreground">{t('address.deliveryTo')}</h2>
            </div>
            <AddressListDialog
              addresses={addresses}
              form={form}
              triggerComponent={
                <Button variant="link" size="sm" className="text-blue-500 h-auto p-0 no-underline hover:no-underline">
                  <Edit2 className="w-4 h-4" />
                  {t('address.edit')}
                </Button>
              }
              defaultAddress={defaultAddress}
              setChosenAddress={setChosenAddress}
            />
          </div>
          {chosenAddress ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="font-medium pr-2 border-r border-gray-300">{chosenAddress?.fullName}</div>
                <div className="font-medium">{chosenAddress?.phone}</div>
              </div>
              <div className="text-muted-foreground">
                {chosenAddress?.type && (
                  <span className="mr-2 w-full px-2 py-0.5 bg-green-100 text-green-700 text-sm rounded">
                    {chosenAddress?.type === AddressEnum.HOME && t('address.addressTypeValueHome')}
                    {chosenAddress?.type === AddressEnum.OFFICE && t('address.addressTypeValueOffice')}
                    {chosenAddress?.type === AddressEnum.OTHER && t('address.addressTypeValueOther')}
                  </span>
                )}
                <span>{chosenAddress?.fullAddress}</span>
              </div>
            </div>
          ) : (
            <AlertMessage message={t('address.alertMessage', { action: 'checkout' })} />
          )}
        </div>
      </div>
    </div>
  )
}
