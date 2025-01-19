import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TicketPlus, Zap } from 'lucide-react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { CiFileOff } from 'react-icons/ci'
import { IoCloudUploadSharp } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router-dom'
import * as z from 'zod'

import UploadFileModal from '@/components/file-input/UploadFileModal'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import SelectProduct from '@/components/select-product'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Routes, routesConfig } from '@/configs/routes'
import { defaultRequiredRegex, requiredFileRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { addFlashSaleApi, getFlashSaleByIdApi } from '@/network/apis/flash-sale'
import { FlashSaleStatusEnum } from '@/types/flash-sale'

const formSchema = z.object({
  product: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  startTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  endTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  images: z.array(z.string()).nonempty({
    message: requiredFileRegex.message
  }),
  discount: z.coerce
    .number({
      message: defaultRequiredRegex.message
    })
    .positive({
      message: defaultRequiredRegex.message
    })
})

const FlashSaleDetails = () => {
  const id = useId()
  const params = useParams()
  const itemId = params.id !== 'add' ? params.id : undefined
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      startTime: '',
      endTime: '',
      images: []
    }
  })

  const { mutateAsync: addFlashSaleFn } = useMutation({
    mutationKey: [addFlashSaleApi.mutationKey],
    mutationFn: addFlashSaleApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! flash sale has been added successfully.'
      })
      form.reset()
    }
  })

  const handleServerError = useHandleServerError()
  const { successToast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addFlashSaleFn(values)
      navigate(routesConfig[Routes.FLASH_SALE].getPath())
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  const { data: flashSale, isLoading: isGettingFlashSale } = useQuery({
    queryKey: [getFlashSaleByIdApi.queryKey, itemId as string],
    queryFn: getFlashSaleByIdApi.fn,
    enabled: !!itemId
  })

  return (
    <>
      {isGettingFlashSale && <LoadingContentLayer />}
      <Card className={'h-min flex items-center align-center max-w-full py-4 px-4 dark:border-zinc-800'}>
        <div className='flex gap-4 items-center justify-between w-full flex-wrap'>
          {!itemId && (
            <div>
              <h1 className='text-2xl font-bold dark:text-white flex items-center gap-2'>
                <TicketPlus size={28} strokeWidth={3} absoluteStrokeWidth />
                <span>Add Flash Sale Product</span>
              </h1>
              <p className='text-muted-foreground'>
                You are about to add a new flash sale product. Please fill in the details below.
              </p>
            </div>
          )}
          {itemId && (
            <div>
              <h1 className='text-2xl font-bold dark:text-white flex items-center gap-2'>
                <TicketPlus size={28} strokeWidth={3} absoluteStrokeWidth />
                <div className='flex items-center gap-2 flex-nowrap'>
                  <span>Edit Flash Sale Product</span>
                  <span>
                    <span className='text-primary max-lg:text-sm truncate w-[100px]'>#{flashSale?.data?.id}</span>
                  </span>
                </div>
              </h1>
              <p className='text-muted-foreground'>
                {flashSale?.data?.status === FlashSaleStatusEnum.ACTIVE
                  ? 'If you want to make any changes, please inactivate it first.'
                  : 'This flash sale product is currently inactive and cannot be viewed by your customers.'}
              </p>
            </div>
          )}
          {/* {itemId && (
            <Button
              variant={'secondary'}
              className='uppercase font-light shadow-lg'
              size={'sm'}
              loading={isTogglingGroupProductStatus}
              onClick={() => {
                toggleGroupProductStatusFn(itemId)
              }}
            >
              {groupProduct?.data.status === GroupProductStatusEnum.ACTIVE ? (
                <Rocket className='rotate-90' />
              ) : (
                <Rocket />
              )}
              {groupProduct?.data.status === GroupProductStatusEnum.ACTIVE ? 'Inactivate group' : 'Activate group'}
            </Button>
          )} */}
        </div>
      </Card>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex-col gap-8 flex'
          id={`form-${id}`}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-1'>
                <Zap />
                Flash Sale Product Details
              </CardTitle>
              <CardDescription>
                Configure the flash sale product details that will be displayed on your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='product'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Flash Sale Product</FormLabel>
                      <SelectProduct {...field} multiple={false} />
                      <FormDescription>
                        This is the flash sale product that will be displayed on dashboard
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`discount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Discount %</FormLabel>
                      <FormControl>
                        <Input
                          type='percentage'
                          placeholder='
                          e.g. 12.5%
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
                  name='startTime'
                  render={({ field, formState }) => {
                    return (
                      <FormItem className='flex flex-col'>
                        <FormLabel required>Start Time Of Flash Sale</FormLabel>
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
                          This is the start time that will be displayed on your flash sale details.
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
                        <FormLabel required>End Time Of Flash Sale</FormLabel>
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
                          This is the end time that will be displayed on your flash sale details.
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
                          These are the images that will be displayed on your flash sale details.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  )
}

export default FlashSaleDetails
