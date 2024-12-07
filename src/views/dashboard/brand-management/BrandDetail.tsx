import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
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
import { Routes, routesConfig } from '@/configs/routes'
import { templateFileUrl } from '@/constants/infor'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { requestCreateBrandApi } from '@/network/apis/brand'
import { uploadFilesApi } from '@/network/apis/file'
import { brandCreateSchema } from '@/schemas'
// import { useStore } from '@/stores/store'
import { StatusEnum } from '@/types/brand'

const BrandDetail = () => {
  const id = useId()
  const navigate = useNavigate()
  // const { userData } = useStore(
  //   useShallow((state) => ({
  //     userData: state.user
  //   }))
  // )

  const form = useForm<z.infer<typeof brandCreateSchema>>({
    resolver: zodResolver(brandCreateSchema),
    defaultValues: {
      email: '',
      phone: '',
      address: '',
      description: '',
      document: [],
      logo: [],
      name: ''
    }
  })

  const handleServerError = useHandleServerError()
  const { successToast } = useToast()
  const {
    mutateAsync: uploadFilesFn,
    isSuccess: isUploadSuccess,
    data: fileUploaded
  } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })
  const { mutateAsync: requestCreateBrandFn } = useMutation({
    mutationKey: [requestCreateBrandApi.mutationKey],
    mutationFn: requestCreateBrandApi.fn,
    onSuccess: () => {
      // console.log('data received', data)
      form.reset()
      navigate(routesConfig[Routes.DASHBOARD_HOME].getPath())
      successToast({ message: 'Your request to create a brand has been successfully completed.' })
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
        await convertFileToUrl([...values.logo, ...values.document])
        if (isUploadSuccess) {
          const formatData = {
            name: values.name,
            document: fileUploaded.data[1],
            address: values.address,
            logo: fileUploaded.data[0],
            email: values.email,
            phone: values.phone,
            description: values.description,
            status: StatusEnum.PENDING
          }
          await requestCreateBrandFn(formatData)
        }
      } else {
        await convertFileToUrl([...values.document])
        if (isUploadSuccess) {
          const formatData = {
            name: values.name,
            document: fileUploaded.data[0],
            address: values.address,
            email: values.email,
            logo: '',
            phone: values.phone,
            description: values.description,
            status: StatusEnum.PENDING
          }
          await requestCreateBrandFn(formatData)
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
            title='Create Brand Information'
            description='Please fill all information'
            rightComponent={
              <Button
                type='submit'
                className='flex gap-2 items-center'
                form={`form-${id}`}
                loading={form.formState.isSubmitting}
              >
                <LuSaveAll />
                <span>Create Brand</span>
              </Button>
            }
          >
            <div className='flex flex-col gap-4'>
              <div className='grid gap-4 grid-cols-2'>
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
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='
                 description
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
