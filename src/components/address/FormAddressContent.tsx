import { useQuery } from '@tanstack/react-query'
import {} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCommune, getDistrict, getProvince } from '@/network/apis/address'
import { CreateAddressBrandSchema } from '@/schemas'

import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'

interface FormAddressContentProps {
  form: UseFormReturn<z.infer<typeof CreateAddressBrandSchema>>
}
export default function FormAddressContent({ form }: FormAddressContentProps) {
  const { t } = useTranslation()
  const { data: listProvinceData } = useQuery({
    queryKey: [getProvince.queryKey],
    queryFn: getProvince.fn,
    select(data) {
      return data.data
    }
  })
  const { data: listCommuneData } = useQuery({
    queryKey: [getCommune.queryKey],
    queryFn: getCommune.fn,
    select(data) {
      return data.data
    }
  })
  const { data: listDistrictData } = useQuery({
    queryKey: [getDistrict.queryKey],
    queryFn: getDistrict.fn,
    select(data) {
      return data.data
    }
  })
  // eslint-disable-next-line no-console
  console.log('dataa', listDistrictData, listCommuneData, listProvinceData)

  return (
    <div className='w-full py-2'>
      <div className='space-y-6'>
        <div className='grid gap-4'>
          <FormField
            control={form.control}
            name='province'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex gap-2'>
                  <div className='w-1/5 flex items-center'>
                    <Label htmlFor='province' required>
                      {t('address.provinceOrCity')}
                    </Label>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <Select onValueChange={(value) => field?.onChange(value)} value={field?.value || ''}>
                        <SelectTrigger>
                          <SelectValue {...field} placeholder={t('address.chooseProvinceOrCity')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='hcm'>Hồ Chí Minh</SelectItem>
                          <SelectItem value='hn'>HN</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='district'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex gap-2'>
                  <div className='w-1/5 flex items-center'>
                    <Label htmlFor='district' required>
                      {t('address.district')}
                    </Label>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field?.onChange(value)
                        }}
                        value={field?.value || ''}
                      >
                        <SelectTrigger>
                          <SelectValue {...field} placeholder={t('address.chooseDistrict')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='hcm'>Thu Duc</SelectItem>
                          <SelectItem value='hn'>Q1</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='ward'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex gap-2'>
                  <div className='w-1/5 flex items-center'>
                    <Label htmlFor='ward' required>
                      {t('address.ward')}
                    </Label>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <Select onValueChange={(value) => field?.onChange(value)} value={field?.value || ''}>
                        <SelectTrigger>
                          <SelectValue {...field} placeholder={t('address.chooseWard')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='hcm'>Truong Thanh</SelectItem>
                          <SelectItem value='hn'>My Tho</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='detailAddress'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex items-start gap-2'>
                  <div className='w-1/5 flex items-center'>
                    <Label htmlFor='detailAddress'>{t('address.detailAddress')}</Label>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <Textarea
                        id='detailAddress'
                        placeholder={t('address.enterDetailAddress')}
                        className='border-primary/40'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
