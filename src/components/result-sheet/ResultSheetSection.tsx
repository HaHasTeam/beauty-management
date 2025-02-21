import { useTranslation } from 'react-i18next'

import { IResponseResultSheetSection } from '@/types/result-sheet'

export interface ResultSheetSectionProps {
  resultSheetSection: IResponseResultSheetSection
}
const ResultSheetSection = ({ resultSheetSection }: ResultSheetSectionProps) => {
  const { t } = useTranslation()

  if (!resultSheetSection) return null
  return (
    <div className='text-base'>
      <div className='flex items-center gap-1 font-medium'>
        {resultSheetSection.mandatory && <span className='text-destructive'>*</span>}
        {t('systemService.section')} {resultSheetSection.orderIndex}
        {':'} {resultSheetSection.section}
      </div>
      <p className='text-muted-foreground'>{resultSheetSection.description}</p>
    </div>
  )
}

export default ResultSheetSection
