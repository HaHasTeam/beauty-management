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

import StepTracking from '../step-tracking'
import { Button } from '../ui/button'
import { Form } from '../ui/form'
import BasicInformation from './BasicInformation'
import DetailInformation from './DetailInformation'
import SalesInformation from './SalesInformation'

const CreateProduct = () => {
  const [resetSignal, setResetSignal] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [categories, setCategories] = useState<ICategory[]>([])

  const id = useId()
  const { successToast } = useToast()
  const navigate = useNavigate()
  const handleServerError = useHandleServerError()

  const steps: IStepper[] = [
    {
      id: 1,
      title: 'Thông Tin Chung',
      isCompleted: true,
      isActive: false
    },
    {
      id: 2,
      title: 'Mô Tả Sản Phẩm',
      isCompleted: false,
      isActive: true,
      isExpanded: true,
      content: 'Vui lòng nhập tên sản phẩm và chọn đúng danh mục để xem các thông tin'
    },
    {
      id: 3,
      title: 'Các Lựa Chọn & Vận Hành',
      isCompleted: false,
      isActive: false
    },
    {
      id: 4,
      title: 'Tài liệu yêu cầu',
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

  return (
    <div className='space-y-3'>
      <div className='w-full'>
        <StepTracking steps={steps} currentSteps={0} setCurrentSteps={() => {}} orientation={'horizontal'} />
      </div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit, (e) => console.error(form.getValues(), e))}
          className='w-full grid gap-4 mb-8'
          id={`form-${id}`}
        >
          <BasicInformation form={form} resetSignal={resetSignal} useCategoryData={categories} />
          <DetailInformation
            form={form}
            resetSignal={resetSignal}
            useCategoryData={categories}
            setIsValid={setIsValid}
          />
          <SalesInformation form={form} resetSignal={resetSignal} setIsValid={setIsValid} />
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
  )
}

export default CreateProduct
