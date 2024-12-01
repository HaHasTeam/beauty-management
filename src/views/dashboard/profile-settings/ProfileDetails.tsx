import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuSaveAll } from 'react-icons/lu'
import * as z from 'zod'

import Button from '@/components/button'
import CardSection from '@/components/card-section'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { PhoneInputWithCountries } from '@/components/phone-input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultRequiredRegex, emailRegex, longRequiredRegex, phoneRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getUserProfileApi, updateProfileApi } from '@/network/apis/user'
import { UserGenderEnum } from '@/types/user'

import { convertFormIntoProfile, convertProfileIntoForm } from './helper'

const formSchema = z.object({
  firstName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message),
  lastName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message),
  username: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message),
  email: z
    .string()
    .regex(longRequiredRegex.pattern, longRequiredRegex.message)
    .regex(emailRegex.pattern, emailRegex.message),
  gender: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  phone: z
    .string()
    .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
    .refine(phoneRegex.pattern, phoneRegex.message),
  dob: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
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
      gender: ''
    }
  })
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const { isFetching: isGettingUserProfile, data: userProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })

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
      form.reset(convertProfileIntoForm(userProfileData.data))
    }
  }, [userProfileData?.data, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateProfileFn(convertFormIntoProfile(values))
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
      <CardSection
        title='Profile Details'
        description='Update your profile details here, this information will be displayed on your profile'
        rightComponent={
          <Button
            type='submit'
            className='flex gap-2 items-center'
            form={`form-${id}`}
            loading={form.formState.isSubmitting}
          >
            <LuSaveAll />
            <span>Save Profile Settings</span>
          </Button>
        }
      >
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full' id={`form-${id}`}>
            <div className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='
                     e.g. Allure
                    '
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is the first name that will be displayed on your profile</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='
                    e.g. Beauty
                    '
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is the last name that will be displayed on your profile</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>User name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='
                    e.g. allurebeauty
                    '
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is the user name that will be displayed on your profile</FormDescription>
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
                      <Input readOnly placeholder='e.g. allurebeauty@gmail.com' {...field} />
                    </FormControl>
                    <FormDescription>This is email will be used to send you notifications and updates</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInputWithCountries {...field} />
                    </FormControl>
                    <FormDescription>This is the phone number that will be displayed on your profile</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dob'
                render={({ field, formState }) => {
                  return (
                    <FormItem className='flex flex-col'>
                      <FormLabel required>Date of Birth</FormLabel>
                      <FlexDatePicker
                        onlyPastDates
                        field={field}
                        formState={{
                          ...formState,
                          ...form
                        }}
                      />
                      <FormDescription>
                        This is the date of birth that will be displayed on your profile
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>User Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='capitalize'>
                          <SelectValue placeholder='Select your gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserGenderEnum).map((gender) => {
                          return (
                            <SelectItem value={gender} className='uppercase'>
                              {gender}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>You can manage email addresses in your email settings.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardSection>
    </>
  )
}

export default ProfileDetails
