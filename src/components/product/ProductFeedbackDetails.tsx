import { useMutation } from '@tanstack/react-query'
import { Check, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { filterFeedbackApi } from '@/network/apis/feedback'
import { IFilterFeedbackData } from '@/network/apis/feedback/type'
import { useStore } from '@/stores/store'
import { FeedbackFilterEnum } from '@/types/enum'
import { IResponseFilterFeedback } from '@/types/feedback'
import { IResponseProduct } from '@/types/product'

import Button from '../button'
import Empty from '../empty/Empty'
import { ViewFeedbackDialog } from '../feedback/ViewFeedbackDialog'
import ViewMediaSection from '../media/ViewMediaSection'
import APIPagination from '../pagination/Pagination'
import { Ratings } from '../ui/rating'

interface FilterOption {
  id: string
  label: string
  value: string | number
  type: 'toggle' | 'star'
}

interface ProductFeedbackDetailsProps {
  product: IResponseProduct | null
}
const ProductFeedbackDetails = ({ product }: ProductFeedbackDetailsProps) => {
  const { t } = useTranslation()
  const [selectedFilter, setSelectedFilter] = useState<string>('')
  const [reviews, setReviews] = useState<IResponseFilterFeedback[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const handleServerError = useHandleServerError()
  const [openViewFbDialog, setOpenViewFbDialog] = useState<boolean>(false)
  // const [total, setTotal] = useState<number>(1)
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )

  const filterOptions: FilterOption[] = [
    // { id: 'newest', label: `${t('filter.newest')}`, value: 'newest', type: 'toggle' },
    { id: 'has-image', label: `${t('filter.hasImage')}`, value: 'has-image', type: 'toggle' },
    { id: 'star-5', label: `${t('filter.numberOfStar', { count: 5 })}`, value: 5, type: 'star' },
    { id: 'star-4', label: `${t('filter.numberOfStar', { count: 4 })}`, value: 4, type: 'star' },
    { id: 'star-3', label: `${t('filter.numberOfStar', { count: 3 })}`, value: 3, type: 'star' },
    { id: 'star-2', label: `${t('filter.numberOfStar', { count: 2 })}`, value: 2, type: 'star' },
    { id: 'star-1', label: `${t('filter.numberOfStar', { count: 1 })}`, value: 1, type: 'star' }
  ]

  const { mutateAsync: getFeedbackOfProduct } = useMutation({
    mutationKey: [filterFeedbackApi.mutationKey, product?.id],
    mutationFn: filterFeedbackApi.fn,
    onSuccess: (data) => {
      setReviews(data?.data?.items || [])
      setTotalPages(data?.data?.totalPages || 1)
      // setTotal(data?.data?.totalPages || 1)
      setIsLoading(false)
    }
  })
  const applyFilters = useCallback(
    async (page = 1) => {
      setIsLoading(true)

      try {
        const convertFiltersToApiParams = () => {
          let filter: { type: string; value: string } | object = {}

          // Check for star ratings
          if (selectedFilter.startsWith('star-')) {
            const rating = parseInt(selectedFilter.split('-')[1])
            filter = { type: FeedbackFilterEnum.RATING, value: rating.toString() }
          }
          // Check for has-image filter
          if (selectedFilter === 'has-image') {
            filter = { type: FeedbackFilterEnum.IMAGE_VIDEO, value: '' }
          }
          if (!selectedFilter) {
            filter = { type: FeedbackFilterEnum.ALL, value: '' }
          }

          return filter
        }
        // Convert selected filters to API parameters
        const filterParams = convertFiltersToApiParams()

        // Call API with filters and pagination
        await getFeedbackOfProduct({ params: product?.id ?? '', data: filterParams as IFilterFeedbackData })

        setCurrentPage(page)
      } catch (error) {
        handleServerError({
          error
        })
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFilter, getFeedbackOfProduct, product?.id]
  )

  // Toggle a filter and apply filters
  const toggleFilter = (filterId: string) => {
    // const newFilters = new Set(selectedFilters)

    // if (newFilters.has(filterId)) {
    //   newFilters.delete(filterId)
    // } else {
    //   newFilters.add(filterId)
    // }

    // setSelectedFilters(newFilters)
    setSelectedFilter((prevFilter) => {
      if (prevFilter === filterId) {
        return ''
      }

      return filterId
    })
    // Reset to first page when filters change
    setCurrentPage(1)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    applyFilters(page)
  }

  // Initial data load
  useEffect(() => {
    applyFilters(1)
  }, [applyFilters])

  // Apply filters when they change
  useEffect(() => {
    applyFilters(1)
  }, [selectedFilter, applyFilters])

  return (
    <div>
      <div className='mb-2 justify-end flex items-center gap-2'>
        <span className='font-semibold text-primary'>{t('filter.filterBy')}</span>
        <div className='flex flex-wrap gap-2'>
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant={selectedFilter === option.id ? 'outline' : 'outline'}
              onClick={() => toggleFilter(option.id)}
              className={`h-8 gap-1.5 rounded-full border-gray-300 ${selectedFilter === option.id ? ' border-primary bg-primary/10 hover:bg-primary/15 text-primary hover:text-primary' : 'border-secondary-foreground text-secondary-foreground hover:text-secondary-foreground'}`}
            >
              {option.type === 'toggle' && selectedFilter === option.id && <Check className='text-primary/80' />}
              {option.label}
              {option.type === 'star' && <Star className='w-4 h-4 fill-current text-yellow-500' />}
            </Button>
          ))}
        </div>
      </div>
      <div className='overflow-x-auto'>
        <Table className='w-full hover:bg-transparent items-center'>
          <TableHeader>
            <TableRow>
              <TableHead className='flex justify-center text-center w-28 text-wrap'>
                {t('createProduct.skuClassification')}
              </TableHead>
              <TableHead>
                <div className='flex justify-center text-center'>{t('feedback.rating')}</div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center text-center'>{t('feedback.customerContent')}</div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center text-center'>{t('media.imagesVideos')}</div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center text-center'>{t('feedback.order')}</div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center text-center'>{t('feedback.viewDetails')}</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && (!reviews || reviews.length === 0) && (
              <TableCell colSpan={6} className='w-full'>
                <Empty
                  title={t('empty.feedback.title')}
                  description={t('empty.feedback.description', {
                    filter: !selectedFilter ? '' : t('empty.feedback.filter'),
                    filterCallAction: !selectedFilter ? '' : t('empty.feedback.filterCallAction')
                  })}
                />
              </TableCell>
            )}
            {reviews &&
              reviews.length > 0 &&
              reviews.map((review, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className='flex justify-center text-center'>
                      {review.orderDetail.productClassification.sku === ''
                        ? '-'
                        : review.orderDetail.productClassification.sku}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center text-center'>
                      <Ratings rating={review.rating} size={13} variant='yellow' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center text-start line-clamp-5 overflow-ellipsis'>
                      {review.content}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center text-center'>
                      {review.mediaFiles && review.mediaFiles.length > 0 ? (
                        <ViewMediaSection mediaFiles={review.mediaFiles} />
                      ) : (
                        t('orderDetail.no')
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col items-center justify-center text-center gap-2'>
                      <Link
                        to={routesConfig[Routes.ORDER_DETAILS].getPath({ id: review.orderDetail.id ?? '' })}
                        className='no-underline'
                      >
                        {/* <div>{review.orderDetail.id.substring(0, 8)}</div> */}

                        <Button
                          variant='outline'
                          size='sm'
                          className='border border-primary text-primary hover:text-primary hover:bg-primary/10'
                          onClick={() => setOpenViewFbDialog(true)}
                        >
                          {t('order.viewOrder')}
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center text-center'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border border-primary text-primary hover:text-primary hover:bg-primary/10'
                        onClick={() => setOpenViewFbDialog(true)}
                      >
                        {t('order.viewFeedback')}
                      </Button>
                    </div>
                    {review && product && (
                      <ViewFeedbackDialog
                        productQuantity={review.orderDetail.quantity}
                        productClassification={review.orderDetail.productClassification}
                        isOpen={openViewFbDialog}
                        onClose={() => setOpenViewFbDialog(false)}
                        feedback={{
                          id: review.id,
                          createdAt: review.createdAt,
                          updatedAt: review.updatedAt,
                          rating: review.rating,
                          content: review.content,
                          orderDetailId: review.orderDetail.id,
                          mediaFiles: review.mediaFiles,
                          author: review.orderDetail.order.account,
                          replies: review.replies
                        }}
                        brand={product?.brand || null}
                        accountAvatar={user.avatar ?? ''}
                        accountName={user.username ?? ''}
                        orderDetailId={review.orderDetail.id}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      {reviews && reviews.length > 0 && (
        <div className='mt-2'>
          <APIPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}

export default ProductFeedbackDetails
