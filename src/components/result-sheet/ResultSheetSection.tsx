import { useTranslation } from 'react-i18next'

import { IResponseResultSheetSection } from '@/types/result-sheet'

export interface ResultSheetSectionProps {
  resultSheetSection: IResponseResultSheetSection
}
const ResultSheetSection = ({ resultSheetSection }: ResultSheetSectionProps) => {
  const { t } = useTranslation()

  if (!resultSheetSection) return null
  return (
    <div className='flex items-start gap-2'>
      <div className='bg-primary/80 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1'>
        {resultSheetSection.orderIndex}
      </div>
      <div className='flex-1'>
        <h4 className='font-medium text-gray-800'>{resultSheetSection.section}</h4>
        <p className='text-gray-600 mt-1'>{resultSheetSection.description}</p>
        {resultSheetSection.mandatory && (
          <span className='text-xs text-red-600 mt-1 block'>* {t('systemService.required')}</span>
        )}
      </div>
    </div>
  )
}

export default ResultSheetSection
