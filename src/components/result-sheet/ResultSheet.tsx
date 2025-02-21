import { useTranslation } from 'react-i18next'

import { IResponseResultSheetData } from '@/types/result-sheet'

import { Separator } from '../ui/separator'
import ResultSheetSection from './ResultSheetSection'

export interface ResultSheetProps {
  resultSheet: IResponseResultSheetData
}
const ResultSheet = ({ resultSheet }: ResultSheetProps) => {
  const { t } = useTranslation()
  if (!resultSheet) return null
  return (
    <div className='px-6 py-4 border border-primary/40 rounded-lg space-y-3 bg-card'>
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
        </div>
      </div>
    </div>
  )
}

export default ResultSheet
