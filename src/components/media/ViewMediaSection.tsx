import { FilesIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { TServerFile } from '@/types/file'
import { isImageFile, isVideoFile } from '@/utils/media-files'

import { PreviewDialog } from '../file-input/PreviewImageDialog'
import { VideoThumbnailServer } from '../file-input/VideoThumbnail'
import ImageWithFallback from '../image/ImageWithFallback'

interface ViewMediaSectionProps {
  mediaFiles: TServerFile[]
}

export default function ViewMediaSection({ mediaFiles }: ViewMediaSectionProps) {
  const { t } = useTranslation()

  const imageFiles = mediaFiles.filter((file: TServerFile) => file.fileUrl && isImageFile(file.fileUrl))

  const videoFiles = mediaFiles.filter((file: TServerFile) => file.fileUrl && isVideoFile(file.fileUrl))

  // Get file type based on file URL
  const getFileContentType = (file: TServerFile) => {
    if (!file.fileUrl) return 'text'
    if (isImageFile(file.fileUrl)) return 'image'
    if (isVideoFile(file.fileUrl)) return 'video'
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
    <div className='flex gap-2 items-start'>
      {videoFiles.length > 0 &&
        videoFiles.map((file) => (
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
      {imageFiles.length > 0 && (
        <div className='w-full flex flex-col gap-2'>
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
    </div>
  )
}
