import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getUserProfileApi } from '@/network/apis/user'
import { getProductApi, updateProductApi } from '@/network/product'
import { useStore } from '@/stores/store'
import { ProductEnum } from '@/types/product'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import BasicInformation from '../create-product/BasicInformation'
import DetailInformation from '../create-product/DetailInformation'
import SalesInformation from '../create-product/SalesInformation'
import { Button } from '../ui/button'
import { Form } from '../ui/form'

const UpdateProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      authData: state.authData,
      setAuthState: state.setAuthState
    }))
  )
  const productId = id ?? ''

  const { data: useProfileData, isLoading: isGettingUserProfile } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const { data: productData, isFetching: isGettingProduct } = useQuery({
    queryKey: [getProductApi.queryKey, productId as string],
    queryFn: getProductApi.fn,
    enabled: !!productId
  })

  const [resetSignal, setResetSignal] = useState(false)
  const [defineFormSignal, setDefineFormSignal] = useState(false)

  const formId = useId()
  const { successToast } = useToast()
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

  const { mutateAsync: updateProductFn } = useMutation({
    mutationKey: [updateProductApi.mutationKey, productId as string],
    mutationFn: updateProductApi.fn,
    onSuccess: () => {
      successToast({
        message:
          form.getValues('status') === ProductEnum.OFFICIAL
            ? 'Product updated successfully! It is active and visible on the website after moderator approval.'
            : 'Product updated successfully! It is currently inactive and will not be visible until activated.'
      })
      handleReset()
    }
  })

  async function onSubmit(values: z.infer<typeof FormProductSchema>) {
    try {
      if (isAuthenticated && !isLoading && !isGettingUserProfile) {
        form.setValue('brand', (useProfileData?.data?.brand ?? [])[0] ?? '9efbce21-328e-4189-a433-6852dbf76a45')
      }
      await updateProductFn(values)
      handleReset()
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }
  useEffect(() => {
    if (productData?.data) {
      form.reset(productData?.data)
      setDefineFormSignal((prev) => !prev)
    }
  }, [productData?.data, form])
  return (
    <div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full grid gap-4 mb-8'
          id={`form-${formId}`}
        >
          <BasicInformation form={form} resetSignal={resetSignal} defineFormSignal={defineFormSignal} />
          <DetailInformation form={form} resetSignal={resetSignal} defineFormSignal={defineFormSignal} />
          <SalesInformation form={form} resetSignal={resetSignal} defineFormSignal={defineFormSignal} />
          <div className='w-full flex justify-end gap-3'>
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
            <Button variant='outline' type='submit' onClick={() => form.setValue('status', ProductEnum.INACTIVE)}>
              Submit and Hide
            </Button>
            <Button type='submit' onClick={() => form.setValue('status', ProductEnum.OFFICIAL)}>
              Submit and Show
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UpdateProduct
