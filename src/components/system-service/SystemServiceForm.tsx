import { useQuery } from '@tanstack/react-query'
import { BadgeInfo, FileSpreadsheet } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import { getAllCategoryApi } from '@/network/apis/category'
import { ISystemServiceFormData, SystemServiceSchema } from '@/schemas/system-service.schema'
import { RoleEnum } from '@/types/enum'

import LoadingLayer from '../loading-icon/LoadingLayer'
import SectionCollapsable from '../section-collapsable'
import ConsultationCriteriaSystemService from './ConsultationCriteriaSystemService'
import GeneralSystemService from './GeneralSystemService'

interface SystemServiceFormProps {
  form: UseFormReturn<z.infer<typeof SystemServiceSchema>>
  isLoading: boolean
  onSubmit: (data: ISystemServiceFormData) => void
  formId?: string
  resetSignal?: boolean
  defineFormSignal?: boolean
  mode?: 'create' | 'update'
}
const SystemServiceForm = ({
  form,
  isLoading,
  onSubmit,
  formId,
  resetSignal,
  defineFormSignal,
  mode = 'create'
}: SystemServiceFormProps) => {
  const isGrant = useGrant([RoleEnum.ADMIN, RoleEnum.OPERATOR])
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: useCategoryData } = useQuery({
    queryKey: [getAllCategoryApi.queryKey],
    queryFn: getAllCategoryApi.fn
  })
  return (
    <>
      {isLoading && <LoadingLayer />}
      {
        <Form {...form}>
          <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
              <SectionCollapsable
                header={
                  <div className='flex gap-2 items-center text-primary'>
                    <BadgeInfo />
                    <h2 className='font-bold text-xl'>{t('systemService.generalInformation')}</h2>
                  </div>
                }
                content={
                  <GeneralSystemService
                    form={form}
                    categories={useCategoryData?.data ?? []}
                    resetSignal={resetSignal}
                    defineFormSignal={defineFormSignal}
                  />
                }
              />
            </div>
            <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
              <SectionCollapsable
                header={
                  <div className='flex gap-2 items-center text-primary'>
                    <FileSpreadsheet />
                    <h2 className='font-bold text-xl'>{t('systemService.consultationCriteriaInformation')}</h2>
                  </div>
                }
                content={<ConsultationCriteriaSystemService form={form} mode={mode} />}
              />
            </div>

            {isGrant ? (
              <div className='flex justify-end space-x-4'>
                <Button
                  variant='outline'
                  type='submit'
                  className='border border-primary text-primary hover:text-primary hover:bg-primary/10'
                  onClick={() => {
                    form.reset()
                    navigate(routesConfig[Routes.SYSTEM_SERVICE_LIST].getPath())
                  }}
                >
                  {t('button.cancel')}
                </Button>
                <Button form={formId} type='submit'>
                  {t('button.create')}
                </Button>
              </div>
            ) : null}
          </form>
        </Form>
      }
    </>
  )
}

export default SystemServiceForm
