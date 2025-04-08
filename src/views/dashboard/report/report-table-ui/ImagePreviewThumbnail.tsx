import { ImageIcon, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ImagePreviewThumbnailProps {
  imageUrl: string
  alt: string
}

export function ImagePreviewThumbnail({ imageUrl, alt }: ImagePreviewThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const openDialog = () => {
    if (!hasError) {
      setIsDialogOpen(true)
    }
  }

  return (
    <>
      <div
        className='relative aspect-square w-full rounded-md overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer'
        onClick={openDialog}
      >
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
          </div>
        )}

        {hasError ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-2'>
            <ImageIcon className='h-6 w-6 text-gray-400 mb-1' />
            <span className='text-xs text-gray-500 text-center'>Failed to load image</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={alt}
            className='h-full w-full object-cover'
            onLoad={handleLoad}
            onError={handleError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[800px] p-0 overflow-hidden bg-black/90'>
          <div className='relative h-full w-full'>
            <Button
              className='absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70'
              size='sm'
              variant='ghost'
              onClick={() => setIsDialogOpen(false)}
            >
              <X className='h-5 w-5' />
              <span className='sr-only'>Close</span>
            </Button>
            <img src={imageUrl} alt={alt} className='max-h-[80vh] object-contain mx-auto' />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
