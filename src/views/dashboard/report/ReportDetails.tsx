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
import { ClipboardType, SaveIcon, Siren, Trash2 } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { TbBrandAmigo } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/button'
import UploadFiles, { TriggerUploadRef } from '@/components/file-input/UploadFiles'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import SelectSystemService from '@/components/select-system-service'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Creatable from '@/components/ui/react-select/Creatable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SortableLinks from '@/components/ui/SortableLinks'
import { Textarea } from '@/components/ui/textarea'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import {
  addConsultantServiceApi,
  getConsultantServiceByIdApi,
  updateConsultantServiceByIdApi
} from '@/network/apis/consultant-service'
import {
  AddConsultantServiceRequestParams,
  UpdateConsultantServiceByIdRequestParams
} from '@/network/apis/consultant-service/type'
import { ConsultantServiceStatusEnum, ConsultantServiceTypeEnum } from '@/types/consultant-service'
import { TFile } from '@/types/file'

import { convertConsultantServiceToForm, formSchema, SchemaType } from './helper'

const ConsultantServiceDetails = () => {
  const { id: consultantServiceId } = useParams()

  const triggerRef = useRef<TriggerUploadRef>(null)
  const navigate = useNavigate()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const queryClient = useQueryClient()
  const id = useId()
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      serviceBookingFormData: {
        questions: [
          {
            images: [],
            mandatory: true,
            orderIndex: 0
          }
        ]
      }
    }
  })

  const { successToast } = useToast()

  const handleServerError = useHandleServerError()

  const { data: detailConsultantServiceById, isLoading } = useQuery({
    queryKey: [
      getConsultantServiceByIdApi.queryKey,
      {
        consultantServiceId: consultantServiceId ?? ''
      }
    ],
    queryFn: getConsultantServiceByIdApi.fn,
    enabled: !!consultantServiceId
  })

  const { mutateAsync: addConsultantServiceFn } = useMutation({
    mutationKey: [addConsultantServiceApi.mutationKey],
    mutationFn: addConsultantServiceApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing!, Consultant service has been added successfully'
      })
    }
  })

  const { mutateAsync: updateConsultantServiceFn, isPending: isUpdatingService } = useMutation({
    mutationKey: [updateConsultantServiceByIdApi.fn],
    mutationFn: updateConsultantServiceByIdApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing!, Consultant service has been updated successfully'
      })
    }
  })

  const handleBackToConsultantService = () => {
    navigate(routesConfig[Routes.CONSULTANT_SERVICE].getPath())
  }

  const onSubmit = async () => {
    const triggerFns = triggerRef.current?.triggers
    if (triggerFns) {
      await Promise.all(triggerFns.map((trigger) => trigger()))
    }
    const values = formSchema.parse(form.getValues())

    try {
      if (consultantServiceId) {
        await updateConsultantServiceFn(values as UpdateConsultantServiceByIdRequestParams)
        return queryClient.invalidateQueries({
          queryKey: [getConsultantServiceByIdApi.queryKey, { consultantServiceId }]
        })
      } else {
        await addConsultantServiceFn(values as AddConsultantServiceRequestParams)
      }
      handleBackToConsultantService()
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  const { fields, append, remove, swap, update, replace } = useFieldArray({
    control: form.control,
    name: 'serviceBookingFormData.questions'
  })

  const questionList = form.watch('serviceBookingFormData.questions') ?? []

  const isRemoveDisabled = questionList?.length === 1

  const handleAddMore = async () => {
    const res = await form.trigger('serviceBookingFormData.questions')
    if (res) {
      append({
        images: [] as TFile[],
        type: ConsultantServiceTypeEnum.Text,
        mandatory: true,
        orderIndex: fields.length
      } as SchemaType['serviceBookingFormData']['questions'][0])
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id)
      const newIndex = fields.findIndex((item) => item.id === over?.id)
      swap(oldIndex, newIndex)
      const newFields = form.getValues().serviceBookingFormData.questions

      for (let i = 0; i < newFields.length; i++) {
        update(i, { ...newFields[i], orderIndex: i })
      }
    }
  }

  const handleRemove = (index: number) => () => {
    remove(index)
  }

  const handleChangeStatus = async (status: ConsultantServiceStatusEnum) => {
    const values = formSchema.parse(form.getValues())
    try {
      await updateConsultantServiceFn({
        id: consultantServiceId,
        ...values,
        status
      } as UpdateConsultantServiceByIdRequestParams)
      queryClient.invalidateQueries({
        queryKey: [getConsultantServiceByIdApi.queryKey, { consultantServiceId }]
      })
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  const service = detailConsultantServiceById?.data
  const getHeader = () => {
    if (!consultantServiceId) return null
    switch (service?.status) {
      case ConsultantServiceStatusEnum.ACTIVE:
        return (
          <Alert variant={'success'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div className='flex flex-col'>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-green-300 bg-green-400 text-white'>Active</span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>
                  This consultant service is currently active and visible to your customers. If you want to make any
                  changes, please inactivate it first.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(ConsultantServiceStatusEnum.INACTIVE)
              }}
              loading={isUpdatingService}
              variant={'default'}
            >
              {'Close  service'}
            </AlertAction>
          </Alert>
        )
      case ConsultantServiceStatusEnum.INACTIVE:
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
                  This consultant service is currently inactive and not visible to your customers.
                </AlertDescription>
              </div>
            </div>
            <AlertAction
              onClick={() => {
                handleChangeStatus(ConsultantServiceStatusEnum.ACTIVE)
              }}
              loading={isUpdatingService}
              variant={'success'}
            >
              {'Open service'}
            </AlertAction>
          </Alert>
        )
      case ConsultantServiceStatusEnum.BANNED:
        return (
          <Alert variant={'destructive'}>
            <div className='flex items-center gap-2'>
              <Siren className='size-4' />
              <div className='flex flex-col'>
                <AlertTitle className='flex items-center gap-2'>
                  <span className='p-0.5 px-2 rounded-lg border border-red-300 bg-red-400 text-white'>Banned</span>
                  <span className='font-bold uppercase text-xs'>status</span>
                </AlertTitle>
                <AlertDescription>
                  This consultant service is currently banned and not visible to your customers.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )
      default:
        return null
    }
  }

  const getFooter = () => {
    switch (service?.status) {
      case ConsultantServiceStatusEnum.ACTIVE:
      case ConsultantServiceStatusEnum.BANNED:
        return null
      default:
        return (
          <div className='flex items-center justify-end'>
            {
              <Button type='submit' form={`form-${id}`} loading={form.formState.isSubmitting}>
                <SaveIcon />
                Save Service
              </Button>
            }
          </div>
        )
    }
  }

  useEffect(() => {
    if (detailConsultantServiceById?.data) {
      const formData = convertConsultantServiceToForm(detailConsultantServiceById.data)
      form.reset(formData as unknown as SchemaType)
      replace(formData.serviceBookingFormData.questions as unknown as SchemaType['serviceBookingFormData']['questions'])
    }
  }, [detailConsultantServiceById?.data, form, replace])

  return (
    <>
      {isLoading && <LoadingContentLayer />}
      {getHeader()}
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8' id={`form-${id}`}>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-1'>
                <TbBrandAmigo />
                Consultant Service Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='w-full gap-4 flex flex-col'>
                <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='serviceBookingFormData.title'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel required>Name Of Service</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. Allure Beauty facial check up' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='systemService'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Kind Of Service</FormLabel>
                        <SelectSystemService {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Price Of Service</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g 100.000' {...field} type='currency' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images`}
                    render={({ field }) => {
                      return (
                        <FormItem className='flex flex-col sm:col-span-2 col-span-1'>
                          <FormLabel required>Images Of Service</FormLabel>
                          <UploadFiles
                            triggerRef={triggerRef}
                            form={form}
                            field={field}
                            dropZoneConfigOptions={{
                              maxFiles: 6
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-1'>
                <ClipboardType />
                Survey information
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
                      value={questionList.map((_, index) => String(index))}
                    >
                      {fields.map((_, index) => {
                        const item = { ...fields[index] }
                        return (
                          <SortableLinks
                            key={index}
                            item={item}
                            children={
                              <AccordionItem value={String(index)} key={index} className='border-none'>
                                <AccordionTrigger className='hover:no-underline border-none'>
                                  <div className='flex items-center gap-2 w-full'>
                                    <span className='bg-green-600 px-4 py-1 text-white rounded-3xl items-center flex gap-1 uppercase text-xs font-extrabold'>
                                      <QuestionMarkCircledIcon />
                                      Question {index + 1}
                                    </span>
                                    <div className='ml-auto mr-2 flex items-center gap-8'>
                                      <button
                                        className=' disabled:opacity-20 cursor-pointer'
                                        onClick={handleRemove(index)}
                                        disabled={isRemoveDisabled}
                                        type='button'
                                      >
                                        <Trash2 color='red' strokeWidth={3} size={20} />
                                      </button>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className='border-none'>
                                  <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                                    <FormField
                                      control={form.control}
                                      name={`serviceBookingFormData.questions.${index}.question`}
                                      render={({ field }) => (
                                        <FormItem className='col-span-2'>
                                          <FormLabel required>Question ?</FormLabel>
                                          <FormControl>
                                            <Textarea
                                              {...field}
                                              placeholder='e.g. What is your current skin type ?'
                                              rows={5}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`serviceBookingFormData.questions.${index}.type`}
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
                                                {Object.keys(ConsultantServiceTypeEnum).map((key) => (
                                                  <SelectItem
                                                    key={key}
                                                    value={
                                                      ConsultantServiceTypeEnum[
                                                        key as keyof typeof ConsultantServiceTypeEnum
                                                      ]
                                                    }
                                                  >
                                                    {ConsultantServiceTypeEnum[
                                                      key as keyof typeof ConsultantServiceTypeEnum
                                                    ].replace('_', ' ')}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                            <FormField
                                              control={form.control}
                                              name={`serviceBookingFormData.questions.${index}.mandatory`}
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
                                                  <FormLabel>Optional?</FormLabel>
                                                </div>
                                              )}
                                            />
                                          </div>

                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    {(questionList[index].type === ConsultantServiceTypeEnum.SingleChoice ||
                                      questionList[index].type === ConsultantServiceTypeEnum.MultipleChoice) && (
                                      <FormField
                                        control={form.control}
                                        shouldUnregister
                                        name={`serviceBookingFormData.questions.${index}.answers`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel required>Question answers</FormLabel>
                                            <FormControl>
                                              <Creatable
                                                isMulti
                                                {...field}
                                                options={[
                                                  {
                                                    label: 'Let user answer',
                                                    value: 'user_answer'
                                                  }
                                                ]}
                                              />
                                            </FormControl>

                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    )}

                                    <FormField
                                      control={form.control}
                                      name={`serviceBookingFormData.questions.${index}.images`}
                                      render={({ field }) => {
                                        return (
                                          <FormItem className='flex flex-col sm:col-span-2 col-span-1'>
                                            <FormLabel>Images Of Question</FormLabel>
                                            <UploadFiles
                                              triggerRef={triggerRef}
                                              form={form}
                                              field={field}
                                              dropZoneConfigOptions={{
                                                maxFiles: 6
                                              }}
                                            />
                                            <FormMessage />
                                          </FormItem>
                                        )
                                      }}
                                    />
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
        </form>
        {getFooter()}
      </Form>
    </>
  )
}

export default ConsultantServiceDetails
