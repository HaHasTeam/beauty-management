import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dispatch, forwardRef, SetStateAction, useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { replyFeedbackApi } from '@/network/apis/feedback'
import { getOrderByIdApi } from '@/network/apis/order'
import { getProductByIdApi } from '@/network/apis/product'
import { getReplyFeedbackSchema } from '@/schemas/feedback.schema'
import { useStore } from '@/stores/store'
import { IBrand } from '@/types/brand'
import { IResponseFeedback } from '@/types/feedback'

import Button from '../button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'

interface ReplyFeedbackFormProps {
  isOpen: boolean
  feedback: IResponseFeedback
  setShowRep: Dispatch<SetStateAction<boolean>>
  brand?: IBrand | null
}

export const ReplyFeedbackForm = forwardRef<HTMLDivElement, ReplyFeedbackFormProps>(
  ({ isOpen, feedback, brand, setShowRep }, ref) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { successToast } = useToast()
    const handleServerError = useHandleServerError()
    const id = useId()
    const queryClient = useQueryClient()
    const ReplyFeedbackSchema = getReplyFeedbackSchema()
    const MAX_FEEDBACK_LENGTH = 500
    const { user } = useStore(
      useShallow((state) => ({
        user: state.user
      }))
    )

    const defaultValues = {
      content: ''
    }

    const form = useForm<z.infer<typeof ReplyFeedbackSchema>>({
      resolver: zodResolver(ReplyFeedbackSchema),
      defaultValues
    })

    const { mutateAsync: submitFeedbackFn } = useMutation({
      mutationKey: [replyFeedbackApi.mutationKey],
      mutationFn: replyFeedbackApi.fn,
      onSuccess: () => {
        successToast({
          message: t('feedback.successRepTitle'),
          description: t('feedback.successRepDescription')
        })
        queryClient.invalidateQueries({
          queryKey: [getOrderByIdApi.queryKey]
        })
        queryClient.invalidateQueries({
          queryKey: [getProductByIdApi.queryKey]
        })
        handleReset()
      }
    })

    const handleReset = () => {
      form.reset()
      setShowRep(false)
    }

    const handleSubmit = async (values: z.infer<typeof ReplyFeedbackSchema>) => {
      try {
        setIsLoading(true)
        await submitFeedbackFn({ params: feedback.id, content: values.content })
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        handleServerError({
          error,
          form
        })
      }
    }
    useEffect(() => {
      if (!isOpen) {
        setShowRep(false)
      }
    }, [isOpen, setShowRep])

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3' id={`form-${id}`}>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex items-start gap-2'>
                  <div>
                    {/* <FormLabel required className='text-primary'>
                    {t('feedback.reply')}
                  </FormLabel> */}
                    {brand ? (
                      <Avatar>
                        <AvatarImage src={brand.logo} alt={brand.name} />
                        <AvatarFallback>{brand.name?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarImage src={user?.avatar ?? ''} alt={user?.firstName ?? ''} />
                        <AvatarFallback>{user?.firstName?.charAt(0) ?? 'A'}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className='w-full space-y-1' ref={ref}>
                    <FormControl>
                      <Textarea
                        id='content'
                        placeholder={t('feedback.writeYourRep')}
                        className='border-primary/40 min-h-32'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
                <div className='text-sm text-muted-foreground text-right'>
                  {field?.value?.length ?? 0}/{MAX_FEEDBACK_LENGTH}
                </div>
              </FormItem>
            )}
          />
          <div className='flex gap-2 w-full items-center justify-end'>
            <Button
              variant='outline'
              className='border border-primary text-primary hover:text-primary hover:bg-primary/10'
              size='sm'
              type='button'
              onClick={() => setShowRep(false)}
            >
              {t('button.cancel')}
            </Button>
            <Button loading={isLoading} size='sm' type='submit'>
              {t('button.submit')}
            </Button>
          </div>
        </form>
      </Form>
    )
  }
)
