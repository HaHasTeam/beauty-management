import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuSaveAll } from 'react-icons/lu'
import * as z from 'zod'

import CardSection from '@/components/CardSection'
import FormLabel from '@/components/form-label'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultRequiredRegex, emailRegex, longRequiredRegex, phoneRegex } from '@/constants/regex'
import { UserGenderEnum } from '@/types/User'

import { FlexDatePicker } from '../flexible-date-picker/FlexDatePicker'
import { PhoneInputWithCountries } from '../phone-input'

const formSchema = z.object({
  firstName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message),
  lastName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message),
  userName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message),
  email: z
    .string()
    .regex(longRequiredRegex.pattern, longRequiredRegex.message)
    .regex(emailRegex.pattern, emailRegex.message),
  role: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  gender: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  phone: z
    .string()
    .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
    .refine(phoneRegex.pattern, phoneRegex.message),
  dob: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  address: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
})

const ProfileDetails = () => {
  const id = useId()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      phone: '',
      address: '',
      dob: '',
      gender: ''
    }
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <CardSection
      title='Profile Details'
      description='Update your profile details here, this information will be displayed on your profile'
      rightComponent={
        <Button type='submit' className='flex gap-2 items-center' form={`form-${id}`}>
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
              name='userName'
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
                    <Input
                      placeholder='
                    e.g. allurebeauty@gmail.com
                    '
                      {...field}
                    />
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
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='
                    e.g. 123, Allure Street, Beauty City, Nigeria
                    '
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is the address that will be displayed on your profile</FormDescription>
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
                      field={field}
                      formState={{
                        ...formState,
                        ...form
                      }}
                    />
                    <FormDescription>This is the date of birth that will be displayed on your profile</FormDescription>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
  )
}

export default ProfileDetails
