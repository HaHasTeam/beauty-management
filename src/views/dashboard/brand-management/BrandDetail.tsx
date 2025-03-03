import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FilesIcon, ImagePlus } from 'lucide-react'
import { useId } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { LuSaveAll } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import Button from '@/components/button'
import CardSection from '@/components/card-section'
import UploadFilePreview from '@/components/file-input/UploadFilePreview'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import ImageWithFallback from '@/components/image/ImageWithFallback'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Routes, routesConfig } from '@/configs/routes'
import { templateFileUrl } from '@/constants/infor'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllBrandsApi, getBrandByIdApi, requestCreateBrandApi, updateBrandByIdApi } from '@/network/apis/brand'
import { uploadFilesApi } from '@/network/apis/file'
import { brandCreateSchema } from '@/schemas'
import { IBranch } from '@/types/Branch'
import { StatusEnum } from '@/types/brand'

const BrandDetail = ({
  form,
  brandData
}: {
  form: UseFormReturn<z.infer<typeof brandCreateSchema>>
  brandData?: IBranch
}) => {
  const queryClient = useQueryClient()
  const id = useId()
  const navigate = useNavigate()

  const handleServerError = useHandleServerError()
  const { successToast } = useToast()
  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })
  const { mutateAsync: requestCreateBrandFn } = useMutation({
    mutationKey: [requestCreateBrandApi.mutationKey],
    mutationFn: requestCreateBrandApi.fn,
    onSuccess: () => {
      form.reset()
      queryClient.invalidateQueries({ queryKey: [getAllBrandsApi.queryKey] })

      navigate(routesConfig[Routes.BRAND].getPath())

      successToast({ message: 'Your request to create a brand has been successfully completed.' })
    }
  })

  const { mutateAsync: updateBrandFn } = useMutation({
    mutationKey: [updateBrandByIdApi.mutationKey, brandData?.id],
    mutationFn: updateBrandByIdApi.fn,
    onSuccess: () => {
      navigate(routesConfig[Routes.BRAND].getPath())
      queryClient.invalidateQueries({ queryKey: [getBrandByIdApi.queryKey, brandData?.id] })
      successToast({ message: ' Update successfully.' })
    }
  })
  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)

    return uploadedFilesResponse.data
  }

  async function onSubmit(values: z.infer<typeof brandCreateSchema>) {
    try {
      if (values.logo && values.logo?.length > 0) {
        const imgUrls = await convertFileToUrl([...values.logo, ...values.document])

        if (imgUrls && imgUrls.length > 0) {
          const formatData = {
            name: values.name,
            document: imgUrls[1],
            address: values.address,
            logo: imgUrls[0],
            email: values.email,
            phone: values.phone,
            description: values.description,
            province: values.province,
            district: values.district,
            ward: values.ward,
            businessTaxCode: values.businessTaxCode,
            businessRegistrationCode: values.businessRegistrationCode,
            establishmentDate: values.establishmentDate ? values.establishmentDate : '',
            businessRegistrationAddress: values.businessRegistrationAddress,
            status: StatusEnum.PENDING
          }

          if (brandData && brandData?.id) {
            await updateBrandFn({
              brandId: brandData?.id,
              ...formatData
            })
          } else {
            await requestCreateBrandFn(formatData)
          }
        }
      } else {
        const imgUrls = await convertFileToUrl([...values.document])
        if (imgUrls && imgUrls.length > 0) {
          const formatData = {
            name: values.name,
            document: imgUrls[0],
            address: values.address,
            email: values.email,
            logo: '',
            phone: values.phone,
            description: values.description,
            status: StatusEnum.PENDING,
            province: values.province,
            district: values.district,
            ward: values.ward,
            businessTaxCode: values.businessTaxCode,
            businessRegistrationCode: values.businessRegistrationCode,
            establishmentDate: values.establishmentDate ? values.establishmentDate : '',
            businessRegistrationAddress: values.businessRegistrationAddress
          }
          if (brandData && brandData?.id) {
            await updateBrandFn({
              brandId: brandData?.id,
              ...formatData
            })
          } else {
            await requestCreateBrandFn(formatData)
          }
        }
      }
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }
  const isLoading = false
  return (
    <>
      {isLoading && <LoadingContentLayer />}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex-col gap-8 flex'
          id={`form-${id}`}
        >
          <CardSection
            title={brandData ? 'Update Brand Information' : 'Create Brand Information'}
            description='Please fill all information'
            rightComponent={
              <Button
                type='submit'
                className='flex gap-2 items-center'
                form={`form-${id}`}
                loading={form.formState.isSubmitting}
              >
                <LuSaveAll />
                <span>{brandData ? 'Update Brand' : 'Create Brand'}</span>
              </Button>
            }
          >
            <div className='flex flex-col gap-4'>
              <div className='grid gap-4 grid-cols-2'>
                <div className='grid gap-4 grid-cols-1'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Name</FormLabel>
                        <FormControl>
                          <Input
                            className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                            placeholder='
                please enter your brand name
                    '
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Email</FormLabel>
                        <FormControl>
                          <Input
                            className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                            placeholder='
                     e.g. allure@gmail.com
                    '
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='logo'
                  render={({ field }) => (
                    <FormItem className=''>
                      <FormLabel>Logo thương hiệu</FormLabel>
                      <div className=''>
                        <UploadFilePreview
                          field={field}
                          vertical={false}
                          dropZoneConfigOptions={{ maxFiles: 7 }}
                          renderFileItemUI={(file) => {
                            return (
                              <div key={file.name} className=' rounded-lg max-h-32 '>
                                {file.type.includes('image') ? (
                                  <ImageWithFallback
                                    fallback={fallBackImage}
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className='object-cover rounded-lg max-h-32 '
                                    onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                  />
                                ) : (
                                  <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                )}
                              </div>
                            )
                          }}
                          renderInputUI={(_isDragActive, files, maxFiles) => {
                            return (
                              <div className='hover:bg-primary/15 p-4 w-40 h-40 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                                <ImagePlus className='w-12 h-12 text-primary' />

                                <p className='text-sm text-primary'>
                                  Drag & drop or browse file ({files?.length ?? 0}/{maxFiles})
                                </p>
                              </div>
                            )
                          }}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid gap-4 grid-cols-2'>
                <FormField
                  control={form.control}
                  name='province'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Province</FormLabel>
                      <FormControl>
                        <Input
                          className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                          placeholder='Province'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ward'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Ward</FormLabel>
                      <FormControl>
                        <Input
                          className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                          placeholder='Ward'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='district'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>District</FormLabel>
                      <FormControl>
                        <Input
                          className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                          placeholder='District'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Address</FormLabel>
                      <FormControl>
                        <Input
                          className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                          placeholder='Address'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='Phone'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='description' className='resize-none' {...field} />
                      {/* <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='
                 description
                    '
                        {...field}
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
          control={form.control}
          name='document'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>document</FormLabel>
              <FormControl>
                <Input
                  className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                  placeholder='document'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
            </div>
          </CardSection>
          <CardSection
            title={'Business Registration Certificate'}
            description='Store legal documents and contracts of the Seller.'
          >
            <FormField
              control={form.control}
              name='businessTaxCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Business Tax Code</FormLabel>
                  <FormControl>
                    <Input
                      className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                      placeholder='Business Tax Code'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique identifier issued by the tax authorities, used to recognize the business for tax purposes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='establishmentDate'
              render={({ field, formState }) => {
                return (
                  <FormItem className='flex flex-col'>
                    <FormLabel required>Establishment Date</FormLabel>
                    <FlexDatePicker
                      onlyPastDates
                      field={field}
                      formState={{
                        ...formState,
                        ...form
                      }}
                    />
                    <FormDescription>
                      The date the business was officially established. Use this to specify when the business began its
                      operations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name='businessRegistrationCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Business Registration Code</FormLabel>
                  <FormControl>
                    <Input
                      className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                      placeholder='Business Registration Code'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A number or code assigned to the business upon registration, serving as a formal identifier for the
                    company.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='businessRegistrationAddress'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Business Registration Address</FormLabel>
                  <FormControl>
                    <Input
                      className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                      placeholder='Business Registration Address'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The official address of the business as stated during registration.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='document'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Document</FormLabel>
                  <UploadFilePreview
                    field={field}
                    vertical
                    dropZoneConfigOptions={{ maxFiles: 1 }}
                    header={
                      <div>
                        {/* <div className='text-2xl font-bold text-foreground'>Upload Your File(s)</div> */}
                        <div className='text-muted-foreground'>
                          You must upload at least 1 document for your lisense details. To help you, we’ve provided a
                          template file. Please download it, fill in the necessary details, and upload it back:
                        </div>
                        <a href={templateFileUrl} download className='text-primary underline'>
                          Download License Details Template
                        </a>
                      </div>
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardSection>
        </form>
      </Form>
    </>
  )
}

export default BrandDetail
