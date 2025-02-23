import '@cyntler/react-doc-viewer/dist/index.css'

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import { Calendar, FileText, Mail, MapPin, Phone, X } from 'lucide-react'
import type * as React from 'react'

import CardSection from '@/components/card-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TBrand } from '@/types/brand'

interface ViewDetailsBrandsSheetProps extends React.ComponentPropsWithRef<typeof Dialog> {
  TBrand?: TBrand
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

export function ViewDetailsBrandsSheet({ TBrand, ...props }: ViewDetailsBrandsSheetProps) {
  if (!TBrand) {
    return null // Or you could return a placeholder or error message
  }

  const docs = TBrand.document ? [{ uri: TBrand.document }] : []
  const fileType = TBrand.document?.split('.').pop()?.toLowerCase()

  return (
    <Dialog {...props}>
      <DialogContent className='sm:max-w-[700px]  p-0'>
        <DialogHeader className='px-6 py-4 sticky top-0 bg-background z-10 flex flex-row items-center justify-between'>
          <DialogTitle>{'Brand Details'}</DialogTitle>
          <Button variant='ghost' size='icon'>
            <X className='h-4 w-4' />
          </Button>
        </DialogHeader>
        <ScrollArea className='max-h-[calc(90vh-80px)]'>
          <div className='flex flex-col gap-6 p-6'>
            <CardSection
              title={TBrand.name}
              description={TBrand.description ?? 'No description available'}
              rightComponent={
                <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
                  <AvatarImage src={TBrand.logo ?? ''} />
                  <AvatarFallback>{TBrand.name?.[0] ?? 'B'}</AvatarFallback>
                </Avatar>
              }
            >
              <div className='grid grid-cols-1 gap-2'>
                <Badge variant={TBrand.status === 'PENDING' ? 'secondary' : 'default'} className='w-fit'>
                  {TBrand.status ?? 'UNKNOWN'}
                </Badge>
                <InfoItem icon={<Mail className='w-5 h-5 text-primary' />} label='Email' value={TBrand.email} />
                <InfoItem icon={<Phone className='w-5 h-5 text-primary' />} label='Phone' value={TBrand.phone} />
                <InfoItem icon={<MapPin className='w-5 h-5 text-primary' />} label='Address' value={TBrand.address} />
              </div>
            </CardSection>

            <CardSection title='Business Information'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <InfoItem
                  icon={<FileText className='w-5 h-5 text-primary' />}
                  label='Tax Code'
                  value={TBrand.businessTaxCode}
                />
                <InfoItem
                  icon={<FileText className='w-5 h-5 text-primary' />}
                  label='Registration Code'
                  value={TBrand.businessRegistrationCode}
                />
                <InfoItem
                  icon={<Calendar className='w-5 h-5 text-primary' />}
                  label='Established'
                  value={TBrand.establishmentDate ? new Date(TBrand.establishmentDate).toLocaleDateString() : undefined}
                />
                <InfoItem icon={<MapPin className='w-5 h-5 text-primary' />} label='Province' value={TBrand.province} />
                <InfoItem icon={<MapPin className='w-5 h-5 text-primary' />} label='District' value={TBrand.district} />
                <InfoItem icon={<MapPin className='w-5 h-5 text-primary' />} label='Ward' value={TBrand.ward} />
                <InfoItem
                  icon={<MapPin className='w-5 h-5 text-primary' />}
                  label='Registration Address'
                  value={TBrand.businessRegistrationAddress}
                />
              </div>
            </CardSection>

            <CardSection title='Timestamps'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <InfoItem
                  icon={<Calendar className='w-5 h-5 text-primary' />}
                  label='Created At'
                  value={TBrand.createdAt ? new Date(TBrand.createdAt).toLocaleString() : undefined}
                />
                <InfoItem
                  icon={<Calendar className='w-5 h-5 text-primary' />}
                  label='Updated At'
                  value={TBrand.updatedAt ? new Date(TBrand.updatedAt).toLocaleString() : undefined}
                />
              </div>
            </CardSection>

            {TBrand.document && (fileType === 'pdf' || fileType === 'docx') && (
              <CardSection title={`Attached Document (${fileType?.toUpperCase() ?? 'Unknown Type'})`}>
                <div className='w-full h-[400px]  border rounded'>
                  <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
                </div>
              </CardSection>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
