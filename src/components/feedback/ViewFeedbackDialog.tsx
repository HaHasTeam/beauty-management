import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Reply } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { replyFeedbackApi } from '@/network/apis/feedback'
import { getOrderByIdApi } from '@/network/apis/order'
import { getProductByIdApi } from '@/network/apis/product'
import { getReplyFeedbackSchema } from '@/schemas/feedback.schema'
import { IBrand } from '@/types/brand'
import { IClassification } from '@/types/classification'
import { IResponseFeedback } from '@/types/feedback'

import Button from '../button'
import BrandAnswer from '../reviews/BrandAnswer'
import CustomerReview from '../reviews/CustomerReview'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'

interface ViewFeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  feedback: IResponseFeedback
  productQuantity: number
  productClassification: IClassification | null
  brand: IBrand | null
  recipientAvatar: string
  recipientName: string
  orderDetailId: string
}

export const ViewFeedbackDialog: React.FC<ViewFeedbackDialogProps> = ({
  productClassification,
  productQuantity,
  isOpen,
  onClose,
  feedback,
  recipientAvatar,
  recipientName,
  orderDetailId,
  brand
}) => {
  const { t } = useTranslation()
  const [showRep, setShowRep] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const queryClient = useQueryClient()
  const ReplyFeedbackSchema = getReplyFeedbackSchema()
  const MAX_FEEDBACK_LENGTH = 500

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
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='md:max-w-xl sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-primary'>{t('feedback.viewReview')}</DialogTitle>
        </DialogHeader>

        {/* Feedback ID */}
        <div className='flex items-center justify-between text-sm text-gray-500'>
          <div>
            <span className='font-medium'>{t('feedback.ID')}:</span> {feedback.id.substring(0, 8)}
          </div>
          {orderDetailId && (
            <div>
              <span className='font-medium'> {t('feedback.order')}:</span> {orderDetailId.substring(0, 8)}
            </div>
          )}
        </div>
        <CustomerReview
          authorName={recipientName}
          authorAvatar={recipientAvatar}
          updatedAt={feedback.updatedAt}
          classification={productClassification}
          numberOfItem={productQuantity}
          description={feedback.content}
          mediaFiles={feedback.mediaFiles}
          rating={feedback.rating}
        />
        {!showRep && (
          <div>
            <Button
              variant='outline'
              size='sm'
              className='border border-primary text-primary hover:text-primary hover:bg-primary/10 flex gap-1'
              onClick={() => setShowRep(true)}
            >
              <Reply />
              {t('feedback.reply')}
            </Button>
          </div>
        )}
        {showRep && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3' id={`form-${id}`}>
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <div className='w-full flex flex-col gap-2'>
                      <div className='w-full flex items-center'>
                        <FormLabel required className='text-primary'>
                          {t('feedback.reply')}
                        </FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
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
        )}
        <BrandAnswer brandName={brand?.name ?? ''} updatedAt={''} description={''} brandLogo={brand?.logo ?? ''} />
        <DialogFooter>
          <Button
            variant='outline'
            className='border border-primary text-primary hover:text-primary hover:bg-primary/10'
            type='button'
            onClick={onClose}
          >
            {t('button.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
