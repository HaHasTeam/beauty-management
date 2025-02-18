import { IResponseResultSheetData } from '@/types/result-sheet'

import ResultSheetSection from './ResultSheetSection'

export interface ResultSheetProps {
  resultSheet: IResponseResultSheetData
}
const ResultSheet = ({ resultSheet }: ResultSheetProps) => {
  if (!resultSheet) return null
  return (
    <div className='px-6 py-4 border border-primary/40 rounded-lg space-y-3 bg-card'>
      <p className='font-semibold text-xl flex justify-center'>{resultSheet.title}</p>
      <div className='space-y-4'>
        {resultSheet.resultSheetSections.map((section) => (
          <ResultSheetSection key={section.id} resultSheetSection={section} />
        ))}
      </div>
    </div>
  )
}

export default ResultSheet
