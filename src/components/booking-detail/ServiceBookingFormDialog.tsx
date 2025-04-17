import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImageIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getBookingByIdApi, updateBookingStatusApi } from '@/network/apis/booking/details'
import { getBookingFormAnswerSchema, QuestionSchema } from '@/schemas/booking.schema'
import { IBooking } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'
import { TServerFile } from '@/types/file'

import Button from '../button'
import UploadMediaFiles from '../file-input/UploadMediaFiles'
import FormLabel from '../form-label'
import ImageWithFallback from '../image/ImageWithFallback'
import { Checkbox } from '../ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Textarea } from '../ui/textarea'

interface ServiceBookingFormDialogProps {
  isOpen: boolean
  setOpen: () => void
  booking: IBooking
}

const ServiceBookingFormDialog: React.FC<ServiceBookingFormDialogProps> = ({ isOpen, setOpen, booking }) => {
  const MAX_IMAGES = 3
  const MAX_SIZE_NUMBER = 15
  const MAX_SIZE = MAX_SIZE_NUMBER * 1024 * 1024
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const queryClient = useQueryClient()
  const SubmitBookingFormAnswerSchema = getBookingFormAnswerSchema()

  // Assuming the booking contains or has access to the form questions
  const bookingForm = booking?.consultantService?.serviceBookingForm || { id: '', questions: [] }

  // Ensure questions array has proper types by mapping through and ensuring all required fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedQuestions = bookingForm.questions.map((q: any) => ({
    type: q.type,
    question: q.question,
    orderIndex: q.orderIndex || 0,
    mandatory: !!q.mandatory,
    answers: q.answers || {},
    images: q.images || []
  }))

  // Prepare default values based on form structure
  const defaultFormValues: z.infer<typeof SubmitBookingFormAnswerSchema> = {
    formId: bookingForm.id ?? '',
    form: bookingForm.questions.map((q) => ({
      question: q.question || '',
      orderIndex: q.orderIndex || 1,
      mandatory: q.mandatory,
      type: q.type,
      answers: (q.answers as Record<string, string>) || ({} as Record<string, string>),
      images: q.images?.map((img) => ({
        name: img.name || '',
        fileUrl: img.fileUrl || ''
      }))
    })),
    answers: typedQuestions.map((question) => ({
      question: question.question,
      orderIndex: question.orderIndex,
      answers: {},
      images: question.images?.map((img: TServerFile) => ({
        name: img.name || '',
        fileUrl: img.fileUrl
      }))
    }))
  }

  const form = useForm<z.infer<typeof SubmitBookingFormAnswerSchema>>({
    resolver: zodResolver(SubmitBookingFormAnswerSchema),
    defaultValues: defaultFormValues
  })

  const handleReset = () => {
    form.reset(defaultFormValues)
  }

  const { mutateAsync: updateBookingStatusFn } = useMutation({
    mutationKey: [updateBookingStatusApi.mutationKey],
    mutationFn: updateBookingStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('booking.submitBookingFormSuccess')
      })
      await Promise.all([queryClient.invalidateQueries({ queryKey: [getBookingByIdApi.queryKey] })])
      handleReset()
      setOpen()
    }
  })

  const handleSubmit = async (values: z.infer<typeof SubmitBookingFormAnswerSchema>) => {
    try {
      setIsLoading(true)

      // Process each answer
      const processedAnswers = values.answers.map((answer) => {
        return {
          ...answer
          // If you need to process images or other fields, do it here
        }
      })

      await updateBookingStatusFn({
        id: booking.id,
        status: BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED,
        bookingFormAnswer: {
          formId: bookingForm.id ?? '',
          form: typedQuestions,
          answers: processedAnswers
        }
      })

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }

  const renderQuestionField = (question: z.infer<typeof QuestionSchema>, index: number) => {
    switch (question.type) {
      case 'SINGLE_CHOICE':
        return (
          <FormField
            key={`question-${index}`}
            control={form.control}
            name={`answers.${index}.answers`}
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel required={question.mandatory}>{question.question}</FormLabel>
                {question.images && question.images.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {question.images.map((img, imgIndex) => (
                      <ImageWithFallback
                        key={`img-${imgIndex}`}
                        src={img.fileUrl}
                        alt={img.name}
                        fallback={fallBackImage}
                        className='w-20 h-20 object-cover rounded-md'
                      />
                    ))}
                  </div>
                )}
                <RadioGroup
                  onValueChange={(value) => {
                    const selectedKey = Object.keys(question.answers).find((key) => question.answers[key] === value)
                    if (selectedKey) {
                      field.onChange({ [selectedKey]: value })
                    }
                  }}
                  defaultValue={Object.values(field.value)[0]}
                  className='flex flex-col space-y-1'
                >
                  {Object.entries(question.answers).map(([key, value]) => (
                    <div key={key} className='flex items-center space-x-2'>
                      <RadioGroupItem value={value} id={`${question.orderIndex}-${key}`} />
                      <label
                        htmlFor={`${question.orderIndex}-${key}`}
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {value}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'MULTIPLE_CHOICE':
        return (
          <FormField
            key={`question-${index}`}
            control={form.control}
            name={`answers.${index}.answers`}
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel required={question.mandatory}>{question.question}</FormLabel>
                {question.images && question.images.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {question.images.map((img, imgIndex) => (
                      <ImageWithFallback
                        key={`img-${imgIndex}`}
                        src={img.fileUrl}
                        alt={img.name}
                        fallback={fallBackImage}
                        className='w-20 h-20 object-cover rounded-md'
                      />
                    ))}
                  </div>
                )}
                <div className='space-y-2'>
                  {Object.entries(question.answers).map(([key, value]) => (
                    <div key={key} className='flex items-center space-x-2'>
                      <Checkbox
                        id={`${question.orderIndex}-${key}`}
                        checked={field.value[key] === value}
                        onCheckedChange={(checked) => {
                          const newAnswers = { ...field.value }
                          if (checked) {
                            newAnswers[key] = value
                          } else {
                            delete newAnswers[key]
                          }
                          field.onChange(newAnswers)
                        }}
                      />
                      <label
                        htmlFor={`${question.orderIndex}-${key}`}
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {value}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'TEXT':
        return (
          <FormField
            key={`question-${index}`}
            control={form.control}
            name={`answers.${index}.answers`}
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel required={question.mandatory}>{question.question}</FormLabel>
                {question.images && question.images.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {question.images.map((img, imgIndex) => (
                      <ImageWithFallback
                        key={`img-${imgIndex}`}
                        src={img.fileUrl}
                        alt={img.name}
                        fallback={fallBackImage}
                        className='w-20 h-20 object-cover rounded-md'
                      />
                    ))}
                  </div>
                )}
                <Textarea
                  {...field}
                  onChange={(e) => field.onChange({ text: e.target.value })}
                  value={field.value.text || ''}
                  placeholder={t('booking.enterYourAnswer')}
                  className='resize-none'
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className='md:max-w-2xl sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-primary'>{t('booking.serviceBookingForm')}</DialogTitle>
          <DialogDescription className='text-justify'>{t('booking.serviceBookingFormDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6' id={`form-${id}`}>
            {typedQuestions.map((question, index) => (
              <div key={index} className='space-y-4'>
                {renderQuestionField(question, index)}
                <hr className='my-4' />
                <div className='mt-4'>
                  <FormField
                    control={form.control}
                    name={`answers.${index}.images`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <div className='w-full flex flex-col gap-2'>
                          <div className='w-full space-y-1'>
                            <FormLabel className='text-primary'>{t('feedback.uploadImages')}</FormLabel>
                            <FormDescription>{t('booking.imagesHint')}</FormDescription>
                          </div>
                          <div className='w-full space-y-1'>
                            <UploadMediaFiles
                              field={field}
                              vertical={false}
                              isAcceptImage={true}
                              isAcceptVideo={false}
                              maxImages={MAX_IMAGES}
                              maxVideos={0}
                              dropZoneConfigOptions={{
                                maxFiles: MAX_IMAGES,
                                maxSize: MAX_SIZE
                              }}
                              renderFileItemUI={(file) => (
                                <div
                                  key={file.name}
                                  className='hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative'
                                >
                                  <ImageWithFallback
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    fallback={fallBackImage}
                                    className='object-contain w-full h-full rounded-lg'
                                    onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                  />
                                </div>
                              )}
                              renderInputUI={(_isDragActive, files, maxFiles) => (
                                <div className='w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                                  <ImageIcon className='w-8 h-8 text-primary' />
                                  <p className='text-xs text-muted-foreground'>
                                    {files.length}/{maxFiles} {t('media.imagesFile')}
                                  </p>
                                </div>
                              )}
                            />
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <div className='flex justify-end space-x-2'>
              <Button variant='outline' type='button' onClick={setOpen}>
                {t('button.cancel')}
              </Button>
              <Button type='submit' loading={isLoading}>
                {t('button.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceBookingFormDialog
