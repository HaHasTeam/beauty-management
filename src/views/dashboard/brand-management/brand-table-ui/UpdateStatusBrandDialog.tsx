import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import { createElement, useId } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { getAllBrandsApi, updateStatusBrandByIdApi } from '@/network/apis/brand'
import { reasonSchema, reasonSchemaRequire } from '@/schemas'
import { BrandStatusEnum, type TBrand } from '@/types/brand'

import { getStatusInfo } from './helper'

function getUpdateButtonText(status: BrandStatusEnum, isPlural: boolean) {
  const brandText = isPlural ? 'Brands' : 'Brand'
  switch (status) {
    case BrandStatusEnum.ACTIVE:
      return `Activate ${brandText}`
    case BrandStatusEnum.INACTIVE:
      return `Deactivate ${brandText}`
    case BrandStatusEnum.PENDING_REVIEW:
      return `Set ${brandText} to Pending Review`
    case BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS:
      return `Request Additional Documents`
    case BrandStatusEnum.PRE_APPROVED_FOR_MEETING:
      return `Pre-approve ${brandText} for Meeting`
    case BrandStatusEnum.DENIED:
      return `Deny ${brandText}`
    case BrandStatusEnum.BANNED:
      return `Ban ${brandText}`
    default:
      return `Update ${brandText} Status`
  }
}

interface UpdateStatusBrandDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Brands: Row<TBrand>['original'][]
  showTrigger?: boolean
  status: BrandStatusEnum
}

