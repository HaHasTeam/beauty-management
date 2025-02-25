import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllResultSheetApi, getResultSheetByIdApi } from '@/network/apis/result-sheet'
import { deleteResultSheetByIdApi } from '@/network/apis/result-sheet-section'
import { ResultSheetDataSchema } from '@/schemas/result-sheet.schema'
import { IResponseResultSheetSection } from '@/types/result-sheet'

import Button from '../button'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'

interface FormResultSheetContentProps {
  form: UseFormReturn<z.infer<typeof ResultSheetDataSchema>>
  originalSections?: IResponseResultSheetSection[]
}

const FormResultSheet = ({ form, originalSections = [] }: FormResultSheetContentProps) => {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const queryClient = useQueryClient()
  const handleServerError = useHandleServerError()

  // Delete section API mutation
  const { mutateAsync: deleteResultSheetSectionFn } = useMutation({
    mutationKey: [deleteResultSheetByIdApi?.mutationKey],
    mutationFn: deleteResultSheetByIdApi?.fn,
    onSuccess: () => {
      successToast({
        message: `${t('systemService.deleteSectionSuccess')}`
      })
    }
  })

  const handleDeleteSection = async (index: number) => {
    const currentSections = form.getValues('resultSheetSections')
    const sectionToDelete = currentSections[index]

    // Check if section exists in originalSections (was part of defaultValues)
    const isExistingSection = sectionToDelete.id && originalSections.some((s) => s.id === sectionToDelete.id)

    if (isExistingSection) {
      // Case 1: Section exists in database, call API to delete
      try {
        await deleteResultSheetSectionFn({
          params: sectionToDelete.id ?? ''
        })

        // After successful API call, remove from form state
        removeSectionFromForm(index)
        queryClient.invalidateQueries({
          queryKey: [getResultSheetByIdApi.queryKey, form.getValues('id') as string]
        })
        queryClient.invalidateQueries({
          queryKey: [getAllResultSheetApi.queryKey]
        })
      } catch (error) {
        handleServerError({
          error,
          form
        })
      }
    } else {
      // Case 2: Just added during current session, just remove from form state
      removeSectionFromForm(index)
    }
  }

  const removeSectionFromForm = (index: number) => {
    const currentSections = form.getValues('resultSheetSections')

    // Remove the section at the specified index
    const updatedSections = currentSections.filter((_, i) => i !== index)

    // Update the orderIndex for remaining sections
    const reorderedSections = updatedSections.map((section, i) => ({
      ...section,
      orderIndex: i + 1
    }))

    // Update the form value
    form.setValue('resultSheetSections', reorderedSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const moveSection = (fromIndex: number, direction: 'up' | 'down') => {
    const currentSections = form.getValues('resultSheetSections')
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

    form.setValue('resultSheetSections', reorderedSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }
  const sections = form.watch('resultSheetSections') || []
  const sortedSections = [...sections].sort((a, b) => a.orderIndex - b.orderIndex)

  // Find the selected result sheet data for preview
  return (
    <div className='py-2'>
      {/* Result Sheet Title */}
      <FormField
        control={form.control}
        name='title'
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
              name={`resultSheetSections.${index}.section`}
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
              name={`resultSheetSections.${index}.description`}
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
                name={`resultSheetSections.${index}.mandatory`}
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
              {form.watch('resultSheetSections').length > 1 && (
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
            const currentSections = form.getValues('resultSheetSections') || []
            const newSection = {
              section: '',
              orderIndex: (currentSections?.length || 0) + 1,
              mandatory: true,
              description: ''
            }

            form.setValue('resultSheetSections', [...currentSections, newSection], {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true
            })
          }}
        >
          {t('button.addSection')}
        </Button>
      </div>
    </div>
  )
}

export default FormResultSheet
