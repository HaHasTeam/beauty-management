import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Info, List, Package, Pencil, Star, Store } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import BrandSection from '@/components/branch/BrandSection'
import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import BasicInformationDetails from '@/components/product/BasicInformationDetails'
import ClassificationDetails from '@/components/product/ClassificationDetails'
import ProductDetailInfoSection from '@/components/product/ProductDetailInfoSection'
import ProductFeedbackDetails from '@/components/product/ProductFeedbackDetails'
import UpdateProductQuantity from '@/components/product/UpdateProductQuantity'
import UpdateProductStatus from '@/components/product/UpdateProductStatus'
import SectionCollapsable from '@/components/section-collapsable'
import { Routes, routesConfig } from '@/configs/routes'
import { getProductApi } from '@/network/apis/product'
import { useStore } from '@/stores/store'
import { ProductEnum, RoleEnum } from '@/types/enum'

const ProductDetails = () => {
  const PRODUCT_QUANTITY_WARNING = 15

  const { t } = useTranslation()
  const { id } = useParams()
  const { data: productData, isFetching: isGettingProduct } = useQuery({
    queryKey: [getProductApi.queryKey, id as string],
    queryFn: getProductApi.fn,
    enabled: !!id
  })
  const { user } = useStore(
    useShallow((state) => ({
      // addProduct: state.addProduct,
      // removeProduct: state.removeProduct,
      // incQty: state.incQty,
      // decQty: state.decQty,
      // setTotal: state.setTotal,
      // reset: state.reset,
      user: state.user
    }))
  )

  const productQuantity = useMemo(() => {
    return productData?.data?.productClassifications?.reduce((total, item) => total + (item.quantity || 0), 0) ?? 0
  }, [productData])

  return (
    <>
      {isGettingProduct && <LoadingLayer />}
      {!isGettingProduct && productData && (
        <div className='container mx-auto p-6 space-y-4'>
          {/* Header Section */}
          <div className='flex justify-between items-center gap-2'>
            <h3 className='md:text-xl sm:text-sm text-xs font-bold text-justify'>{productData.data.name}</h3>
            <div className='flex gap-2 items-center'>
              {productData.data.status !== ProductEnum.INACTIVE && productData.data.status !== ProductEnum.BANNED && (
                <Link
                  to={routesConfig[Routes.UPDATE_PRODUCT].getPath({ id: productData.data.id })}
                  className='md:text-base sm:text-sm text-xs min-w-fit px-2 py-1 rounded-md text-white hover:text-white flex items-center gap-1 bg-primary hover:bg-primary/80 border border-primary'
                >
                  {t('button.edit')}
                  <Pencil className='w-5 h-5 sm:block hidden' />
                </Link>
              )}
              <Link
                to={routesConfig[Routes.PRODUCT_LIST].getPath()}
                className='md:text-base sm:text-sm text-xs min-w-fit px-2 py-1 rounded-md text-primary hover:text-primary flex items-center gap-1 bg-white hover:bg-primary/10 border border-primary'
              >
                <ChevronLeft className='w-5 h-5 sm:block hidden' />
                {t('button.backToList')}
              </Link>
            </div>
          </div>

          {/* Update product status */}
          <UpdateProductStatus product={productData.data} />

          {/* Update product quantity */}
          {productQuantity <= PRODUCT_QUANTITY_WARNING &&
            productData.data.status !== ProductEnum.INACTIVE &&
            productData.data.status !== ProductEnum.BANNED && (
              <UpdateProductQuantity product={productData.data} productQuantityWarning={PRODUCT_QUANTITY_WARNING} />
            )}

          {/* Basic Information Section */}
          <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
            <SectionCollapsable
              header={
                <div className='flex gap-2 items-center text-primary'>
                  <Info className='w-5 h-5' />
                  <h2 className='font-bold text-xl'>{t('createProduct.basicInformation')}</h2>
                </div>
              }
              content={<BasicInformationDetails product={productData.data} />}
            />
          </div>
          {/* Product Detail Information Section */}
          <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
            <SectionCollapsable
              header={
                <div className='flex gap-2 items-center text-primary'>
                  <List className='w-5 h-5' />
                  <h2 className='font-bold text-xl'>{t('createProduct.detailInformation')}</h2>
                </div>
              }
              content={
                <ProductDetailInfoSection
                  detail={productData.data?.detail ?? ''}
                  detailCategoryObject={productData.data?.category?.detail}
                />
              }
            />
          </div>
          {/* Brand Information Section */}
          {user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR ? (
            <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
              <SectionCollapsable
                header={
                  <div className='flex gap-2 items-center text-primary'>
                    <Store className='w-5 h-5' />
                    <h2 className='font-bold text-xl'>{t('createProduct.brandInformation')}</h2>
                  </div>
                }
                content={<BrandSection brand={productData.data.brand || null} />}
              />
            </div>
          ) : null}
          {/* Product Variants Section */}
          <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
            <SectionCollapsable
              header={
                <div className='flex gap-2 items-center text-primary'>
                  <Package className='w-5 h-5' />
                  <h2 className='font-bold text-xl'>{t('createProduct.classificationInformation')}</h2>
                </div>
              }
              content={<ClassificationDetails classifications={productData.data.productClassifications ?? []} />}
            />
          </div>
          {/* Product Feedbacks Section */}
          <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
            <SectionCollapsable
              header={
                <div className='flex gap-2 items-center text-primary'>
                  <Star className='w-5 h-5' />
                  <h2 className='font-bold text-xl'>{t('reviews.title')}</h2>
                </div>
              }
              content={<ProductFeedbackDetails product={productData.data ?? {}} />}
            />
          </div>
        </div>
      )}
      {!isGettingProduct && (!productData || (productData && !productData.data)) && (
        <div className='h-[600px] w-full flex justify-center items-center'>
          <Empty title={t('empty.productDetail.title')} description={t('empty.productDetail.description')} />
        </div>
      )}
    </>
  )
}

export default ProductDetails
