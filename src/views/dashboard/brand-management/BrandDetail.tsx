import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FilesIcon, ImagePlus } from 'lucide-react'
import { useId } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { LuSaveAll } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'

import Button from '@/components/button'
import CardSection from '@/components/card-section'
import UploadFilePreview from '@/components/file-input/UploadFilePreview'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
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
  // const { userData } = useStore(
  //   useShallow((state) => ({
  //     userData: state.user
  //   }))
  // )

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
                                  <img
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
            </div>
          </CardSection>
        </form>
      </Form>
    </>
  )
}

export default BrandDetail
