import * as React from 'react'

import Button from '@/components/button'
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
import { TTransaction } from '@/types/transaction'

interface BanTransactionsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  Transactions: TTransaction[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function BanTransactionsDialog({
  open,
  onOpenChange,
  Transactions = [],
  showTrigger = true
}: BanTransactionsDialogProps) {
  const [isOpen, setIsOpen] = React.useState(open || false)
  const isDesktop = useMediaQuery('(min-width: 640px)')

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value)
    onOpenChange?.(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button variant='destructive' size='sm'>
              Ban {Transactions.length} {Transactions.length === 1 ? 'Transaction' : 'Transactions'}
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              {/* <XCircle className='size-5 text-destructive' /> */}
              <span>Unpublish {Transactions.length === 1 ? 'Transaction' : 'Transactions'}</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to unpublish{' '}
              {Transactions.length === 1 ? 'this Transaction' : `these ${Transactions.length} Transactions`}? This will
              hide them from customers. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='button' variant='destructive'>
              Unpublish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DrawerTrigger asChild>
          <Button variant='destructive' size='sm'>
            Ban {Transactions.length} {Transactions.length === 1 ? 'Transaction' : 'Transactions'}
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to unpublish{' '}
            {Transactions.length === 1 ? 'this Transaction' : `these ${Transactions.length} Transactions`}? This will
            hide them from customers. This action cannot be undone.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline' type='button'>
              Cancel
            </Button>
          </DrawerClose>
          <Button type='button' variant='destructive'>
            Unpublish
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
