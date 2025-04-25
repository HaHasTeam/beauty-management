import 'react-quill-new/dist/quill.snow.css'
import 'react-quill-new/dist/quill.bubble.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Award, Briefcase, CameraIcon, FileText, Info, PlayCircle, Plus, Trash } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill-new'
import { useParams } from 'react-router-dom'
import * as z from 'zod'

import Button from '@/components/button'
import UploadFiles, { TriggerUploadRef } from '@/components/file-input/UploadFiles'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { defaultRequiredRegex } from '@/constants/regex'
import { getAccountDetailsByIdApi } from '@/network/apis/user'
import { FileSchema } from '@/schemas/file.schema'
import { TFile } from '@/types/file'
import { TUser } from '@/types/user'
import { modules } from '@/variables/textEditor'

import { convertUserIntoWorkingProfileFormValues } from '../../profile-settings/helper'

// Fix the certificate schema to use files array instead of a single file
const formSchema = z.object({
  majorTitle: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  description: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  yoe: z.coerce.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  introduceVideo: z.array(FileSchema).min(1, {
    message: defaultRequiredRegex.message()
  }),
  certificates: z
    .array(
      z.object({
        year: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
        title: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
        files: z.array(FileSchema).min(1, {
          message: defaultRequiredRegex.message()
        })
      })
    )
    .min(1, {
      message: defaultRequiredRegex.message()
    }),
  initialCertificates: z
    .array(
      z.object({
        year: z.string().optional(),
        title: z.string().optional(),
        files: z.array(FileSchema).optional()
      })
    )
    .optional(),
  thumbnailImageList: z.array(FileSchema).min(1, {
    message: defaultRequiredRegex.message()
  })
})

type FormValues = z.infer<typeof formSchema>

export type WorkingProfileFormValues = FormValues
interface Certificate {
  title?: string
  year?: string
  files?: TFile[]
}

// Type for user data from API
interface UserData {
  majorTitle?: string
  description?: string
  yoe?: number
  introduceVideo?: string
  certificates?: Certificate[]
  thumbnailImageList?: TFile[]
}

// Quill modules configuration

