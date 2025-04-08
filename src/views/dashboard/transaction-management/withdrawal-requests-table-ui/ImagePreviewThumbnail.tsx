import { FileImageIcon } from 'lucide-react'
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
  // Check for cloud storage URLs that might have the file extension in the path or query parameters
  const isCloudStorageImage = /storage\.googleapis\.com.*\.(jpg|jpeg|png|gif|bmp|webp|svg)($|\?)/i.test(imageUrl)

  // If fileType is provided, use that, otherwise use URL pattern detection
  const isImage = fileType
    ? fileType.startsWith('image/')
    : hasImageExtension || isCloudStorageImage || isImageLoaded === true

  // Try to load the image to verify it's actually an image
  useEffect(() => {
    // Always try to load the image if we're not sure
    if (!fileType && isImageLoaded === null) {
      const img = new Image()
      img.onload = () => setIsImageLoaded(true)
      img.onerror = () => setIsImageLoaded(false)
      img.src = imageUrl
    }
  }, [fileType, imageUrl, isImageLoaded])

  return (
    <>
      <div className='relative group rounded-md border border-gray-200 overflow-hidden bg-gray-50'>
        <button onClick={() => isImage && setShowPreview(true)} className='w-full cursor-pointer'>
          {isImage ? (
            <img
              src={imageUrl}
              alt={alt}
              className='w-full h-16 object-cover'
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                setIsImageLoaded(false)
              }}
            />
          ) : (
            <div className='w-full h-16 flex items-center justify-center'>
              <FileImageIcon className='h-6 w-6 text-gray-400' />
            </div>
          )}
        </button>
        <div className='p-1 text-xs truncate bg-white text-center'>
          {alt.length > 12 ? `${alt.slice(0, 10)}...` : alt}
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{alt}</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-center p-2'>
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
