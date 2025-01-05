import { type Row } from '@tanstack/react-table'
import { CheckCheckIcon, XIcon } from 'lucide-react'
import * as React from 'react'

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
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { TGroupProduct } from '@/types/group-product'

interface PublishGroupProductsDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  GroupProducts: Row<TGroupProduct>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function PublishGroupProductsDialog({
  GroupProducts,
  showTrigger = true,
  ...props
}: PublishGroupProductsDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)')

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant='destructive' size='sm' className='text-white'>
              <XIcon className='size-4' aria-hidden='true' />
              Publish {GroupProducts.length} Selected {GroupProducts.length > 1 ? 'Users' : 'User'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <CheckCheckIcon className='size-6' aria-hidden='true' />
              Are you sure to Publish {GroupProducts.length >= 2 ? 'these GroupProducts' : 'this GroupProduct'}?
            </DialogTitle>
            <DialogDescription>
              You are about to <b className='uppercase'>Publish</b>{' '}
              {GroupProducts.map((GroupProduct) => (
                <Badge className='mr-1'>{GroupProduct.id}</Badge>
              ))}
              . After publish, the GroupProduct will be visible to the users. Please check the GroupProducts before
              publishing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button aria-label='Publish Selected rows' variant='default' className='text-white bg-green-500'>
              Publish
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
            Publish {GroupProducts.length} Selected {GroupProducts.length > 1 ? 'Users' : 'User'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>Publish</b>{' '}
            {GroupProducts.map((GroupProduct) => (
              <Badge className='mr-1'>{GroupProduct.name}</Badge>
            ))}
            . After Publishning, the GroupProducts will be disabled. Please check the GroupProducts before Publishning.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button aria-label='Publish Selected rows' className='text-white bg-green-500' variant={'default'}>
            Publish
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
