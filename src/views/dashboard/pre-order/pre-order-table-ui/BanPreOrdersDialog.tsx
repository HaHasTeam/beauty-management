import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { getAllPreOrderListApi, updatePreOrderApi } from '@/network/apis/pre-order'
import { PreOrderStatusEnum, TPreOrder } from '@/types/pre-order'

interface BanPreOrdersDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  PreOrders: Row<TPreOrder>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function BanPreOrdersDialog({ PreOrders, showTrigger = true, onSuccess, ...props }: BanPreOrdersDialogProps) {
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const queryClient = useQueryClient()
  const { mutateAsync: unPublishPreOrderFn, isPending: isUnPublishingPreOrder } = useMutation({
    mutationKey: [updatePreOrderApi.mutationKey],
    mutationFn: updatePreOrderApi.fn
  })
  async function onUnPublish() {
    try {
      await unPublishPreOrderFn({
        id: PreOrders[0].id,
        status: PreOrderStatusEnum.INACTIVE
      })
      queryClient.invalidateQueries({
        queryKey: [getAllPreOrderListApi.queryKey]
      })
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
              Ban {PreOrders.length} Selected {PreOrders.length > 1 ? 'Users' : 'User'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FaBan className='size-6' aria-hidden='true' />
              Are you sure to Unpublish {PreOrders.length >= 2 ? 'these PreOrders' : 'this PreOrder'}?
            </DialogTitle>
            <DialogDescription>
              You are about to <b className='uppercase'>ban</b>{' '}
              {PreOrders.map((PreOrder) => (
                <Badge className='mr-1'>{PreOrder.id}</Badge>
              ))}
              . After inactive, the PreOrders will be disabled. Please check the PreOrders before inactivating.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button
              aria-label='Ban Selected rows'
              variant='destructive'
              className='text-white'
              onClick={onUnPublish}
              loading={isUnPublishingPreOrder}
            >
              Unpublish
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
            Ban {PreOrders.length} Selected {PreOrders.length > 1 ? 'Users' : 'User'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>ban</b>{' '}
            {PreOrders.map((PreOrder) => (
              <Badge className='mr-1'>{PreOrder.product.name}</Badge>
            ))}
            . After banning, the PreOrders will be disabled. Please check the PreOrders before banning.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button
            aria-label='Ban Selected rows'
            className='text-white'
            variant='destructive'
            onClick={onUnPublish}
            loading={isUnPublishingPreOrder}
          >
            Ban User{PreOrders.length > 1 ? 's' : ''}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
