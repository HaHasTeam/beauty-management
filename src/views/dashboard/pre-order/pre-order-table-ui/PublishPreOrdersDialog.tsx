import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { getAllPreOrderListApi, updatePreOrderApi } from '@/network/apis/pre-order'
import { PreOrderStatusEnum, TPreOrder } from '@/types/pre-order'

interface PublishPreOrdersDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  PreOrders: Row<TPreOrder>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function PublishPreOrdersDialog({
  PreOrders,
  showTrigger = true,
  onSuccess,
  ...props
}: PublishPreOrdersDialogProps) {
  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const queryClient = useQueryClient()
  const { mutateAsync: publishPreOrderFn, isPending: isPublishingPreOrder } = useMutation({
    mutationKey: [updatePreOrderApi.mutationKey],
    mutationFn: updatePreOrderApi.fn
  })
  async function onPublish() {
    try {
      await publishPreOrderFn({
        id: PreOrders[0].id,
        status: PreOrderStatusEnum.ACTIVE
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
              Publish {PreOrders.length} Selected {PreOrders.length > 1 ? 'Users' : 'User'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <CheckCheckIcon className='size-6' aria-hidden='true' />
              Are you sure to Publish {PreOrders.length >= 2 ? 'these PreOrders' : 'this PreOrder'}?
            </DialogTitle>
            <DialogDescription>
              You are about to <b className='uppercase'>Publish</b>{' '}
              {PreOrders.map((PreOrder) => (
                <Badge className='mr-1'>{PreOrder.id}</Badge>
              ))}
              . After publish, the preOrder will be visible to the users. Please check the PreOrders before publishing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button
              aria-label='Publish Selected rows'
              variant='default'
              className='text-white bg-green-500'
              onClick={onPublish}
              loading={isPublishingPreOrder}
            >
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
            Publish {PreOrders.length} Selected {PreOrders.length > 1 ? 'Users' : 'User'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>Publish</b>{' '}
            {PreOrders.map((PreOrder) => (
              <Badge className='mr-1'>{PreOrder.product.name}</Badge>
            ))}
            . After Publishning, the PreOrders will be disabled. Please check the PreOrders before Publishning.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button
            aria-label='Publish Selected rows'
            className='text-white bg-green-500'
            variant={'default'}
            onClick={onPublish}
          >
            Publish
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
