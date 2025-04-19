'use client'
import { X, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { IBooking } from '@/types/booking'

interface ConsultationResultInfoDialogProps {
  isOpen: boolean
  onClose: () => void
  booking: IBooking
}

export default function ConsultationResultInfoDialog({ isOpen, onClose, booking }: ConsultationResultInfoDialogProps) {
  const { t } = useTranslation()
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

  if (!booking.consultationResult) return null

  const handleImageClick = (imageUrl: string) => {
    setEnlargedImage(imageUrl)
  }

  const closeEnlargedImage = () => {
    setEnlargedImage(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[600px] h-[80vh] p-0 overflow-hidden'>
        <DialogHeader className='px-6 pt-6 pb-2'>
          <DialogTitle>{t('booking.consultationResultInfo')}</DialogTitle>
        </DialogHeader>

        {/* Use a div with overflow-auto instead of ScrollArea for more reliable scrolling */}
        <div className='overflow-y-auto px-6 pb-6 h-[calc(80vh-80px)]'>
          <div className='space-y-6'>
            {booking.consultationResult.results.map((result, index) => (
              <div key={index} className='space-y-2'>
                <h3 className='font-semibold text-lg'>{result.section}</h3>
                <p className='text-sm text-gray-700 whitespace-pre-line'>{result.answers}</p>
                {result.images && result.images.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2'>
                    {result.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className='group relative aspect-square rounded-md overflow-hidden border border-gray-200 cursor-pointer'
                        onClick={() => handleImageClick(image.fileUrl || '/placeholder.svg')}
                      >
                        <img
                          src={image.fileUrl || '/placeholder.svg'}
                          alt={image.name || `Image ${imgIndex + 1}`}
                          className='object-cover w-full h-full transition-transform duration-200 group-hover:scale-105'
                        />
                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100'>
                          <ZoomIn className='text-white h-6 w-6 drop-shadow-md' />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {booking.consultationResult.suggestedProductClassifications &&
              booking.consultationResult.suggestedProductClassifications.length > 0 && (
                <div className='space-y-2'>
                  <h3 className='font-semibold text-lg'>{t('booking.suggestedProducts')}</h3>
                  <ul className='list-disc pl-5 space-y-1'>
                    {booking.consultationResult.suggestedProductClassifications.map((product, index) => (
                      <li key={index} className='text-sm text-gray-700'>
                        {product.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>

        {/* Image Lightbox */}
        {enlargedImage && (
          <div
            className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'
            onClick={closeEnlargedImage}
          >
            <Button
              variant='outline'
              size='icon'
              className='absolute top-4 right-4 bg-white/10 hover:bg-white/20 border-none text-white'
              onClick={(e) => {
                e.stopPropagation()
                closeEnlargedImage()
              }}
            >
              <X className='h-6 w-6' />
              <span className='sr-only'>Close</span>
            </Button>
            <div className='max-w-4xl max-h-[90vh] relative' onClick={(e) => e.stopPropagation()}>
              <img
                src={enlargedImage || '/placeholder.svg'}
                alt='Enlarged view'
                className='max-w-full max-h-[90vh] object-contain'
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
