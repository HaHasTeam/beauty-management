import { useState } from 'react'

import { IFormValues } from '@/types/productForm'

import { Button } from '../ui/button'
import BasicInformation from './BasicInformation'
import DetailInformation from './DetailInformation'
import SalesInformation from './SalesInformation'

const CreateProduct = () => {
  const [formValues, setFormValues] = useState<IFormValues>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanFormValues = Object.entries(formValues).reduce((acc: IFormValues, [key, value]) => {
      if (
        value !== null && // Exclude null values
        value !== undefined && // Exclude undefined values
        !(Array.isArray(value) && value.length === 0) && // Exclude empty arrays
        !(typeof value === 'string' && value.trim() === '') // Exclude empty strings
      ) {
        acc[key] = value // Include only valid values
      }
      return acc
    }, {})
    setFormValues(cleanFormValues)
  }
  return (
    <div>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <BasicInformation />
        <DetailInformation formValues={formValues} setFormValues={setFormValues} />
        <SalesInformation />
        <Button type='submit'>Submit</Button>
      </form>
    </div>
  )
}

export default CreateProduct
