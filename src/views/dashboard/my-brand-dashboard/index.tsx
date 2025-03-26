import { AlertCircle, Building, Calendar, FileCheck, FileText, Mail, MapPin, Phone } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'

// This would typically come from an API call
const brandData = {
  id: '02fda8f0-1cc8-4c91-b61d-e2fcc9560977',
  createdAt: '2025-03-24T03:16:01.422Z',
  updatedAt: '2025-03-25T10:31:12.610Z',
  name: 'FaceReco',
  logo: 'https://storage.googleapis.com/dev-storage-c9d70.appspot.com/1742786159911.png',
  description: 'xin chao',
  email: 'facereco@gmail.com',
  phone: '+84348485167',
  address: 'k3/21/x, Phường Ngọc Sơn, Quận Kiến An, Thành phố Hải Phòng',
  businessTaxCode: '312313213123123',
  businessRegistrationCode: '231312q3123',
  establishmentDate: '2018-03-06',
  province: 'Thành phố Hải Phòng',
  district: 'Quận Kiến An',
  ward: 'Phường Ngọc Sơn',
  businessRegistrationAddress: 'Biên hòa',
  currentUpdateProfileTime: 1,
  status: 'NEED_ADDITIONAL_DOCUMENTS',
  documents: [
    {
      id: '4cd348d0-67d5-47f5-a32a-31eb349d79c0',
      createdAt: '2025-03-24T03:16:01.422Z',
      updatedAt: '2025-03-24T03:16:01.422Z',
      name: null,
      fileUrl: 'https://storage.googleapis.com/dev-storage-c9d70.appspot.com/1742786159921.docx',
      type: 'BRAND_DOCUMENT',
      status: 'ACTIVE'
    }
  ],
  reviewer: {
    id: 'd2f96ceb-15ff-458f-80e1-89928eb66891',
    createdAt: '2025-03-20T06:17:02.968Z',
    updatedAt: '2025-03-20T06:17:02.968Z',
    firstName: 'operator',
    lastName: '02',
    username: 'oprator02',
    avatar: null,
    email: 'operator2@gmail.com',
    isEmailVerify: true,
    password: '$2b$08$BZ4JYDyXKRvgOicobEyB4uMOpv/IfV7HNRVWgRx7q/wpTv42LstXS',
    gender: null,
    phone: null,
    dob: null,
    status: 'ACTIVE',
    yoe: null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800'
    case 'NEED_ADDITIONAL_DOCUMENTS':
      return 'bg-amber-100 text-amber-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    case 'PENDING':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function BrandDashboard() {
  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg'>
        <div className='flex items-center gap-4'>
          <div className='relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-md'>
            <img
              src={brandData.logo || '/placeholder.svg'}
              alt={`${brandData.name} logo`}
              className='absolute inset-0 w-full h-full object-cover'
            />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>{brandData.name}</h1>
            <p className='text-muted-foreground'>{brandData.description}</p>
            <p className='text-xs text-muted-foreground mt-1'>ID: {brandData.id.substring(0, 8)}</p>
          </div>
        </div>
        <div className='flex flex-col items-end gap-2'>
          <Badge className={`${getStatusColor(brandData.status)} px-3 py-1 text-xs font-medium`}>
            {brandData.status.replace(/_/g, ' ')}
          </Badge>
          <p className='text-xs text-muted-foreground'>Last updated: {formatDate(brandData.updatedAt)}</p>
        </div>
      </div>

      <Tabs defaultValue='overview' className='mb-8'>
        <TabsList className='mb-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='documents'>Documents</TabsTrigger>
          <TabsTrigger value='business'>Business Details</TabsTrigger>
        </TabsList>

        <TabsContent value='overview'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card>
              <CardHeader className='bg-primary/5 pb-2'>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your brand and products</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-3 pt-4'>
                <Button asChild className='w-full'>
                  <a href='/dashboard/update'>Update Brand Information</a>
                </Button>
                <Button asChild className='w-full'>
                  <a href='/dashboard/documents/update'>Update Documents</a>
                </Button>
                <Button asChild className='w-full'>
                  <a href='/dashboard/products/create'>Create Product</a>
                </Button>
                <Button asChild className='w-full'>
                  <a href='/dashboard/vouchers/create'>Create Voucher</a>
                </Button>
              </CardContent>
            </Card>

            <Card className='md:col-span-2'>
              <CardHeader className='bg-primary/5 pb-2'>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>Last updated on {formatDate(brandData.updatedAt)}</CardDescription>
              </CardHeader>
              <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Mail className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Email</p>
                    <p className='text-sm text-muted-foreground'>{brandData.email}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Phone className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Phone</p>
                    <p className='text-sm text-muted-foreground'>{brandData.phone}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <MapPin className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Address</p>
                    <p className='text-sm text-muted-foreground'>{brandData.address}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Calendar className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Establishment Date</p>
                    <p className='text-sm text-muted-foreground'>{formatDate(brandData.establishmentDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className='mt-6'>
            <CardHeader className='bg-primary/5 pb-2'>
              <CardTitle>Reviewer Information</CardTitle>
              <CardDescription>Your brand reviewer details</CardDescription>
            </CardHeader>
            <CardContent className='pt-4'>
              <div className='flex items-center gap-4'>
                <div className='h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shadow-sm'>
                  {brandData.reviewer.avatar ? (
                    <img
                      src={brandData.reviewer.avatar || '/placeholder.svg'}
                      alt={`${brandData.reviewer.firstName} ${brandData.reviewer.lastName}`}
                      className='w-full h-full rounded-full object-cover'
                    />
                  ) : (
                    <span className='text-xl font-medium text-primary'>
                      {brandData.reviewer.firstName.charAt(0)}
                      {brandData.reviewer.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className='font-medium text-lg'>
                    {brandData.reviewer.firstName} {brandData.reviewer.lastName}
                  </p>
                  <p className='text-sm text-muted-foreground'>{brandData.reviewer.email}</p>
                  <Badge variant='outline' className='mt-1'>
                    Reviewer
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='documents'>
          <Card>
            <CardHeader className='bg-primary/5 pb-2'>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Uploaded brand documents</CardDescription>
            </CardHeader>
            <CardContent className='pt-4'>
              {brandData.documents.length > 0 ? (
                <div className='space-y-3'>
                  {brandData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className='flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 p-2 rounded-full'>
                          <FileText className='h-5 w-5 text-primary' />
                        </div>
                        <div>
                          <p className='text-sm font-medium'>{doc.name || doc.type.replace(/_/g, ' ')}</p>
                          <p className='text-xs text-muted-foreground'>Uploaded on {formatDate(doc.createdAt)}</p>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' asChild>
                          <a href={doc.fileUrl} target='_blank' rel='noopener noreferrer'>
                            View
                          </a>
                        </Button>
                        <Button variant='outline' size='sm' asChild>
                          <a href={`/dashboard/documents/update/${doc.id}`}>Update</a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-10 text-center bg-muted/20 rounded-lg'>
                  <FileText className='h-12 w-12 text-muted-foreground mb-3' />
                  <p className='text-muted-foreground'>No documents uploaded</p>
                  <Button className='mt-4' asChild>
                    <a href='/dashboard/documents/upload'>Upload Documents</a>
                  </Button>
                </div>
              )}

              {brandData.status === 'NEED_ADDITIONAL_DOCUMENTS' && (
                <div className='mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3'>
                  <AlertCircle className='h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-sm font-medium text-amber-800'>Additional documents required</p>
                    <p className='text-sm text-amber-700 mt-1'>
                      Please upload the required documents to complete your brand verification.
                    </p>
                    <Button size='sm' className='mt-3' asChild>
                      <a href='/dashboard/documents/upload'>Upload Documents</a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='business'>
          <Card>
            <CardHeader className='bg-primary/5 pb-2'>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>Your business registration information</CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Building className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Business Tax Code</p>
                    <p className='text-sm text-muted-foreground'>{brandData.businessTaxCode}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <FileCheck className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Business Registration Code</p>
                    <p className='text-sm text-muted-foreground'>{brandData.businessRegistrationCode}</p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <MapPin className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Business Registration Address</p>
                    <p className='text-sm text-muted-foreground'>{brandData.businessRegistrationAddress}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <MapPin className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Location</p>
                    <p className='text-sm text-muted-foreground'>
                      {brandData.ward}, {brandData.district}, {brandData.province}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
