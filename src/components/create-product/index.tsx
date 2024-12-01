import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getUserProfileApi } from '@/network/apis/user'
import { createProductApi } from '@/network/product'
import { useStore } from '@/stores/store'
import { ProductClassificationTypeEnum, ProductEnum } from '@/types/product'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import { Button } from '../ui/button'
import { Form } from '../ui/form'
import BasicInformation from './BasicInformation'
import DetailInformation from './DetailInformation'
import SalesInformation from './SalesInformation'

const CreateProduct = () => {
  const { isAuthenticated, isLoading } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      authData: state.authData,
      setAuthState: state.setAuthState
    }))
  )
  const { data: useProfileData, isLoading: isGettingUserProfile } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const [resetSignal, setResetSignal] = useState(false)

  const id = useId()
  const { successToast } = useToast()
  const navigate = useNavigate()

  const defaultProductValues = {
    name: '',
    brand: '9efbce21-328e-4189-a433-6852dbf76a45',
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
      if (isAuthenticated && !isLoading && !isGettingUserProfile) {
        form.setValue('brand', (useProfileData?.data?.brand ?? [])[0] ?? '9efbce21-328e-4189-a433-6852dbf76a45')
      }
      const transformedData = {
        ...values,
        images: values.images.map((image) => ({
          fileUrl: image // Transform image strings to objects
        })),
        detail: JSON.stringify(values.detail), // Convert detail object to a string
        productClassifications:
          values.productClassifications?.length > 0
            ? values.productClassifications
            : [
                {
                  title: 'Default',
                  image: 'default image',
                  price: values.price ?? 1000, // Ensure fallback values
                  quantity: values.quantity ?? 1,
                  type: ProductClassificationTypeEnum.DEFAULT
                }
              ]
      }

      // Call mutation with the transformed data
      await createProductFn(transformedData)

      console.log('Original Values:', values)
      console.log('Transformed Data:', transformedData)
      // handleReset();
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  return (
    <div>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full grid gap-4 mb-8' id={`form-${id}`}>
          <BasicInformation form={form} resetSignal={resetSignal} />
          <DetailInformation form={form} resetSignal={resetSignal} />
          <SalesInformation form={form} resetSignal={resetSignal} />
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
