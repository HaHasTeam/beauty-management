import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { MdOutlineChangeCircle, MdPhoto } from 'react-icons/md'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { requiredRegex } from '@/constants/regex'

import UploadFileModal from '../file-input/file-upload-modal'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full' id={`form-${id}`}>
        <FormField
          control={form.control}
          name='avatar'
          render={({ field }) => (
            <FormItem>
              <Card className={'h-min flex items-center align-center max-w-full py-8 px-4 dark:border-zinc-800'}>
                <div className='flex gap-4 items-center justify-between w-full flex-wrap'>
                  <div className='flex gap-4 items-center'>
                    <Avatar className='min-h-[68px] min-w-[68px] relative'>
                      <AvatarImage src={form.watch('avatar') || ''} />
                      <AvatarFallback className='text-2xl font-bold dark:bg-accent/20'>A</AvatarFallback>
                      <UploadFileModal
                        field={field}
                        formState={{
                          ...form
                        }}
                        Trigger={
                          <MdOutlineChangeCircle className='cursor-pointer absolute bottom-3 right-3 hover:scale-150 transition-all shadow-lg duration-500 text-foreground p-0.5 rounded-full bg-primary/80' />
                        }
                      />
                    </Avatar>
                    <div>
                      <p className='text-xl font-extrabold  leading-[100%]  pl-4 md:text-3xl'>Allure Beauty</p>
                      <p className='text-sm font-medium  md:mt-2 pl-4 md:text-base'>CEO and Founder</p>
                    </div>
                  </div>
                  <Button>
                    <MdPhoto className='flex items-center gap-2' />
                    Save Avatar Settings
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
