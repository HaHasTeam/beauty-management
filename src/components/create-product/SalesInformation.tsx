import { Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductClassificationTypeEnum } from '@/types/product'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import UploadProductImages from './UploadProductImages'

interface SalesInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
  defineFormSignal?: boolean
  setIsValid: React.Dispatch<boolean>
}

type IClassificationOption = { title: string; options: string[] }
type ICombination = {
  title?: string
  price?: number
  quantity?: number
  image?: string[]
  type?: string
  sku?: string
}

export default function SalesInformation({ form, resetSignal, defineFormSignal, setIsValid }: SalesInformationProps) {
  const [classificationCount, setClassificationCount] = useState<number>(0)
  const [classificationsOptions, setClassificationsOptions] = useState<IClassificationOption[]>([])
  const [combinations, setCombinations] = useState<ICombination[]>([])
  const [errorOption, setErrorOption] = useState<string>('')
  const [duplicateOptionIndex, setDuplicateOptionIndex] = useState<number | null>(null)

  const validateOptionTitles = (
    classificationOptions: IClassificationOption[],
    classificationIndex: number
  ): number | null => {
    const options = classificationOptions[classificationIndex].options
    const optionSet = new Set()
    for (let i = 0; i < options.length; i++) {
      if (optionSet.has(options[i])) {
        return i
      }
      optionSet.add(options[i])
    }
    return null
  }
  const regenerateCombinations = (updatedOptions: { title: string; options: string[] }[]) => {
    const [options1 = [], options2 = ['']] = updatedOptions.map((c) => c.options)
    const newCombinations: ICombination[] = []

    options1.forEach((o1) => {
      options2.forEach((o2) => {
        const existingCombination = combinations.find((combo) => combo.title === (o2 ? `${o1}-${o2}` : `${o1}`))

        newCombinations.push({
          title: o2 ? `${o1}-${o2}` : `${o1}`,
          price: existingCombination?.price ?? undefined,
          quantity: existingCombination?.quantity ?? undefined,
          image: existingCombination?.image ?? [],
          type: existingCombination?.type ?? ProductClassificationTypeEnum.CUSTOM,
          sku: existingCombination?.sku ?? ''
        })
      })
    })
    setCombinations(newCombinations)
    form.setValue('productClassifications', newCombinations)
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

  const handleRemoveCombination = (index: number) => {
    // Create a copy of the existing combinations
    const updatedCombinations = [...combinations]

    // Remove the combination at the specified index
    updatedCombinations.splice(index, 1)

    // Update the combinations state
    setCombinations(updatedCombinations)

    // Optionally, handle other side effects
    // For example: Reset form values for this combination if using React Hook Form
    form.setValue('productClassifications', updatedCombinations)
  }

  const handleAddClassification = () => {
    if (classificationCount >= 2) return
    setClassificationCount((prev) => prev + 1)
    setClassificationsOptions((prev) => [...prev, { title: '', options: [] }])

    const currentClassifications = form.getValues('productClassifications') || []
    const newClassification = {
      title: '',
      image: [],
      type: ProductClassificationTypeEnum?.CUSTOM,
      price: undefined,
      quantity: undefined
    }

    const updatedClassifications = [...currentClassifications, newClassification]

    form.setValue('productClassifications', updatedClassifications)

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
    const duplicateIndex = validateOptionTitles(updatedOptions, classificationIndex)

    setDuplicateOptionIndex(duplicateIndex)
    if (duplicateIndex !== null) {
      setIsValid(false)
      setErrorOption('Each option in the same classification must have a unique name.')
    } else {
      setIsValid(true)
      setErrorOption('')
      regenerateCombinations(updatedOptions)
    }
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
          <h2 className='font-bold text-xl'>Thông tin phân loại sản phẩm</h2>
        </div>
        <div>
          <div className='w-full flex mb-3'>
            <FormField
              control={form.control}
              name='sku'
              render={({ field, fieldState }) => (
                <FormItem className='w-full'>
                  <div className='w-full flex'>
                    <div className='w-[15%]'>
                      <FormLabel required>SKU sản phẩm</FormLabel>
                    </div>
                    <div className='w-full space-y-1'>
                      <FormControl>
                        <Input
                          type='string'
                          placeholder='Nhập SKU sản phẩm'
                          className='border-primary/40'
                          {...field}
                          value={field?.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
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

                        <div className='space-y-2'>
                          <div className='flex gap-2 items-center'>
                            <div>
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
                              <div key={optionIndex} className='flex flex-col gap-2'>
                                <div className='flex items-center gap-2'>
                                  <FormField
                                    control={form.control}
                                    name={`productClassifications.${index}.title`}
                                    render={({ field, fieldState }) => (
                                      <FormItem className='w-full'>
                                        <div className='flex gap-2 items-center'>
                                          <FormControl>
                                            <Input
                                              placeholder={`e.g. Red etc`}
                                              {...field}
                                              value={option}
                                              onChange={(e) => {
                                                handleUpdateOption(index, optionIndex, e.target.value)
                                              }}
                                              className='border-primary/40 w-full'
                                            />
                                          </FormControl>
                                          <Trash2
                                            onClick={() => handleRemoveOption(index, optionIndex)}
                                            className='text-destructive cursor-pointer hover:text-destructive/80'
                                          />
                                        </div>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                        {errorOption && optionIndex === duplicateOptionIndex && (
                                          <div className='font-semibold text-destructive text-xs'>{errorOption}</div>
                                        )}
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
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
                                <FormLabel required styleParent='justify-center text-center'>
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
                                Số lượng
                              </FormLabel>
                            </TableHead>
                            <TableHead>
                              <FormLabel styleParent='justify-center'>SKU sản phẩm</FormLabel>
                            </TableHead>
                            <TableHead>
                              <FormLabel styleParent='justify-center'>Thao tác</FormLabel>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {combinations.map((combo, index) => (
                            <TableRow key={index}>
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
                                          <div className='w-full space-y-1 flex flex-col justify-center items-center'>
                                            <UploadProductImages field={field} maxFileInput={4} />
                                            <FormMessage />
                                          </div>
                                        </FormControl>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              {classificationCount === 2 && (
                                <TableCell className='align-middle'>
                                  <FormLabel styleParent='justify-center h-9 align-middle'>
                                    {combo?.title?.split('-')[1]?.trim()}
                                  </FormLabel>
                                  <div className='h-5'></div>
                                </TableCell>
                              )}
                              <TableCell className='align-middle'>
                                <FormField
                                  control={form.control}
                                  name={`productClassifications.${index}.price`}
                                  render={({ field, fieldState }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder='Nhập giá'
                                          type='number'
                                          {...field}
                                          value={combo?.price ?? ''}
                                          onChange={(e) => {
                                            const updated = [...combinations]
                                            updated[index].price = e.target.value
                                              ? parseFloat(e.target.value)
                                              : undefined
                                            setCombinations(updated)
                                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                                          }}
                                          className='border-primary/40 w-full'
                                        />
                                      </FormControl>
                                      <div className='h-5'>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell className='align-middle'>
                                <FormField
                                  control={form.control}
                                  name={`productClassifications.${index}.quantity`}
                                  render={({ field, fieldState }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder='Nhập số lượng'
                                          type='number'
                                          {...field}
                                          value={combo.quantity ?? ''}
                                          onChange={(e) => {
                                            const updated = [...combinations]
                                            updated[index].quantity = e.target.value
                                              ? parseFloat(e.target.value)
                                              : undefined
                                            setCombinations(updated)
                                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                                          }}
                                          className='border-primary/40 w-full'
                                        />
                                      </FormControl>
                                      <div className='h-5'>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell className='align-middle'>
                                <FormField
                                  control={form.control}
                                  name={`productClassifications.${index}.sku`}
                                  render={({ field, fieldState }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder='Nhập SKU sản phẩm'
                                          type='string'
                                          {...field}
                                          value={combo.sku ?? 1}
                                          onChange={(e) => {
                                            const updated = [...combinations]
                                            updated[index].sku = e.target.value
                                            setCombinations(updated)
                                            field.onChange(e.target.value)
                                          }}
                                          className='border-primary/40 w-full'
                                        />
                                      </FormControl>
                                      <div className='h-5'>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell className='align-middle'>
                                <div className='flex justify-center h-9 align-middle'>
                                  <Trash2
                                    onClick={() => handleRemoveCombination(index)}
                                    className='text-destructive cursor-pointer hover:text-destructive/80'
                                  />
                                </div>
                                <div className='h-5'></div>
                              </TableCell>
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
                      <FormLabel required>Số lượng</FormLabel>
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
