import { ImagePlus, Package, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import AlertCustom from '@/components/alert'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import FormLabel from '@/components/form-label'
import ImageWithFallback from '@/components/image/ImageWithFallback'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input, InputNormal } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IProductClassification, ProductClassificationTypeEnum } from '@/types/product'
import { IClassificationOption, ICombination, SalesInformationProps } from '@/types/productForm'
import { regenerateUpdatedOptions } from '@/utils/product-form/saleInformationForm'
import { validateOptionTitles, validateSKUs } from '@/utils/product-form/validation'

import UploadProductImages from './UploadProductImages'

export default function SalesInformation({
  form,
  resetSignal,
  defineFormSignal,
  setIsValid,
  setCompleteSteps,
  activeStep,
  setActiveStep,
  mode = 'create'
}: SalesInformationProps) {
  const SALE_INFORMATION_INDEX = 3
  const MAX_CLASSIFICATION_LEVEL = 3
  const MAX_PRODUCT_CLASSIFICATION_IMAGES = 4

  const { t } = useTranslation()
  const [classificationCount, setClassificationCount] = useState<number>(0)
  const [classificationsOptions, setClassificationsOptions] = useState<IClassificationOption[]>([])
  const [combinations, setCombinations] = useState<ICombination[]>([])
  const [originalCombinations, setOriginalCombinations] = useState<ICombination[]>([])
  const [errorOption, setErrorOption] = useState<string>('')
  const [errorSKUMessage, setErrorSKUMessage] = useState<string>('')
  const [duplicateOptionIndex, setDuplicateOptionIndex] = useState<number | null>(null)
  const [duplicatedSKUIndex, setDuplicatedSKUIndex] = useState<number[]>([])
  const [isImagesUpload, setIsImagesUpload] = useState<boolean>(false)
  const [isAllowEditing, setIsAllowEditing] = useState<boolean>(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [usedClassificationTypes, setUsedClassificationTypes] = useState<{ [key: number]: string }>({})
  const selectedCategory = form.watch('category')
  const saleInfoRef = useRef<HTMLDivElement>(null)
  const productClassificationsForm = form.watch('productClassifications')
  const price = form.watch('price') ?? -1
  const quantity = form.watch('quantity') ?? -1

  // Update classification name selection handling
  const handleClassificationNameChange = (value: string, index: number) => {
    // Update used classification types for this level
    setUsedClassificationTypes((prev) => ({
      ...prev,
      [index]: value
    }))

    // Update classification options
    const updatedOptions = [...classificationsOptions]
    updatedOptions[index].title = value
    setClassificationsOptions(updatedOptions)
    regenerateCombinations(updatedOptions)
  }

  // Helper function to check if a classification type is used in other levels
  const isClassificationTypeUsedInOtherLevels = (type: string, currentIndex: number) => {
    return Object.entries(usedClassificationTypes).some(
      ([levelIndex, usedType]) => parseInt(levelIndex) !== currentIndex && usedType === type
    )
  }

  // const regenerateCombinations = (updatedOptions: { title: string; options: string[] }[]) => {
  //   const [options1 = [], options2 = [''], options3 = ['']] = updatedOptions.map((c) => c.options)
  //   const newCombinations: ICombination[] = []

  //   options1.forEach((o1) => {
  //     if (options2[0] === '') {
  //       // Only one classification level
  //       const existingCombination = combinations.find((combo) => combo?.title === o1)
  //       const classification1Type = updatedOptions[0]?.title.toLowerCase()

  //       newCombinations.push({
  //         title: o1,
  //         price: existingCombination?.price ?? undefined,
  //         quantity: existingCombination?.quantity ?? undefined,
  //         images: existingCombination?.images ?? [],
  //         type: existingCombination?.type ?? ProductClassificationTypeEnum.CUSTOM,
  //         sku: existingCombination?.sku ?? '',
  //         [classification1Type]: o1
  //       })
  //     } else {
  //       options2.forEach((o2) => {
  //         if (options3[0] === '') {
  //           // Two classification levels
  //           const existingCombination = combinations.find((combo) => combo?.title === `${o1}-${o2}`)
  //           const classification1Type = updatedOptions[0]?.title.toLowerCase()
  //           const classification2Type = updatedOptions[1]?.title.toLowerCase()

  //           newCombinations.push({
  //             title: `${o1}-${o2}`,
  //             price: existingCombination?.price ?? undefined,
  //             quantity: existingCombination?.quantity ?? undefined,
  //             images: existingCombination?.images ?? [],
  //             type: existingCombination?.type ?? ProductClassificationTypeEnum.CUSTOM,
  //             sku: existingCombination?.sku ?? '',
  //             [classification1Type]: o1,
  //             [classification2Type]: o2
  //           })
  //         } else {
  //           // Three classification levels
  //           options3.forEach((o3) => {
  //             const existingCombination = combinations.find((combo) => combo?.title === `${o1}-${o2}-${o3}`)
  //             const classification1Type = updatedOptions[0]?.title.toLowerCase()
  //             const classification2Type = updatedOptions[1]?.title.toLowerCase()
  //             const classification3Type = updatedOptions[2]?.title.toLowerCase()

  //             newCombinations.push({
  //               title: `${o1}-${o2}-${o3}`,
  //               price: existingCombination?.price ?? undefined,
  //               quantity: existingCombination?.quantity ?? undefined,
  //               images: existingCombination?.images ?? [],
  //               type: existingCombination?.type ?? ProductClassificationTypeEnum.CUSTOM,
  //               sku: existingCombination?.sku ?? '',
  //               [classification1Type]: o1,
  //               [classification2Type]: o2,
  //               [classification3Type]: o3
  //             })
  //           })
  //         }
  //       })
  //     }
  //   })

  //   setCombinations(newCombinations)
  //   form.setValue('productClassifications', newCombinations)
  // }
  const regenerateCombinations = (updatedOptions: { title: string; options: string[] }[]) => {
    const [options1 = [], options2 = [''], options3 = ['']] = updatedOptions.map((c) => c.options)
    const newCombinations: ICombination[] = []

    // Create a lookup map from the original combinations
    const originalCombinationMap: Record<string, ICombination> = {}
    originalCombinations.forEach((combo) => {
      // Store the original combination with its unique ID
      if (combo.id) {
        originalCombinationMap[combo.id] = combo
      }
    })

    options1.forEach((o1) => {
      if (options2[0] === '') {
        // Only one classification level
        const classification1Type = updatedOptions[0]?.title.toLowerCase()

        // Look for an existing combination in both current and original combinations
        const existingCombination = combinations.find(
          (combo) => combo?.[classification1Type as keyof ICombination] === o1
        )

        // Find original combination that matches the same pattern
        const originalCombo = originalCombinations.find(
          (combo) => combo?.[classification1Type as keyof ICombination] === o1
        )

        // Use the ID from original if available, or from existing, or undefined for new
        const id = originalCombo?.id || existingCombination?.id

        newCombinations.push({
          id,
          title: o1,
          price: existingCombination?.price ?? originalCombo?.price ?? undefined,
          quantity: existingCombination?.quantity ?? originalCombo?.quantity ?? undefined,
          images: existingCombination?.images ?? originalCombo?.images ?? [],
          type: existingCombination?.type ?? originalCombo?.type ?? ProductClassificationTypeEnum.CUSTOM,
          sku: existingCombination?.sku ?? originalCombo?.sku ?? '',
          [classification1Type]: o1
        })
      } else {
        options2.forEach((o2) => {
          if (options3[0] === '') {
            // Two classification levels
            const classification1Type = updatedOptions[0]?.title.toLowerCase()
            const classification2Type = updatedOptions[1]?.title.toLowerCase()

            // For two classifications, we need to match on both values
            const existingCombination = combinations.find(
              (combo) =>
                combo?.[classification1Type as keyof ICombination] === o1 &&
                combo?.[classification2Type as keyof ICombination] === o2
            )

            // Find in original combinations
            const originalCombo = originalCombinations.find(
              (combo) =>
                combo?.[classification1Type as keyof ICombination] === o1 &&
                combo?.[classification2Type as keyof ICombination] === o2
            )

            // Prioritize original ID
            const id = originalCombo?.id || existingCombination?.id

            newCombinations.push({
              id,
              title: `${o1}-${o2}`,
              price: existingCombination?.price ?? originalCombo?.price ?? undefined,
              quantity: existingCombination?.quantity ?? originalCombo?.quantity ?? undefined,
              images: existingCombination?.images ?? originalCombo?.images ?? [],
              type: existingCombination?.type ?? originalCombo?.type ?? ProductClassificationTypeEnum.CUSTOM,
              sku: existingCombination?.sku ?? originalCombo?.sku ?? '',
              [classification1Type]: o1,
              [classification2Type]: o2
            })
          } else {
            // Three classification levels
            options3.forEach((o3) => {
              const classification1Type = updatedOptions[0]?.title.toLowerCase()
              const classification2Type = updatedOptions[1]?.title.toLowerCase()
              const classification3Type = updatedOptions[2]?.title.toLowerCase()

              // For three classifications, match on all three values
              const existingCombination = combinations.find(
                (combo) =>
                  combo?.[classification1Type as keyof ICombination] === o1 &&
                  combo?.[classification2Type as keyof ICombination] === o2 &&
                  combo?.[classification3Type as keyof ICombination] === o3
              )

              // Find in original combinations
              const originalCombo = originalCombinations.find(
                (combo) =>
                  combo?.[classification1Type as keyof ICombination] === o1 &&
                  combo?.[classification2Type as keyof ICombination] === o2 &&
                  combo?.[classification3Type as keyof ICombination] === o3
              )

              // Prioritize original ID
              const id = originalCombo?.id || existingCombination?.id

              newCombinations.push({
                id,
                title: `${o1}-${o2}-${o3}`,
                price: existingCombination?.price ?? originalCombo?.price ?? undefined,
                quantity: existingCombination?.quantity ?? originalCombo?.quantity ?? undefined,
                images: existingCombination?.images ?? originalCombo?.images ?? [],
                type: existingCombination?.type ?? originalCombo?.type ?? ProductClassificationTypeEnum.CUSTOM,
                sku: existingCombination?.sku ?? originalCombo?.sku ?? '',
                [classification1Type]: o1,
                [classification2Type]: o2,
                [classification3Type]: o3
              })
            })
          }
        })
      }
    })

    setCombinations(newCombinations)
    form.setValue('productClassifications', newCombinations)
  }
  const handleRemoveCombination = (index: number) => {
    // Create a copy of the existing combinations
    const updatedCombinations = [...combinations]

    // Remove the combination at the specified index
    updatedCombinations.splice(index, 1)

    // Update the combinations state
    setCombinations(updatedCombinations)

    form.setValue('productClassifications', updatedCombinations)
  }

  const handleAddClassification = () => {
    if (classificationCount >= MAX_CLASSIFICATION_LEVEL) return
    setClassificationCount((prev) => prev + 1)
    setClassificationsOptions((prev) => [...prev, { title: '', options: [] }])

    const currentClassifications = form.getValues('productClassifications') || []
    const newClassification = {
      title: '',
      images: [],
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
    const newClassificationCount = Math.max(0, classificationCount - 1)
    setClassificationCount(newClassificationCount)

    // Remove the classification type for this level
    setUsedClassificationTypes((prev) => {
      const updated = { ...prev }
      delete updated[index]
      // Reindex the remaining classifications
      const reindexed: { [key: number]: string } = {}
      Object.entries(updated)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .forEach(([_, value], i) => {
          reindexed[i] = value
        })
      return reindexed
    })

    // Remove the selected classification
    const updatedOptions = classificationsOptions.filter((_, i) => i !== index)
    setClassificationsOptions(updatedOptions)

    // if (updatedOptions.length <= 0) {
    //   setCombinations([]) // Reset combinations if no classifications
    //   form.setValue('productClassifications', [])
    //   return
    // }
    // Check if this is the last classification being removed
    if (newClassificationCount === 0 || updatedOptions.length === 0) {
      // Clear all related state
      setCombinations([])
      setClassificationsOptions([])
      setUsedClassificationTypes({})
      form.setValue('productClassifications', [])
      return
    }

    const currentClassifications = form.getValues('productClassifications') || []
    const updatedClassifications = currentClassifications.filter((_, i) => i !== index)

    // Update the form's productClassifications
    form.setValue('productClassifications', updatedClassifications)

    // Regenerate combinations based on updated options
    regenerateCombinations(updatedOptions)
  }

  // const handleClassificationNameChange = (value: string, index: number) => {
  //   // Remove old classification type if it exists
  //   const oldTitle = classificationsOptions[index].title
  //   if (oldTitle) {
  //     const updatedUsedTypes = new Set(usedClassificationTypes)
  //     updatedUsedTypes.delete(oldTitle.toLowerCase())
  //     setUsedClassificationTypes(updatedUsedTypes)
  //   }

  //   // Add new classification type
  //   if (value) {
  //     const updatedUsedTypes = new Set(usedClassificationTypes)
  //     updatedUsedTypes.add(value.toLowerCase())
  //     setUsedClassificationTypes(updatedUsedTypes)
  //   }

  //   // Update classification options
  //   const updatedOptions = [...classificationsOptions]
  //   updatedOptions[index].title = value
  //   setClassificationsOptions(updatedOptions)
  //   regenerateCombinations(updatedOptions)
  // }

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
      setErrorOption(t('createProduct.uniqueNameClassification'))
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
    setOriginalCombinations([])
    setUsedClassificationTypes({})
  }
  useEffect(() => {
    handleReset()
  }, [resetSignal])

  useEffect(() => {
    // Extract product classifications
    const newCombinations = form?.getValues('productClassifications') ?? []
    const classificationsOptions = regenerateUpdatedOptions(newCombinations)
    const newClassificationCount = classificationsOptions?.length

    // Update state
    setClassificationCount(newClassificationCount)
    setClassificationsOptions(classificationsOptions)
    setCombinations(newCombinations)
    setOriginalCombinations(newCombinations)

    // Restore classification types in usedClassificationTypes state
    const newUsedTypes: { [key: number]: string } = {}
    classificationsOptions.forEach((option, index) => {
      if (option.title.toLowerCase() !== `${index + 1}`.toLowerCase()) {
        newUsedTypes[index] = option.title.toLowerCase()
      }
    })
    setUsedClassificationTypes(newUsedTypes)

    // Prevent user edit title, color, size, other
    if (mode === 'update' && (classificationsOptions ?? []).length > 0) {
      setIsAllowEditing(false)
    }
  }, [defineFormSignal, form, mode])

  // Scroll to the BasicInformation section when activeStep is 1
  useEffect(() => {
    if (activeStep === SALE_INFORMATION_INDEX && saleInfoRef.current) {
      saleInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeStep])

  useEffect(() => {
    const handleClassificationValidate = (classifications: IProductClassification[]) => {
      return classifications?.every(
        (item) =>
          !!item?.title &&
          !!item?.images?.length &&
          item?.images?.length > 0 &&
          item?.quantity !== undefined &&
          item?.quantity > 0 &&
          item?.price !== undefined &&
          item?.price >= 1000
      )
    }

    setCompleteSteps((prevSteps) => {
      // Ensure a number[] is always returned
      if (productClassificationsForm && productClassificationsForm?.length > 0) {
        if (handleClassificationValidate(productClassificationsForm ?? [])) {
          return prevSteps?.includes(SALE_INFORMATION_INDEX) ? prevSteps : [...prevSteps, SALE_INFORMATION_INDEX]
        }
        // If validation fails, remove the step
        return prevSteps.filter((index) => index !== SALE_INFORMATION_INDEX)
      } else {
        if (price > 0 && quantity > 0) {
          return prevSteps?.includes(SALE_INFORMATION_INDEX) ? prevSteps : [...prevSteps, SALE_INFORMATION_INDEX]
        } else {
          return prevSteps.filter((index) => index !== SALE_INFORMATION_INDEX)
        }
      }
    })
  }, [form, price, productClassificationsForm, combinations, quantity, setCompleteSteps])

  useEffect(() => {
    const { isUnique, errorMessage, duplicatedIndices } = validateSKUs(combinations)
    setIsValid(isUnique)
    setErrorSKUMessage(errorMessage)
    setDuplicatedSKUIndex(duplicatedIndices)
  }, [combinations, setIsValid])

  useEffect(() => {
    if (isImagesUpload) {
      const updatedCombinations = [...combinations]
      updatedCombinations.forEach((_combo, index) => {
        updatedCombinations[index].images = form.getValues(`productClassifications.${index}.images`)
      })
      setCombinations(updatedCombinations)
      setIsImagesUpload(false)
    }
  }, [combinations, form, isImagesUpload])
  return (
    <div
      className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'
      ref={saleInfoRef}
      onClick={() => setActiveStep(SALE_INFORMATION_INDEX)}
    >
      <Accordion
        type='single'
        collapsible
        disabled={selectedCategory === '' || selectedCategory === undefined}
        defaultChecked={selectedCategory === '' || selectedCategory === undefined}
        className={`w-full ${(selectedCategory === '' || selectedCategory === undefined) && 'opacity-50'}`}
        defaultValue='description'
      >
        <AccordionItem value='description'>
          <AccordionTrigger className='pt-0 text-left font-medium no-underline hover:no-underline'>
            <div className='flex gap-2 items-center text-primary'>
              <Package className='w-5 h-5' />
              <h2 className='font-bold text-xl'>{t('createProduct.classificationInformation')}</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {selectedCategory === '' || selectedCategory === undefined ? (
              <AlertCustom message={t('createProduct.pleaseChooseCategoryToViewInformation')} />
            ) : (
              <div className='space-y-3'>
                <div>
                  <div className='w-full flex mb-3'>
                    <FormField
                      control={form.control}
                      name='sku'
                      render={({ field, fieldState }) => (
                        <FormItem className='w-full'>
                          <div className='w-full flex gap-2'>
                            <div className='w-[20%] flex items-center'>
                              <FormLabel required>{t('createProduct.skuProduct')}</FormLabel>
                            </div>
                            <div className='w-[80%] space-y-1'>
                              <FormControl>
                                <Input
                                  type='string'
                                  placeholder={t('createProduct.skuProductPlaceholder')}
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
                  <div className='w-full space-y-3'>
                    <div className='w-full flex gap-2 items-center'>
                      <div className='w-[20%] flex items-center'>
                        <FormLabel required={classificationCount > 0}>
                          {t('createProduct.productClassification')}
                        </FormLabel>
                      </div>
                      {classificationCount < MAX_CLASSIFICATION_LEVEL && (
                        <Button
                          variant='outline'
                          size='sm'
                          type='button'
                          className='flex items-center gap-1'
                          onClick={handleAddClassification}
                          disabled={classificationCount >= MAX_CLASSIFICATION_LEVEL}
                        >
                          <Plus className='w-4 h-4' />
                          {t('createProduct.newProductClassification')}
                        </Button>
                      )}
                    </div>

                    <div className='w-full space-y-1'>
                      <div className='w-full space-y-3'>
                        {(classificationsOptions ?? []).length > 0 && (
                          <div className='bg-primary/10 rounded-lg p-4 space-y-3'>
                            <div className='flex items-center justify-between'>
                              <h3 className='text-md font-semibold text-primary'>
                                {t('createProduct.classificationTitleInformation')}
                              </h3>
                              {!isAllowEditing && (
                                <Button
                                  onClick={() => setOpenDialog(true)}
                                  variant='outline'
                                  size='sm'
                                  type='button'
                                  className='border-primary text-primary hover:text-primary/80 bg-white hover:bg-primary/10 flex gap-2 items-center'
                                >
                                  {t('button.edit')}
                                  <Pencil className='text-primary cursor-pointer hover:text-primary/80' size={14} />
                                </Button>
                              )}
                            </div>
                            {(classificationsOptions ?? []).map((classification, index) => (
                              <div
                                className={`relative rounded-lg p-4 space-y-3 ${!isAllowEditing ? 'opacity-40 bg-gray-100' : 'bg-primary/10 opacity-100'}`}
                                key={classification?.title || index}
                              >
                                <X
                                  onClick={() => {
                                    if (isAllowEditing) {
                                      handleRemoveClassification(index)
                                    }
                                  }}
                                  className={`${isAllowEditing ? 'cursor-pointer' : 'cursor-default'} text-destructive hover:text-destructive/80 absolute right-4 top-2`}
                                />

                                <div className='space-y-2'>
                                  <div className='flex gap-2 items-center'>
                                    <FormLabel required={classificationCount > 0}>
                                      {t('createProduct.chooseClassificationName')}
                                    </FormLabel>
                                    <div className='space-y-1'>
                                      <FormControl>
                                        <Select
                                          onValueChange={(value) => handleClassificationNameChange(value, index)}
                                          value={classification?.title || ''}
                                          disabled={!isAllowEditing}
                                        >
                                          <SelectTrigger className='border bg-white border-primary/40 text-primary hover:bg-primary/20 hover:text-primary'>
                                            <SelectValue
                                              placeholder={t('createProduct.pleaseChooseClassificationName')}
                                              className='border border-primary/40 text-primary hover:bg-primary/20 hover:text-primary'
                                            />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {/* {!usedClassificationTypes.has('color') && (
                                              <SelectItem value='color'>Color</SelectItem>
                                            )}
                                            {!usedClassificationTypes.has('size') && (
                                              <SelectItem value='size'>Size</SelectItem>
                                            )}
                                            {!usedClassificationTypes.has('other') && (
                                              <SelectItem value='other'>Other</SelectItem>
                                            )} */}
                                            <SelectItem
                                              value='color'
                                              disabled={isClassificationTypeUsedInOtherLevels('color', index)}
                                            >
                                              {t('createProduct.color')}
                                            </SelectItem>
                                            <SelectItem
                                              value='size'
                                              disabled={isClassificationTypeUsedInOtherLevels('size', index)}
                                            >
                                              {t('createProduct.size')}
                                            </SelectItem>
                                            <SelectItem
                                              value='other'
                                              disabled={isClassificationTypeUsedInOtherLevels('other', index)}
                                            >
                                              {t('createProduct.other')}
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </div>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      className='border border-primary/40 text-primary hover:bg-primary/20 hover:text-primary'
                                      onClick={() => handleAddOption(index)}
                                      disabled={!isAllowEditing}
                                    >
                                      {t('createProduct.addOption')}
                                    </Button>
                                  </div>
                                  {classification?.title && (
                                    <div className='flex gap-2 items-center'>
                                      <div>
                                        <FormLabel required={classificationCount > 0}>
                                          {t('createProduct.option')}{' '}
                                          <span className='text-primary'>
                                            {t(`createProduct.${classification?.title}`)}:
                                          </span>
                                        </FormLabel>
                                      </div>
                                    </div>
                                  )}
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
                                                      placeholder={t('createProduct.classificationEg')}
                                                      {...field}
                                                      value={option}
                                                      onChange={(e) => {
                                                        handleUpdateOption(index, optionIndex, e.target.value)
                                                      }}
                                                      className='border-primary/40 w-full'
                                                      disabled={!isAllowEditing}
                                                    />
                                                  </FormControl>
                                                  <Trash2
                                                    onClick={() => {
                                                      if (isAllowEditing) {
                                                        handleRemoveOption(index, optionIndex)
                                                      }
                                                    }}
                                                    className={`${isAllowEditing ? 'cursor-pointer' : 'cursor-default'} text-destructive hover:text-destructive/80`}
                                                  />
                                                </div>
                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                                {errorOption && optionIndex === duplicateOptionIndex && (
                                                  <div className='font-semibold text-destructive text-xs'>
                                                    {errorOption}
                                                  </div>
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
                          </div>
                        )}
                        {(classificationsOptions ?? []).length > 0 && combinations.length > 0 && (
                          <div className='mt-4 bg-primary/10 rounded-lg p-4 space-y-2'>
                            <h3 className='text-md font-semibold text-primary'>
                              {t('createProduct.inputPriceAndQuantity')}
                            </h3>
                            <div>
                              <Table className='hover:bg-transparent items-center'>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>
                                      <FormLabel required className='justify-center text-center'>
                                        {classificationsOptions[0]?.title &&
                                          t(`createProduct.${classificationsOptions[0]?.title}`)}
                                      </FormLabel>
                                    </TableHead>
                                    {classificationCount >= 2 && (
                                      <TableHead>
                                        <FormLabel required className='justify-center text-center'>
                                          {classificationsOptions[1]?.title &&
                                            t(`createProduct.${classificationsOptions[1]?.title}`)}
                                        </FormLabel>
                                      </TableHead>
                                    )}
                                    {classificationCount === 3 && (
                                      <TableHead>
                                        <FormLabel required className='justify-center text-center'>
                                          {classificationsOptions[2]?.title &&
                                            t(`createProduct.${classificationsOptions[2]?.title}`)}
                                        </FormLabel>
                                      </TableHead>
                                    )}
                                    <TableHead>
                                      <FormLabel required className='justify-center text-center'>
                                        {t('createProduct.price')}
                                      </FormLabel>
                                    </TableHead>
                                    <TableHead>
                                      <FormLabel required className='justify-center text-center'>
                                        {t('createProduct.quantity')}
                                      </FormLabel>
                                    </TableHead>
                                    <TableHead>
                                      <FormLabel required className='justify-center text-center'>
                                        {t('createProduct.skuProduct')}
                                      </FormLabel>
                                    </TableHead>
                                    <TableHead>
                                      <FormLabel className='justify-center text-center'>
                                        {t('createProduct.action')}
                                      </FormLabel>
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {combinations.map((combo, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <div className='flex flex-col justify-center align-middle space-y-2'>
                                          <FormLabel className='justify-center'>
                                            {combo?.title?.split('-')[0]?.trim()}
                                          </FormLabel>
                                          <FormField
                                            control={form.control}
                                            name={`productClassifications.${index}.images`}
                                            render={({ field }) => (
                                              <FormItem className='w-full'>
                                                <div className='flex w-full'>
                                                  <FormControl>
                                                    <div className='relative w-full space-y-1 flex flex-col justify-center items-center'>
                                                      <UploadProductImages
                                                        field={field}
                                                        vertical={false}
                                                        centerItem
                                                        setIsImagesUpload={setIsImagesUpload}
                                                        dropZoneConfigOptions={{
                                                          maxFiles: MAX_PRODUCT_CLASSIFICATION_IMAGES
                                                        }}
                                                        renderFileItemUI={(file) => {
                                                          return (
                                                            <div
                                                              key={file?.name}
                                                              className='z-0 hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0'
                                                            >
                                                              <ImageWithFallback
                                                                fallback={fallBackImage}
                                                                src={URL?.createObjectURL(file)}
                                                                alt={file?.name}
                                                                className='object-contain w-full h-full rounded-lg'
                                                                onLoad={() =>
                                                                  URL?.revokeObjectURL(URL?.createObjectURL(file))
                                                                }
                                                              />
                                                            </div>
                                                          )
                                                        }}
                                                        renderInputUI={(_isDragActive, files, maxFiles) => {
                                                          return (
                                                            <div className='z-0 w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                                                              <ImagePlus className='w-12 h-12 text-primary' />

                                                              <p className='text-sm text-primary'>
                                                                {t('createProduct.dragOrBrowse')} ({files?.length ?? 0}/
                                                                {maxFiles})
                                                              </p>
                                                            </div>
                                                          )
                                                        }}
                                                      />
                                                      <FormMessage />
                                                    </div>
                                                  </FormControl>
                                                </div>
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                      </TableCell>
                                      {classificationCount >= 2 && (
                                        <TableCell className='align-middle'>
                                          <FormLabel className='justify-center h-9 align-middle'>
                                            {combo?.title?.split('-')[1]?.trim()}
                                          </FormLabel>
                                          <div className='h-5'></div>
                                        </TableCell>
                                      )}
                                      {classificationCount === 3 && (
                                        <TableCell className='align-middle'>
                                          <FormLabel className='justify-center h-9 align-middle'>
                                            {combo?.title?.split('-')[2]?.trim()}
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
                                                <InputNormal
                                                  placeholder={t('createProduct.inputPrice')}
                                                  type='number'
                                                  {...field}
                                                  value={combo?.price ?? ''}
                                                  onChange={(e) => {
                                                    const updated = [...combinations]
                                                    updated[index].price = e.target.value
                                                      ? parseFloat(e.target.value)
                                                      : undefined
                                                    setCombinations(updated)
                                                    field.onChange(
                                                      e.target.value ? parseFloat(e.target.value) : undefined
                                                    )
                                                  }}
                                                  className='border-primary/40 w-full bg-background'
                                                />
                                              </FormControl>
                                              <div className='h-5'>
                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                                {field?.value === undefined && (
                                                  <span className='text-destructive text-xs font-semibold'>
                                                    {t('productFormMessage.priceClassificationRequired')}
                                                  </span>
                                                )}
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
                                                <InputNormal
                                                  placeholder={t('createProduct.inputQuantity')}
                                                  type='number'
                                                  {...field}
                                                  value={combo.quantity ?? ''}
                                                  onChange={(e) => {
                                                    const updated = [...combinations]
                                                    updated[index].quantity = e.target.value
                                                      ? parseFloat(e.target.value)
                                                      : undefined
                                                    setCombinations(updated)
                                                    field.onChange(
                                                      e.target.value ? parseFloat(e.target.value) : undefined
                                                    )
                                                  }}
                                                  className='border-primary/40 w-full bg-background'
                                                />
                                              </FormControl>
                                              <div className='h-5'>
                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                                {field?.value === undefined && (
                                                  <span className='text-destructive text-xs font-semibold'>
                                                    {t('productFormMessage.quantityClassificationRequired')}
                                                  </span>
                                                )}
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
                                                  placeholder={t('createProduct.inputSku')}
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
                                                {errorSKUMessage !== '' && duplicatedSKUIndex?.includes(index) && (
                                                  <span className='text-xs text-destructive font-semibold'>
                                                    {errorSKUMessage}
                                                  </span>
                                                )}
                                              </div>
                                            </FormItem>
                                          )}
                                        />
                                      </TableCell>
                                      <TableCell className='align-middle'>
                                        <div className='flex justify-center h-9 align-middle'>
                                          <Trash2
                                            onClick={() => {
                                              handleRemoveCombination(index)
                                            }}
                                            className={`text-destructive cursor-pointer hover:text-destructive/80`}
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
                          <div className='w-full flex gap-2'>
                            <div className='w-[20%] flex items-center'>
                              <FormLabel required>{t('createProduct.price')}</FormLabel>
                            </div>
                            <div className='w-[80%] space-y-1'>
                              <FormControl>
                                <InputNormal
                                  type='number'
                                  placeholder={t('createProduct.inputPrice')}
                                  className='border-primary/40'
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(value && parseFloat(value))
                                    handleReset()
                                    form.setValue('productClassifications', [])
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
                          <div className='w-full flex gap-2'>
                            <div className='w-[20%] flex items-center'>
                              <FormLabel required>{t('createProduct.quantity')}</FormLabel>
                            </div>
                            <div className='w-[80%] space-y-1'>
                              <FormControl>
                                <InputNormal
                                  type='number'
                                  placeholder={t('createProduct.inputQuantity')}
                                  className='border-primary/40'
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(value && parseFloat(value))
                                    handleReset()
                                    form.setValue('productClassifications', [])
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
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ConfirmDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onConfirm={() => {
          setIsAllowEditing(true)
          setOpenDialog(false)
        }}
        item={'productClassification'}
      />
    </div>
  )
}
