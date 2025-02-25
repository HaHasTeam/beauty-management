import { Pencil } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { SystemServiceSchema } from '@/schemas/system-service.schema'
import { IResponseResultSheetData } from '@/types/result-sheet'

import { Separator } from '../ui/separator'
import FormResultSheetInSystemService from './FormResultSheetInSystemService'
import ResultSheetSection from './ResultSheetSection'
import UpdateResultSheetSection from './UpdateResultSheetSection'

export interface ResultSheetProps {
  resultSheet: IResponseResultSheetData
  mode?: 'create' | 'update'
  form?: UseFormReturn<z.infer<typeof SystemServiceSchema>>
}
const ResultSheet = ({ resultSheet, mode = 'create', form }: ResultSheetProps) => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setIsEditing(mode === 'update')
  }, [mode])

  const originalSections = useMemo(() => {
    return resultSheet.resultSheetSections || []
  }, [resultSheet])

  if (!resultSheet) return null
  return (
    <div
      className={`px-6 py-4 border border-primary/40 rounded-lg flex flex-col gap-3 bg-card ${isEditing ? 'w-full' : 'max-w-xl'}`}
    >
      {!isEditing && (
        <Pencil
          onClick={() => {
            setIsEditing(true)
          }}
          className='cursor-pointer text-primary absolute right-3 top-3'
        />
      )}
      {isEditing ? (
        mode === 'update' ? (
          form && <FormResultSheetInSystemService form={form} originalSections={originalSections} />
        ) : (
          <UpdateResultSheetSection resultSheet={resultSheet} setOpen={setIsEditing} />
        )
      ) : (
        <>
          <p className='font-semibold text-xl flex justify-center text-center'>{resultSheet.title}</p>
          {/* <Separator className='bg-primary/40' /> */}
          <div className='space-y-3'>
            {resultSheet.resultSheetSections.map((section) => (
              <ResultSheetSection key={section.id} resultSheetSection={section} />
            ))}
          </div>
          <div className='space-y-2'>
            <Separator className='bg-muted' />
            <div className='text-muted-foreground italic'>
              *{t('systemService.alsoUsedFor')}
              {': '}
              <span className='font-medium text-muted-foreground'>
                {resultSheet.systemServices.map((service) => `"${service.name}"`).join(', ')}
              </span>
              .
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ResultSheet
