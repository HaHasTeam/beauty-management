import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useId, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { CiFileOff } from 'react-icons/ci'
import { FaCameraRotate } from 'react-icons/fa6'
import { IoCloudUploadSharp, IoCreateOutline } from 'react-icons/io5'
import { LuSaveAll } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import CardSection from '@/components/card-section'
import UploadFileModal from '@/components/file-input/UploadFileModal'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Routes, routesConfig } from '@/configs/routes'
import { defaultRequiredRegex, numberRequiredRegex, requiredFileRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { addPreOderApi } from '@/network/apis/pre-order'
import { getProductByBrandIdApi } from '@/network/apis/product'
import { useStore } from '@/stores/store'

const formSchema = z.object({
  product: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  startTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  endTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  productClassifications: z
    .array(
      z.object({
        title: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
        price: z.coerce
          .number({
            message: numberRequiredRegex.message
          })
          .positive({ message: 'Please enter a valid price' }),
        image: z.string(),
        quantity: z.coerce
          .number({
            message: numberRequiredRegex.message
          })
          .positive({ message: 'Please enter a valid quantity' })
      })
    )
    .nonempty(),
  images: z.array(z.string()).nonempty({
    message: requiredFileRegex.message
  })
})

const PreOrderDetails = () => {
  const id = useId()
  const navigate = useNavigate()
  const { userData } = useStore(
    useShallow((state) => ({
      userData: state.user
    }))
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      startTime: '',
      endTime: '',
      productClassifications: [],
      images: []
    }
  })

  const { data: productList, isLoading: isGettingProductList } = useQuery({
    queryKey: [
      getProductByBrandIdApi.queryKey,
      {
        brandId: userData?.brands?.length ? userData.brands[0] : ''
      }
    ],
    queryFn: getProductByBrandIdApi.fn,
    enabled: !!userData?.brands?.length
  })

  const { mutateAsync: addPreOrderFn } = useMutation({
    mutationKey: [addPreOderApi.mutationKey],
    mutationFn: addPreOderApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Pre-order has been added successfully.'
      })
      form.reset()
    }
  })

  const productListOptions = useMemo(() => {
    if (productList?.data) {
      return productList.data.map((product) => ({
        label: (
          <div className='flex items-center'>
            <img src={product.images[0]} alt={product.name} className='w-8 h-8 rounded-full object-cover' />
            <span className='ml-2'>{product.name}</span>
          </div>
        ),
        value: product.id
      }))
    }
    return []
  }, [productList])

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: 'productClassifications'
  })

  const handleAddClassification = () => {
    prepend({
      title: '',
      price: 0,
      quantity: 0,
      image: ''
    })
  }

  const handleRemoveClassification = (index: number) => {
    remove(index)
  }

  const handleServerError = useHandleServerError()
  const { successToast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const preOrderItems = await addPreOrderFn(values)
      navigate(routesConfig[Routes.PRE_ORDER_DETAILS].getPath({ id: preOrderItems.data.id }))
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }
  const isLoading = isGettingProductList
  return (
    <>
      {isLoading && <LoadingContentLayer />}
      <Card className={'h-min flex items-center align-center max-w-full py-4 px-4 dark:border-zinc-800'}>
        <div className='flex gap-4 items-center justify-between w-full flex-wrap'>
          <div>
            <h1 className='text-2xl font-bold dark:text-white'>Add Pre-order</h1>
            <p className='text-muted-foreground'>Add a new pre-order to your store</p>
          </div>
          <Button
            type='submit'
            className='flex gap-2 items-center'
            form={`form-${id}`}
            loading={form.formState.isSubmitting}
          >
            <LuSaveAll />
            <span>Save Pre-order</span>
          </Button>
        </div>
      </Card>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex-col gap-8 flex'
          id={`form-${id}`}
        >
          <CardSection
            title='Pre-order Details'
            description='Pre Order Details are the details of the product you are pre ordering'
          >
            <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='product'
                render={({ field }) => (
                  <FormItem className='flex flex-col col-span-1 sm:col-span-2'>
                    <FormLabel required>Pre-order Product</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className='w-full'>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value
                              ? productListOptions.find((product) => product.value === field.value)?.label
                              : 'Select pre-order product'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className='p-0'
                        sideOffset={5}
                        style={{
                          width: 'var(--radix-popover-trigger-width)',
                          maxHeight: 'var(--radix-popover-content-available-height)'
                        }}
                      >
                        <Command>
                          <CommandInput placeholder='Search for pre-order product' />
                          <CommandList>
                            <CommandEmpty>No pre-order product found. Try another search term.</CommandEmpty>
                            <CommandGroup>
                              {productListOptions.map((product) => (
                                <CommandItem
                                  value={product.value}
                                  key={product.value}
                                  onSelect={() => {
                                    form.setValue('product', product.value)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      product.value === field.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {product.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>This is the pre-order product that will be displayed on dashboard</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='startTime'
                render={({ field, formState }) => {
                  return (
                    <FormItem className='flex flex-col'>
                      <FormLabel required>Start Time</FormLabel>
                      <FlexDatePicker
                        showTime
                        onlyFutureDates
                        field={field}
                        formState={{
                          ...formState,
                          ...form
                        }}
                      />
                      <FormDescription>
                        This is the start time that will be displayed on your pre-order details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name='endTime'
                render={({ field, formState }) => {
                  return (
                    <FormItem className='flex flex-col'>
                      <FormLabel required>End Time</FormLabel>
                      <FlexDatePicker
                        showTime
                        onlyFutureDates
                        field={field}
                        formState={{
                          ...formState,
                          ...form
                        }}
                      />
                      <FormDescription>
                        This is the end time that will be displayed on your pre-order details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => {
                  return (
                    <FormItem className='flex flex-col sm:col-span-2 col-span-1'>
                      <FormLabel required>Images</FormLabel>
                      <div className='items-center w-full h-[400px] lg:h-60 border-2 border-dashed rounded-lg shadow-lg flex flex-col gap-8 lg:flex-row p-2'>
                        <div className='w-1/4 flex justify-center lg:border-r-4 border-dashed lg:border-b-0 border-b-4 p-4 border-r-0'>
                          <UploadFileModal
                            field={field}
                            Trigger={
                              <p className='relative p-4 rounded-full border-2 shadow-lg cursor-pointer hover:scale-110 hover:opacity-100 opacity-50 transition-all duration-100 ease-linear'>
                                <IoCloudUploadSharp size={60} />
                              </p>
                            }
                            dropZoneConfigOptions={{
                              maxFiles: 6
                            }}
                          />
                        </div>
                        <div className='h-full flex-1 overflow-auto'>
                          {field.value.length > 0 && (
                            <div className='grid grid-cols-3 gap-2 max-h-full overflow-auto'>
                              {field.value.map((image, index) => (
                                <img
                                  src={image}
                                  alt={`Image ${index}`}
                                  className='size-full h-24 p-2 border bg-accent rounded-xl object-contain shadow-lg'
                                />
                              ))}
                            </div>
                          )}
                          {field.value.length === 0 && (
                            <div className='flex-1 h-full flex justify-center items-center gap-1'>
                              <CiFileOff size={30} />
                              <p className='text-muted-foreground'>No images uploaded.</p>
                            </div>
                          )}
                          <div></div>
                        </div>
                      </div>
                      <FormDescription>
                        These are the images that will be displayed on your pre-order details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </CardSection>
          <CardSection
            rightComponent={
              <Button type='button' className='flex gap-2 items-center' onClick={handleAddClassification}>
                <IoCreateOutline />
                <span>Add An Classification </span>
              </Button>
            }
            title='Pre-order classification'
            description='Pre-order classification are the details of the product you are pre ordering'
          >
            {fields.length > 0 && (
              <div className='w-full flex flex-col gap-4'>
                {fields.map((field, index) => {
                  return (
                    <div
                      key={field.id}
                      className='gap-4 grid grid-flow-row grid-cols-1 lg:grid-cols-2 border-2 p-4 rounded-xl shadow-xl relative'
                    >
                      <MdDeleteOutline
                        onClick={() => handleRemoveClassification(index)}
                        className='absolute text-red-500 border-2 p-1 shadow-xl right-1 top-1 border-red-600 rounded-full bg-red-200 opacity-50 hover:opacity-100 transition-all duration-200 ease-linear cursor-pointer'
                        size={30}
                      />
                      <FormField
                        control={form.control}
                        name={`productClassifications.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Classification Title</FormLabel>
                            <FormControl>
                              <Input placeholder='e.g. Class A' {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the classification title that will be displayed on your pre-order details.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`productClassifications.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Classification Price</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='
                          e.g. 100.00 
                         '
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This is the classification price that will be displayed on your pre-order details.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`productClassifications.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Classification Quantity</FormLabel>
                            <FormControl>
                              <Input placeholder='e.g. 21' {...field} type='quantity' />
                            </FormControl>
                            <FormDescription>
                              This is the classification quantity that will be displayed on your pre-order details.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`productClassifications.${index}.image`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display image</FormLabel>
                            <FormControl>
                              <Avatar className='size-9 relative'>
                                <AvatarImage src={form.watch(`productClassifications.${index}.image`) || ''} />
                                <AvatarFallback className='text-2xl font-bold dark:bg-accent/20'>
                                  {form.watch(`productClassifications.${index}.title`) || ''}
                                </AvatarFallback>
                                <UploadFileModal
                                  field={{
                                    ...field,
                                    value: form.watch(`productClassifications.${index}.image`) || ''
                                  }}
                                  Trigger={
                                    <FaCameraRotate
                                      size={20}
                                      className='cursor-pointer absolute bottom-2 right-2 hover:scale-150 transition-all shadow-lg duration-500 text-foreground p-0.5 rounded-full bg-primary/80 opacity-40 hover:opacity-100'
                                    />
                                  }
                                />
                              </Avatar>
                            </FormControl>
                            <FormDescription>
                              This is the classification image that will be displayed on your pre-order details.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )
                })}
              </div>
            )}
            {
              <div className='flex justify-center items-center'>
                {fields.length === 0 && (
                  <div className='flex gap-2 items-center'>
                    <CiFileOff size={20} />
                    <p className='text-muted-foreground'>No classification added.</p>
                  </div>
                )}
              </div>
            }
          </CardSection>
        </form>
      </Form>
    </>
  )
}

export default PreOrderDetails
