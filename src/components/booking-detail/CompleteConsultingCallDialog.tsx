import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FilesIcon, Image as ImageIcon, Video } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import FormLabel from '@/components/form-label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getBookingByIdApi, updateBookingStatusApi } from '@/network/apis/booking/details'
import { uploadFilesApi } from '@/network/apis/file'
import { getCompleteConsultingCallSchema } from '@/schemas/booking.schema'
import { IBooking } from '@/types/booking'

import UploadMediaFiles from '../file-input/UploadMediaFiles'
import { VideoThumbnail } from '../file-input/VideoThumbnail'
import ImageWithFallback from '../ImageFallback'
import LoadingIcon from '../loading-icon'
import { ScrollArea } from '../ui/scroll-area'

// Define the schema for updating booking status

interface CompleteConsultingCallDialogProps {
  booking: IBooking
  isOpen: boolean
  onClose: () => void
}

const CompleteConsultingCallDialog: React.FC<CompleteConsultingCallDialogProps> = ({ booking, isOpen, onClose }) => {
  const MAX_IMAGES = 3
  const MAX_VIDEOS = 1
  const MAX_SIZE_NUMBER = 15
  const MAX_SIZE = MAX_SIZE_NUMBER * 1024 * 1024

  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const queryClient = useQueryClient()
  const CompleteConsultingCallSchema = getCompleteConsultingCallSchema()

  // Default values based on booking data
  const defaultValues = {
    resultNote: '',
    images: [],
    videos: [],
    mediaFiles: [],
  }

  const handleReset = () => {
    form.reset()
  }

  const form = useForm<z.infer<typeof CompleteConsultingCallSchema>>({
    resolver: zodResolver(CompleteConsultingCallSchema),
    defaultValues,
  })

  const { mutateAsync: updateBookingStatusFn } = useMutation({
    mutationKey: [updateBookingStatusApi.mutationKey],
    mutationFn: updateBookingStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('booking.updateBookingStatusSuccess'),
      })
      await Promise.all([queryClient.invalidateQueries({ queryKey: [getBookingByIdApi.queryKey] })])
      handleReset()
      onClose()
    },
  })

  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn,
  })

  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)
    return uploadedFilesResponse.data
  }

  const handleSubmit = async (values: z.infer<typeof CompleteConsultingCallSchema>) => {
    try {
      setIsLoading(true)
      const imgUrls = values.images ? await convertFileToUrl(values.images) : []
      const vidUrls = values.videos ? await convertFileToUrl(values.videos) : []
      const mediaFiles = [...imgUrls, ...vidUrls]

      await updateBookingStatusFn({
        id: booking?.id,
        status: 'COMPLETED_CONSULTING_CALL',
        mediaFiles,
        resultNote: values.resultNote,
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">{t('booking.completeConsultingCall')}</DialogTitle>
          <DialogDescription className="text-justify">
            {t('booking.completeConsultingCallDescription')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96">
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" id={`form-${id}`}>
              <p className="text-sm text-muted-foreground text-justify">
                {t('feedback.mediaFilesHint', {
                  videoCount: MAX_VIDEOS,
                  imageCount: MAX_IMAGES,
                  size: MAX_SIZE_NUMBER,
                  format: 'mp4/wmv/mov/avi/mkv/flv/jpg/jpeg/png'.toLocaleUpperCase(),
                })}
              </p>
              <FormField
                control={form.control}
                name="videos"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full space-y-1">
                        <FormLabel required className="text-primary">
                          {t('feedback.uploadVideos')}
                        </FormLabel>
                        <FormDescription>{t('booking.videosHint')}</FormDescription>
                      </div>
                      <div className="w-full space-y-1">
                        <UploadMediaFiles
                          field={field}
                          vertical={false}
                          isAcceptImage={false}
                          isAcceptVideo={true}
                          maxImages={0}
                          maxVideos={MAX_VIDEOS}
                          dropZoneConfigOptions={{
                            maxFiles: MAX_VIDEOS,
                            maxSize: MAX_SIZE,
                          }}
                          renderFileItemUI={(file) => (
                            <div
                              key={file.name}
                              className="hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative"
                            >
                              {file.type.includes('video') ? (
                                <VideoThumbnail file={file} />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <FilesIcon className="w-12 h-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          )}
                          renderInputUI={(_isDragActive, files, maxFiles) => (
                            <div className="w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500">
                              <Video className="w-8 h-8 text-primary" />
                              <p className="text-xs text-muted-foreground">
                                {files.length}/{maxFiles} {t('media.videosFile')}
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
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full space-y-1">
                        <FormLabel required className="text-primary">
                          {t('feedback.uploadImages')}
                        </FormLabel>
                        <FormDescription>{t('booking.imagesHint')}</FormDescription>
                      </div>
                      <div className="w-full space-y-1">
                        <UploadMediaFiles
                          field={field}
                          vertical={false}
                          isAcceptImage={true}
                          isAcceptVideo={false}
                          maxImages={MAX_IMAGES}
                          maxVideos={0}
                          dropZoneConfigOptions={{
                            maxFiles: MAX_IMAGES,
                            maxSize: MAX_SIZE,
                          }}
                          renderFileItemUI={(file) => (
                            <div
                              key={file.name}
                              className="hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative"
                            >
                              <ImageWithFallback
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                fallback={fallBackImage}
                                className="object-contain w-full h-full rounded-lg"
                                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                              />
                            </div>
                          )}
                          renderInputUI={(_isDragActive, files, maxFiles) => (
                            <div className="w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500">
                              <ImageIcon className="w-8 h-8 text-primary" />
                              <p className="text-xs text-muted-foreground">
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

              <FormField
                control={form.control}
                name="resultNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">{t('booking.notes')}</FormLabel>
                    {/* Notes only included when customer or consultant not join the meeting */}
                    <FormDescription>{t('booking.resultNoteDescription')}</FormDescription>
                    <Textarea placeholder={t('booking.resultNotePlaceholder')} className="min-h-24" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 space-x-2">
                <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
                  {t('common.cancel')}
                </Button>
                <Button variant="default" type="submit" disabled={isLoading}>
                  {isLoading ? <LoadingIcon color="primary" /> : t('button.submit')}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CompleteConsultingCallDialog
