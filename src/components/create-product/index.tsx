import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getUserProfileApi } from '@/network/apis/user'
import { createProductApi } from '@/network/product'
import { ProductClassificationTypeEnum, ProductEnum } from '@/types/product'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import { Button } from '../ui/button'
import { Form } from '../ui/form'
import BasicInformation from './BasicInformation'
import DetailInformation from './DetailInformation'
import SalesInformation from './SalesInformation'

const CreateProduct = () => {
  const { data: useProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const [resetSignal, setResetSignal] = useState(false)
  const [isValid, setIsValid] = useState(true)

  const id = useId()
  const { successToast } = useToast()
  const navigate = useNavigate()

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

  const handleServerError = useHandleServerError()

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
      if (isValid) {
        const transformedData = {
          ...values,
          brand: (useProfileData?.data?.brands ?? [])[0]?.id ?? '',
          images: values.images.map((image) => ({
            fileUrl: image // Transform image strings to objects
          })),
          detail: JSON.stringify(values.detail), // Convert detail object to a string
          productClassifications:
            (values?.productClassifications ?? [])?.length > 0
              ? values?.productClassifications
              : [
                  {
                    title: 'Default',
                    image: 'default image',
                    price: values.price ?? 1000,
                    quantity: values.quantity ?? 1,
                    type: ProductClassificationTypeEnum.DEFAULT
                  }
                ]
        }
        await createProductFn(transformedData)
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
  return (
    <div>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full grid gap-4 mb-8' id={`form-${id}`}>
          <BasicInformation form={form} resetSignal={resetSignal} />
          <DetailInformation form={form} resetSignal={resetSignal} />
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
