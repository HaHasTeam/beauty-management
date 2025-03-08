import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { MdPhoto } from 'react-icons/md'
import { z } from 'zod'

import Button from '@/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { requiredRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getUserProfileApi, updateProfileApi } from '@/network/apis/user'

import { convertFormIntoProfile } from './helper'

const formSchema = z.object({
  avatar: z.string().regex(requiredRegex().pattern, requiredRegex().message)
})

const ProfileHeader = () => {
  const id = useId()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: ''
    }
  })
  const handleServerError = useHandleServerError()
  const { successToast } = useToast()
  const { data } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const queryClient = useQueryClient()
  const userProfileData = data?.data

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
    if (userProfileData?.avatar) {
      form.setValue('avatar', userProfileData?.avatar)
    }
  }, [userProfileData?.avatar, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateProfileFn(convertFormIntoProfile(values))
      queryClient.invalidateQueries({
        queryKey: [getUserProfileApi.queryKey]
      })
    } catch (error) {
      handleServerError({
        error
      })
    }
  }
  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full' id={`form-${id}`}>
        <FormField
          control={form.control}
          name='avatar'
          render={() => (
            <FormItem>
              <Card className={'h-min flex items-center align-center max-w-full py-8 px-4 dark:border-zinc-800'}>
                <div className='flex gap-4 items-center justify-between w-full flex-wrap'>
                  <div className='flex gap-4 items-center'>
                    <Avatar className='min-h-[68px] min-w-[68px] relative'>
                      <AvatarImage src={form.watch('avatar') || ''} />
                      <AvatarFallback className='text-2xl font-bold dark:bg-accent/20'>
                        {userProfileData ? userProfileData?.username?.[0].toUpperCase() : 'A'}
                      </AvatarFallback>
                      {/* <UploadFileModal
                        field={field}
                        Trigger={
                          <FaCameraRotate
                            size={20}
                            className='cursor-pointer absolute bottom-3 right-3 hover:scale-150 transition-all shadow-lg duration-500 text-foreground p-0.5 rounded-full bg-primary/80'
                          />
                        }
                      /> */}
                    </Avatar>
                    <div>
                      <p className='text-xl font-extrabold  leading-[100%]  pl-4 md:text-3xl'>Allure Beauty</p>
                      <p className='text-sm font-medium  md:mt-2 pl-4 md:text-base'>CEO and Founder</p>
                    </div>
                  </div>
                  <Button loading={form.formState.isSubmitting}>
                    <MdPhoto className='flex items-center gap-2' />
                    Save Avatar
                  </Button>
                </div>
              </Card>
              <FormControl></FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ProfileHeader
