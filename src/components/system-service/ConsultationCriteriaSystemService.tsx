import { useQuery } from '@tanstack/react-query'
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { getAllConsultationCriteriaApi } from '@/network/apis/consultation-criteria'
import { SystemServiceSchema } from '@/schemas/system-service.schema'
import { StatusEnum } from '@/types/enum'

import Button from '../button'
import ConsultationCriteria from '../consultation-criteria/ConsultationCriteria'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'

interface ConsultationCriteriaSystemServiceProps {
  form: UseFormReturn<z.infer<typeof SystemServiceSchema>>
  mode?: 'create' | 'update'
}
const ConsultationCriteriaSystemService = ({ form, mode = 'create' }: ConsultationCriteriaSystemServiceProps) => {
  const CREATE_NEW_RESULT_VALUE = 'createNewConsultationCriteriaData'
  const { t } = useTranslation()

  const { data: consultationCriterias } = useQuery({
    queryKey: [getAllConsultationCriteriaApi.queryKey],
    queryFn: getAllConsultationCriteriaApi.fn
  })

  const handleDeleteSection = (index: number) => {
    const currentSections = form.getValues('consultationCriteriaData.consultationCriteriaSections')

    // Remove the section at the specified index
    const updatedSections = currentSections.filter((_, i) => i !== index)

    // Update the orderIndex for remaining sections
    const reorderedSections = updatedSections.map((section, i) => ({
      ...section,
      orderIndex: i + 1
    }))

    // Update the form value
    form.setValue('consultationCriteriaData.consultationCriteriaSections', reorderedSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const moveSection = (fromIndex: number, direction: 'up' | 'down') => {
    const currentSections = form.getValues('consultationCriteriaData.consultationCriteriaSections')
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1

    if (toIndex < 0 || toIndex >= currentSections.length) return

    const newSections = [...currentSections]
    const [movedItem] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, movedItem)

    // Update orderIndex for all items
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      orderIndex: index + 1
    }))

    form.setValue('consultationCriteriaData.consultationCriteriaSections', reorderedSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  // Handle result sheet selection
  const handleConsultationCriteriaChange = (consultationCriteriaId: string) => {
    if (consultationCriteriaId === CREATE_NEW_RESULT_VALUE) {
      // If "Create New" is selected, initialize consultationCriteriaData
      form.setValue('consultationCriteria', consultationCriteriaId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      })
      form.setValue(
        'consultationCriteriaData',
        {
          title: '',
          consultationCriteriaSections: [
            {
              section: '',
              orderIndex: 1,
              mandatory: true,
              description: ''
            }
          ]
        },
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        }
      )
    } else if (consultationCriteriaId) {
      // If an existing result sheet is selected
      form.setValue('consultationCriteria', consultationCriteriaId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      })
      form.setValue('consultationCriteriaData', undefined, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      })
    }
  }

  const selectedConsultationCriteria = form.watch('consultationCriteria')

  const sections = form.watch('consultationCriteriaData.consultationCriteriaSections') || []
  const sortedSections = [...sections].sort((a, b) => a.orderIndex - b.orderIndex)

  // Find the selected result sheet data for preview
  const selectedConsultationCriteriaData = useMemo(() => {
    return consultationCriterias?.data.find((sheet) => sheet.id === selectedConsultationCriteria)
  }, [consultationCriterias?.data, selectedConsultationCriteria])

  return (
    <div className='space-y-4'>
      {/* Result Sheet Selection */}
      <FormField
        control={form.control}
        name='consultationCriteria'
        render={({ field }) => (
          <FormItem>
            <div className='flex gap-2 md:flex-row flex-col'>
              <div className='md:w-[15%] w-full flex items-center'>
                <FormLabel required>{t('systemService.selectConsultationCriteria')}</FormLabel>
              </div>
              <div className='w-full space-y-1'>
                <Select value={field.value} onValueChange={handleConsultationCriteriaChange}>
                  <FormControl>
                    <SelectTrigger className='border-primary/40'>
                      <SelectValue
                        className='line-clamp-1 overflow-ellipsis w-fit'
                        placeholder={t('systemService.selectOrCreateNew')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CREATE_NEW_RESULT_VALUE}>{t('systemService.createNew')}</SelectItem>
                    {consultationCriterias?.data
                      .filter((consultationCriteria) => consultationCriteria.status === StatusEnum.ACTIVE)
                      .map((sheet) => (
                        <SelectItem key={sheet.id} value={sheet.id}>
                          {sheet.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </div>
          </FormItem>
        )}
      />

      {/* Show Preview if existing result sheet is selected */}
      {selectedConsultationCriteria && selectedConsultationCriteriaData && (
        <div className='relative w-full flex justify-center bg-primary/10 rounded-lg p-4'>
          <ConsultationCriteria consultationCriteria={selectedConsultationCriteriaData} mode={mode} form={form} />
        </div>
      )}

      {/* Show form fields if creating new result sheet */}
      {selectedConsultationCriteria === CREATE_NEW_RESULT_VALUE && (
        <>
          {/* Result Sheet Title */}
          <FormField
            control={form.control}
            name='consultationCriteriaData.title'
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
                        placeholder={t('systemService.enterConsultationCriteriaTitle')}
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
            {sortedSections.map((section, index) => (
              <div key={index} className='space-y-3 p-4 border rounded-lg'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-primary text-base'>
                      {t('systemService.section')}: {section.orderIndex}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    {index > 0 && (
                      <ArrowUpCircle
                        className='w-5 h-5 text-primary cursor-pointer hover:text-primary/80'
                        onClick={() => moveSection(index, 'up')}
                      />
                    )}
                    {index < sections.length - 1 && (
                      <ArrowDownCircle
                        className='w-5 h-5 text-primary cursor-pointer hover:text-primary/80'
                        onClick={() => moveSection(index, 'down')}
                      />
                    )}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name={`consultationCriteriaData.consultationCriteriaSections.${index}.section`}
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
                  name={`consultationCriteriaData.consultationCriteriaSections.${index}.description`}
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

                <div className='w-full flex flex-1 justify-between'>
                  <FormField
                    control={form.control}
                    name={`consultationCriteriaData.consultationCriteriaSections.${index}.mandatory`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
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
                  {form.watch('consultationCriteriaData.consultationCriteriaSections').length > 1 && (
                    <Trash2
                      className='text-destructive hover:text-destructive/80 cursor-pointer'
                      onClick={() => handleDeleteSection(index)}
                    />
                  )}
                </div>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              className='border border-primary text-primary hover:text-primary hover:bg-primary/10'
              onClick={() => {
                const currentSections = form.getValues('consultationCriteriaData.consultationCriteriaSections') || []
                const newSection = {
                  section: '',
                  orderIndex: (currentSections?.length || 0) + 1,
                  mandatory: true,
                  description: ''
                }

                form.setValue(
                  'consultationCriteriaData.consultationCriteriaSections',
                  [...currentSections, newSection],
                  {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                  }
                )
              }}
            >
              {t('button.addSection')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default ConsultationCriteriaSystemService
