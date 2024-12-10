import { type Row } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { FaBan } from 'react-icons/fa'

import Button from '@/components/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { TVoucher } from '@/types/voucher'

interface BanVouchersDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Vouchers: Row<TVoucher>['original'][]
  showTrigger?: boolean
  onSuccess?: (Brands: Row<TVoucher>['original'][]) => void
}

export function BanVouchersDialog({ Vouchers, showTrigger = true, onSuccess, ...props }: BanVouchersDialogProps) {
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')

  async function onBan() {
    try {
      props.onOpenChange?.(false)
      onSuccess?.(Vouchers)
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant='destructive' size='sm' className='text-white'>
              <XIcon className='size-4' aria-hidden='true' />
              Ban {Vouchers.length} Selected {Vouchers.length > 1 ? 'Vouchers' : 'Voucher'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FaBan className='size-6' aria-hidden='true' />
              Are you sure to ban {Vouchers.length >= 2 ? 'these Vouchers' : 'this Voucher'}?
            </DialogTitle>
            <DialogDescription>
              You are about to <b className='uppercase'>ban</b>{' '}
              {Vouchers.map((Voucher) => (
                <Badge className='mr-1' key={Voucher.id}>
                  {Voucher.name}
                </Badge>
              ))}
              . After banning, the Voucher will be disabled. Please check the Voucher before banning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button aria-label='Ban Selected rows' variant='destructive' className='text-white' onClick={onBan}>
              Ban Voucher{Vouchers.length > 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant='destructive' size='sm' className='text-white'>
            <XIcon className='size-4' aria-hidden='true' />
            Ban {Vouchers.length} Selected {Vouchers.length > 1 ? 'Vouchers' : 'Voucher'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>ban</b>{' '}
            {Vouchers.map((Voucher) => (
              <Badge className='mr-1'>{Voucher.name}</Badge>
            ))}
            . After banning, the Vouchers will be disabled. Please check the Vouchers before banning.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button aria-label='Ban Selected rows' className='text-white' variant='destructive' onClick={onBan}>
            Ban Voucher{Vouchers.length > 1 ? 's' : ''}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
