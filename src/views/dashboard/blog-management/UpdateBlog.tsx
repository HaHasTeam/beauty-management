import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

import Button from '@/components/button'
import Empty from '@/components/empty/Empty'
import FormLabel from '@/components/form-label'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getBlogApi, updateBlogApi } from '@/network/apis/blog'
import { getFormBlogSchema } from '@/schemas/blog.schema'
import { IServerCreateBlog } from '@/types/blog'
import { BlogEnum } from '@/types/enum'
import { modules } from '@/variables/textEditor'

const UpdateBlog = () => {
  const { t } = useTranslation()
  // const [resetSignal, setResetSignal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams<{ id: string }>() // Get blog ID from URL params
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()

  // Form setup
  const FormBlogSchema = getFormBlogSchema()
  const defaultBlogValues = {
    title: '',
    content: '',
    status: BlogEnum.UN_PUBLISHED,
    tag: ''
  }

  const form = useForm<z.infer<typeof FormBlogSchema>>({
    resolver: zodResolver(FormBlogSchema),
    defaultValues: defaultBlogValues
  })

  // Fetch blog data
  const { data: blogData, isLoading: isBlogLoading } = useQuery({
    queryKey: [getBlogApi.queryKey, id as string],
    queryFn: getBlogApi.fn,
    enabled: !!id // Only fetch if blogId exists
  })

  // Update blog mutation
  const { mutateAsync: updateBlogFn } = useMutation({
    mutationKey: [updateBlogApi.mutationKey],
    mutationFn: updateBlogApi.fn,
    onSuccess: () => {
      successToast({
        message:
          form.getValues('status') === BlogEnum.PUBLISHED
            ? t('updateBlog.successPublished')
            : t('updateBlog.successInactive'),
        description:
          form.getValues('status') === BlogEnum.PUBLISHED
            ? t('updateBlog.successPublishedDescription')
            : t('updateBlog.successInactiveDescription')
      })
      queryClient.invalidateQueries({
        queryKey: [getBlogApi.queryKey, id as string]
      })
      handleReset()
    }
  })

  const handleReset = () => {
    if (blogData?.data) {
      form.reset({
        title: blogData.data.title,
        content: blogData.data.content,
        status: blogData.data.status,
        tag: blogData.data.tag
      })
    } else {
      form.reset({
        ...defaultBlogValues,
        content: '<p><br></p>'
      })
    }
    // setResetSignal((prev) => !prev)
  }

  // Pre-populate form with blog data when fetched
  useEffect(() => {
    if (blogData?.data) {
      form.reset({
        title: blogData.data.title,
        content: blogData.data.content || '<p><br></p>',
        status: blogData.data.status,
        tag: blogData.data.tag
      })
    }
  }, [blogData, form])

  async function onSubmit(values: z.infer<typeof FormBlogSchema>) {
    if (!id) return

    try {
      setIsLoading(true)
      const transformedData: IServerCreateBlog = {
        title: values.title,
        content: values.content,
        status: values.status,
        tag: values.tag
      }

      await updateBlogFn({ id: id ?? '', data: transformedData })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }

  if (isBlogLoading) {
    return <LoadingLayer />
  }

  if (!isBlogLoading && (!blogData || !blogData?.data)) {
    return (
      <div className='h-[600px] w-full flex justify-center items-center'>
        <Empty title={t('empty.blog.title')} description={t('empty.blog.description')} />
      </div>
    )
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
                        <FormLabel required>{t('updateBlog.title')}</FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <Input placeholder={t('updateBlog.titlePlaceholder')} {...field} />
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
                        <FormLabel required>{t('updateBlog.content')}</FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <ReactQuill
                            modules={modules}
                            placeholder={t('updateBlog.contentPlaceholder')}
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
                        <FormLabel required>{t('updateBlog.status')}</FormLabel>
                      </div>
                      <div className='w-full space-y-1'>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('updateBlog.statusPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={BlogEnum.PUBLISHED} key={BlogEnum.PUBLISHED}>
                                {t('updateBlog.published')}
                              </SelectItem>
                              <SelectItem value={BlogEnum.UN_PUBLISHED} key={BlogEnum.UN_PUBLISHED}>
                                {t('updateBlog.unPublished')}
                              </SelectItem>
                              <SelectItem value={BlogEnum.INACTIVE} key={BlogEnum.INACTIVE}>
                                {t('updateBlog.inactive')}
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

export default UpdateBlog