const WorkingProfile = () => {
  const id = useId()
  const { id: accountId } = useParams<{ id: string }>()
  const fileUploadRef = useRef<TriggerUploadRef>({ triggers: [] })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      majorTitle: '',
      description: '',
      yoe: '',
      introduceVideo: [],
      certificates: [],
      thumbnailImageList: []
    }
  })

  // Setup field array for certificates
  const {
    fields: certificateFields,
    append: appendCertificate,
    remove: removeCertificate
  } = useFieldArray({
    control: form.control,
    name: 'certificates'
  })

  const { isFetching: isGettingUserProfile, data: userProfileData } = useQuery({
    queryKey: [getAccountDetailsByIdApi.queryKey, accountId || ''],
    queryFn: getAccountDetailsByIdApi.fn
  })

  // Cập nhật phần useEffect để tránh reset form không cần thiết
  // Thêm memo để lưu trữ data đã xử lý trước đó
  const prevUserData = useRef<UserData | null>(null)

  // Populate form fields from API data
  useEffect(() => {
    if (userProfileData?.data) {
      const userData = userProfileData.data

      // Kiểm tra xem data có thực sự thay đổi không
      const isDataChanged = JSON.stringify(prevUserData.current) !== JSON.stringify(userData)

      // Chỉ reset form khi data thực sự thay đổi
      if (isDataChanged) {
        // Map certificates to the expected format if they exist

        const certificates =
          userData.certificates?.map((cert) => {
            const [name, year] = cert.name?.split('_') || []
            return {
              title: name,
              year: year,
              files: [
                {
                  ...cert,
                  name: name || ''
                }
              ]
            }
          }) || []

        // Lưu data hiện tại để so sánh
        prevUserData.current = {
          ...userData,
          certificates: certificates
        }

        const convertData = convertUserIntoWorkingProfileFormValues(userData as unknown as TUser)
        // Cập nhật form có cấu trúc dữ liệu đúng để tránh reset mẫu thuẫn
        form.reset(convertData, {
          keepDirtyValues: false,
          keepIsValid: false
        })
      }
    }
  }, [userProfileData?.data, form])

  // Function to add a new certificate
  const handleAddCertificate = () => {
    appendCertificate({
      title: '',
      year: '',
      files: []
    })
  }

  return (
    <>
      {isGettingUserProfile && <LoadingContentLayer />}

      <Card className=''>
        <CardHeader className='pb-3 pt-4'>
          <CardTitle className='flex items-center gap-3 text-2xl font-semibold'>
            <div className='bg-primary/10 p-2.5 rounded-lg'>
              <Briefcase className='h-6 w-6 text-primary' />
            </div>
            Working Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form noValidate className='w-full space-y-6' id={`form-${id}`}>
              {/* Basic Information Section */}
              <Card className='border shadow-sm'>
                <CardHeader className='pb-2 pt-3 border-b bg-muted/5'>
                  <CardTitle className='text-lg font-medium flex items-center gap-2'>
                    <div className='bg-primary/10 p-1.5 rounded-md'>
                      <FileText className='h-5 w-5 text-primary' />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-5 pt-4'>
                  <div className='flex flex-col lg:flex-row gap-5 mb-6'>
                    <FormField
                      control={form.control}
                      name='majorTitle'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel required>Your professional title</FormLabel>
                          <FormControl>
                            <Input
                              readOnly={true}
                              placeholder='e.g. Senior Beauty Consultant'
                              {...field}
                              className='h-11 text-base'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='yoe'
                      render={({ field }) => (
                        <FormItem className='w-full lg:w-48'>
                          <FormLabel required>Years of experience</FormLabel>
                          <FormControl>
                            <Input
                              readOnly={true}
                              type='number'
                              placeholder='e.g. 5'
                              {...field}
                              symbol='years'
                              className='h-11 text-base'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Brief introduction & overview</FormLabel>
                        <FormControl>
                          <div>
                            <ReactQuill
                              readOnly={true}
                              theme='snow'
                              modules={modules}
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder='Tell us about your professional background, expertise, and services...'
                              className='text-base'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Media Content Section - Holds both Video and Portfolio */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* Introduction Video Card */}
                <div className=' border rounded-md shadow-sm overflow-hidden h-fit'>
                  <div className='px-4 py-3 border-b bg-muted/5 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='bg-primary/10 p-1.5 rounded-md'>
                        <PlayCircle className='h-4 w-4 text-primary' />
                      </div>
                      <h3 className='font-medium'>Introduction Video</h3>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className='h-4 w-4 text-muted-foreground cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent className='max-w-80'>
                          <p>
                            Upload a short video introducing yourself and your services. This will be displayed on your
                            profile.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className='p-4'>
                    <FormField
                      control={form.control}
                      name='introduceVideo'
                      render={({ field }) => (
                        <FormItem className='space-y-0'>
                          <div className='flex flex-col gap-4'>
                            <FormControl>
                              <UploadFiles
                                readOnly={true}
                                triggerRef={fileUploadRef}
                                field={{
                                  ...field,
                                  value: field.value
                                }}
                                isAcceptVideo={true}
                                maxVideos={1}
                                dropZoneConfigOptions={{
                                  maxFiles: 1,
                                  accept: {
                                    'video/*': ['.mp4', '.mov']
                                  }
                                }}
                                header={
                                  <p className='text-sm font-medium text-muted-foreground mb-2'>
                                    Upload a video that highlights your personality and expertise
                                  </p>
                                }
                              />
                            </FormControl>

                            <div className='bg-green-50 dark:bg-green-900/20 rounded-md p-3 flex items-center gap-2 border-l-4 border-green-500 dark:border-green-600 shadow-sm'>
                              <div className='text-green-600 dark:text-green-400 flex-shrink-0'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='16'
                                  height='16'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  className='lucide lucide-lightbulb'
                                >
                                  <path d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5'></path>
                                  <path d='M9 18h6'></path>
                                  <path d='M10 22h4'></path>
                                </svg>
                              </div>
                              <p className='text-sm font-medium text-green-800 dark:text-green-300'>
                                <span className='font-semibold'>Only video format with MP4/MOV</span> allowed. Max
                                duration 90 seconds.
                              </p>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Portfolio Gallery Card */}
                <div className=' border rounded-md shadow-sm overflow-hidden'>
                  <div className='px-4 py-3 border-b bg-muted/5 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='bg-primary/10 p-1.5 rounded-md'>
                        <CameraIcon className='h-4 w-4 text-primary' />
                      </div>
                      <h3 className='font-medium'>Portfolio Gallery</h3>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-xs'>
                        <CameraIcon className='h-3 w-3 text-primary' />
                        <span className='font-medium text-primary'>Max 8</span>
                      </div>
                      <div className='flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-xs'>
                        <PlayCircle className='h-3 w-3 text-primary' />
                        <span className='font-medium text-primary'>Max 2</span>
                      </div>
                    </div>
                  </div>
                  <div className='p-4'>
                    <FormField
                      control={form.control}
                      name='thumbnailImageList'
                      render={({ field }) => (
                        <FormItem className='space-y-0'>
                          <FormControl>
                            <UploadFiles
                              readOnly={true}
                              triggerRef={fileUploadRef}
                              field={{
                                ...field,
                                value: (field.value as TFile[]) || []
                              }}
                              isAcceptImage={true}
                              isAcceptVideo={true}
                              maxImages={8}
                              maxVideos={2}
                              dropZoneConfigOptions={{
                                maxFiles: 10,
                                accept: {
                                  'image/*': ['.jpg', '.jpeg', '.png'],
                                  'video/*': ['.mp4', '.mov']
                                }
                              }}
                              header={
                                <p className='text-sm font-medium text-muted-foreground mb-2'>
                                  Create a gallery of your best work to impress potential clients
                                </p>
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Certificates Section */}
              <Card className='border shadow-sm'>
                <CardHeader className='pb-2 pt-3 border-b bg-muted/5'>
                  <CardTitle className='text-lg font-medium flex items-center gap-2'>
                    <div className='bg-primary/10 p-1.5 rounded-md'>
                      <Award className='h-5 w-5 text-primary' />
                    </div>
                    Professional Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-5 pt-4'>
                  {certificateFields.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md bg-muted/5'>
                      <div className='bg-primary/10 p-3 rounded-full mb-4'>
                        <FileText className='h-8 w-8 text-primary' />
                      </div>
                      <p className='text-muted-foreground text-center mb-4 max-w-md'>No certificates added yet</p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3'>
                        {certificateFields.map((field, index) => (
                          <Card key={field.id} className='overflow-hidden shadow-sm transition-all border max-w-full'>
                            <CardContent className='p-0'>
                              <div className='p-2 border-b bg-muted/5'>
                                <div className='flex justify-between items-start'>
                                  <FormField
                                    control={form.control}
                                    name={`certificates.${index}.title`}
                                    render={({ field }) => (
                                      <FormItem className='flex-1 mb-0'>
                                        <FormControl>
                                          <Input
                                            placeholder='Certificate name...'
                                            {...field}
                                            className='font-medium border-0 bg-transparent p-0 h-auto focus-visible:ring-0 shadow-none text-xs truncate w-[calc(100%-20px)]'
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => removeCertificate(index)}
                                    className='h-5 w-5 rounded-full -mt-1 -mr-1 hover:bg-muted/80'
                                  >
                                    <Trash className='h-3 w-3 text-muted-foreground hover:text-destructive' />
                                  </Button>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`certificates.${index}.year`}
                                  render={({ field }) => (
                                    <FormItem className='mb-0 mt-0.5'>
                                      <FormControl>
                                        <Input
                                          placeholder='Year issued'
                                          {...field}
                                          className='text-xs text-muted-foreground border-0 bg-transparent p-0 h-auto focus-visible:ring-0 shadow-none'
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className='p-5 flex justify-center w-full'>
                                <FormField
                                  control={form.control}
                                  name={`certificates.${index}.files`}
                                  render={({ field }) => (
                                    <FormItem className='m-0'>
                                      <FormControl>
                                        <UploadFiles
                                          triggerRef={fileUploadRef}
                                          field={{
                                            ...field,
                                            value: (field.value as TFile[]) || []
                                          }}
                                          isAcceptFile={true}
                                          isAcceptImage={true}
                                          dropZoneConfigOptions={{
                                            maxFiles: 1,
                                            accept: {
                                              'image/*': ['.jpg', '.jpeg', '.png'],
                                              'application/pdf': ['.pdf']
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {/* Add certificate card with enhanced visuals */}
                        <div
                          onClick={handleAddCertificate}
                          className='border border-dashed rounded-md flex flex-col items-center justify-center p-3 min-h-[160px] cursor-pointer hover:bg-muted/10 transition-all group'
                        >
                          <div className='h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center mb-2 group-hover:bg-muted/40 transition-all'>
                            <Plus className='h-4 w-4 text-muted-foreground' />
                          </div>
                          <p className='text-muted-foreground text-xs font-medium'>Add Certificate</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default WorkingProfile
