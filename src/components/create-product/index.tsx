import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useToast } from '@/hooks/useToast'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import { Button } from '../ui/button'
import { Form } from '../ui/form'
import BasicInformation from './BasicInformation'
import DetailInformation from './DetailInformation'
import SalesInformation from './SalesInformation'

const CreateProduct = () => {
  const id = useId()
  const { successToast } = useToast()
  const defaultProductValues = {
    name: '',
    category: '',
    images: [],
    description: '',
    detail: {},
    productClassifications: []
  }

  const form = useForm<z.infer<typeof FormProductSchema>>({
    resolver: zodResolver(FormProductSchema),
    defaultValues: defaultProductValues
  })
  function onSubmit(data: z.infer<typeof FormProductSchema>) {
    successToast({
      message: JSON.stringify(data, null, 2)
    })
    form.getValues()
    form.reset()
  }
  return (
    <div>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full grid gap-4 mb-8' id={`form-${id}`}>
          <BasicInformation form={form} />
          <DetailInformation form={form} />
          <SalesInformation form={form} />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateProduct
