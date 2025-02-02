import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useHandleAddressMock } from '@/hooks/useHandleAddressMock'
import { CreateAddressBrandSchema } from '@/schemas'

import LoadingContentLayer from '../loading-icon/LoadingContentLayer'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'

interface FormAddressContentProps {
  // provinceData?: TAddressProvinceMock[]
  // districtData?: TAddressDistrictMock[]
  // communeData?: TAddressCommuneMock[]
  form: UseFormReturn<z.infer<typeof CreateAddressBrandSchema>>
}
export default function FormAddressContent({ form }: FormAddressContentProps) {
  const { t } = useTranslation()
  const { communeData, districtData, provinceData, communeQuery, districtQuery, provinceQuery } = useHandleAddressMock({
    districtId: form.watch('district'),
    provinceId: form.watch('province')
  })

  return (
    <div className='w-full py-2'>
      {districtQuery.isLoading || communeQuery.isLoading || (provinceQuery.isLoading && <LoadingContentLayer />)}
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
                      <Select
                        onValueChange={(value) => {
                          form.setValue('district', '')
                          form.setValue('ward', '')
                          field?.onChange(value)
                        }}
                        value={field?.value || ''}
                      >
                        <SelectTrigger>
                          <SelectValue {...field} placeholder={t('address.chooseProvinceOrCity')} />
                        </SelectTrigger>
                        <SelectContent>
                          {provinceData?.map((el) => {
                            return (
                              <SelectItem value={el.idProvince} key={el.idProvince}>
                                {el.name}
                              </SelectItem>
                            )
                          })}
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
                          form.setValue('ward', '')
                          field?.onChange(value)
                        }}
                        value={field?.value || ''}
                      >
                        <SelectTrigger>
                          <SelectValue {...field} placeholder={t('address.chooseDistrict')} />
                        </SelectTrigger>
                        <SelectContent>
                          {districtData?.map((el) => {
                            return (
                              <SelectItem value={el.idDistrict} key={el.idDistrict}>
                                {el.name}
                              </SelectItem>
                            )
                          })}
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
                          {communeData?.map((el) => {
                            return (
                              <SelectItem value={el.idCommune} key={el.idCommune}>
                                {el.name}
                              </SelectItem>
                            )
                          })}
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
