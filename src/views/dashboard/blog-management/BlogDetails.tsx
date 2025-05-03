import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { Link, useParams } from 'react-router-dom'

import BlogState from '@/components/blog-state'
import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Routes, routesConfig } from '@/configs/routes'
import { getBlogApi } from '@/network/apis/blog'

const BlogDetails = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>() // Get blog ID from URL params

  // Fetch blog data
  const { data: blogData, isLoading: isBlogLoading } = useQuery({
    queryKey: [getBlogApi.queryKey, id as string],
    queryFn: getBlogApi.fn,
    enabled: !!id // Only fetch if blogId exists
  })

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
    !isBlogLoading &&
    blogData &&
    blogData.data && (
      <div className='container mx-auto py-3 flex flex-col gap-4'>
        <div className='flex justify-between items-center gap-2'>
          <div className='flex gap-1 items-center'>
            <h2 className='md:text-2xl sm:text-sm text-xs font-bold text-justify text-primary'>
              {blogData.data.title}
            </h2>
            <BlogState state={blogData.data.status} />
          </div>
          <div className='flex gap-2 items-center'>
            <Link
              to={routesConfig[Routes.UPDATE_BLOG].getPath({ id: blogData.data.id })}
              className='md:text-base sm:text-sm text-xs min-w-fit px-2 py-1 rounded-md text-white hover:text-white flex items-center gap-1 bg-primary hover:bg-primary/80 border border-primary'
            >
              {t('button.edit')}
              <Pencil className='w-5 h-5 sm:block hidden' />
            </Link>
            <Link
              to={routesConfig[Routes.BLOG].getPath()}
              className='md:text-base sm:text-sm text-xs min-w-fit px-2 py-1 rounded-md text-primary hover:text-primary flex items-center gap-1 bg-white hover:bg-primary/10 border border-primary'
            >
              <ChevronLeft className='w-5 h-5 sm:block hidden' />
              {t('button.backToList')}
            </Link>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <p className='text-blue-500 underline italic text-sm flex flex-wrap line-clamp-1 overflow-ellipsis'>
                {blogData.data?.tag}
              </p>
              <p>
                {blogData.data?.author?.username && `${t('createBlog.author')}: ${blogData.data?.author?.username}`}
              </p>
              <div className='text-sm text-muted-foreground flex justify-between items-center'>
                <p>
                  {t('blogDetails.createdAt')}:{' '}
                  {t('date.toLocaleDateTimeString', { val: new Date(blogData.data.createdAt) })}
                </p>
                <p>
                  {t('blogDetails.updatedAt')}:{' '}
                  {t('date.toLocaleDateTimeString', { val: new Date(blogData.data.updatedAt) })}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactQuill value={blogData.data.content} readOnly={true} theme={'bubble'} />
          </CardContent>
        </Card>
      </div>
    )
  )
}

export default BlogDetails
