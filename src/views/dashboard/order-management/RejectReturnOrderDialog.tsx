import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FilesIcon, ImagePlus, Video } from 'lucide-react'
import { Dispatch, SetStateAction, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Button from '@/components/button'
import UploadMediaFiles from '@/components/file-input/UploadMediaFiles'
import { VideoThumbnail } from '@/components/file-input/VideoThumbnail'
import Label from '@/components/form-label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { uploadFilesApi } from '@/network/apis/file'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  makeDecisionOnReturnRequestOrderApi
} from '@/network/apis/order'
import { getRejectReturnOrderSchema } from '@/schemas/order.schema'
import { RequestStatusEnum } from '@/types/enum'
import { IReturnRequestOrder } from '@/types/order'

interface RejectReturnOrderDialogProps {
  returnRequest: IReturnRequestOrder
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onOpenChange: (open: boolean) => void
}

export const RejectReturnOrderDialog: React.FC<RejectReturnOrderDialogProps> = ({
  returnRequest,
  open,
  setOpen,
  onOpenChange
}) => {
  const MAX_IMAGES = 4
  const MAX_VIDEOS = 1
  // const MAX_FILES = MAX_IMAGES + MAX_VIDEOS
  const MAX_SIZE_NUMBER = 10
  const MAX_SIZE = MAX_SIZE_NUMBER * 1024 * 1024

  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const ReturnOrderSchema = getRejectReturnOrderSchema()
  const [isOtherReason, setIsOtherReason] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const reasons: { value: string }[] = useMemo(
    () => [
      { value: t('return.rejectReturnOrderReason.notEligible') },
      { value: t('return.rejectReturnOrderReason.noValidReason') },
      { value: t('return.rejectReturnOrderReason.insufficientEvidence') },
      { value: t('return.rejectReturnOrderReason.policyViolation') },
      { value: t('return.rejectReturnOrderReason.damagedByCustomer') },
      { value: t('return.rejectReturnOrderReason.usedOrAltered') },
      { value: t('return.rejectReturnOrderReason.discountedOrFinalSale') },
      { value: t('return.rejectReturnOrderReason.other') }
    ],
    [t]
  )

  const defaultValues = {
    reason: '',
    otherReason: '',
    mediaFiles: [],
    videos: [],
    images: []
  }

  const form = useForm<z.infer<typeof ReturnOrderSchema>>({
    resolver: zodResolver(ReturnOrderSchema),
    defaultValues
  })

  const { mutateAsync: makeDecisionOnReturnRequestOrderFn } = useMutation({
    mutationKey: [makeDecisionOnReturnRequestOrderApi.mutationKey],
    mutationFn: makeDecisionOnReturnRequestOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('return.rejectReturnSuccess'),
        description: t('return.rejectReturnSuccessMessage')
      })
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getStatusTrackingByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getCancelAndReturnRequestApi.queryKey]
      })
    }
  })

  const handleReset = () => {
    form.reset()
    setIsOtherReason(false)
    setOpen(false)
  }

  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)

    return uploadedFilesResponse.data
  }

  const handleSubmit = async (values: z.infer<typeof ReturnOrderSchema>) => {
    try {
      setIsLoading(true)
      const imgUrls = values.images ? await convertFileToUrl(values.images) : []
      const videoUrls = values.videos ? await convertFileToUrl(values.videos) : []
      const payload = isOtherReason ? { reasonRejected: values.otherReason } : { reasonRejected: values.reason }
      await makeDecisionOnReturnRequestOrderFn({
        requestId: returnRequest?.id ?? '',
        status: RequestStatusEnum.REJECTED,
        ...payload,
        mediaFiles: [...imgUrls, ...videoUrls]
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='md:max-w-xl sm:max-w-lg'>
        <ScrollArea className='max-h-[80vh]'>
          <div className='space-y-3 mr-2'>
            <DialogHeader>
              <DialogTitle className='text-primary'>{t('return.rejectReturnOrderDialog.title')}</DialogTitle>
              <DialogDescription className='text-justify'>
                {t('return.rejectReturnOrderDialog.description')}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6' id={`form-${id}`}>
                <FormField
                  control={form.control}
                  name='reason'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <div className='w-full flex gap-2'>
                        <div className='w-1/5 flex items-center'>
                          <Label htmlFor='reason' required className='w-fit text-primary'>
                            {t('order.cancelOrderReason.reason')}
                          </Label>
                        </div>
                        <div className='w-full space-y-1'>
                          <FormControl>
                            <Select
                              value={field.value ?? ''}
                              onValueChange={(value: string) => {
                                field.onChange(value)
                                setIsOtherReason(value === t('return.rejectReturnOrderReason.other'))
                              }}
                              required
                              name='reason'
                            >
                              <SelectTrigger className='border-primary/40'>
                                <SelectValue {...field} placeholder={t('order.cancelOrderReason.selectAReason')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {reasons.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                      {reason.value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                {isOtherReason && (
                  <FormField
                    control={form.control}
                    name='otherReason'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <div className='w-full flex gap-2'>
                          <div className='w-1/5 flex items-center'>
                            <Label htmlFor='otherReason' required className='w-fit text-primary'>
                              {t('order.cancelOrderReason.otherReason')}
                            </Label>
                          </div>
                          <div className='w-full space-y-1'>
                            <FormControl>
                              <Textarea
                                id='otherReason'
                                {...field}
                                className='w-full p-2 border rounded-md focus:outline-none focus:ring border-primary/40'
                                placeholder={t('order.cancelOrderReason.enterReason')}
                                rows={4}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {/* media */}
                <div className='space-y-1'>
                  <Label required className='text-primary'>
                    {t('feedback.mediaFiles')}
                  </Label>
                  <FormDescription className='text-justify'>
                    {t('return.rejectReturnOrderDialog.mediaFilesNotes')}
                  </FormDescription>
                  <FormDescription className='text-justify'>
                    {t('feedback.mediaFilesHint', {
                      videoCount: MAX_VIDEOS,
                      imageCount: MAX_IMAGES,
                      size: MAX_SIZE_NUMBER,
                      format: 'mp4/wmv/mov/avi/mkv/flv/jpg/jpeg/png'.toLocaleUpperCase()
                    })}
                  </FormDescription>
                </div>
                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='videos'
                    render={({ field }) => (
                      <FormItem className=''>
                        <div className='flex flex-col gap-2'>
                          <div className='space-y-2'>
                            <Label required className='text-primary'>
                              {t('feedback.uploadVideos')}
                            </Label>
                            <UploadMediaFiles
                              field={field}
                              vertical={false}
                              isAcceptImage={false}
                              isAcceptVideo={true}
                              maxImages={MAX_IMAGES}
                              maxVideos={MAX_VIDEOS}
                              dropZoneConfigOptions={{
                                maxFiles: MAX_VIDEOS,
                                maxSize: MAX_SIZE
                              }}
                              renderFileItemUI={(file) => {
                                return (
                                  <div
                                    key={file.name}
                                    className='hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative'
                                  >
                                    {file.type.includes('image') ? (
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className='object-contain w-full h-full rounded-lg'
                                        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                      />
                                    ) : file.type.includes('video') ? (
                                      <VideoThumbnail file={file} />
                                    ) : (
                                      <div className='flex items-center justify-center h-full'>
                                        <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                      </div>
                                    )}
                                  </div>
                                )
                              }}
                              renderInputUI={(_isDragActive, files, maxFiles) => {
                                return (
                                  <div className='w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                                    <Video className='w-8 h-8 text-primary' />
                                    {/* <p className="text-xs text-primary">{t('validation.inputMedia')}</p> */}
                                    <p className='text-xs text-muted-foreground'>
                                      {files.length}/{maxFiles} {t('media.videosFile')}
                                    </p>
                                  </div>
                                )
                              }}
                            />
                            <p className='text-xs text-muted-foreground'></p>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='images'
                    render={({ field }) => (
                      <FormItem>
                        <div className='space-y-2'>
                          <Label required className='text-primary'>
                            {t('feedback.uploadImages')}
                          </Label>
                          <UploadMediaFiles
                            field={field}
                            vertical={false}
                            isAcceptImage={true}
                            isAcceptVideo={false}
                            maxImages={MAX_IMAGES}
                            maxVideos={MAX_VIDEOS}
                            dropZoneConfigOptions={{
                              maxFiles: MAX_IMAGES,
                              maxSize: MAX_SIZE
                            }}
                            renderFileItemUI={(file) => {
                              return (
                                <div
                                  key={file.name}
                                  className='hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative'
                                >
                                  {file.type.includes('image') ? (
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className='object-contain w-full h-full rounded-lg'
                                      onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                    />
                                  ) : file.type.includes('video') ? (
                                    <VideoThumbnail file={file} />
                                  ) : (
                                    <div className='flex items-center justify-center h-full'>
                                      <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                    </div>
                                  )}
                                </div>
                              )
                            }}
                            renderInputUI={(_isDragActive, files, maxFiles) => {
                              return (
                                <div className='w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                                  <ImagePlus className='w-8 h-8 text-primary' />
                                  {/* <p className="text-xs text-primary">{t('validation.inputMedia')}</p> */}
                                  <p className='text-xs text-muted-foreground'>
                                    {files.length}/{maxFiles} {t('media.imagesFile')}
                                  </p>
                                </div>
                              )
                            }}
                          />
                          <p className='text-xs text-muted-foreground'></p>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    className='border border-primary hover:bg-primary/10 text-primary hover:text-primary'
                    onClick={() => {
                      onOpenChange(false)
                      handleReset()
                    }}
                  >
                    {t('button.cancel')}
                  </Button>
                  <Button type='submit' className='gap-1' loading={isLoading}>
                    {t('button.submit')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
