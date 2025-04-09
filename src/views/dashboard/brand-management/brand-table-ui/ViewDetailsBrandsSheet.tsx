import { useQuery } from '@tanstack/react-query'
import { Calendar, Download, FileText, Mail, MapPin, Phone, Star, X } from 'lucide-react'
import type * as React from 'react'

import CardSection from '@/components/card-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { getBrandByIdApi } from '@/network/apis/brand'

interface ViewDetailsBrandsSheetProps extends React.ComponentPropsWithRef<typeof Dialog> {
  brandId?: string
  onOpenChange?: (open: boolean) => void
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value?: string | number }> = ({
  icon,
  label,
  value
}) => (
  <div className='flex items-center gap-2'>
    {icon}
    <span className='font-semibold'>{label}:</span> {value ?? 'N/A'}
  </div>
)

const LoadingSkeleton = () => (
  <div className='flex flex-col gap-6 p-6'>
    <div className='space-y-3'>
      <Skeleton className='h-8 w-1/3' />
      <Skeleton className='h-4 w-2/3' />
      <div className='grid grid-cols-1 gap-2 mt-4'>
        <Skeleton className='h-4 w-1/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/2' />
      </div>
    </div>

    <div className='space-y-3'>
      <Skeleton className='h-6 w-1/4' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </div>

    <div className='space-y-3'>
      <Skeleton className='h-6 w-1/4' />
      <Skeleton className='h-[400px] w-full' />
    </div>
  </div>
)

export function ViewDetailsBrandsSheet({ brandId, onOpenChange, ...props }: ViewDetailsBrandsSheetProps) {
  const handleDownloadAll = () => {
    if (!brand?.documents || brand.documents.length === 0) return

    // Create a message to show download progress
    const downloadMessage = document.createElement('div')
    downloadMessage.className =
      'fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-md shadow-lg z-50'
    downloadMessage.textContent = `Downloading ${brand.documents.length} documents...`
    document.body.appendChild(downloadMessage)

    // Download each document
    brand.documents.forEach((doc, index) => {
      setTimeout(() => {
        const fileName = doc.fileUrl.split('/').pop() || `document-${index + 1}`
        const link = document.createElement('a')
        link.href = doc.fileUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Update message when all downloads are initiated
        if (index === brand.documents.length - 1) {
          downloadMessage.textContent = 'All downloads initiated!'
          setTimeout(() => {
            document.body.removeChild(downloadMessage)
          }, 3000)
        }
      }, index * 1000) // Stagger downloads by 1 second
    })
  }

  const { data: brand, isLoading } = useQuery({
    queryKey: [getBrandByIdApi.queryKey, brandId ?? ''],
    queryFn: getBrandByIdApi.fn,
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
    select(data) {
      return data.data
    }
  })

  const handleDownload = (documentUrl: string) => {
    const fileName = documentUrl.split('/').pop() || 'document'
    const link = document.createElement('a')
    link.href = documentUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px] p-0'>
        <DialogHeader className='px-6 py-4 sticky top-0 bg-background z-10 flex flex-row items-center justify-between'>
          <DialogTitle>{'Brand Details'}</DialogTitle>
          <Button variant='ghost' size='icon' onClick={() => onOpenChange?.(false)}>
            <X className='h-4 w-4' />
          </Button>
        </DialogHeader>
        <ScrollArea className='max-h-[calc(90vh-80px)]'>
          {isLoading ? (
            <LoadingSkeleton />
          ) : !brand ? (
            <div className='p-6 text-center'>
              <p>Brand not found or failed to load.</p>
              <Button variant='outline' className='mt-4' onClick={() => onOpenChange?.(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className='flex flex-col gap-6 p-6'>
              <CardSection
                title={brand.name}
                description={brand.description ?? 'No description available'}
                rightComponent={
                  <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
                    <AvatarImage src={brand.logo ?? ''} />
                    <AvatarFallback>{brand.name?.[0] ?? 'B'}</AvatarFallback>
                  </Avatar>
                }
              >
                <div className='grid grid-cols-1 gap-2'>
                  <Badge variant='default' className='w-fit'>
                    {brand.status ?? 'UNKNOWN'}
                  </Badge>
                  <InfoItem icon={<Mail className='w-5 h-5 text-primary' />} label='Email' value={brand.email} />
                  <InfoItem icon={<Phone className='w-5 h-5 text-primary' />} label='Phone' value={brand.phone} />
                  <InfoItem icon={<MapPin className='w-5 h-5 text-primary' />} label='Address' value={brand.address} />
                  <InfoItem icon={<Star className='w-5 h-5 text-primary' />} label='Rating' value={brand.star} />
                </div>
              </CardSection>

              <CardSection title='Business Information'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <InfoItem
                    icon={<FileText className='w-5 h-5 text-primary' />}
                    label='Tax Code'
                    value={brand.businessTaxCode}
                  />
                  <InfoItem
                    icon={<FileText className='w-5 h-5 text-primary' />}
                    label='Registration Code'
                    value={brand.businessRegistrationCode}
                  />
                  <InfoItem
                    icon={<Calendar className='w-5 h-5 text-primary' />}
                    label='Established'
                    value={new Date(brand.establishmentDate).toLocaleDateString()}
                  />
                  <InfoItem
                    icon={<MapPin className='w-5 h-5 text-primary' />}
                    label='Province'
                    value={brand.province}
                  />
                  <InfoItem
                    icon={<MapPin className='w-5 h-5 text-primary' />}
                    label='District'
                    value={brand.district}
                  />
                  <InfoItem icon={<MapPin className='w-5 h-5 text-primary' />} label='Ward' value={brand.ward} />
                  <InfoItem
                    icon={<MapPin className='w-5 h-5 text-primary' />}
                    label='Registration Address'
                    value={brand.businessRegistrationAddress}
                  />
                </div>
              </CardSection>

              {brand.documents && brand.documents.length > 0 && (
                <CardSection
                  title='Attached Documents'
                  rightComponent={
                    <Button variant='default' size='sm' className='flex items-center gap-1' onClick={handleDownloadAll}>
                      <Download className='h-4 w-4' />
                      Download All Documents
                    </Button>
                  }
                >
                  <div className='w-full border rounded p-4 space-y-2'>
                    {brand.documents.map((doc, index) => (
                      <div
                        key={doc.id}
                        className='flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors'
                      >
                        <div className='flex items-center gap-2'>
                          <FileText className='h-5 w-5 text-primary' />
                          <span>Document {index + 1}</span>
                          {doc.name && <span className='text-muted-foreground'>({doc.name})</span>}
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='flex items-center gap-1'
                          onClick={() => handleDownload(doc.fileUrl)}
                        >
                          <Download className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardSection>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
