import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SaveIcon, User2 } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import Button from '@/components/button'
import UploadFiles, { TriggerUploadRef } from '@/components/file-input/UploadFiles'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { PhoneInputWithCountries } from '@/components/phone-input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultRequiredRegex, emailRegex, longRequiredRegex, phoneRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getUserProfileApi, updateProfileApi } from '@/network/apis/user'
import { FileStatusEnum, TFile } from '@/types/file'
import { TUser, UserGenderEnum } from '@/types/user'

import { convertFormIntoProfile, convertProfileIntoForm } from './helper'

const formSchema = z.object({
  firstName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message()),
  lastName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message()),
  username: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message()),
  email: z
    .string()
    .regex(longRequiredRegex.pattern, longRequiredRegex.message())
    .regex(emailRegex.pattern, emailRegex.message()),
  gender: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  phone: z
    .string()
    .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
    .refine(phoneRegex.pattern, phoneRegex.message()),
  dob: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  avatar: z
    .array(
      z.object({
        fileUrl: z.string().optional(),
        name: z.string().optional(),
        id: z.string().optional(),
        status: z.nativeEnum(FileStatusEnum).optional()
      })
    )
    .optional()
    .default([])
})

const ProfileDetails = () => {
  const id = useId()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      avatar: []
    }
  })
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const { isFetching: isGettingUserProfile, data: userProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const triggerRef = useRef<TriggerUploadRef>(null)

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationKey: [updateProfileApi.mutationKey],
    mutationFn: updateProfileApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Your profile has been updated!'
      })
    }
  })

  useEffect(() => {
    if (userProfileData?.data) {
      const userData = userProfileData.data as unknown as TUser
      const formData = convertProfileIntoForm(userData)
      form.reset({
        ...formData,
        avatar: userData.avatar
          ? [
              {
                fileUrl: userData.avatar,
                name: 'avatar',
                id: userData.avatar,
                status: FileStatusEnum.ACTIVE
              }
            ]
          : []
      })
    }
  }, [userProfileData?.data, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // There's a type mismatch between the form data and what the API expects
      // The API needs a TUser type, but convertFormIntoProfile returns a type with a different 'role' structure
      // Using 'any' is necessary here to bridge this type gap since the API works correctly at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await triggerRef.current?.triggers[0]()
      values = form.getValues()

      const updateData = convertFormIntoProfile({
        ...values,
        avatar: values.avatar[0]?.fileUrl
      })
      await updateProfileFn(updateData)

      queryClient.invalidateQueries({
        queryKey: [getUserProfileApi.queryKey]
      })
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  return (
    <>
      {isGettingUserProfile && <LoadingContentLayer />}

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User2 />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full' id={`form-${id}`}>
              <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='avatar'
                  render={({ field }) => (
                    <FormItem className='col-span-full'>
                      <FormLabel required>Avatar</FormLabel>
                      <FormControl>
                        <UploadFiles
                          triggerRef={triggerRef}
                          dropZoneConfigOptions={{
                            maxFiles: 1,
                            accept: {
                              'image/*': ['.png', '.jpg', '.jpeg']
                            }
                          }}
                          field={{
                            value: field.value as TFile[],
                            onChange: field.onChange
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>First Name Of User</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. Allure' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Last Name Of User</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. Beauty' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Username</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. allurebeauty' {...field} />
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
                      <FormLabel required>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. allure@example.com' {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Gender Of User</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a gender' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserGenderEnum.MALE}>Male</SelectItem>
                          <SelectItem value={UserGenderEnum.FEMALE}>Female</SelectItem>
                          <SelectItem value={UserGenderEnum.OTHER}>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Phone Number Of User</FormLabel>
                      <FormControl>
                        <PhoneInputWithCountries {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='dob'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Date of Birth</FormLabel>
                      <FormControl>
                        <FlexDatePicker field={field} onlyPastDates label='Select Date of Birth' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Button
        type='submit'
        className='flex gap-2 items-center mt-8 ml-auto'
        form={`form-${id}`}
        loading={form.formState.isSubmitting ? true : undefined}
      >
        <SaveIcon />
        Save Profiles
      </Button>
    </>
  )
}

export default ProfileDetails
