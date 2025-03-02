import { useQuery } from '@tanstack/react-query'
import { BadgeInfo, FileSpreadsheet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import ConsultationCriteria from '@/components/consultation-criteria/ConsultationCriteria'
import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import SectionCollapsable from '@/components/section-collapsable'
import SystemServiceDetailsGeneral from '@/components/system-service/SystemServiceDetailsGeneral'
import SystemServiceDetailsHeader from '@/components/system-service/SystemServiceDetailsHeader'
import UpdateSystemServiceStatus from '@/components/system-service/UpdateSystemServiceStatus'
import { getSystemServiceByIdApi } from '@/network/apis/system-service'

const SystemServiceDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: serviceData, isFetching: isGettingSystemService } = useQuery({
    queryKey: [getSystemServiceByIdApi.queryKey, id as string],
    queryFn: getSystemServiceByIdApi.fn,
    enabled: !!id
  })

  if (!isGettingSystemService && (!serviceData || !serviceData.data))
    return (
      <div className='h-[600px] w-full flex justify-center items-center'>
        <Empty title={t('empty.systemServiceDetail.title')} description={t('empty.systemServiceDetail.description')} />
      </div>
    )
  return (
    <div>
      {isGettingSystemService && <LoadingLayer />}
      {!isGettingSystemService && serviceData && (
        <div className='w-full space-y-4'>
          {/* service header */}
          <SystemServiceDetailsHeader serviceData={serviceData.data} />

          {/* Update service */}
          <UpdateSystemServiceStatus systemService={serviceData.data} />

          {/* Service general */}
          <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
            <SectionCollapsable
              header={
                <div className='flex gap-2 items-center text-primary'>
                  <BadgeInfo />
                  <h2 className='font-bold text-xl'>{t('systemService.generalInformation')}</h2>
                </div>
              }
              content={<SystemServiceDetailsGeneral serviceData={serviceData.data} />}
            />
          </div>
          {/* result sheet section  */}

          <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
            <SectionCollapsable
              header={
                <div className='flex gap-2 items-center text-primary'>
                  <FileSpreadsheet />
                  <h2 className='font-bold text-xl'>{t('systemService.consultationCriteriaInformation')}</h2>
                </div>
              }
              content={
                <div className='w-full bg-primary/10 rounded-lg p-4 flex justify-center'>
                  <ConsultationCriteria consultationCriteria={serviceData.data.consultationCriteria} mode='view' />
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SystemServiceDetail
