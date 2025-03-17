import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { StepTrackingVertical } from '@/components/step-tracking'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Routes, routesConfig } from '@/configs/routes'
import { getSteps } from '@/constants/helper'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllCategoryApi } from '@/network/apis/category'
import { uploadFilesApi } from '@/network/apis/file'
import { createProductApi } from '@/network/apis/product'
import { getUserProfileApi } from '@/network/apis/user'
import { ICategory } from '@/types/category'
import { IServerCreateProduct, ProductClassificationTypeEnum, ProductEnum } from '@/types/product'
import { getFormProductSchema } from '@/variables/productFormDetailFields'

import BasicInformation from './BasicInformation'
import DetailInformation from './DetailInformation'
import SalesInformation from './SalesInformation'

const CreateProduct = () => {
  const DEFAULT_TITLE = 'Default'
  const { t } = useTranslation()
  const [resetSignal, setResetSignal] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [activeStep, setActiveStep] = useState(1)
  const [completeSteps, setCompleteSteps] = useState<number[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const id = useId()
  const { successToast } = useToast()
  const navigate = useNavigate()
  const handleServerError = useHandleServerError()
  const FormProductSchema = getFormProductSchema()

  const defaultProductValues = {
    name: '',
    brand: '',
    category: '',
    images: [],
    certificates: [],
    description: '',
    detail: {},
    productClassifications: [],
    status: ''
  }

  const form = useForm<z.infer<typeof FormProductSchema>>({
    resolver: zodResolver(FormProductSchema),
    defaultValues: defaultProductValues
  })

  const { data: useProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const { data: useCategoryData } = useQuery({
    queryKey: [getAllCategoryApi.queryKey],
    queryFn: getAllCategoryApi.fn
  })

  const handleReset = () => {
    form.reset()
    setResetSignal((prev) => !prev)
    setActiveStep(1)
    setCompleteSteps([])
  }

  const { mutateAsync: createProductFn } = useMutation({
    mutationKey: [createProductApi.mutationKey],
    mutationFn: createProductApi.fn,
    onSuccess: () => {
      successToast({
        message:
          form.getValues('status') === ProductEnum.OFFICIAL
            ? t('createProduct.successOfficial')
            : t('createProduct.successInactive'),
        description:
          form.getValues('status') === ProductEnum.OFFICIAL
            ? t('createProduct.successOfficialDescription')
            : t('createProduct.successInactiveDescription')
      })
      handleReset()
    }
  })
  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)

    return uploadedFilesResponse.data
  }

  async function onSubmit(values: z.infer<typeof FormProductSchema>) {
    try {
      setIsLoading(true)
      if (isValid) {
        const imgUrls = await convertFileToUrl(values.images)
        const certUrl = await convertFileToUrl(values.certificates)
        const classificationImgUrls = await Promise.all(
          (values?.productClassifications ?? []).map(async (classification) => {
            if (classification.images && classification.images.length > 0) {
              return await convertFileToUrl(classification.images)
            }
            return []
          })
        )
        // (useProfileData?.data?.brands ?? [])[0]?.id ??
        const transformedData: IServerCreateProduct = {
          name: values?.name,
          category: values?.category,
          status: values?.status,
          brand: (useProfileData?.data?.brands ?? [])[0]?.id ?? '',
          images: imgUrls.map((image) => ({
            fileUrl: image // Transform image strings to objects
          })),
          description: values?.description,
          sku: values?.sku ?? '',
          detail: JSON.stringify(values.detail), // Convert detail object to a string
          certificates: certUrl.map((cert) => ({
            fileUrl: cert
          })),
          productClassifications:
            (values?.productClassifications ?? [])?.length > 0
              ? (values?.productClassifications ?? []).map((classification, index) => ({
                  ...classification,
                  images: classificationImgUrls[index].map((imageUrl) => ({
                    fileUrl: imageUrl
                  }))
                }))
              : [
                  {
                    title: DEFAULT_TITLE,
                    images: [],
                    price: values.price ?? 1000,
                    quantity: values.quantity ?? 1,
                    type: ProductClassificationTypeEnum.DEFAULT,
                    sku: values.sku ?? ''
                  }
                ]
        }
        await createProductFn(transformedData)
        setIsLoading(false)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }
  useEffect(() => {
    if (useProfileData?.data?.brands?.[0]?.id) {
      form.setValue('brand', useProfileData.data.brands[0].id)
    }
  }, [useProfileData, form, resetSignal])
  useEffect(() => {
    if (useCategoryData?.data) {
      setCategories(useCategoryData.data)
    }
  }, [form, resetSignal, useCategoryData])
  return (
    <>
      {isLoading && <LoadingLayer />}
      <div className='space-y-3 relative flex sm:gap-3 gap-0 justify-between'>
        <div className='lg:w-[72%] md:w-[70%] sm:w-[85%] w-full'>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full grid gap-4 mb-8'
              id={`form-${id}`}
            >
              <BasicInformation
                form={form}
                resetSignal={resetSignal}
                useCategoryData={categories}
                setActiveStep={setActiveStep}
                activeStep={activeStep}
                setCompleteSteps={setCompleteSteps}
              />
              <DetailInformation
                form={form}
                resetSignal={resetSignal}
                useCategoryData={categories}
                setIsValid={setIsValid}
                setActiveStep={setActiveStep}
                activeStep={activeStep}
                setCompleteSteps={setCompleteSteps}
                isValid={isValid}
              />
              <SalesInformation
                form={form}
                resetSignal={resetSignal}
                setIsValid={setIsValid}
                setActiveStep={setActiveStep}
                activeStep={activeStep}
                setCompleteSteps={setCompleteSteps}
              />
              <div className='w-full flex flex-row-reverse justify-start gap-3'>
                <Button type='submit' onClick={() => form.setValue('status', ProductEnum.OFFICIAL)}>
                  {t('button.submit')}
                </Button>
                {/* <Button
                  variant='outline'
                  className='border border-primary hover:bg-primary/10 text-primary hover:text-primary'
                  type='submit'
                  onClick={() => form.setValue('status', ProductEnum.INACTIVE)}
                >
                  {t('button.submitAndHide')}
                </Button> */}
                <Button
                  variant='outline'
                  className='border border-primary hover:bg-primary/10 text-primary hover:text-primary'
                  type='submit'
                  onClick={() => {
                    handleReset()
                    navigate(routesConfig[Routes.PRODUCT_LIST].getPath())
                  }}
                >
                  {t('button.cancel')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className='lg:w-[28%] md:w-[30%] sm:w-[15%] w-0 sm:block hidden'>
          <div className='fixed right-8'>
            <StepTrackingVertical
              steps={getSteps()}
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              completeSteps={completeSteps}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateProduct
