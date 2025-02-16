import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { BadgePlus, Images, Info } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import MockImage from '@/assets/SidebarBadge.png'
import BranchCreation from '@/components/branch/BranchCreation'
import BranchDetails from '@/components/branch/BranchDetails'
import Confirmation from '@/components/branch/Confirmation'
// import DocumentDetails from '@/components/branch/DocumentDetails'
import UplImagesUploader from '@/components/branch/UplImagesUploader'
import Stepper from '@/components/steppers'
import { Form } from '@/components/ui/form'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import type { Steppers } from '@/hooks/useStepper'
import useStepper from '@/hooks/useStepper'
import { useToast } from '@/hooks/useToast'
import { requestCreateBrandApi } from '@/network/apis/brand'
import { uploadFilesApi } from '@/network/apis/file'
import { brandCreateSchema } from '@/schemas'
import { StatusEnum } from '@/types/enum'

function RegisterBrand() {
  const { successToast } = useToast()
  const { t } = useTranslation()
  const navigate = useNavigate()
  // const accountId = accessToken ? jwtDecode<TEmailDecoded>(accessToken).accountId : undefined

  const form = useForm<z.infer<typeof brandCreateSchema>>({
    resolver: zodResolver(brandCreateSchema),
    defaultValues: {
      email: '',
      phone: '',
      address: '',
      description: '',
      document: [],
      logo: [],
      name: '',
      businessRegistrationAddress: '',
      businessTaxCode: '',
      district: '',
      businessRegistrationCode: '',
      province: '',
      ward: ''
    }
  })
  const handleServerError = useHandleServerError()

  const steppers: Steppers[] = [
    {
      icon: <BadgePlus />,
      label: 'Brand Creation',
      key: 'branch-creation'
    },

    {
      icon: <Info />,
      label: 'Brand details',
      key: 'branch-details'
    },
    {
      icon: <Images />,
      label: 'Images',
      key: 'images'
    }
  ]
  const { activeStep, goBack, goNext } = useStepper({ steppers })
  const Silde = useMemo(() => {
    switch (steppers[activeStep]?.key) {
      case 'branch-creation':
        return <BranchCreation stepIndex={activeStep} goNextFn={goNext} goBackfn={goBack} steppers={steppers} />
      case 'branch-details':
        return (
          <BranchDetails stepIndex={activeStep} goNextFn={goNext} goBackfn={goBack} steppers={steppers} form={form} />
        )
      case 'images':
        return (
          <UplImagesUploader
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
            form={form}
          />
        )

      default:
        return (
          <Confirmation stepIndex={activeStep} goNextFn={goNext} goBackfn={goBack} steppers={steppers} form={form} />
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep])
  const { mutateAsync: uploadFilesFn } = useMutation({
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
            establishmentDate: values.establishmentDate ? new Date(values.establishmentDate) : '',
            businessRegistrationAddress: values.businessRegistrationAddress,
            status: StatusEnum.PENDING
          }
          await requestCreateBrandFn(formatData)
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

  return (
    <div className='min-h-screen bg-primary/10'>
      <header className='border-b bg-primary text-white px-4 py-3 shadow-md'>
        <div className='flex items-center gap-2'>
          <img src={MockImage} alt='Logo' width={32} height={32} className='h-8 w-8 object-contain' />
          <span className='text-lg'>{t('header.registerBrand')}</span>
        </div>
      </header>

      <main className='m-auto max-w-3xl px-4 py-8 mt-10 bg-white rounded-lg backdrop-blur-3xl'>
        <Stepper steppers={steppers} activeStep={activeStep} />

        <div className='p-6'>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full grid gap-4 mb-8'
              id={`form-create-branch`}
            >
              {Silde}
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}

export default RegisterBrand
