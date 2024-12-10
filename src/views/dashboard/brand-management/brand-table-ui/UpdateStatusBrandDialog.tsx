import { type Row } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { GrStatusGood } from 'react-icons/gr'

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
import { BrandStatusEnum, TBrand } from '@/types/brand'

interface UpdateStatusBrandDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Brands: Row<TBrand>['original'][]
  showTrigger?: boolean
  onSuccess?: (brand: Row<TBrand>['original'][]) => void
  status: BrandStatusEnum
}

export function UpdateStatusBrandDialog({
  Brands,
  showTrigger = true,
  onSuccess,
  status,
  ...props
}: UpdateStatusBrandDialogProps) {
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')

  async function onUpdate() {
    try {
      props.onOpenChange?.(false)
      onSuccess?.(Brands)
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
              Update status {Brands.length} Selected {Brands.length > 1 ? 'Brands' : 'Brand'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <GrStatusGood className='size-6' aria-hidden='true' />
              Are you sure to update status to {status} {Brands.length >= 2 ? 'these Brands' : 'this Brand'}?
            </DialogTitle>
            <DialogDescription>
              You are about to <b className='uppercase'>Update</b>{' '}
              {Brands.map((Brand) => (
                <Badge className='mr-1'>{Brand.name}</Badge>
              ))}
              . After update , the Brand will be active on platform. Please check the Brand information before update.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button aria-label='Update Selected rows' variant='default' className='text-white' onClick={onUpdate}>
              Update To {status}
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
          <Button variant='default' size='sm' className='text-white'>
            <XIcon className='size-4' aria-hidden='true' />
            Update {Brands.length} Selected {Brands.length > 1 ? 'Brands' : 'Brand'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>update</b>{' '}
            {Brands.map((Brand) => (
              <Badge className='mr-1'>{Brand.name}</Badge>
            ))}
            . After update , the Brand will be active on platform. Please check the Brand information before update.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button aria-label='Update Selected rows' className='text-white' variant='default' onClick={onUpdate}>
            Update Brand{Brands.length > 1 ? 's' : ''}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
