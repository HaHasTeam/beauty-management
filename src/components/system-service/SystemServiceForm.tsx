import { useQuery } from '@tanstack/react-query'
import { FileSpreadsheet, Sheet } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Routes, routesConfig } from '@/configs/routes'
import { getAllCategoryApi } from '@/network/apis/category'
import { ISystemServiceFormData, SystemServiceSchema } from '@/schemas/system-service.schema'

import LoadingLayer from '../loading-icon/LoadingLayer'
import SectionCollapsable from '../section-collapsable'
import GeneralSystemService from './GeneralSystemService'
import ResultSheetSystemService from './ResultSheetSystemService'

interface SystemServiceFormProps {
  form: UseFormReturn<z.infer<typeof SystemServiceSchema>>
  isLoading: boolean
  onSubmit: (data: ISystemServiceFormData) => void
  formId?: string
  resetSignal?: boolean
  defineFormSignal?: boolean
}
const SystemServiceForm = ({
  form,
  isLoading,
  onSubmit,
  formId,
  resetSignal,
  defineFormSignal
}: SystemServiceFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: useCategoryData, isFetching: isGettingCategory } = useQuery({
    queryKey: [getAllCategoryApi.queryKey],
    queryFn: getAllCategoryApi.fn
  })
  return (
    <>
      {isLoading && <LoadingLayer />}
      {!isGettingCategory && (
        <Form {...form}>
          <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
              <SectionCollapsable
                header={
                  <div className='flex gap-2 items-center'>
                    <Sheet />
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
                  <div className='flex gap-2 items-center'>
                    <FileSpreadsheet />
                    <h2 className='font-bold text-xl'>{t('systemService.resultSheetInformation')}</h2>
                  </div>
                }
                content={<ResultSheetSystemService form={form} />}
              />
            </div>

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
          </form>
        </Form>
      )}
    </>
  )
}

export default SystemServiceForm
