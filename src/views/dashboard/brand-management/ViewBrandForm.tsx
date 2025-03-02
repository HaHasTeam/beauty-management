import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, MoreVertical, Search, ShoppingCart, Store } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { z } from 'zod'

import Button from '@/components/button'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getBrandByIdApi } from '@/network/apis/brand'
import { brandCreateSchema } from '@/schemas'
import { createFiles } from '@/utils/files'

import BrandDetail from './BrandDetail'

function ViewBrandForm() {
  const { id } = useParams()
  const brandId = id ?? ''
  const { data: brandData, isLoading } = useQuery({
    queryKey: [getBrandByIdApi.queryKey, brandId as string],
    queryFn: getBrandByIdApi.fn,
    enabled: !!brandId,
    select: (data) => data.data
  })

  const form = useForm<z.infer<typeof brandCreateSchema>>({
    resolver: zodResolver(brandCreateSchema),
    defaultValues: {
      email: '',
      phone: '',
      address: '',
      description: '',
      document: [],
      logo: [],
      name: '',
      businessRegistrationAddress: '',
      businessTaxCode: '',
      district: '',
      businessRegistrationCode: '',
      province: '',
      ward: ''
    }
  })
  const imageLogo = form.watch('logo')?.[0]

  useEffect(() => {
    async function convertBrandData() {
      if (brandData && brandId) {
        const getFileUrl = (brandData.documents ?? []).map((item) => item.fileUrl)

        const brandImages = brandData.logo
          ? await createFiles([brandData?.logo, ...getFileUrl])
          : await createFiles(getFileUrl)
        const formatData = {
          id: brandId,
          name: brandData.name,
          email: brandData.email,
          address: brandData.address,
          description: brandData.description,
          phone: brandData.phone,
          logo: brandImages.length > 2 ? [brandImages[0]] : [],
          document: brandImages.length > 2 ? [brandImages[1]] : [brandImages[0]],
          province: brandData.province,
          district: brandData.district,
          ward: brandData.ward,
          businessTaxCode: brandData.businessTaxCode,
          businessRegistrationCode: brandData.businessRegistrationCode,
          establishmentDate: brandData.establishmentDate ? brandData.establishmentDate.toString() : '',
          businessRegistrationAddress: brandData.businessRegistrationAddress
        }
        form.reset(formatData)
      }
    }
    convertBrandData()
  }, [brandData, brandId, form])
  return (
    <>
      {isLoading && <LoadingContentLayer />}
      <div className='relative flex w-full flex-col md:pt-[unset]'>
        <div className='max-w-full mx-auto w-full flex-col justify-center md:w-full md:flex-row xl:w-full gap-8 flex'>
          <div className='w-full md:w-3/5 lg:w-3/4 flex flex-col gap-8'>
            <BrandDetail form={form} brandData={brandData} />
          </div>
          <div className='w-full md:w-2/5 lg:w-1/4 flex flex-col gap-8 border rounded-xl overflow-hidden h-fit '>
            <div className=' h-96 bg-gradient-to-b from-background to-primary/10 text-foreground max-h-md'>
              {/* Header */}
              <div className='px-4 py-3 flex items-center gap-2'>
                <Link to='#' className='text-foreground'>
                  <ChevronLeft className='h-6 w-6' />
                </Link>
                <div className='flex-1 relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    type='search'
                    placeholder='Tìm kiếm tại cửa hàng'
                    className='w-full pl-9 bg-muted border-0 text-foreground placeholder:text-muted-foreground'
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' size='icon' className='relative text-foreground'>
                    <ShoppingCart className='h-6 w-6' />
                    <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center'>
                      1
                    </span>
                  </Button>
                  <Button variant='ghost' size='icon' className='text-foreground'>
                    <MoreVertical className='h-6 w-6' />
                  </Button>
                </div>
              </div>

              {/* Profile Section */}
              <div className='px-4 py-4 flex items-start gap-3'>
                <div className='bg-primary  rounded-lg'>
                  {imageLogo ? (
                    <img
                      src={URL.createObjectURL(imageLogo)}
                      alt={form.getValues('name')}
                      className='h-16 w-16 object-cover rounded-lg border-2'
                    />
                  ) : (
                    <Store className='h-12 w-12 p-2 text-primary-foreground' />
                  )}
                </div>
                <div className='flex-1'>
                  <h1 className='text-foreground font-medium break-words w-32 line-clamp-2'>
                    {form.watch('name') || 'tên thương hiệu'}
                  </h1>
                  <p className='text-muted-foreground text-sm'>1K người theo dõi</p>
                </div>
                <div className='flex gap-2'>
                  <Button size='sm' variant='outline' className='border-primary text-primary hover:bg-primary/10'>
                    Chat
                  </Button>
                  <Button
                    size='sm'
                    variant='default'
                    className='bg-primary text-primary-foreground hover:bg-primary/90'
                  >
                    Theo dõi
                  </Button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <Tabs defaultValue='store' className='w-full'>
                <TabsList className='w-full justify-start bg-transparent border-b border-border h-auto p-0'>
                  <TabsTrigger
                    value='store'
                    className='flex-1 text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none bg-transparent h-10'
                  >
                    Cửa Hàng
                  </TabsTrigger>
                  <TabsTrigger
                    value='products'
                    className='flex-1 text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none bg-transparent h-10'
                  >
                    Sản Phẩm
                  </TabsTrigger>
                  <TabsTrigger
                    value='collections'
                    className='flex-1 text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none bg-transparent h-10'
                  >
                    Bộ Sưu Tập
                  </TabsTrigger>
                  <TabsTrigger
                    value='flash-sales'
                    className='flex-1 text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none bg-transparent h-10'
                  >
                    Giá Sốc H
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewBrandForm
