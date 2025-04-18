import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import { getVoucherByIdApi } from '@/network/apis/voucher'
import { getCreateVoucherSchema } from '@/schemas'
import { DiscountTypeEnum, StatusEnum, VoucherApplyTypeEnum, VoucherEnum } from '@/types/enum'

import VoucherForm from './VoucherForm'

function ViewVoucherDetail() {
  const { id } = useParams()
  const voucherId = id ?? ''

  const VoucherCreateSchema = getCreateVoucherSchema()

  const { data: voucherData } = useQuery({
    queryKey: [getVoucherByIdApi.queryKey, voucherId as string],
    queryFn: getVoucherByIdApi.fn,
    enabled: !!voucherId,
    select: (data) => data.data
  })
  const form = useForm<z.infer<typeof VoucherCreateSchema>>({
    resolver: zodResolver(VoucherCreateSchema),
    defaultValues: {
      orderValueType: 'noLimit',
      name: '',
      code: '',
      type: VoucherEnum.NORMAL,
      discountType: DiscountTypeEnum.AMOUNT,
      discountValue: undefined,
      maxDiscount: undefined,
      minOrderValue: undefined,
      amount: undefined,
      description: '',
      // startTime: new Date(),
      // endTime: new Date()
      startTime: '',
      endTime: '',
      status: StatusEnum.ACTIVE,
      visibility: false,
      selectedProducts: [],
      applyType: VoucherApplyTypeEnum.ALL
    }
  })
  const amountVoucher = form.watch('amount') || 0
  const discountValue = form.watch('discountValue') || 0

  const minOrderValue = form.watch('minOrderValue') || 0
  const startTime = form.watch('startTime') || new Date()
  const endTime = form.watch('endTime') || new Date()

  useEffect(() => {
    async function convertVoucherData() {
      if (voucherData && voucherId) {
        const formatData = {
          id: voucherId,
          name: voucherData.name,
          code: voucherData.code,
          type: voucherData.type == VoucherEnum.GROUP_BUYING ? VoucherEnum.GROUP_BUYING : VoucherEnum.NORMAL,
          discountType:
            voucherData.discountType == DiscountTypeEnum.AMOUNT ? DiscountTypeEnum.AMOUNT : DiscountTypeEnum.PERCENTAGE,
          discountValue: voucherData.discountValue,
          maxDiscount: voucherData.maxDiscount,
          minOrderValue: voucherData.minOrderValue,
          description: voucherData.description,
          // status: voucherData.status === StatusEnum.ACTIVE ? true : false,
          status: voucherData.status,
          amount: voucherData.amount,
          startTime: voucherData.startTime,
          endTime: voucherData.endTime,
          brand: voucherData.brand,
          applyType: voucherData.applyType,
          applyProductIds: voucherData.applyProducts ?? []
        }
        form.reset(formatData)
      }
    }
    convertVoucherData()
  }, [form, voucherData, voucherId])

  return (
    <div className='relative flex w-full flex-col md:pt-[unset]'>
      <div className='max-w-full mx-auto w-full flex-col justify-center md:w-full md:flex-row xl:w-full gap-8 flex'>
        <div className='w-full md:w-3/5 lg:w-3/4 flex flex-col gap-8'>
          <VoucherForm form={form} voucherData={voucherData} />
        </div>
        <div className='max-w-2xl mx-auto p-4 space-y-6'>
          <div>
            <h2 className='text-lg font-medium mb-4'>Tóm tắt điều kiện áp dụng mã</h2>

            <Card className='p-4 bg-primary/10 border-primary space-y-2'>
              <div className='space-y-2 text-sm'>
                <p>
                  • Giảm {discountValue}
                  {form.watch('discountType') == DiscountTypeEnum.AMOUNT ? '--đ' : '--%'}
                </p>
                <p>• Hiện mã giảm giá trong [Trang Chi Tiết Sản Phẩm]</p>
                <p>
                  • Thời gian hiệu lực:{' '}
                  {formatDate(startTime, {
                    hour: 'numeric',
                    minute: 'numeric'
                  })}{' '}
                  →{' '}
                  {formatDate(endTime, {
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </p>
                <p>• Giá trị đơn hàng tối thiểu: {minOrderValue > 0 ? minOrderValue : '--'} đ</p>
                {/* <p>
                  • Nhóm khách hàng áp dụng: <span className='text-primary'>Tất cả khách hàng</span>
                </p> */}
                <p>• Tổng số lượng mã giảm giá: {amountVoucher > 0 ? amountVoucher : '--'}</p>
                {/* <p>• Không giới hạn số lần sử dụng mỗi khách hàng</p> */}
                {/* <p>
                  • Áp dụng cho: <span className='text-primary'>Tất cả sản phẩm</span>
                </p> */}
              </div>
            </Card>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Hiển thị mẫu </h3>

            <Tabs defaultValue='product' className='w-full'>
              <TabsList className='grid w-full grid-cols-2 h-auto p-1'>
                <TabsTrigger value='product' className='data-[state=active]:bg-primary data-[state=active]:text-white'>
                  Trang chi tiết sản phẩm
                </TabsTrigger>
                <TabsTrigger value='store' className='data-[state=active]:bg-primary data-[state=active]:text-white'>
                  Trang gian hàng
                </TabsTrigger>
              </TabsList>
              <TabsContent value='product'>
                {' '}
                <Card className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg'>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-blue-600'
                      >
                        <path d='M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z' />
                        <path d='M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4' />
                        <path d='M21 6H3' />
                        <path d='M6 12h.01' />
                        <path d='M12 12h.01' />
                        <path d='M18 12h.01' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span>Giảm {form.watch('discountType') == DiscountTypeEnum.AMOUNT ? '--đ' : '--%'}</span>
                        <Info className='w-4 h-4 text-primary' />
                      </div>
                      <div className='text-sm text-gray-500'>Đơn từ 0K</div>
                    </div>
                    <Button variant='default' size='sm' className='text-white'>
                      Lưu
                    </Button>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value='store'>
                <Card className='bg-white shadow-sm'>
                  <div className='flex flex-col items-center p-4 space-y-4'>
                    <Button className='w-full bg-primary text-white'>Giảm --%</Button>
                    <div className='flex items-center gap-1 text-sm text-gray-600'>
                      Đơn từ 0K
                      <Info className='w-4 h-4' />
                    </div>
                    <Button variant='outline' className='w-full uppercase'>
                      Lưu
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewVoucherDetail
