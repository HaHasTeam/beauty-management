import { MapPin, Phone, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { IAddress } from '@/types/address'

import CircleStyleIcon from '../icon/CircleStyleIcon'
import StatusTag from '../status-tag/StatusTag'
import { RadioGroupItem } from '../ui/radio-group'
import UpdateAddressDialog from './UpdateAddressDialog'

interface AddressItemProps {
  address: IAddress
  selectedAddressId?: string
  isShowRadioItem?: boolean
}
const AddressItem = ({ address, selectedAddressId, isShowRadioItem = true }: AddressItemProps) => {
  const { t } = useTranslation()
  return (
    <div className='w-full shadow-lg border border-gray-300 rounded-lg'>
      <div className='p-2 sm:p-4 flex gap-2'>
        {isShowRadioItem ? (
          <div className='h-8 flex items-center py-2'>
            <RadioGroupItem
              className='h-4'
              value={address?.id ?? ''}
              id={address?.id ?? ''}
              checked={address?.id === selectedAddressId}
            />
          </div>
        ) : null}
        <div className='w-full flex flex-col gap-3'>
          <div className='w-full flex flex-col gap-2'>
            <div className='w-full flex items-center justify-between'>
              <div className='flex-col sm:flex-row flex items-start sm:items-center gap-2'>
                <div className='flex items-center gap-2 border-0 sm:border-r sm:border-gray-300 pr-2'>
                  <CircleStyleIcon
                    icon={<User className='h-4 w-4 text-gray-500' size={16} />}
                    className='bg-secondary/50'
                    size='small'
                  />

                  <h3 className='font-medium'>{address?.fullName ?? ''}</h3>
                </div>
                <div className='flex items-center gap-2'>
                  <CircleStyleIcon
                    icon={<Phone className='h-4 w-4 text-gray-500' size={16} />}
                    className='bg-secondary/50'
                    size='small'
                  />

                  <span>{address?.phone ?? ''}</span>
                </div>
              </div>

              <UpdateAddressDialog
                address={address}
                triggerComponent={
                  <Button variant='link' className='text-blue-500 hover:text-blue-800 hover:no-underline'>
                    {t('address.update')}
                  </Button>
                }
              />
            </div>
            <div className='text-gray-600'>
              <div className='flex items-start gap-2'>
                <div>
                  <CircleStyleIcon
                    icon={<MapPin className='h-4 w-4 text-gray-500' size={16} />}
                    className='bg-secondary/50'
                    size='small'
                  />
                </div>
                <span className='text-sm'>{address?.fullAddress ?? ''}</span>
              </div>
            </div>
          </div>
          <div>{address?.isDefault && <StatusTag tag='Default' />}</div>
        </div>
      </div>
    </div>
  )
}

export default AddressItem