export function UpdateStatusBrandDialog({
  Brands,
  showTrigger = true,
  status,
  ...props
}: UpdateStatusBrandDialogProps) {
  const queryClient = useQueryClient()

  const handleServerError = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const form = useForm<z.infer<typeof reasonSchemaRequire>>({
    resolver: zodResolver(
      status === BrandStatusEnum.DENIED ||
        status === BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS ||
        status === BrandStatusEnum.BANNED
        ? reasonSchemaRequire
        : reasonSchema
    ),
    defaultValues: {
      reason: ''
    }
  })
  const id = useId()
  const { mutateAsync: updateStatusBrandMutation } = useMutation({
    mutationKey: [updateStatusBrandByIdApi.mutationKey],
    mutationFn: updateStatusBrandByIdApi.fn
  })
  const updateStatusBrand = async ({
    brands,
    status,
    reason
  }: {
    status: string
    reason?: string
    brands: TBrand[]
  }) => {
    // Map over the brand array and call the mutation for each brand
    const updatePromises = brands.map((item) => updateStatusBrandMutation({ brandId: item.id, status: status, reason }))

    // Wait for all updates to complete
    await Promise.all(updatePromises)
    await queryClient.invalidateQueries({ queryKey: [getAllBrandsApi.queryKey] })
    form.reset()
    // await queryClient.invalidateQueries({ queryKey: ['getAllBrands', 'updateStatusBrandById'] })
    props.onOpenChange?.(false)
  }
  async function onSubmit(values: z.infer<typeof reasonSchemaRequire>) {
    try {
      const needsReason =
        status === BrandStatusEnum.DENIED ||
        status === BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS ||
        status === BrandStatusEnum.BANNED

      const formatData = {
        status: status,
        reason: needsReason ? values.reason : undefined,
        brands: Brands
      }

      await updateStatusBrand(formatData)
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }
  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className={`${getStatusInfo(status).textColor} ${getStatusInfo(status).bgColor} border-none hover:${getStatusInfo(status).bgColor} hover:opacity-80`}
            >
              {createElement(getStatusInfo(status).icon, {
                className: 'size-4 mr-2',
                'aria-hidden': 'true'
              })}
              Update status {Brands.length} Selected {Brands.length > 1 ? 'Brands' : 'Brand'}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              // className='w-full flex-col gap-8 flex'
              // id={`form-${id}`}
            >
              <DialogHeader className='my-2'>
                <DialogTitle className='flex items-center gap-2'>
                  {createElement(getStatusInfo(status).icon, {
                    className: `size-6 ${getStatusInfo(status).iconColor}`,
                    'aria-hidden': 'true'
                  })}
                  <span>
                    Are you sure to update status to{' '}
                    <span className={getStatusInfo(status).textColor}>{status.replace(/_/g, ' ').toLowerCase()}</span>{' '}
                    {Brands.length >= 2 ? 'these Brands' : 'this Brand'}?
                  </span>
                </DialogTitle>
                <DialogDescription>
                  You are about to update the status to{' '}
                  <Badge
                    variant='outline'
                    className={`font-semibold ${getStatusInfo(status).textColor} ${getStatusInfo(status).bgColor}`}
                  >
                    {createElement(getStatusInfo(status).icon, {
                      className: 'size-4 mr-2 inline',
                      'aria-hidden': 'true'
                    })}
                    {status.replace(/_/g, ' ')}
                  </Badge>{' '}
                  for{' '}
                  {Brands.map((Brand, index) => (
                    <Badge key={index} variant='secondary' className='mr-1'>
                      {Brand.name}
                    </Badge>
                  ))}
                  {status === BrandStatusEnum.ACTIVE && '. After update, the Brand will be active on platform.'}
                  {status === BrandStatusEnum.INACTIVE && '. After update, the Brand will be inactive on platform.'}
                  {status === BrandStatusEnum.BANNED && '. After update, the Brand will be banned from the platform.'}
                  {status === BrandStatusEnum.PENDING_REVIEW && '. The Brand will be placed in the review queue.'}
                  {status === BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS &&
                    '. The Brand will be notified to provide additional documents.'}
                  {status === BrandStatusEnum.PRE_APPROVED_FOR_MEETING &&
                    '. The Brand has been pre-approved pending a confirmation meeting.'}
                  {status === BrandStatusEnum.DENIED && ". The Brand's application will be rejected."}
                  {' Please review the information before proceeding.'}
                </DialogDescription>
                {(status === BrandStatusEnum.DENIED ||
                  status === BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS ||
                  status === BrandStatusEnum.BANNED) && (
                  <FormField
                    control={form.control}
                    name='reason'
                    render={({ field }) => (
                      <FormItem className='my-2'>
                        <FormLabel required>Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder={`Please provide a reason for ${status.toLowerCase().replace(/_/g, ' ')}`}
                            className='resize-none'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </DialogHeader>
              <DialogFooter className='gap-2 sm:space-x-0 '>
                <DialogClose asChild>
                  <Button
                    variant='outline'
                    onClick={() => {
                      form.reset()
                    }}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type='submit'
                  aria-label='Update Selected rows'
                  variant='default'
                  className={`${getStatusInfo(status).bgColor} ${getStatusInfo(status).textColor} hover:${getStatusInfo(status).bgColor} hover:opacity-80`}
                >
                  {getUpdateButtonText(status, Brands.length > 1)}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className={`${getStatusInfo(status).textColor} ${getStatusInfo(status).bgColor} border-none hover:${getStatusInfo(status).bgColor} hover:opacity-80`}
          >
            {createElement(getStatusInfo(status).icon, {
              className: 'size-4 mr-2',
              'aria-hidden': 'true'
            })}
            Update {Brands.length} Selected {Brands.length > 1 ? 'Brands' : 'Brand'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            // className='w-full flex-col gap-8 flex'
            id={`form-${id}`}
          >
            <DrawerHeader className='my-2'>
              <DrawerTitle className='flex items-center gap-2'>
                {createElement(getStatusInfo(status).icon, {
                  className: `size-6 ${getStatusInfo(status).iconColor}`,
                  'aria-hidden': 'true'
                })}
                <span>
                  Update status to{' '}
                  <span className={getStatusInfo(status).textColor}>{status.replace(/_/g, ' ').toLowerCase()}</span>
                </span>
              </DrawerTitle>
              <DrawerDescription>
                You are about to update the status to{' '}
                <Badge
                  variant='outline'
                  className={`font-semibold ${getStatusInfo(status).textColor} ${getStatusInfo(status).bgColor}`}
                >
                  {createElement(getStatusInfo(status).icon, {
                    className: 'size-4 mr-2 inline',
                    'aria-hidden': 'true'
                  })}
                  {status.replace(/_/g, ' ')}
                </Badge>{' '}
                for{' '}
                {Brands.map((Brand, index) => (
                  <Badge key={index} variant='secondary' className='mr-1'>
                    {Brand.name}
                  </Badge>
                ))}
                {status === BrandStatusEnum.ACTIVE && '. After update, the Brand will be active on platform.'}
                {status === BrandStatusEnum.INACTIVE && '. After update, the Brand will be inactive on platform.'}
                {status === BrandStatusEnum.BANNED && '. After update, the Brand will be banned from the platform.'}
                {status === BrandStatusEnum.PENDING_REVIEW && '. The Brand will be placed in the review queue.'}
                {status === BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS &&
                  '. The Brand will be notified to provide additional documents.'}
                {status === BrandStatusEnum.PRE_APPROVED_FOR_MEETING &&
                  '. The Brand has been pre-approved pending a confirmation meeting.'}
                {status === BrandStatusEnum.DENIED && ". The Brand's application will be rejected."}
                {' Please review the information before proceeding.'}
              </DrawerDescription>
              {(status === BrandStatusEnum.DENIED ||
                status === BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS ||
                status === BrandStatusEnum.BANNED) && (
                <FormField
                  control={form.control}
                  name='reason'
                  render={({ field }) => (
                    <FormItem className='my-2'>
                      <FormLabel required>Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder={`Please provide a reason for ${status.toLowerCase().replace(/_/g, ' ')}`}
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </DrawerHeader>

            <DrawerFooter className='gap-2 sm:space-x-0'>
              <DrawerClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DrawerClose>
              <Button
                aria-label='Update Selected rows'
                className={`${getStatusInfo(status).bgColor} ${getStatusInfo(status).textColor} hover:${getStatusInfo(status).bgColor} hover:opacity-80`}
                variant='default'
                type='submit'
              >
                {getUpdateButtonText(status, Brands.length > 1)}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
