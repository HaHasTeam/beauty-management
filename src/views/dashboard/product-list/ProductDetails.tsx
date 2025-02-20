import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import BrandSection from '@/components/branch/BrandSection'
import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import BasicInformationDetails from '@/components/product/BasicInformationDetails'
import ClassificationDetails from '@/components/product/ClassificationDetails'
import UpdateProductStatus from '@/components/product/UpdateProductStatus'
import { Routes, routesConfig } from '@/configs/routes'
import { getProductApi } from '@/network/product'

const ProductDetails = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { data: productData, isFetching: isGettingProduct } = useQuery({
    queryKey: [getProductApi.queryKey, id as string],
    queryFn: getProductApi.fn,
    enabled: !!id
  })

  return (
    <>
      {isGettingProduct && <LoadingLayer />}
      {!isGettingProduct && productData && (
        <div className='container mx-auto p-6 space-y-4'>
          {/* Header Section */}
          <div className='flex justify-between items-center gap-2'>
            <h3 className='md:text-xl sm:text-sm text-xs font-bold'>{productData.data.name}</h3>
            <Link
              to={routesConfig[Routes.UPDATE_PRODUCT].getPath({ id: productData.data.id })}
              className='md:text-base sm:text-sm text-xs min-w-fit px-2 py-1 rounded-md text-primary hover:text-primary flex items-center gap-1 bg-white hover:bg-primary/10 border border-primary'
            >
              {t('button.edit')}
              <Pencil className='w-5 h-5 sm:block hidden' />
            </Link>
          </div>

          {/* Update product status */}
          <UpdateProductStatus product={productData.data} />

          {/* Basic Information Section */}
          <BasicInformationDetails product={productData.data} />
          {/* Brand Information Section */}
          <BrandSection brand={productData.data.brand || null} />

          {/* Product Variants Section */}
          <ClassificationDetails classifications={productData.data.productClassifications ?? []} />
        </div>
      )}
      {!isGettingProduct && productData && !productData.data && (
        <div className='h-[600px] w-full flex justify-center items-center'>
          <Empty title={t('empty.productDetail.title')} description={t('empty.productDetail.description')} />
        </div>
      )}
    </>
  )
}

export default ProductDetails
