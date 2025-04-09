import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { useParams } from 'react-router-dom'

import BlogState from '@/components/blog-state'
import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
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
      <div className='container mx-auto py-3 flex flex-col gap-2'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-primary'>{blogData.data.title}</h2>
          <BlogState state={blogData.data.status} />
        </div>
        <div className='text-sm text-muted-foreground '>
          <p>
            {t('blogDetails.createdAt')}: {t('date.toLocaleDateTimeString', { val: new Date(blogData.data.createdAt) })}
          </p>
          <p>
            {t('blogDetails.updatedAt')}: {t('date.toLocaleDateTimeString', { val: new Date(blogData.data.updatedAt) })}
          </p>
        </div>

        <ReactQuill value={blogData.data.content} readOnly={true} theme={'bubble'} />
      </div>
    )
  )
}

export default BlogDetails
