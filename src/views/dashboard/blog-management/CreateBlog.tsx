import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Newspaper } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { z } from 'zod'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createBlogApi } from '@/network/apis/blog'
import { getFormBlogSchema } from '@/schemas/blog.schema'
import { IServerCreateBlog } from '@/types/blog'
import { BlogEnum, BlogTypeEnum } from '@/types/enum'
import { modules } from '@/variables/textEditor'

const CreateBlog = () => {
  const { t } = useTranslation()
  // const [resetSignal, setResetSignal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { successToast } = useToast()
  const handleServerError = useHandleServerError()

  // Form setup
  const FormBlogSchema = getFormBlogSchema()
  const defaultBlogValues = {
    title: '',
    content: '',
    status: BlogEnum.UN_PUBLISHED,
    tag: '',
    type: BlogTypeEnum.CONDITION
  }

  const form = useForm<z.infer<typeof FormBlogSchema>>({
    resolver: zodResolver(FormBlogSchema),
    defaultValues: defaultBlogValues
  })
  // User profile query
  // const { data: useProfileData } = useQuery({
  //   queryKey: [getUserProfileApi.queryKey],
  //   queryFn: getUserProfileApi.fn
  // })

  // Create blog mutation
  const { mutateAsync: createBlogFn } = useMutation({
    mutationKey: [createBlogApi.mutationKey],
    mutationFn: createBlogApi.fn,
    onSuccess: () => {
      successToast({
        message:
          form.getValues('status') === BlogEnum.PUBLISHED
            ? t('createBlog.successPublished')
            : t('createBlog.successInactive'),
        description:
          form.getValues('status') === BlogEnum.PUBLISHED
            ? t('createBlog.successPublishedDescription')
            : t('createBlog.successInactiveDescription')
      })
      handleReset()
    }
  })

  const handleReset = () => {
    form.reset()
    form.reset({
      content: '<p><br></p>',
      status: BlogEnum.UN_PUBLISHED,
      type: BlogTypeEnum.CONDITION
    })
    // setResetSignal((prev) => !prev)
  }
  async function onSubmit(values: z.infer<typeof FormBlogSchema>) {
    try {
      setIsLoading(true)
      const transformedData: IServerCreateBlog = {
        title: values.title,
        content: values.content,
        status: values.status,
        tag: values.tag,
        type: values.type
      }

      await createBlogFn(transformedData)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-1'>
              <Newspaper />
              Blog Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4 w-full'>
              {/* Title Field */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <div className='flex w-full gap-2'>
                      <div className='w-[15%]'>
                        <FormLabel required>{t('createBlog.title')}</FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <Input placeholder={t('createBlog.titlePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {/* Tag Field */}
              <FormField
                control={form.control}
                name='tag'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <div className='flex w-full gap-2'>
                      <div className='w-[15%]'>
                        <FormLabel required>{t('createBlog.tag')}</FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <Input placeholder={t('createBlog.tagPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Content Field */}
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <div className='flex w-full gap-2'>
                      <div className='w-[15%]'>
                        <FormLabel required>{t('createBlog.content')}</FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <ReactQuill
                            modules={modules}
                            placeholder={t('createBlog.contentPlaceholder')}
                            className='border border-primary/10 focus-within:border-primary transition-colors duration-200 rounded-lg'
                            theme='snow'
                            {...field}
                            onChange={(content) => {
                              field.onChange(content.trim())
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Status Field */}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <div className='flex w-full gap-2'>
                      <div className='w-[15%]'>
                        <FormLabel required>{t('createBlog.status')}</FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <Select
                            defaultValue={defaultBlogValues.status}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue {...field} placeholder={t('createBlog.statusPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={BlogEnum.UN_PUBLISHED} key={BlogEnum.UN_PUBLISHED}>
                                {t('createBlog.unPublished')}
                              </SelectItem>
                              <SelectItem value={BlogEnum.PUBLISHED} key={BlogEnum.PUBLISHED}>
                                {t('createBlog.published')}
                              </SelectItem>
                              <SelectItem value={BlogEnum.INACTIVE} key={BlogEnum.INACTIVE}>
                                {t('createBlog.inactive')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Types Field */}
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <div className='flex w-full gap-2'>
                      <div className='w-[15%]'>
                        <FormLabel required>{t('createBlog.type')}</FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <Select
                            defaultValue={defaultBlogValues.type}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue {...field} placeholder={t('createBlog.statusPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={BlogTypeEnum.CONDITION} key={BlogTypeEnum.CONDITION}>
                                {t('createBlog.condition')}
                              </SelectItem>
                              <SelectItem value={BlogTypeEnum.BLOG} key={BlogTypeEnum.BLOG}>
                                {t('createBlog.blog')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        {/* Submit Button */}
        <div className='flex justify-end gap-4'>
          <Button type='button' variant='outline' onClick={handleReset}>
            {t('button.cancel')}
          </Button>
          <Button type='submit' loading={isLoading}>
            {t('button.submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CreateBlog
