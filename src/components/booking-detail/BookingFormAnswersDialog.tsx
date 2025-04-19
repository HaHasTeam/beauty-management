'use client'

import { X, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { IBooking } from '@/types/booking'

import ImageWithFallback from '../image/ImageWithFallback'

interface BookingFormAnswersDialogProps {
  isOpen: boolean
  setOpen: () => void
  booking: IBooking
}

interface ImageData {
  name: string
  fileUrl: string
}

const BookingFormAnswersDialog: React.FC<BookingFormAnswersDialogProps> = ({ isOpen, setOpen, booking }) => {
  const { t } = useTranslation()
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

  // Check if booking form answers exist
  const hasBookingFormAnswers = booking?.bookingFormAnswer && booking.bookingFormAnswer.answers?.length > 0

  if (!hasBookingFormAnswers) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen()}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>{t('booking.bookingFormAnswers')}</DialogTitle>
          </DialogHeader>
          <div className='py-6 text-center text-muted-foreground'>{t('booking.noBookingFormAnswers')}</div>
        </DialogContent>
      </Dialog>
    )
  }

  const handleImageClick = (imageUrl: string) => {
    setEnlargedImage(imageUrl)
  }

  const closeEnlargedImage = () => {
    setEnlargedImage(null)
  }

  // Get the form questions
  const bookingForm = booking?.consultantService?.serviceBookingForm || { id: '', questions: [] }

  // Map questions by their text for easy lookup
  const questionMap = new Map()
  bookingForm.questions.forEach((q) => {
    questionMap.set(q.question, q)
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen()}>
      <DialogContent className='sm:max-w-[600px] h-[80vh] p-0 overflow-hidden'>
        <DialogHeader className='px-6 pt-6 pb-2'>
          <DialogTitle>{t('booking.bookingFormAnswers')}</DialogTitle>
        </DialogHeader>

        <div className='overflow-y-auto px-6 pb-6 h-[calc(80vh-80px)]'>
          <div className='space-y-6'>
            {booking.bookingFormAnswer.answers.map((answer, index) => {
              // Get the original question details if available
              const questionDetails = questionMap.get(answer.question)
              //   const questionType = questionDetails?.type || 'TEXT'

              return (
                <Card key={index} className='overflow-hidden'>
                  <CardContent className='p-4 space-y-3'>
                    <div className='font-medium'>{answer.question}</div>

                    {/* Question images (if any) */}
                    {questionDetails?.images && questionDetails.images.length > 0 && (
                      <div className='flex flex-wrap gap-2 mt-2'>
                        <div className='w-full text-sm text-muted-foreground mb-1'>{t('booking.questionImages')}:</div>
                        {questionDetails.images.map((image: ImageData, imgIndex: number) => (
                          <div
                            key={`question-img-${imgIndex}`}
                            className='relative aspect-square w-20 h-20 rounded-md overflow-hidden border cursor-pointer group'
                            onClick={() => handleImageClick(image.fileUrl)}
                          >
                            <ImageWithFallback
                              src={image.fileUrl || '/placeholder.svg'}
                              alt={image.name || `Question Image ${imgIndex + 1}`}
                              fallback={fallBackImage}
                              className='object-cover w-full h-full transition-transform duration-200 group-hover:scale-105'
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100'>
                              <ZoomIn className='text-white h-5 w-5 drop-shadow-md' />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answer content based on type */}
                    <div className='mt-4'>
                      <div className='text-sm text-muted-foreground mb-2'>{t('booking.answer')}:</div>

                      {/* Text answer */}
                      {answer.answers.text && (
                        <div className='text-sm bg-gray-50 p-3 rounded-md'>{answer.answers.text}</div>
                      )}

                      {/* Single/Multiple choice answer */}
                      {Object.keys(answer.answers).length > 0 && !answer.answers.text && (
                        <div className='flex flex-wrap gap-2'>
                          {Object.values(answer.answers).map((value, valueIndex) => (
                            <Badge key={valueIndex} variant='outline' className='px-2 py-1'>
                              {value}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* No answer provided */}
                      {Object.keys(answer.answers).length === 0 && (
                        <div className='text-sm text-muted-foreground italic'>{t('booking.noAnswerProvided')}</div>
                      )}
                    </div>

                    {/* Answer images */}
                    {answer.images && answer.images.length > 0 && (
                      <div className='mt-4'>
                        <div className='text-sm text-muted-foreground mb-2'>{t('booking.answerImages')}:</div>
                        <div className='grid grid-cols-3 gap-2'>
                          {answer.images.map((image: ImageData, imgIndex: number) => (
                            <div
                              key={`answer-img-${imgIndex}`}
                              className='relative aspect-square rounded-md overflow-hidden border cursor-pointer group'
                              onClick={() => handleImageClick(image.fileUrl)}
                            >
                              <ImageWithFallback
                                src={image.fileUrl || '/placeholder.svg'}
                                alt={image.name || `Image ${imgIndex + 1}`}
                                fallback={fallBackImage}
                                className='object-cover w-full h-full transition-transform duration-200 group-hover:scale-105'
                              />
                              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100'>
                                <ZoomIn className='text-white h-6 w-6 drop-shadow-md' />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
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

export default BookingFormAnswersDialog
