import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getUserProfileApi } from '@/network/apis/user'
import { createProductApi, getProductApi, updateProductApi } from '@/network/product'
import { ICreateProduct, ProductClassificationTypeEnum, ProductEnum } from '@/types/product'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import BasicInformation from '../create-product/BasicInformation'
import DetailInformation from '../create-product/DetailInformation'
import SalesInformation from '../create-product/SalesInformation'
import { Button } from '../ui/button'
import { Form } from '../ui/form'

const UpdateProduct = () => {
  const { id } = useParams()
  const productId = id ?? ''
  const formId = useId()
  const [resetSignal, setResetSignal] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [defineFormSignal, setDefineFormSignal] = useState(false)

  const { successToast } = useToast()
  const navigate = useNavigate()
  const handleServerError = useHandleServerError()

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

  const { data: useProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })

  const { data: productData, isFetching: isGettingProduct } = useQuery({
    queryKey: [getProductApi.queryKey, productId as string],
    queryFn: getProductApi.fn,
    enabled: !!productId
  })

  const form = useForm<z.infer<typeof FormProductSchema>>({
    resolver: zodResolver(FormProductSchema),
    defaultValues: defaultProductValues
  })

  const handleReset = () => {
    form.reset()
    setResetSignal((prev) => !prev)
  }

  const { mutateAsync: updateProductFn } = useMutation({
    mutationKey: [updateProductApi.mutationKey],
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
      if (isValid) {
        const transformedData = {
          ...values,
          brand: productData?.data[0]?.brand?.id ?? '',
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
        await updateProductFn(transformedData)
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
    console.log(productData?.data)
    if (productData?.data) {
      const formValue: ICreateProduct = {
        id: productData?.data[0]?.id,
        name: productData?.data[0].name,
        brand: productData?.data[0]?.brand?.id,
        category: productData?.data[0]?.category?.id,
        images: productData?.data[0]?.images?.map((image) => image.fileUrl),
        description: productData?.data[0]?.description,
        detail: productData?.data[0]?.detail,
        productClassifications: productData?.data[0]?.productClassifications,
        status: productData?.data[0]?.status
      }
      console.log(productData)
      console.log(formValue)
      form.reset(formValue)
      setDefineFormSignal((prev) => !prev)
    }
  }, [productData?.data, form, resetSignal])

  return (
    <div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full grid gap-4 mb-8'
          id={`form-${formId}`}
        >
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

export default UpdateProduct
