import { Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import UploadProductImages from './UploadProductImages'

interface BasicInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
  defineFormSignal?: boolean
}

type IClassificationOption = { title: string; options: string[] }
type ICombination = {
  title?: string
  price?: number
  quantity?: number
  image?: string
}

export default function SalesInformation({ form, resetSignal, defineFormSignal }: BasicInformationProps) {
  const [classificationCount, setClassificationCount] = useState<number>(0)
  const [classificationsOptions, setClassificationsOptions] = useState<IClassificationOption[]>([])
  const [combinations, setCombinations] = useState<ICombination[]>([])

  // const generateCombinations = () => {
  //   if (classificationsOptions.length === 0) return

  //   const [options1 = [''], options2 = ['']] = classificationsOptions.map((c) => c.options) // Ensure options2 defaults to ['']
  //   const newCombinations: { title: string; price: number | ''; quantity: number | '' }[] = []

  //   options1.forEach((o1) => {
  //     options2.forEach((o2) => {
  //       newCombinations.push({
  //         title: o2 ? `${o1}-${o2}` : `${o1}`, // Avoid appending '-' if o2 is empty
  //         price: '',
  //         quantity: ''
  //       })
  //     })
  //   })

  //   setCombinations(newCombinations)
  // }

  const regenerateCombinations = (updatedOptions: { title: string; options: string[] }[]) => {
    const [options1 = [], options2 = ['']] = updatedOptions.map((c) => c.options)
    const newCombinations: ICombination[] = []

    options1.forEach((o1) => {
      options2.forEach((o2) => {
        const existingCombination = combinations.find((combo) => combo.title === (o2 ? `${o1}-${o2}` : `${o1}`))

        newCombinations.push({
          title: o2 ? `${o1}-${o2}` : `${o1}`,
          price: existingCombination?.price ?? undefined,
          quantity: existingCombination?.quantity ?? undefined
        })
      })
    })

    setCombinations(newCombinations)
  }
  const regenerateUpdatedOptions = (newCombinations: ICombination[]): IClassificationOption[] => {
    const updatedOptions: IClassificationOption[] = []

    // Extract unique options from combinations
    const optionsSet1 = new Set<string>()
    const optionsSet2 = new Set<string>()

    newCombinations.forEach((combo) => {
      const parts = combo?.title?.split('-') ?? ''
      optionsSet1.add(parts[0])
      if (parts[1]) {
        optionsSet2.add(parts[1])
      }
    })

    // Construct updatedOptions from sets
    const options1 = Array.from(optionsSet1)
    const options2 = Array.from(optionsSet2)

    if (options1.length) {
      updatedOptions.push({ title: `Phân loại 1`, options: options1 })
    }

    if (options2.length) {
      updatedOptions.push({ title: `Phân loại 2`, options: options2 })
    }

    return updatedOptions
  }

  const handleAddClassification = () => {
    if (classificationCount >= 2) return
    setClassificationCount((prev) => prev + 1)
    setClassificationsOptions((prev) => [...prev, { title: '', options: [] }])

    const currentClassifications = form.getValues('productClassifications') || []
    form.setValue('productClassifications', [
      ...currentClassifications,
      { title: '', image: '', type: '', price: 0, quantity: 1 }
    ])

    form.resetField('price')
    form.resetField('quantity')
  }

  const handleRemoveClassification = (index: number) => {
    setClassificationCount((prev) => prev - 1)

    // Remove the selected classification
    const updatedOptions = classificationsOptions.filter((_, i) => i !== index)
    setClassificationsOptions(updatedOptions)

    const currentClassifications = form.getValues('productClassifications') || []
    const updatedClassifications = currentClassifications.filter((_, i) => i !== index)

    // Update the form's productClassifications
    form.setValue('productClassifications', updatedClassifications)

    if (updatedOptions.length <= 0) {
      setCombinations([]) // Reset combinations if no classifications
      return
    }

    // Regenerate combinations based on updated options
    regenerateCombinations(updatedOptions)
  }

  const handleAddOption = (classificationIndex: number) => {
    const updatedOptions = [...classificationsOptions]
    updatedOptions[classificationIndex].options.push('')
    setClassificationsOptions(updatedOptions)
    regenerateCombinations(updatedOptions)
  }

  const handleUpdateOption = (classificationIndex: number, optionIndex: number, value: string) => {
    const updatedOptions = [...classificationsOptions]
    updatedOptions[classificationIndex].options[optionIndex] = value
    setClassificationsOptions(updatedOptions)
    regenerateCombinations(updatedOptions)
    const currentClassifications = form.getValues('productClassifications')
    form.setValue(
      'productClassifications',
      currentClassifications.map((item, idx) => {
        if (idx === classificationIndex) {
          return { ...item, options: updatedOptions[classificationIndex].options }
        }
        return item
      })
    )
  }

  const handleRemoveOption = (classificationIndex: number, optionIndex: number) => {
    const updatedOptions = [...classificationsOptions]
    updatedOptions[classificationIndex].options.splice(optionIndex, 1)
    setClassificationsOptions(updatedOptions)
    regenerateCombinations(updatedOptions)
  }
  const handleReset = () => {
    setClassificationCount(0)
    setClassificationsOptions([])
    setCombinations([])
  }
  useEffect(() => {
    handleReset()
  }, [resetSignal])

  useEffect(() => {
    // Extract product classifications
    const newCombinations = form?.getValues('productClassifications') ?? []
    const classificationsOptions = regenerateUpdatedOptions(newCombinations)
    const newClassificationCount = classificationsOptions?.length
    // Generate combinations

    // Update state
    setClassificationCount(newClassificationCount)
    setClassificationsOptions(classificationsOptions)
    setCombinations(newCombinations)
  }, [defineFormSignal, form])

  return (
    <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='font-bold text-xl'>Thông tin bán hàng</h2>
        </div>
        <div>
          <FormField
            control={form.control}
            name='productClassifications'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='w-full flex'>
                  <div className='w-[15%]'>
                    <FormLabel required={classificationCount > 0}>Phân loại hàng</FormLabel>
                  </div>
                  <div className='w-full space-y-1'>
                    <div className='w-full space-y-3'>
                      {classificationCount < 2 && (
                        <Button
                          variant='outline'
                          size='sm'
                          type='button'
                          className='flex items-center gap-1'
                          onClick={handleAddClassification}
                          disabled={classificationCount >= 2}
                        >
                          <Plus className='w-4 h-4' />
                          Thêm nhóm phân loại
                        </Button>
                      )}
                      {(classificationsOptions ?? []).length > 0 && (
                        <>
                          {(classificationsOptions ?? []).map((classification, index) => (
                            <div className='relative bg-primary/5 rounded-lg p-4' key={classification?.title || index}>
                              <X
                                onClick={() => handleRemoveClassification(index)}
                                className='text-destructive hover:cursor-pointer hover:text-destructive/80 absolute right-4 top-4'
                              />
                              <FormControl>
                                <div className='space-y-2'>
                                  <div className='flex gap-2 items-center'>
                                    <div className='w-[10%]'>
                                      <FormLabel required={classificationCount > 0}>Phân loại {index + 1}</FormLabel>
                                    </div>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      className='border border-primary/40 text-primary hover:bg-primary/20 hover:text-primary'
                                      onClick={() => handleAddOption(index)}
                                    >
                                      Thêm Option
                                    </Button>
                                  </div>
                                  <div className='grid grid-cols-2 gap-x-5 gap-y-3 lg:gap-x-10'>
                                    {classification.options.map((option, optionIndex) => (
                                      <div key={optionIndex} className='flex items-center gap-2'>
                                        <Input
                                          placeholder={`Option ${optionIndex + 1}`}
                                          value={option}
                                          onChange={(e) => handleUpdateOption(index, optionIndex, e.target.value)}
                                          className='border-primary/40 w-full'
                                        />
                                        {option === '' ||
                                          option === undefined ||
                                          (option === null && (
                                            <span className='font-semibold text-destructive text-xs'>
                                              Vui lòng nhập tên phân loại
                                            </span>
                                          ))}
                                        <Trash2
                                          onClick={() => handleRemoveOption(index, optionIndex)}
                                          className='text-destructive cursor-pointer hover:text-destructive/80'
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </FormControl>
                            </div>
                          ))}
                        </>
                      )}
                      {combinations.length > 0 && (
                        <div className='mt-4 bg-primary/5 rounded-lg p-4 space-y-2'>
                          <h3 className='text-md font-semibold'>Tùy chọn giá và số lượng</h3>
                          <div>
                            <Table className='hover:bg-transparent items-center'>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>
                                    <FormLabel required styleParent='justify-center'>
                                      Phân loại 1
                                    </FormLabel>
                                  </TableHead>
                                  {classificationCount === 2 && (
                                    <TableHead>
                                      <FormLabel required styleParent='justify-center'>
                                        Phân loại 2
                                      </FormLabel>
                                    </TableHead>
                                  )}
                                  <TableHead>
                                    <FormLabel required styleParent='justify-center'>
                                      Giá
                                    </FormLabel>
                                  </TableHead>
                                  <TableHead>
                                    <FormLabel required styleParent='justify-center'>
                                      Kho hàng
                                    </FormLabel>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {combinations.map((combo, index) => (
                                  <TableRow key={index}>
                                    {/* <div key={index} className='flex items-center gap-4 mt-2'> */}
                                    <TableCell className='space-y-2'>
                                      <FormLabel styleParent='justify-center'>
                                        {combo?.title?.split('-')[0]?.trim()}
                                      </FormLabel>
                                      <FormField
                                        control={form.control}
                                        name={`productClassifications.${index}.image`}
                                        render={({ field }) => (
                                          <FormItem className='w-full'>
                                            <div className='flex w-full'>
                                              <FormControl>
                                                <div className='w-full space-y-1 flex justify-center'>
                                                  <UploadProductImages field={field} maxFileInput={1} />
                                                  <FormMessage />
                                                </div>
                                              </FormControl>
                                            </div>
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
                                    {classificationCount === 2 && (
                                      <TableCell>
                                        <FormLabel styleParent='justify-center'>
                                          {combo?.title?.split('-')[1]?.trim()}
                                        </FormLabel>
                                      </TableCell>
                                    )}
                                    <TableCell>
                                      <Input
                                        placeholder='Giá'
                                        type='number'
                                        {...field}
                                        value={combo?.price ?? 0}
                                        onChange={(e) => {
                                          const updated = [...combinations]
                                          updated[index].price = e.target.value ? parseFloat(e.target.value) : undefined
                                          setCombinations(updated)
                                          field.onChange(updated)
                                        }}
                                        className='border-primary/40 w-full'
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        placeholder='Số lượng'
                                        type='number'
                                        {...field}
                                        value={combo.quantity ?? 1}
                                        onChange={(e) => {
                                          const updated = [...combinations]
                                          updated[index].quantity = e.target.value
                                            ? parseFloat(e.target.value)
                                            : undefined
                                          setCombinations(updated)
                                          field.onChange(updated)
                                        }}
                                        className='border-primary/40 w-full'
                                      />
                                    </TableCell>
                                    {/* </div> */}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
        {classificationsOptions?.length === 0 && (
          <div className='space-y-3'>
            <FormField
              control={form.control}
              name='price'
              render={({ field, fieldState }) => (
                <FormItem className='w-full'>
                  <div className='w-full flex'>
                    <div className='w-[15%]'>
                      <FormLabel required>Giá</FormLabel>
                    </div>
                    <div className='w-full space-y-1'>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Nhập vào'
                          className='border-primary/40'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value && parseFloat(value))
                            handleReset()
                            form.resetField('productClassifications')
                          }}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='w-full flex'>
                    <div className='w-[15%]'>
                      <FormLabel required>Kho hàng</FormLabel>
                    </div>
                    <div className='w-full space-y-1'>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Nhập vào'
                          className='border-primary/40'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value && parseFloat(value))
                            handleReset()
                            form.resetField('productClassifications')
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}
