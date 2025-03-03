import { AlertTriangle, FilesIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TServerFile } from '@/types/file'

import { PreviewDialog } from '../file-input/PreviewImageDialog'
import { VideoThumbnailServer } from '../file-input/VideoThumbnail'
import ImageWithFallback from '../image/ImageWithFallback'

interface ViewMediaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mediaFiles: TServerFile[]
}

export default function ViewMediaDialog({ mediaFiles, open, onOpenChange }: ViewMediaDialogProps) {
  const { t } = useTranslation()

  const imageFiles = mediaFiles.filter(
    (file: TServerFile) =>
      file.fileUrl && (file.fileUrl.endsWith('.jpg') || file.fileUrl.endsWith('.jpeg') || file.fileUrl.endsWith('.png'))
  )

  const videoFiles = mediaFiles.filter(
    (file: TServerFile) =>
      file.fileUrl &&
      (file.fileUrl.endsWith('.mp4') ||
        file.fileUrl.endsWith('.wmv') ||
        file.fileUrl.endsWith('.mov') ||
        file.fileUrl.endsWith('.avi') ||
        file.fileUrl.endsWith('.mkv') ||
        file.fileUrl.endsWith('.flv'))
  )

  // Get file type based on file URL
  const getFileContentType = (file: TServerFile) => {
    if (!file.fileUrl) return 'text'
    if (file.fileUrl.endsWith('.jpg') || file.fileUrl.endsWith('.jpeg') || file.fileUrl.endsWith('.png')) return 'image'
    if (
      file.fileUrl.endsWith('.mp4') ||
      file.fileUrl.endsWith('.wmv') ||
      file.fileUrl.endsWith('.mov') ||
      file.fileUrl.endsWith('.avi') ||
      file.fileUrl.endsWith('.mkv') ||
      file.fileUrl.endsWith('.flv')
    )
      return 'video'
    return 'text'
  }

  // Preview content for dialog
  const getPreviewContent = (file: TServerFile) => {
    const contentType = getFileContentType(file)

    if (contentType === 'image') {
      return file.fileUrl
    } else if (contentType === 'video') {
      return (
        <div className='flex items-center justify-center'>
          <video src={file.fileUrl} controls className='max-w-full max-h-full'>
            {t('validation.videoBrowser')}
          </video>
        </div>
      )
    } else {
      return (
        <div className='flex items-center justify-center'>
          <FilesIcon className='w-12 h-12 text-muted-foreground' />
          <span className='text-sm font-medium truncate max-w-[200px]'>
            {file.fileUrl && file.fileUrl.split('/').pop()}
          </span>
        </div>
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] md:max-w-[700px]'>
        <DialogHeader className='flex flex-row items-start gap-4'>
          <AlertTriangle className='mt-2 h-6 w-6 text-orange-500' />
          <div className='flex-1 gap-2 items-start'>
            <DialogTitle className='text-lg'>{t(`media.viewMediaFiles`)}</DialogTitle>
            <DialogDescription></DialogDescription>
          </div>
        </DialogHeader>
        <div className='space-y-2'>
          {imageFiles.length > 0 && (
            <div className='w-full flex flex-col gap-2'>
              <div className='w-full space-y-1'>
                <h3 className='text-primary font-semibold'>{t('media.images')}</h3>
              </div>
              <div className='w-full space-y-1 flex flex-wrap gap-2'>
                {imageFiles.map((file) => (
                  <PreviewDialog
                    key={file.id}
                    className='lg:max-w-xl md:max-w-md sm:max-w-sm max-w-xs xl:max-w-xl'
                    content={getPreviewContent(file)}
                    trigger={
                      <div className='hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative'>
                        <ImageWithFallback
                          fallback={fallBackImage}
                          src={file.fileUrl}
                          alt={`Image ${file.id}`}
                          className='object-contain w-full h-full rounded-lg'
                        />
                      </div>
                    }
                    contentType={getFileContentType(file)}
                  />
                ))}
              </div>
            </div>
          )}

          {videoFiles.length > 0 && (
            <div className='w-full flex flex-col gap-2'>
              <div className='w-full space-y-1'>
                <h3 className='text-primary font-semibold'>{t('media.videos')}</h3>
              </div>
              <div className='w-full space-y-1 flex flex-wrap gap-2'>
                {videoFiles.map((file) => (
                  <PreviewDialog
                    key={file.id}
                    className='lg:max-w-xl md:max-w-md sm:max-w-sm max-w-xs xl:max-w-xl'
                    content={getPreviewContent(file)}
                    trigger={
                      <div className='hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative'>
                        <VideoThumbnailServer file={file} />
                      </div>
                    }
                    contentType={getFileContentType(file)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
