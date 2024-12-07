import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getCategoryApi } from '@/network/apis/category'
import { getUserProfileApi } from '@/network/apis/user'
import { createProductApi } from '@/network/product'
import { ICategory } from '@/types/category'
import { IServerCreateProduct, ProductClassificationTypeEnum, ProductEnum } from '@/types/product'
import { IStepper } from '@/types/stepper'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import StepTracking, { StepTrackingVertical } from '../step-tracking'
import { Button } from '../ui/button'
import { Form } from '../ui/form'
import BasicInformation from './BasicInformation'
import DetailInformation from './DetailInformation'
import SalesInformation from './SalesInformation'

const CreateProduct = () => {
  const [resetSignal, setResetSignal] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [activeStep, setActiveStep] = useState(1)
  const [completeSteps, setCompleteSteps] = useState<number[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])

  const id = useId()
  const { successToast } = useToast()
  const navigate = useNavigate()
  const handleServerError = useHandleServerError()

  const steps: IStepper[] = [
    {
      id: 1,
      title: 'Thông Tin Cơ bản',
      isCompleted: true,
      isActive: false
    },
    {
      id: 2,
      title: 'Thông tin chi tiết',
      isCompleted: false,
      isActive: true
    },
    {
      id: 3,
      title: 'Thông tin phân loại sản phẩm',
      isCompleted: false,
      isActive: false
    }
  ]

  const defaultProductValues = {
    name: '',
    brand: '',
    category: '',
    images: [],
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
    queryKey: [getCategoryApi.queryKey],
    queryFn: getCategoryApi.fn
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
            ? 'Product created successfully! It is active and visible on the website after moderator approval.'
            : 'Product created successfully! It is currently inactive and will not be visible until activated.'
      })
      handleReset()
    }
  })

  async function onSubmit(values: z.infer<typeof FormProductSchema>) {
    try {
      console.log(isValid)
      if (isValid) {
        const transformedData: IServerCreateProduct = {
          name: values?.name,
          category: values?.category,
          status: values?.status,
          brand: (useProfileData?.data?.brands ?? [])[0]?.id ?? '',
          images: values.images.map((image) => ({
            fileUrl: image // Transform image strings to objects
          })),
          description: values?.description,
          sku: values?.sku,
          detail: JSON.stringify(values.detail), // Convert detail object to a string
          productClassifications:
            (values?.productClassifications ?? [])?.length > 0
              ? values?.productClassifications
              : [
                  {
                    title: 'Default',
                    image: [],
                    price: values.price ?? 1000,
                    quantity: values.quantity ?? 1,
                    type: ProductClassificationTypeEnum.DEFAULT,
                    sku: values.sku
                  }
                ]
        }
        await createProductFn(transformedData)
        console.log(transformedData)
      }
    } catch (error) {
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
  console.log(completeSteps)
  return (
    <div className='space-y-3 relative flex gap-3 justify-between'>
      <div className='w-[75%]'>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (e) => console.error(form.getValues(), e))}
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
                Submit and Show
              </Button>
              <Button variant='outline' type='submit' onClick={() => form.setValue('status', ProductEnum.INACTIVE)}>
                Submit and Hide
              </Button>
              <Button
                variant='outline'
                type='submit'
                onClick={() => {
                  handleReset()
                  navigate(routesConfig[Routes.PRODUCT_LIST].getPath())
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className='w-[25%]'>
        <div className='fixed right-8'>
          <StepTrackingVertical
            steps={steps}
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            completeSteps={completeSteps}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateProduct
