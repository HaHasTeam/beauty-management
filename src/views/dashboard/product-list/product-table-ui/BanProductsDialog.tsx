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
import { IResponseProduct } from '@/types/product'

interface BanProductsDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Products: Row<IResponseProduct>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function BanProductsDialog({ Products, showTrigger = true, onSuccess, ...props }: BanProductsDialogProps) {
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')

  async function onBan() {
    try {
      props.onOpenChange?.(false)
      onSuccess?.()
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
              Ban {Products.length} Selected {Products.length > 1 ? 'Users' : 'User'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FaBan className='size-6' aria-hidden='true' />
              Are you sure to ban {Products.length >= 2 ? 'these Products' : 'this Product'}?
            </DialogTitle>
            <DialogDescription>
              You are about to <b className='uppercase'>ban</b>{' '}
              {Products.map((Product) => (
                <Badge className='mr-1'>{Product.name}</Badge>
              ))}
              . After banning, the Products will be disabled. Please check the Products before banning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button aria-label='Ban Selected rows' variant='destructive' className='text-white' onClick={onBan}>
              Ban User{Products.length > 1 ? 's' : ''}
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
            Ban {Products.length} Selected {Products.length > 1 ? 'Users' : 'User'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>ban</b>{' '}
            {Products.map((Product) => (
              <Badge className='mr-1'>{Product.name}</Badge>
            ))}
            . After banning, the Products will be disabled. Please check the Products before banning.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button aria-label='Ban Selected rows' className='text-white' variant='destructive' onClick={onBan}>
            Ban User{Products.length > 1 ? 's' : ''}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
