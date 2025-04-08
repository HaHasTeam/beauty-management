import { FileImageIcon, FileVideoIcon, PlayIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ImagePreviewThumbnailProps {
  imageUrl: string
  alt: string
  fileType?: string
}

export function ImagePreviewThumbnail({ imageUrl, alt, fileType }: ImagePreviewThumbnailProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState<boolean | null>(null)

  // Detect if the URL is an image based on extension or query parameters
  const hasImageExtension = /\.(jpg|jpeg|png|gif|bmp|webp|svg)($|\?)/i.test(imageUrl)
  // Detect if the URL is a video based on extension
  const hasVideoExtension = /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)($|\?)/i.test(imageUrl)
  // Check for cloud storage URLs that might have the file extension in the path or query parameters
  const isCloudStorageImage = /storage\.googleapis\.com.*\.(jpg|jpeg|png|gif|bmp|webp|svg)($|\?)/i.test(imageUrl)
  const isCloudStorageVideo = /storage\.googleapis\.com.*\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)($|\?)/i.test(imageUrl)

  // If fileType is provided, use that, otherwise use URL pattern detection
  const isImage = fileType
    ? fileType.startsWith('image/')
    : hasImageExtension || isCloudStorageImage || isImageLoaded === true

  const isVideo = fileType ? fileType.startsWith('video/') : hasVideoExtension || isCloudStorageVideo

  // Try to load the image to verify it's actually an image
  useEffect(() => {
    // Always try to load the image if we're not sure and it's not a video
    if (!fileType && !isVideo && isImageLoaded === null) {
      const img = new Image()
      img.onload = () => setIsImageLoaded(true)
      img.onerror = () => setIsImageLoaded(false)
      img.src = imageUrl
    }
  }, [fileType, imageUrl, isImageLoaded, isVideo])

  return (
    <>
      <div className='relative group rounded-md border border-gray-200 overflow-hidden bg-gray-50'>
        <button
          onClick={() => (isImage || isVideo) && setShowPreview(true)}
          className='w-full cursor-pointer aspect-square relative'
        >
          {isImage ? (
            <div className='relative w-full h-full'>
              <img
                src={imageUrl}
                alt={alt}
                className='w-full h-full object-cover'
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  setIsImageLoaded(false)
                }}
              />
            </div>
          ) : isVideo ? (
            <div className='relative w-full h-full bg-black'>
              <video
                src={imageUrl}
                className='w-full h-full object-cover opacity-70'
                muted
                playsInline
                preload='metadata'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <PlayIcon className='h-10 w-10 text-white opacity-90' />
              </div>
            </div>
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <FileImageIcon className='h-8 w-8 text-gray-400' />
            </div>
          )}

          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-xs truncate text-white'>
            {alt.length > 20 ? `${alt.slice(0, 18)}...` : alt}
          </div>
        </button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{alt}</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-center p-2'>
            {isImage ? (
              <img
                src={imageUrl}
                alt={alt}
                className='max-h-[70vh] max-w-full object-contain'
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  setShowPreview(false)
                }}
              />
            ) : isVideo ? (
              <video
                src={imageUrl}
                controls
                autoPlay
                className='max-h-[70vh] max-w-full'
                onError={() => setShowPreview(false)}
              />
            ) : (
              <div className='flex flex-col items-center gap-2'>
                <FileVideoIcon className='h-16 w-16 text-gray-400' />
                <p className='text-gray-500'>Unable to preview this file</p>
              </div>
            )}
          </div>
          <div className='flex justify-end gap-2 mt-4'>
            <Button type='button' variant='outline' size='sm' onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button type='button' variant='default' size='sm' onClick={() => window.open(imageUrl, '_blank')}>
              Open in new tab
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
