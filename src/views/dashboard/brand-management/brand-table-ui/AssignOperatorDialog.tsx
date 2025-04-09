import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { defaultRequiredRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'

import { UserSelect } from '../../schedule-booking/booking-details-dialog/user-select'

const formSchema = z.object({
  operatorId: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
})

interface AssignOperatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brandId: string
  onAssign: (operatorId: string, brandId: string) => Promise<void>
}

export function AssignOperatorDialog({ open, onOpenChange, brandId, onAssign }: AssignOperatorDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { successToast } = useToast()
  const handleServerErrors = useHandleServerError()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operatorId: ''
    }
  })
  const { user } = useStore(
    useShallow((state) => {
      return {
        user: state.user
      }
    })
  )
  const isAdmin = user?.role === RoleEnum.ADMIN
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      await onAssign(values.operatorId, brandId)
      successToast({
        message: 'Operator assigned successfully!'
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      handleServerErrors({
        error
      })
    } finally {
      setIsLoading(false)
    }
  }
  if (!isAdmin) {
    return null
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Assign Operator</DialogTitle>
          <DialogDescription>Select an operator to assign to this brand.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='operatorId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Operator</FormLabel>
                  <FormControl>
                    <UserSelect onSelect={(userId) => field.onChange(userId)} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => onOpenChange(false)} type='button'>
                Cancel
              </Button>
              <Button type='submit' loading={isLoading}>
                Assign Operator
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
