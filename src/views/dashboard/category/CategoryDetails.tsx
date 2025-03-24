import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ClipboardType, Layers2Icon, SaveAll, Siren, Trash2 } from 'lucide-react'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import SelectCategory from '@/components/select-order copy'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Creatable from '@/components/ui/react-select/Creatable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SortableLinks from '@/components/ui/SortableLinks'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { addCategoryApi, getCategoryByIdApi, updateCategoryByIdApi } from '@/network/apis/category'
import { AddCategoryRequestParams } from '@/network/apis/category/type'
import {
  CategoryStatusEnum,
  CategoryType as CategoryDetailType,
  CategoryTypeEnum,
  categoryTypeOptions,
  InputTypeEnum
} from '@/types/category'

import { CategoryType, convertFormToCategory, formSchema, FormType } from './helper'

const defaultFieldName = 'initField' + Date.now()

const CategoryDetails = () => {
  const { id: categoryId } = useParams()
  const queryClient = useQueryClient()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const navigate = useNavigate()

  const id = useId()
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasSubcategories: false,
      name: '',
      shouldInheritParent: true,
      parentCategory: undefined,
      detail: {
        [defaultFieldName]: {
          label: '',
          required: true,
          type: CategoryTypeEnum.input,
          inputType: InputTypeEnum.text,
          order: 0
        }
      }
    }
  })

  const { successToast } = useToast()

  const handleServerError = useHandleServerError()

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
      form.setValue('detail', category.detail as FormType['detail'])
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

  const { mutateAsync: updateCategoryFn, isPending: isUpdatingCategory } = useMutation({
    mutationKey: [updateCategoryByIdApi.fn],
    mutationFn: updateCategoryByIdApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing!, Category has been updated successfully'
      })
    }
  })

  const detailFields = form.watch('detail')

  const handleBackToCategory = () => {
    navigate(routesConfig[Routes.CATEGORY].getPath())
  }

  const onSubmit = async (data: FormType) => {
    try {
      if (categoryId) {
        await updateCategoryFn({
          name: data.name,
          detail: data.detail as FormType['detail'] as Record<string, CategoryDetailType>,
          parentCategory: data.parentCategory,
          id: categoryId
        })
        return queryClient.invalidateQueries({
          queryKey: [getCategoryByIdApi.queryKey, { categoryId: categoryId }]
        })
      } else {
        await addCategoryFn(convertFormToCategory(data as FormType) as AddCategoryRequestParams)
      }
      handleBackToCategory()
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  const fields = Object.keys(detailFields ?? {})
    .map((key) => {
      return {
        id: key,
        ...detailFields?.[key]
      }
    })
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id)
      const newIndex = fields.findIndex((item) => item.id === over?.id)

      const newFields = [...fields]
      const swapFields = newFields[oldIndex]
      newFields[oldIndex] = newFields[newIndex]
      newFields[newIndex] = swapFields
      const reOrderFields = newFields.map((item, index) => {
        return {
          ...item,
          order: index
        }
      })
      const objectFields = reOrderFields.reduce((acc, item) => {
        Object.assign(acc, { ...acc, [item.id]: item })
        return acc
      }, {})
      form.setValue('detail', objectFields)
    }
  }

  const handleRemove = (key: string) => () => {
    const fields = form.getValues('detail')
    delete fields?.[key]

    form.setValue('detail', fields)
  }
  const isRemoveDisabled = fields?.length === 1

  const handleAddMore = async () => {
    const isValid = await form.trigger('detail')
    if (isValid) {
      const newField: CategoryType = {
        label: '',
        required: true,
        type: CategoryTypeEnum.input,
        inputType: InputTypeEnum.number,
        order: Object.keys(detailFields ?? 0).length
      } as CategoryType

      const defaultFieldName = 'initField' + Date.now()
      const currentFields = form.getValues('detail') ?? {}
      const newFields = {
        ...currentFields,
        [defaultFieldName]: { ...newField }
      }
      const stringObject = JSON.stringify(newFields)
      form.setValue('detail', JSON.parse(stringObject))
    }
  }
  const categoryItem = { ...detailCategoryById?.data[0] }

  const handleChangeStatus = async (status: CategoryStatusEnum) => {
    try {
      await updateCategoryFn({
        id: categoryId,
        status
      })
      queryClient.invalidateQueries({
        queryKey: [getCategoryByIdApi.queryKey, { categoryId: categoryId }]
      })
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  const getHeader = () => {
    const id = categoryItem?.id
    if (!id) return null
    switch (categoryItem?.status) {
      case CategoryStatusEnum.ACTIVE:
        return (
          <Alert variant={'success'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div className='flex flex-col'>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-green-300 bg-green-400 text-white'>Active</span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>This category is currently active and visible to your customers.</AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(CategoryStatusEnum.INACTIVE)
              }}
              loading={isUpdatingCategory}
              variant={'default'}
            >
              {'Close category'}
            </AlertAction>
          </Alert>
        )
      case CategoryStatusEnum.INACTIVE:
        return (
          <Alert variant={'default'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div className='flex flex-col'>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-gray-300 bg-gray-400 text-white'>Inactive</span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>
                  This category is currently inactive and not visible to your customers.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(CategoryStatusEnum.ACTIVE)
              }}
              loading={isUpdatingCategory}
              variant={'success'}
            >
              {'Open category'}
            </AlertAction>
          </Alert>
        )
      default:
        return null
    }
  }

  return (
    <>
      {getHeader()}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex flex-col gap-8'
          id={`form-${id}`}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-1'>
                <Layers2Icon />
                Category Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='w-full gap-4 flex flex-col'>
                <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Name Of Category</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. Cleaning facial tonner' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`parentCategory`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Parent Of Category</FormLabel>
                        <SelectCategory {...field} value={field.value ?? ''} except={categoryId ? [categoryId] : []} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-1 w-full justify-between'>
                <div className='flex items-center gap-1'>
                  <ClipboardType />
                  Category Details
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='gap-4 grid grid-flow-row grid-cols-1'>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                >
                  <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                    <Accordion
                      type='multiple'
                      className='w-full flex flex-col gap-4'
                      value={fields.map((_, index) => String(index))}
                    >
                      {fields.map((itemField, index) => {
                        const item = { ...itemField }
                        return (
                          <SortableLinks
                            key={index}
                            item={item}
                            children={
                              <AccordionItem value={String(index)} key={index} className='border-none w-full'>
                                <AccordionTrigger className='hover:no-underline border-none'>
                                  <div className='flex items-center gap-2 w-full'>
                                    <span className='bg-green-600 px-4 py-1 text-white rounded-3xl items-center flex gap-1 uppercase text-xs font-extrabold'>
                                      <QuestionMarkCircledIcon />
                                      Field {index + 1}
                                    </span>
                                    <div className='ml-auto mr-2 flex items-center gap-8'>
                                      <button
                                        className=' disabled:opacity-20 cursor-pointer'
                                        onClick={handleRemove(item.id)}
                                        disabled={isRemoveDisabled}
                                        type='button'
                                      >
                                        <Trash2 color='red' strokeWidth={3} size={20} />
                                      </button>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className='border-none'>
                                  <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2' key={item.id}>
                                    <FormField
                                      control={form.control}
                                      name={`detail.${item.id}.type`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel required>Type Of Question</FormLabel>
                                          <div className='w-full flex-1 flex'>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                              <FormControl>
                                                <SelectTrigger className='z-[2] rounded-r-none'>
                                                  <SelectValue
                                                    className='flex-1'
                                                    placeholder='Select type of question
                                      '
                                                  />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                {categoryTypeOptions.map((option) => (
                                                  <SelectItem
                                                    key={option.value}
                                                    value={option.value as CategoryTypeEnum}
                                                  >
                                                    {option.label.replace(/_/g, ' ')}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                            <FormField
                                              control={form.control}
                                              name={`detail.${item.id}.required`}
                                              render={({ field }) => (
                                                <div
                                                  className={cn(
                                                    'flex h-9 rounded-md border border-input bg-background px-4 py-2 text-sm gap-1',
                                                    'ring-offset-background file:border-0 file:bg-transparent file:text-sm',
                                                    'file:font-medium file:text-foreground placeholder:text-muted-foreground',
                                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                                    'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-l-none'
                                                  )}
                                                >
                                                  <FormItem>
                                                    <FormControl>
                                                      <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                      />
                                                    </FormControl>
                                                    <FormMessage />
                                                  </FormItem>
                                                  <FormLabel>Required</FormLabel>
                                                </div>
                                              )}
                                            />
                                          </div>

                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name={`detail.${item.id}.label`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel required>Label</FormLabel>
                                          <FormControl>
                                            <Input placeholder={`e.g. label A`} {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    {fields[index]?.type === CategoryTypeEnum.input && (
                                      <FormField
                                        control={form.control}
                                        name={`detail.${item.id}.inputType`}
                                        render={({ field }) => {
                                          return (
                                            <FormItem>
                                              <FormLabel required>Type Of Input</FormLabel>
                                              <div className='w-full flex-1 flex'>
                                                <Select
                                                  onValueChange={field.onChange}
                                                  value={field.value}
                                                  defaultValue={field.value}
                                                >
                                                  <FormControl>
                                                    <SelectTrigger>
                                                      <SelectValue
                                                        className='flex-1'
                                                        placeholder='Select type of input
                                      '
                                                      />
                                                    </SelectTrigger>
                                                  </FormControl>
                                                  <SelectContent>
                                                    {Object.keys(InputTypeEnum).map((key) => (
                                                      <SelectItem
                                                        key={key}
                                                        value={InputTypeEnum[key as keyof typeof InputTypeEnum]}
                                                        className='uppercase'
                                                      >
                                                        {InputTypeEnum[key as keyof typeof InputTypeEnum]
                                                          .replace('_', ' ')
                                                          .toUpperCase()}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>

                                              <FormMessage />
                                            </FormItem>
                                          )
                                        }}
                                      />
                                    )}
                                    {
                                      <>
                                        {(fields[index]?.type === CategoryTypeEnum.singleChoice ||
                                          fields[index]?.type === CategoryTypeEnum.multipleChoice) && (
                                          <FormField
                                            control={form.control}
                                            name={`detail.${item.id}.options`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel required>Choice options</FormLabel>
                                                <FormControl>
                                                  <Creatable isMulti {...field} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        )}
                                      </>
                                    }
                                    {fields[index]?.type === CategoryTypeEnum.date && (
                                      <FormItem className='space-y-3'>
                                        <FormLabel required>Date Rule</FormLabel>
                                        <FormControl>
                                          <RadioGroup
                                            className='flex flex-col space-y-0.5'
                                            defaultValue='none'
                                            value={
                                              fields[index]?.onlyFutureDates
                                                ? 'future'
                                                : fields[index]?.onlyPastDates
                                                  ? 'past'
                                                  : 'none'
                                            }
                                            onValueChange={(value) => {
                                              const isFuture = value === 'future'
                                              const isPast = value === 'past'
                                              form.setValue(`detail.${item.id}.onlyFutureDates`, isFuture)
                                              form.setValue(`detail.${item.id}.onlyPastDates`, isPast)
                                            }}
                                          >
                                            <FormItem className='flex items-center space-x-2 space-y-0'>
                                              <FormControl>
                                                <RadioGroupItem value='none' />
                                              </FormControl>
                                              <FormLabel className='font-light'>No rule anymore</FormLabel>
                                            </FormItem>
                                            <FormItem className='flex items-center space-x-2 space-y-0'>
                                              <FormControl>
                                                <RadioGroupItem value='future' />
                                              </FormControl>
                                              <FormLabel className='font-light'>Date should be in the future</FormLabel>
                                            </FormItem>
                                            <FormItem className='flex items-center space-x-2 space-y-0'>
                                              <FormControl>
                                                <RadioGroupItem value='past' />
                                              </FormControl>
                                              <FormLabel className='font-light'>Date should be in the past</FormLabel>
                                            </FormItem>
                                          </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            }
                          />
                        )
                      })}
                    </Accordion>
                  </SortableContext>
                </DndContext>
                <div className='mb-4 flex w-full gap-2'>
                  <Button size='sm' type='button' onClick={handleAddMore}>
                    Add more
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className='justify-end flex w-full gap-4'>
            <Button type='submit' className='mt-4' loading={form.formState.isSubmitting}>
              <SaveAll />
              Save Category
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default CategoryDetails
