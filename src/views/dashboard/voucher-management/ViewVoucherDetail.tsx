import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { voucherCreateSchema } from '@/schemas'
import { DiscountTypeEnum, VoucherEnum } from '@/types/enum'

import VoucherForm from './VoucherForm'

function ViewVoucherDetail() {
  const form = useForm<z.infer<typeof voucherCreateSchema>>({
    resolver: zodResolver(voucherCreateSchema),
    defaultValues: {
      name: '',
      code: '',
      type: VoucherEnum.NORMAL,
      discountType: DiscountTypeEnum.AMOUNT,
      discountValue: 0,
      maxDiscount: 0,
      minOrderValue: 0,
      amount: 0,
      description: '',
      // startTime: new Date(),
      // endTime: new Date()
      startTime: '',
      endTime: ''
    }
  })

  return (
    <div className='relative flex w-full flex-col md:pt-[unset]'>
      <div className='max-w-full mx-auto w-full flex-col justify-center md:w-full md:flex-row xl:w-full gap-8 flex'>
        <div className='w-full md:w-3/5 lg:w-3/4 flex flex-col gap-8'>
          <VoucherForm form={form} />
        </div>
        <div className='max-w-2xl mx-auto p-4 space-y-6'>
          <div>
            <h2 className='text-lg font-medium mb-4'>Tóm tắt điều kiện áp dụng mã</h2>

            <Card className='p-4 bg-primary/10 border-primary space-y-2'>
              <div className='space-y-2 text-sm'>
                <p>• Giảm --% - Không giới hạn số tiền tối đa</p>
                <p>• Hiện mã giảm giá trong [Trang Chi Tiết Sản Phẩm]</p>
                <p>• Thời gian hiệu lực: 13/12/2024 - 15:30 → --</p>
                <p>• Giá trị đơn hàng tối thiểu: -- đ</p>
                <p>
                  • Nhóm khách hàng áp dụng: <span className='text-primary'>Tất cả khách hàng</span>
                </p>
                <p>• Tổng số lượng mã giảm giá: --</p>
                <p>• Không giới hạn số lần sử dụng mỗi khách hàng</p>
                <p>
                  • Áp dụng cho: <span className='text-primary'>Tất cả sản phẩm</span>
                </p>
              </div>
            </Card>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Hiển thị mẫu trên ứng dụng Tiki</h3>

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
                        <span>Giảm --%</span>
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
