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
import { TBrand } from '@/types/brand'

interface BanBrandsDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Brands: Row<TBrand>['original'][]
  showTrigger?: boolean
  onSuccess?: (Brands: Row<TBrand>['original'][]) => void
}

export function BanBrandsDialog({ Brands, showTrigger = true, onSuccess, ...props }: BanBrandsDialogProps) {
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')

  async function onBan() {
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
              Ban {Brands.length} Selected {Brands.length > 1 ? 'Brands' : 'Brand'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FaBan className='size-6' aria-hidden='true' />
              Are you sure to ban {Brands.length >= 2 ? 'these Brands' : 'this Brand'}?
            </DialogTitle>
            <DialogDescription>
              You are about to <b className='uppercase'>ban</b>{' '}
              {Brands.map((Brand) => (
                <Badge className='mr-1' key={Brand.id}>
                  {Brand.name}
                </Badge>
              ))}
              . After banning, the Brand will be disabled. Please check the Brand before banning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button aria-label='Ban Selected rows' variant='destructive' className='text-white' onClick={onBan}>
              Ban Brand{Brands.length > 1 ? 's' : ''}
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
            Ban {Brands.length} Selected {Brands.length > 1 ? 'Brands' : 'Brand'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>ban</b>{' '}
            {Brands.map((Brand) => (
              <Badge className='mr-1'>{Brand.name}</Badge>
            ))}
            . After banning, the Brads will be disabled. Please check the Brads before banning.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button aria-label='Ban Selected rows' className='text-white' variant='destructive' onClick={onBan}>
            Ban Brand{Brands.length > 1 ? 's' : ''}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
