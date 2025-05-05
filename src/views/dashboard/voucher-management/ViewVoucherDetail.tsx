import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

import { OrderStatisticsWidget } from '@/components/ui/transaction-statics/order/OrderStatisticsWidget'
import { getVoucherByIdApi } from '@/network/apis/voucher'
import { getCreateVoucherSchema } from '@/schemas'
import { DiscountTypeEnum, StatusEnum, VoucherApplyTypeEnum, VoucherEnum, VoucherVisibilityEnum } from '@/types/enum'

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
          orderValueType: voucherData.minOrderValue !== null ? 'limited' : ('noLimit' as 'limited' | 'noLimit'),
          // status: voucherData.status === StatusEnum.ACTIVE ? true : false,
          status: voucherData.status,
          amount: voucherData.amount,
          startTime: voucherData.startTime,
          endTime: voucherData.endTime,
          brand: voucherData.brand,
          applyType: voucherData.applyType,
          applyProductIds: voucherData.applyProducts?.map((product) => product.id) ?? [],
          selectedProducts: voucherData.applyProducts?.map((product) => product.id) ?? [],
          visibility: voucherData.visibility === VoucherVisibilityEnum.PUBLIC ? true : false
        }
        form.reset(formatData)
      }
    }
    convertVoucherData()
  }, [form, voucherData, voucherId])

  return (
    <div className='relative flex w-full flex-col md:pt-[unset]'>
      <div className='max-w-full mx-auto w-full flex-col justify-center md:w-full md:flex-row-reverse xl:w-full gap-8 flex'>
        <div className='w-full md:w-2/5 lg:w-4/12 flex flex-col gap-8'>
          {!!voucherId && (
            <div>
              <OrderStatisticsWidget
                voucherId={voucherId}
                header={<h1 className='text-2xl font-bold w-fit'>Voucher Statistics</h1>}
              />
            </div>
          )}
        </div>
        <div className='w-full md:w-3/5 lg:w-8/12 flex flex-col gap-8'>
          <VoucherForm form={form} voucherData={voucherData} />
        </div>
      </div>
    </div>
  )
}

export default ViewVoucherDetail
