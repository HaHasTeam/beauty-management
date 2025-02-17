import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { SystemServiceSchema } from '@/schemas/system-service.schema'

import Button from '../button'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'

interface ResultSheetSystemServiceProps {
  form: UseFormReturn<z.infer<typeof SystemServiceSchema>>
}
const ResultSheetSystemService = ({ form }: ResultSheetSystemServiceProps) => {
  const { t } = useTranslation()
  return (
    <div className='space-y-4'>
      {/* Result Sheet Title */}
      <FormField
        control={form.control}
        name='resultSheetData.title'
        render={({ field }) => (
          <FormItem>
            <div className='flex gap-2'>
              <div className='w-[15%] flex items-center'>
                <FormLabel required>{t('systemService.title')}</FormLabel>
              </div>
              <div className='w-full space-y-1'>
                <FormControl>
                  <Input
                    {...field}
                    className='border-primary/40'
                    placeholder={t('systemService.enterResultSheetTitle')}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </div>
          </FormItem>
        )}
      />
      {/* Result Sheet Sections */}
      <div className='space-y-2'>
        <div className='flex gap-2'>
          <h4 className='text-base font-semibold'>{t('systemService.sections')}</h4>
        </div>
        {form.watch('resultSheetData.resultSheetSections').map((_, index) => (
          <div key={index} className='space-y-4 p-4 border rounded-lg'>
            <FormField
              control={form.control}
              name={`resultSheetData.resultSheetSections.${index}.section`}
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2'>
                    <div className='w-[15%] flex items-center'>
                      <FormLabel required>{t('systemService.sectionName')}</FormLabel>
                    </div>
                    <div className='w-full space-y-1'>
                      <FormControl>
                        <Input
                          {...field}
                          className='border-primary/40'
                          placeholder={t('systemService.enterSectionName')}
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
              name={`resultSheetData.resultSheetSections.${index}.description`}
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
                          placeholder={t('systemService.enterSectionDescription')}
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
              name={`resultSheetData.resultSheetSections.${index}.mandatory`}
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2'>
                    <div className='w-[15%] flex items-center'>
                      <FormLabel>{t('systemService.required')}</FormLabel>
                    </div>
                    <div className='w-full space-y-1'>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} size='medium' />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        ))}
        <Button
          type='button'
          variant='outline'
          className='border border-primary text-primary hover:text-primary hover:bg-primary/10'
          onClick={() => {
            const sections = form.getValues('resultSheetData.resultSheetSections')
            form.setValue('resultSheetData.resultSheetSections', [
              ...sections,
              {
                section: '',
                orderIndex: sections.length + 1,
                mandatory: true,
                description: ''
              }
            ])
          }}
        >
          {t('button.addSection')}
        </Button>
      </div>
    </div>
  )
}

export default ResultSheetSystemService
