import { useQuery } from '@tanstack/react-query'
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { getAllResultSheetApi } from '@/network/apis/result-sheet'
import { SystemServiceSchema } from '@/schemas/system-service.schema'
import { StatusEnum } from '@/types/enum'

import Button from '../button'
import ResultSheet from '../result-sheet/ResultSheet'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'

interface ResultSheetSystemServiceProps {
  form: UseFormReturn<z.infer<typeof SystemServiceSchema>>
  mode?: 'create' | 'update'
}
const ResultSheetSystemService = ({ form, mode = 'create' }: ResultSheetSystemServiceProps) => {
  const CREATE_NEW_RESULT_VALUE = 'createNewResultSheetData'
  const { t } = useTranslation()

  const { data: resultSheets } = useQuery({
    queryKey: [getAllResultSheetApi.queryKey],
    queryFn: getAllResultSheetApi.fn
  })

  const handleDeleteSection = (index: number) => {
    const currentSections = form.getValues('resultSheetData.resultSheetSections')

    // Remove the section at the specified index
    const updatedSections = currentSections.filter((_, i) => i !== index)

    // Update the orderIndex for remaining sections
    const reorderedSections = updatedSections.map((section, i) => ({
      ...section,
      orderIndex: i + 1
    }))

    // Update the form value
    form.setValue('resultSheetData.resultSheetSections', reorderedSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const moveSection = (fromIndex: number, direction: 'up' | 'down') => {
    const currentSections = form.getValues('resultSheetData.resultSheetSections')
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

    form.setValue('resultSheetData.resultSheetSections', reorderedSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  // Handle result sheet selection
  const handleResultSheetChange = (resultSheetId: string) => {
    if (resultSheetId === CREATE_NEW_RESULT_VALUE) {
      // If "Create New" is selected, initialize resultSheetData
      form.setValue('resultSheet', resultSheetId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      })
      form.setValue(
        'resultSheetData',
        {
          title: '',
          resultSheetSections: [
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
    } else if (resultSheetId) {
      // If an existing result sheet is selected
      form.setValue('resultSheet', resultSheetId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      })
      form.setValue('resultSheetData', undefined, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      })
    }
  }

  const selectedResultSheet = form.watch('resultSheet')

  const sections = form.watch('resultSheetData.resultSheetSections') || []
  const sortedSections = [...sections].sort((a, b) => a.orderIndex - b.orderIndex)

  // Find the selected result sheet data for preview
  const selectedResultSheetData = useMemo(() => {
    return resultSheets?.data.find((sheet) => sheet.id === selectedResultSheet)
  }, [resultSheets?.data, selectedResultSheet])

  return (
    <div className='space-y-4'>
      {/* Result Sheet Selection */}
      <FormField
        control={form.control}
        name='resultSheet'
        render={({ field }) => (
          <FormItem>
            <div className='flex gap-2 md:flex-row flex-col'>
              <div className='md:w-[15%] w-full flex items-center'>
                <FormLabel required>{t('systemService.selectResultSheet')}</FormLabel>
              </div>
              <div className='w-full space-y-1'>
                <Select value={field.value} onValueChange={handleResultSheetChange}>
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
                    {resultSheets?.data
                      .filter((resultSheet) => resultSheet.status === StatusEnum.ACTIVE)
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
      {selectedResultSheet && selectedResultSheetData && (
        <div className='relative w-full flex justify-center bg-primary/10 rounded-lg p-4'>
          <ResultSheet resultSheet={selectedResultSheetData} mode={mode} form={form} />
        </div>
      )}

      {/* Show form fields if creating new result sheet */}
      {selectedResultSheet === CREATE_NEW_RESULT_VALUE && (
        <>
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

                <div className='w-full flex flex-1 justify-between'>
                  <FormField
                    control={form.control}
                    name={`resultSheetData.resultSheetSections.${index}.mandatory`}
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
                  {form.watch('resultSheetData.resultSheetSections').length > 1 && (
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
                const currentSections = form.getValues('resultSheetData.resultSheetSections') || []
                const newSection = {
                  section: '',
                  orderIndex: (currentSections?.length || 0) + 1,
                  mandatory: true,
                  description: ''
                }

                form.setValue('resultSheetData.resultSheetSections', [...currentSections, newSection], {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true
                })
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

export default ResultSheetSystemService
