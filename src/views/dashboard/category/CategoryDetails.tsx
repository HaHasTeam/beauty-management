import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, NotebookTabs, SaveAll, SquareStack, XIcon } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useCallback, useEffect, useId, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { ImCancelCircle } from 'react-icons/im'
import { IoAddSharp } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router-dom'
import { z, ZodSchema } from 'zod'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Creatable from '@/components/ui/react-select/Creatable'
import { Switch } from '@/components/ui/switch'
import { Routes, routesConfig } from '@/configs/routes'
import { defaultRequiredRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { addCategoryApi, getCategoryByIdApi, updateCategoryByIdApi } from '@/network/apis/category'
import {
  CategoryType,
  CategoryTypeEnum,
  categoryTypeOptions,
  ICategory,
  InputTypeEnum,
  inputTypeOptions
} from '@/types/category'
import { getKeyFromString } from '@/utils/string'

import { convertFormToCategory, FormType } from './helper'

const defaultFieldName = 'initField' + Date.now()

const optionSchema = z.object({
  label: z.string(),
  value: z.string()
})

const categoryTypeSchema: ZodSchema<CategoryType> = z
  .object({
    label: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
    required: z.boolean()
  })
  .and(
    z.union([
      z.object({
        type: z.literal(CategoryTypeEnum.input),
        inputType: z.nativeEnum(InputTypeEnum)
      }),
      z.object({
        type: z.union([z.literal(CategoryTypeEnum.singleChoice), z.literal(CategoryTypeEnum.multipleChoice)]),
        options: z.array(optionSchema).nonempty({
          message: defaultRequiredRegex.message
        })
      }),
      z.object({
        type: z.literal(CategoryTypeEnum.date)
      })
    ])
  )

const formSchema: z.ZodSchema<FormType> = z.lazy(() =>
  z.object({
    name: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
    detail: z.record(categoryTypeSchema).optional(),
    parentCategory: z.string().optional(),
    subCategories: z.array(z.lazy(() => formSchema)).optional(),
    hasSubcategories: z.boolean().default(false),
    shouldInheritParent: z.boolean().default(true)
  })
)

const CategoryDetails = () => {
  const { id: categoryId } = useParams()

  const navigate = useNavigate()
  const [selectedCategory] = useQueryState('selectedCategory', parseAsString.withDefault('root'))

  const id = useId()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasSubcategories: false,
      name: '',
      shouldInheritParent: true,
      parentCategory: undefined
    }
  })

  const { successToast } = useToast()

  const handleServerError = useHandleServerError()

  const { data: parentCategory } = useQuery({
    queryKey: [
      getCategoryByIdApi.queryKey,
      {
        categoryId: selectedCategory
      }
    ],
    queryFn: getCategoryByIdApi.fn,
    enabled: selectedCategory !== 'root' && categoryId === 'add'
  })

  const { data: detailCategoryById } = useQuery({
    queryKey: [
      getCategoryByIdApi.queryKey,
      {
        categoryId: categoryId ?? ''
      }
    ],
    queryFn: getCategoryByIdApi.fn,
    enabled: categoryId !== 'add'
  })

  useEffect(() => {
    const category = detailCategoryById?.data[0]
    if (category) {
      form.setValue('name', category.name)
      form.setValue('parentCategory', category.parentCategory?.id)
      form.setValue('detail', category.detail)
    }
  }, [detailCategoryById, form])

  const { mutateAsync: addCategoryFn } = useMutation({
    mutationKey: [addCategoryApi.mutationKey],
    mutationFn: addCategoryApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing!, Category has been added successfully'
      })
    }
  })

  const { mutateAsync: updateCategoryFn } = useMutation({
    mutationKey: [updateCategoryByIdApi.fn],
    mutationFn: updateCategoryByIdApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing!, Category has been updated successfully'
      })
    }
  })

  const categoryOptions = useMemo(() => {
    const options: {
      label: string
      value: string | undefined
    }[] = [
      {
        label: 'Root',
        value: undefined
      }
    ]
    if (parentCategory?.data) {
      parentCategory?.data.forEach((category: ICategory) => {
        options.push({
          label: category.name,
          value: category.id
        })
      })
    }
    return options
  }, [parentCategory])

  const detailFields = form.watch('detail')

  const isCreatingDetailField = useMemo(() => {
    if (!detailFields) return false
    return Object.keys(detailFields).includes(defaultFieldName)
  }, [detailFields])

  const handleAppendDetailField = useCallback(
    (key: string, payload: CategoryType) => {
      const fieldKey = key
      const detailFields = form.getValues('detail')

      if (!detailFields) {
        const fieldRecord = {
          [fieldKey]: payload
        }
        form.setValue('detail', fieldRecord)
        return
      } else {
        const fieldRecord = {
          ...detailFields,
          [fieldKey]: payload
        }
        form.setValue('detail', fieldRecord)
      }
    },
    [form]
  )

  const handleAddField = () => {
    const newField: CategoryType = {
      label: '',
      required: true,
      type: CategoryTypeEnum.input,
      inputType: InputTypeEnum.text
    } as CategoryType
    handleAppendDetailField(defaultFieldName, newField)
  }

  const handleSaveDetailField = (key: string, payload: CategoryType) => {
    if (!payload.label) return
    if (key === defaultFieldName) {
      handleRemoveField(key)
    }
    handleAppendDetailField(getKeyFromString(payload.label), payload)
  }

  const handleRemoveField = (key: string) => {
    const detailFields = form.getValues('detail')
    if (!detailFields) {
      return
    } else {
      const newDetailFields = { ...detailFields }
      delete newDetailFields[key]
      form.setValue('detail', newDetailFields)
    }
  }

  const handleBackToCategory = () => {
    navigate(routesConfig[Routes.CATEGORY].getPath())
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (categoryId !== 'add') {
        await updateCategoryFn({
          name: data.name,
          detail: data.detail,
          parentCategory: data.parentCategory,
          id: categoryId
        })
      } else {
        await addCategoryFn(convertFormToCategory(data))
      }
      handleBackToCategory()
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  useEffect(() => {
    if (parentCategory?.data) {
      form.setValue('parentCategory', parentCategory.data[0].id)
    } else {
      form.setValue('parentCategory', undefined)
    }
  }, [parentCategory, form])

  useEffect(() => {
    const shouldInheritParent = form.watch('shouldInheritParent')
    const parentDetail = parentCategory?.data[0]?.detail
    if (shouldInheritParent && parentDetail) {
      form.setValue('detail', parentDetail)
    }
  }, [parentCategory, form, handleAppendDetailField])

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full' id={`form-${id}`}>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-1'>
              <NotebookTabs />
              Category Details
            </CardTitle>
            <CardDescription>Manipulate the category details here.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='w-full gap-4 flex flex-col'>
              <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Category's Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Fill out the category name' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name of the category that will be displayed on the website.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`parentCategory`}
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel required>Category's Parent</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                            >
                              {categoryOptions.find((item) => item.value === field.value)?.label ||
                                `Select category's parent`}
                              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-full p-0' style={{ width: 'var(--radix-popover-trigger-width)' }}>
                          <Command>
                            <CommandInput placeholder={`Search for category's parent...`} />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {categoryOptions.map((item) => (
                                  <CommandItem
                                    value={item.label}
                                    key={item.value}
                                    onSelect={() => {
                                      form.setValue(`parentCategory`, item.value)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        item.value === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {item.label}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Base on the category parents, the category will be displayed differently on the website.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name='hasSubcategories'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Enable Subcategories?</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} className='' />
                      </FormControl>
                      <FormDescription>
                        If enabled, this category will have subcategories. If disabled, this category will be a leaf
                        category.
                      </FormDescription>
                    </FormItem>
                  )}
                /> */}
                {categoryId === 'add' && (
                  <FormField
                    control={form.control}
                    name='shouldInheritParent'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Enable Inherit Field From Parent?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} className='' />
                        </FormControl>
                        <FormDescription>
                          If enabled, this category will inherit the fields from the parent category.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              {
                <>
                  {detailFields && Object.keys(detailFields).length > 0 && (
                    <>
                      <span>
                        <h3 className='text-lg font-semibold flex items-center gap-2'>
                          <SquareStack />
                          Category Fields
                        </h3>
                      </span>
                      {Object.keys(detailFields).map((fields) => {
                        return (
                          <div
                            className='flex gap-4 flex-col p-4 border-2 border-dashed shadow-md rounded-2xl'
                            key={fields}
                          >
                            <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                              <FormField
                                control={form.control}
                                name={`detail.${fields}.type`}
                                render={({ field }) => (
                                  <FormItem className='flex flex-col'>
                                    <FormLabel required>Category's Field Type</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant='outline'
                                            role='combobox'
                                            className={cn(
                                              'w-full justify-between',
                                              !field.value && 'text-muted-foreground'
                                            )}
                                          >
                                            {field.value
                                              ? categoryTypeOptions.find((item) => item.value === field.value)?.label ||
                                                'Select category type'
                                              : 'Select category type'}
                                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className='w-full p-0'
                                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                                      >
                                        <Command>
                                          <CommandInput placeholder='Search for category type...' />
                                          <CommandEmpty>No category type found.</CommandEmpty>
                                          <CommandGroup>
                                            <CommandList>
                                              {categoryTypeOptions.map((item) => (
                                                <CommandItem
                                                  value={item.label}
                                                  key={item.value}
                                                  onSelect={() => {
                                                    form.setValue(`detail.${fields}.type`, item.value)
                                                  }}
                                                >
                                                  <Check
                                                    className={cn(
                                                      'mr-2 h-4 w-4',
                                                      item.value === field.value ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                  />
                                                  {item.label}
                                                </CommandItem>
                                              ))}
                                            </CommandList>
                                          </CommandGroup>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                      Base on the category type, the form will be rendered differently.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`detail.${fields}.label`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel required>Category's Field Label</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Fill out the category's field label`} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      This is the label of the category field that will be displayed on the website.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`detail.${fields}.required`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel required>Enable Field Required?</FormLabel>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} className='' />
                                    </FormControl>
                                    <FormDescription>
                                      If enabled, this field will be required when creating a new product.
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />
                              {detailFields[fields].type === CategoryTypeEnum.input && (
                                <FormField
                                  control={form.control}
                                  name={`detail.${fields}.inputType`}
                                  shouldUnregister
                                  render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                      <FormLabel required>Category's Field Input Type</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button
                                              variant='outline'
                                              role='combobox'
                                              className={cn(
                                                'w-full justify-between',
                                                !field.value && 'text-muted-foreground'
                                              )}
                                            >
                                              {field.value
                                                ? inputTypeOptions.find((item) => item.value === field.value)?.label ||
                                                  'Select category input type'
                                                : 'Select category input type'}
                                              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                            </Button>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className='w-full p-0'
                                          style={{ width: 'var(--radix-popover-trigger-width)' }}
                                        >
                                          <Command>
                                            <CommandInput placeholder='Search for category input type...' />
                                            <CommandEmpty>No category input type found.</CommandEmpty>
                                            <CommandGroup>
                                              <CommandList>
                                                {inputTypeOptions.map((item) => (
                                                  <CommandItem
                                                    value={item.label}
                                                    key={item.value}
                                                    onSelect={() => {
                                                      form.setValue(`detail.${fields}.inputType`, item.value)
                                                    }}
                                                  >
                                                    <Check
                                                      className={cn(
                                                        'mr-2 h-4 w-4',
                                                        item.value === field.value ? 'opacity-100' : 'opacity-0'
                                                      )}
                                                    />
                                                    {item.label}
                                                  </CommandItem>
                                                ))}
                                              </CommandList>
                                            </CommandGroup>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>
                                      <FormDescription>
                                        Base on the category input type, the form will be rendered differently.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                              {
                                <>
                                  {(detailFields[fields].type === CategoryTypeEnum.singleChoice ||
                                    detailFields[fields].type === CategoryTypeEnum.multipleChoice) && (
                                    <FormField
                                      control={form.control}
                                      name={`detail.${fields}.options`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel required>Category's Field Options</FormLabel>
                                          <FormControl>
                                            <Creatable isMulti {...field} />
                                          </FormControl>
                                          <FormDescription>
                                            This is the options of the category field that will be displayed on the
                                            website.
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  )}
                                </>
                              }
                            </div>
                            <div className='flex items-center gap-4 justify-between'>
                              <Button
                                type='button'
                                variant='ghost'
                                onClick={() => {
                                  handleRemoveField(fields)
                                }}
                              >
                                <XIcon className='h-6 w-6' />
                                Discard
                              </Button>
                              {fields === defaultFieldName && (
                                <Button
                                  variant={'secondary'}
                                  onClick={() => {
                                    const formValues = form.getValues('detail')?.[fields]
                                    if (formValues) {
                                      handleSaveDetailField(fields, formValues)
                                    }
                                  }}
                                >
                                  <Check className='h-6 w-6' />
                                  Save
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}
                  {!isCreatingDetailField && (
                    <span className='ml-auto'>
                      <Button
                        size='lg'
                        variant={'ghost'}
                        className='rounded-3xl'
                        type='button'
                        onClick={handleAddField}
                      >
                        <IoAddSharp className='h-6 w-6' />
                        {Object.keys(detailFields ?? {}).length > 0 ? 'Add Another Field' : 'Configure Category Field'}
                      </Button>
                    </span>
                  )}
                </>
              }
            </div>
          </CardContent>
        </Card>
        <div className='justify-end flex w-full gap-4'>
          <Button
            type='button'
            className='mt-4 ml-4'
            variant='secondary'
            disabled={form.formState.isSubmitting}
            onClick={handleBackToCategory}
          >
            <ImCancelCircle />
            Discard All
          </Button>
          <Button type='submit' className='mt-4' loading={form.formState.isSubmitting}>
            <SaveAll />
            Save All
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CategoryDetails
