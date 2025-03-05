'use client'

import '@cyntler/react-doc-viewer/dist/index.css'

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Download, FileText, Mail, MapPin, Phone, Star, X } from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'

import CardSection from '@/components/card-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0)

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
                    <div className='flex items-center gap-2'>
                      <Select
                        value={selectedDocumentIndex.toString()}
                        onValueChange={(value) => setSelectedDocumentIndex(Number.parseInt(value))}
                      >
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Select a document' />
                        </SelectTrigger>
                        <SelectContent>
                          {brand.documents.map((doc, index) => (
                            <SelectItem key={doc.id} value={index.toString()}>
                              Document {index + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex items-center gap-1'
                        onClick={() =>
                          brand.documents && handleDownload(brand.documents[selectedDocumentIndex].fileUrl)
                        }
                      >
                        <Download className='h-4 w-4' />
                        Download
                      </Button>
                    </div>
                  }
                >
                  <div className='w-full h-[400px] border rounded'>
                    <DocViewer
                      documents={[{ uri: brand.documents[selectedDocumentIndex].fileUrl }]}
                      pluginRenderers={DocViewerRenderers}
                    />
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
