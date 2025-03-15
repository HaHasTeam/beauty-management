import { List, Pencil, Settings2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { SystemServiceSchema } from '@/schemas/system-service.schema'
import { IResponseConsultationCriteriaData } from '@/types/consultation-criteria'
import { SystemServiceStatusEnum } from '@/types/system-service'

import SectionCollapsable from '../section-collapsable'
import SystemServiceTypeTag from '../system-service/SystemServiceTypeTag'
import ConsultationCriteriaSection from './ConsultationCriteriaSection'
import FormConsultationCriteriaInSystemService from './FormConsultationCriteriaInSystemService'
import UpdateConsultationCriteriaSection from './UpdateConsultationCriteriaSection'

export interface ConsultationCriteriaProps {
  consultationCriteria: IResponseConsultationCriteriaData
  mode?: 'create' | 'update' | 'view'
  form?: UseFormReturn<z.infer<typeof SystemServiceSchema>>
}
const ConsultationCriteria = ({ consultationCriteria, mode = 'create', form }: ConsultationCriteriaProps) => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setIsEditing(mode === 'update')
  }, [mode])

  const originalSections = useMemo(() => {
    return consultationCriteria.consultationCriteriaSections || []
  }, [consultationCriteria])

  if (!consultationCriteria) return null

  return (
    <div
      className={`border border-primary/40 rounded-lg flex flex-col gap-3 bg-card ${isEditing ? 'w-full px-6 py-4' : 'max-w-xl w-full'}`}
    >
      {!isEditing && mode !== 'view' && (
        <Pencil
          onClick={() => {
            setIsEditing(true)
          }}
          className='cursor-pointer text-primary absolute right-3 top-3'
        />
      )}
      {isEditing ? (
        mode === 'update' ? (
          form && <FormConsultationCriteriaInSystemService form={form} originalSections={originalSections} />
        ) : (
          <UpdateConsultationCriteriaSection consultationCriteria={consultationCriteria} setOpen={setIsEditing} />
        )
      ) : (
        <>
          <div className='bg-primary/80 text-white rounded-tl-lg rounded-tr-lg p-4'>
            <h2 className='text-xl font-bold'>{consultationCriteria.title}</h2>
            <div className='text-sm opacity-80 mt-1'>
              {t('systemService.lastUpdated')}:{' '}
              {t('date.toLocaleDateTimeString', { val: new Date(consultationCriteria.updatedAt) })}
            </div>
          </div>
          <div className='px-4 space-y-4'>
            <div>
              <SectionCollapsable
                header={
                  <div className='flex gap-1 text-primary'>
                    <List />
                    <h3 className='text-lg font-semibold text-primary'>
                      {t('systemService.consultantCriteriaDetails')}
                    </h3>
                  </div>
                }
                content={
                  <>
                    {consultationCriteria.consultationCriteriaSections.map((section, index) => (
                      <div key={section.id} className='w-full'>
                        <ConsultationCriteriaSection consultationCriteriaSection={section} />
                        {index < consultationCriteria.consultationCriteriaSections.length - 1 && (
                          <div className='border-b border-gray-200 my-4'></div>
                        )}
                      </div>
                    ))}
                  </>
                }
              />
            </div>

            {/* System Services */}
            {consultationCriteria.systemServices &&
              consultationCriteria.systemServices.length > 0 &&
              consultationCriteria.systemServices.filter((service) => service.status === SystemServiceStatusEnum.ACTIVE)
                .length > 0 && (
                <div>
                  <SectionCollapsable
                    header={
                      <div className='flex gap-1 text-primary'>
                        <Settings2 />
                        <h3 className='text-lg font-semibold text-primary'>{t('systemService.applicableServices')}</h3>
                      </div>
                    }
                    content={
                      <div className='space-y-2'>
                        {consultationCriteria.systemServices
                          ?.filter((service) => service.status === SystemServiceStatusEnum.ACTIVE)
                          ?.map((service) => (
                            <div key={service.id} className='bg-primary/10 p-3 rounded-md space-y-1'>
                              <div className='flex gap-1 items-center'>
                                <div className='font-medium text-primary/90 text-base'>{service.name}</div>
                                <div className='w-fit'>
                                  <SystemServiceTypeTag type={service.type} />
                                </div>
                              </div>

                              <div className='text-sm text-gray-600 mt-1 line-clamp-2 overflow-ellipsis'>
                                {service.description}
                              </div>
                            </div>
                          ))}
                      </div>
                    }
                  />
                </div>
              )}
          </div>

          {/* Footer */}
          <div className='px-4 pb-3'>
            <div className='text-xs text-gray-500'>
              {t('systemService.ID')}: {consultationCriteria.id.substring(0, 8)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ConsultationCriteria
