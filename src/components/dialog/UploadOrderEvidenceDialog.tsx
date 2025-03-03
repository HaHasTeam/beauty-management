import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FilesIcon, ImagePlus } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import FormLabel from '@/components/form-label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { uploadFilesApi } from '@/network/apis/file'
import { getOrderByIdApi, getStatusTrackingByIdApi, updateOrderStatusApi } from '@/network/apis/order'
import { getUpdateOrderStatusEvidenceSchema } from '@/schemas/order.schema'
import { IOrderItem } from '@/types/order'

import Button from '../button'
import UploadMediaFiles from '../file-input/UploadMediaFiles'
import { VideoThumbnail } from '../file-input/VideoThumbnail'
import ImageWithFallback from '../image/ImageWithFallback'

interface UploadOrderEvidenceDialogProps {
  isOpen: boolean
  onClose: () => void
  order: IOrderItem
  dialogTitle: string
  dialogDescription: string
  status: string
}

export const UploadOrderEvidenceDialog: React.FC<UploadOrderEvidenceDialogProps> = ({
  isOpen,
  onClose,
  order,
  dialogTitle,
  dialogDescription,
  status
}) => {
  const MAX_IMAGES = 4
  const MAX_VIDEOS = 2
  //   const MAX_FILES = MAX_IMAGES + MAX_VIDEOS
  const MAX_SIZE_NUMBER = 15
  const MAX_SIZE = MAX_SIZE_NUMBER * 1024 * 1024

  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const queryClient = useQueryClient()
  const UpdateOrderStatusEvidenceSchema = getUpdateOrderStatusEvidenceSchema()

  const defaultOrderValues = {
    status: status ?? '',
    images: [],
    videos: [],
    mediaFiles: []
  }
  const handleReset = () => {
    form.reset()
  }
  const form = useForm<z.infer<typeof UpdateOrderStatusEvidenceSchema>>({
    resolver: zodResolver(UpdateOrderStatusEvidenceSchema),
    defaultValues: defaultOrderValues
  })
  const { mutateAsync: updateOrderStatusFn } = useMutation({
    mutationKey: [updateOrderStatusApi.mutationKey],
    mutationFn: updateOrderStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('order.updateOrderStatusSuccess')
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getOrderByIdApi.queryKey] }),
        queryClient.invalidateQueries({ queryKey: [getStatusTrackingByIdApi.queryKey] })
      ])
      handleReset()
      onClose()
    }
  })

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

  const handleSubmit = async (values: z.infer<typeof UpdateOrderStatusEvidenceSchema>) => {
    try {
      setIsLoading(true)
      const imgUrls = values.images ? await convertFileToUrl(values.images) : []
      const vidUrls = values.videos ? await convertFileToUrl(values.videos) : []
      const mediaFiles = [...imgUrls, ...vidUrls]

      await updateOrderStatusFn({ id: order?.id, status: status, mediaFiles })
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='md:max-w-xl sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-primary'>{dialogTitle}</DialogTitle>
          <DialogDescription className='text-justify'>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4' id={`form-${id}`}>
            <p className='text-sm text-muted-foreground text-justify'>
              {t('feedback.mediaFilesHint', {
                videoCount: MAX_VIDEOS,
                imageCount: MAX_IMAGES,
                size: MAX_SIZE_NUMBER,
                format: 'mp4/wmv/mov/avi/mkv/flv/jpg/jpeg/png'.toLocaleUpperCase()
              })}
            </p>
            <FormField
              control={form.control}
              name='videos'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='w-full flex flex-col gap-2'>
                    <div className='w-full space-y-1'>
                      <FormLabel required className='text-primary'>
                        {t('feedback.uploadVideos')}
                      </FormLabel>
                      <FormDescription>{t(`feedback.videosHint.${order.status}`)}</FormDescription>
                    </div>
                    <div className='w-full space-y-1'>
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
                                <ImageWithFallback
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  fallback={fallBackImage}
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
                              <p className='text-xs text-primary'>{t('validation.inputMedia')}</p>
                              <p className='text-xs text-muted-foreground'>
                                {files.length}/{maxFiles} {t('systemService.files')}
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
                <FormItem className='w-full'>
                  <div className='w-full flex flex-col gap-2'>
                    <div className='w-full space-y-1'>
                      <FormLabel required className='text-primary'>
                        {t('feedback.uploadImages')}
                      </FormLabel>
                      <FormDescription>{t(`feedback.imagesHint.${order.status}`)}</FormDescription>
                    </div>
                    <div className='w-full space-y-1'>
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
                                <ImageWithFallback
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  fallback={fallBackImage}
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
                              <p className='text-xs text-primary'>{t('validation.inputMedia')}</p>
                              <p className='text-xs text-muted-foreground'>
                                {files.length}/{maxFiles} {t('systemService.files')}
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
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                className='border border-primary hover:bg-primary/10 text-primary hover:text-primary'
                onClick={onClose}
              >
                {t('button.cancel')}
              </Button>
              <Button type='submit' className='gap-1' loading={isLoading} form={`form-${id}`}>
                {t('button.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
