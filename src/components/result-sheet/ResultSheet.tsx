import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IResponseResultSheetData } from '@/types/result-sheet'

import { Separator } from '../ui/separator'
import ResultSheetSection from './ResultSheetSection'
import UpdateResultSheetSection from './UpdateResultSheetSection'

export interface ResultSheetProps {
  resultSheet: IResponseResultSheetData
}
const ResultSheet = ({ resultSheet }: ResultSheetProps) => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)

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
        <UpdateResultSheetSection resultSheet={resultSheet} setOpen={setIsEditing} />
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
