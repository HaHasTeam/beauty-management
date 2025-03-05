import { useTranslation } from 'react-i18next'

import { IResponseConsultationCriteriaSection } from '@/types/consultation-criteria'

export interface ConsultationCriteriaSectionProps {
  consultationCriteriaSection: IResponseConsultationCriteriaSection
}
const ConsultationCriteriaSection = ({ consultationCriteriaSection }: ConsultationCriteriaSectionProps) => {
  const { t } = useTranslation()

  if (!consultationCriteriaSection) return null
  return (
    <div className='flex items-start gap-2'>
      <div className='bg-primary/80 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1'>
        {consultationCriteriaSection.orderIndex}
      </div>
      <div className='flex-1'>
        <h4 className='font-medium text-gray-800'>{consultationCriteriaSection.section}</h4>
        <p className='text-gray-600 mt-1'>{consultationCriteriaSection.description}</p>
        {consultationCriteriaSection.mandatory && (
          <span className='text-xs text-red-600 mt-1 block'>* {t('systemService.required')}</span>
        )}
      </div>
    </div>
  )
}

export default ConsultationCriteriaSection
