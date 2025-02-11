import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getDistrictsByProvinceApi, getProvincesApi, getWardsByDistrictApi } from '@/network/apis/address'
import CreateAddressSchema from '@/schemas/address.schema'
import { IDistrict, IProvince, IWard } from '@/types/address'
import { AddressEnum } from '@/types/enum'

import LoadingIcon from '../loading-icon'
import { PhoneInputWithCountries } from '../phone-input'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { ScrollArea } from '../ui/scroll-area'
import { Textarea } from '../ui/textarea'

interface FormAddressContentProps {
  form: UseFormReturn<z.infer<typeof CreateAddressSchema>>
  initialAddress?: {
    province?: string
    district?: string
    ward?: string
  }
}
export default function FormAddressContent({ form, initialAddress }: FormAddressContentProps) {
  const { t } = useTranslation()
  // const [provinces, setProvinces] = useState<IProvince[]>([])
  const [provinceCode, setProvinceCode] = useState<string>('')
  const [districtCode, setDistrictCode] = useState<string>('')

  const { data: provinces } = useQuery({
    queryKey: [getProvincesApi.queryKey],
    queryFn: getProvincesApi.fn
  })

  const { data: province, isLoading: isDistrictsLoading } = useQuery({
    queryKey: [getDistrictsByProvinceApi.queryKey, provinceCode as string],
    queryFn: getDistrictsByProvinceApi.fn,
    enabled: !!provinceCode // Only fetch when provinceCode is available
  })

  const { data: district, isLoading: isWardsLoading } = useQuery({
    queryKey: [getWardsByDistrictApi.queryKey, districtCode as string],
    queryFn: getWardsByDistrictApi.fn,
    enabled: !!districtCode // Only fetch when districtCode is available
  })

  const handleProvinceChange = (provinceCode: string) => {
    setProvinceCode(provinceCode)
    form.resetField('district')
    form.resetField('ward')
  }

  const handleDistrictChange = (districtCode: string) => {
    setDistrictCode(districtCode)
    form.resetField('ward')
  }

  useEffect(() => {
    if (provinces && initialAddress?.province) {
      const selectedProvince = provinces.find((p) => p.name === initialAddress.province)
      if (selectedProvince) {
        setProvinceCode(selectedProvince.code)
      }
    }
  }, [provinces, initialAddress?.province])
  useEffect(() => {
    if (province?.districts && initialAddress?.district) {
      const selectedDistrict = province.districts.find((d) => d.name === initialAddress.district)
      if (selectedDistrict) {
        setDistrictCode(selectedDistrict.code)
      }
    }
  }, [province?.districts, initialAddress?.district])
  return (
    <div className='w-full py-2'>
      <div className='space-y-6'>
        <div className='grid gap-4'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex gap-2'>
                  <div className='w-1/5 flex items-center'>
                    <Label htmlFor='fullName' required className='w-fit'>
                      {t('address.fullName')}
                    </Label>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <Input
                        id='fullName'
                        placeholder={t('address.enterFullName')}
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

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex items-center gap-2'>
                  <div className='w-1/5 flex items-center'>
                    <Label htmlFor='phone' required>
                      {t('address.phone')}
                    </Label>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <PhoneInputWithCountries {...field} isShowCountry={false} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

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
                          const selectedProvince = provinces?.find((p) => p.name === value)
                          field.onChange(value)
                          handleProvinceChange(selectedProvince?.code ?? '')
                        }}
                        value={field.value ?? ''}
                      >
                        <SelectTrigger className='border-primary/40'>
                          <SelectValue
                            className='border-primary/40'
                            {...field}
                            placeholder={t('address.chooseProvinceOrCity')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className='h-72 pr-2'>
                            <SelectGroup>
                              {provinces?.map((province: IProvince) => (
                                <SelectItem key={province.code} value={province.name}>
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </ScrollArea>
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
                  <div className='w-full space-y-1 relative'>
                    <FormControl>
                      <div>
                        {isDistrictsLoading && (
                          <div className='z-20 absolute justify-center items-center w-full flex'>
                            <LoadingIcon size='small' color='primaryBackground' />
                          </div>
                        )}
                        <Select
                          onValueChange={(value) => {
                            const selectedDistrict = province?.districts?.find((p) => p.name === value)
                            field.onChange(value)
                            handleDistrictChange(selectedDistrict?.code ?? '')
                          }}
                          value={field?.value || ''}
                          disabled={!form.watch('province') || isDistrictsLoading}
                        >
                          <SelectTrigger className='border-primary/40'>
                            <SelectValue {...field} placeholder={t('address.chooseDistrict')} />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className='h-72 pr-2'>
                              {province?.districts.map((district: IDistrict) => (
                                <SelectItem key={district.code} value={district.name}>
                                  {district.name}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      </div>
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
                  <div className='w-full space-y-1 relative'>
                    <FormControl>
                      <div>
                        {isWardsLoading && (
                          <div className='z-20 absolute justify-center items-center w-full flex'>
                            <LoadingIcon size='small' color='primaryBackground' />
                          </div>
                        )}
                        <Select
                          onValueChange={(value) => field?.onChange(value)}
                          value={field?.value || ''}
                          disabled={!form.watch('district') || isWardsLoading}
                        >
                          <SelectTrigger className='border-primary/40'>
                            <SelectValue {...field} placeholder={t('address.chooseWard')} />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className='h-72 pr-2'>
                              {district?.wards?.map((ward: IWard) => (
                                <SelectItem key={ward.code} value={ward.name.toString()}>
                                  {ward.name}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      </div>
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
                    <Label required htmlFor='detailAddress'>
                      {t('address.detailAddress')}
                    </Label>
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
          <FormField
            control={form.control}
            name='notes'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex items-start gap-2'>
                  <div className='w-1/5 flex items-center'>
                    <Label htmlFor='notes'>{t('address.notes')}</Label>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl>
                      <Textarea
                        id='notes'
                        placeholder={t('address.enterNotes')}
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

        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex gap-2'>
                  <div className='w-1/5 flex items-center'>
                    <Label required>{t('address.addressType')}</Label>
                  </div>
                  <div className='w-full space-y-1'>
                    <FormControl className='flex gap-3'>
                      <RadioGroup
                        value={field.value} // Bind the selected value
                        onValueChange={field.onChange} // Update the form value
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value={AddressEnum.HOME} id={AddressEnum.HOME} />
                          <Label
                            htmlFor={AddressEnum.HOME}
                            className={`px-4 py-2 rounded border cursor-pointer ${
                              field.value === AddressEnum.HOME ? 'border-red-500 text-red-500' : 'border-gray-200'
                            }`}
                          >
                            {t('address.addressTypeValueHome', { type: AddressEnum.HOME })}
                          </Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value={AddressEnum.OFFICE} id={AddressEnum.OFFICE} />
                          <Label
                            htmlFor={AddressEnum.OFFICE}
                            className={`px-4 py-2 rounded border cursor-pointer ${
                              field.value === AddressEnum.OFFICE ? 'border-red-500 text-red-500' : 'border-gray-200'
                            }`}
                          >
                            {t('address.addressTypeValueOffice', { type: AddressEnum.OFFICE })}
                          </Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value={AddressEnum.OTHER} id={AddressEnum.OTHER} />
                          <Label
                            htmlFor={AddressEnum.OTHER}
                            className={`px-4 py-2 rounded border cursor-pointer ${
                              field.value === AddressEnum.OTHER ? 'border-red-500 text-red-500' : 'border-gray-200'
                            }`}
                          >
                            {t('address.addressTypeValueOther', { type: AddressEnum.OTHER })}
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='isDefault'
          render={({ field }) => (
            <FormItem className='w-full'>
              <div className='w-full flex gap-2'>
                <div className='w-full space-y-1'>
                  <FormControl className='flex gap-3'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='default' checked={field?.value || false} onCheckedChange={field?.onChange} />
                      <Label
                        htmlFor='default'
                        className='cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {t('address.setAsDefault')}
                      </Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
