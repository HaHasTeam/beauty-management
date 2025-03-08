import { ImagePlus } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import FormLabel from '@/components/form-label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SystemServiceSchema } from '@/schemas/system-service.schema'
import { ICategory } from '@/types/category'
import { ServiceTypeEnum } from '@/types/enum'
import { SystemServiceStatusEnum } from '@/types/system-service'
import UploadProductImages from '@/views/dashboard/create-product/UploadProductImages'

import FormCategorySelection from '../form-category-selection'
import ImageWithFallback from '../image/ImageWithFallback'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'

interface GeneralSystemServiceProps {
  form: UseFormReturn<z.infer<typeof SystemServiceSchema>>
  categories: ICategory[]
  resetSignal?: boolean
  defineFormSignal?: boolean
}
const GeneralSystemService = ({ form, categories, resetSignal, defineFormSignal }: GeneralSystemServiceProps) => {
  const MAX_PRODUCT_IMAGES = 1
  const { t } = useTranslation()
  const serviceTypes = [
    { value: ServiceTypeEnum.STANDARD, text: t('systemService.standard') },
    { value: ServiceTypeEnum.PREMIUM, text: t('systemService.premium') }
  ]
  return (
    <div className='space-y-6'>
      {/* Service Images */}
      <FormField
        control={form.control}
        name='images'
        render={({ field }) => (
          <FormItem className='w-full'>
            <div className='flex w-full gap-2'>
              <div className='w-[15%] space-y-1'>
                <FormLabel required>{t('systemService.serviceImages')}</FormLabel>
              </div>
              <FormControl>
                <div className='w-full space-y-1'>
                  <UploadProductImages
                    field={field}
                    vertical={false}
                    dropZoneConfigOptions={{ maxFiles: MAX_PRODUCT_IMAGES }}
                    renderFileItemUI={(file) => {
                      return (
                        <div
                          key={file?.name}
                          className='hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0'
                        >
                          <ImageWithFallback
                            fallback={fallBackImage}
                            src={URL?.createObjectURL(file)}
                            alt={file?.name}
                            className='object-contain w-full h-full rounded-lg'
                            onLoad={() => URL?.revokeObjectURL(URL?.createObjectURL(file))}
                          />
                        </div>
                      )
                    }}
                    renderInputUI={(_isDragActive, files, maxFiles) => {
                      return (
                        <div className='w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                          <ImagePlus className='w-12 h-12 text-primary' />

                          <p className='text-sm text-primary'>
                            {t('createProduct.inputImage')} ({files?.length ?? 0}/{maxFiles})
                          </p>
                        </div>
                      )
                    }}
                  />
                  <FormMessage />
                </div>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
      {/* Service Name */}
      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <div className='flex gap-2'>
              <div className='w-[15%] flex items-center'>
                <FormLabel required>{t('systemService.name')}</FormLabel>
              </div>
              <div className='w-full space-y-1'>
                <FormControl>
                  <Input {...field} className='border-primary/40' placeholder={t('systemService.enterServiceName')} />
                </FormControl>
                <FormMessage />
              </div>
            </div>
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name='description'
        render={({ field }) => (
          <FormItem>
            <div className='flex gap-2'>
              <div className='w-[15%] flex items-center'>
                <FormLabel required>{t('systemService.description')}</FormLabel>
              </div>
              <div className='w-full space-y-1'>
                <FormControl>
                  <Textarea
                    {...field}
                    className='border-primary/40'
                    placeholder={t('systemService.enterServiceDescription')}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </div>
          </FormItem>
        )}
      />

      {/* Category Selection - Using your existing component */}
      <div className='flex w-full'>
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem className='w-full'>
              <div className='w-full flex gap-2'>
                <div className='w-[15%] flex items-center'>
                  <FormLabel required>{t('systemService.category')}</FormLabel>
                </div>
                <div className='w-full space-y-1'>
                  <FormControl>
                    <FormCategorySelection
                      categories={categories ?? []}
                      onSelect={(selected: string) => {
                        field.onChange(selected)
                      }}
                      form={form}
                      resetSignal={resetSignal}
                      defineFormSignal={defineFormSignal}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Service Type */}
      <FormField
        control={form.control}
        name='type'
        render={({ field }) => (
          <FormItem>
            <div className='flex gap-2'>
              <div className='w-[15%] flex items-center'>
                <FormLabel required>{t('systemService.type')}</FormLabel>
              </div>
              <div className='w-full space-y-1'>
                <FormControl>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                    required
                    name='type'
                  >
                    <SelectTrigger className='border border-primary/40'>
                      <SelectValue {...field} placeholder={t('systemService.selectServiceType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {serviceTypes.map((serviceType) => (
                          <SelectItem key={serviceType.value} value={serviceType.value}>
                            {serviceType.text}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </div>
            </div>
          </FormItem>
        )}
      />

      {/* Status */}
      <FormField
        control={form.control}
        name={`status`}
        render={({ field }) => (
          <FormItem>
            <div className='flex gap-2'>
              <div className='w-[15%] flex items-center'>
                <FormLabel>{t('systemService.status')}</FormLabel>
              </div>
              <div className='w-full space-y-1'>
                <FormControl>
                  <Switch
                    checked={field.value === SystemServiceStatusEnum.ACTIVE ? true : false}
                    onCheckedChange={(value) => {
                      field.onChange(value === true ? SystemServiceStatusEnum.ACTIVE : SystemServiceStatusEnum.INACTIVE)
                    }}
                    size='medium'
                  />
                </FormControl>
                <FormMessage />
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}

export default GeneralSystemService
