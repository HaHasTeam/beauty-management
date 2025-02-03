import { useQuery } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Routes, routesConfig } from '@/configs/routes'
import { getAllProductApi } from '@/network/product'

import LoadingContentLayer from '../loading-icon/LoadingContentLayer'

const ProductList = () => {
  // const [tableData, setTableData] = useState<IProductTable[]>([])
  const { isFetching: isGettingAllProduct } = useQuery({
    queryKey: [getAllProductApi.queryKey],
    queryFn: getAllProductApi.fn
  })

  // useEffect(() => {
  //   if (allProductData?.data) {
  //     setTableData(
  //       allProductData?.data?.map((product) => ({
  //         id: product.id ?? '',
  //         name: product.name ?? '',
  //         status: product.status ?? '',
  //         updatedAt: product.updatedAt ?? '',
  //         description: product.description ?? '',
  //         detail: product.detail ?? '',
  //         brand: product.brand,
  //         category: product.category,
  //         menu: ''
  //       }))
  //     )
  //   }
  // }, [allProductData])

  return (
    <div className='flex flex-col space-y-4'>
      {isGettingAllProduct && <LoadingContentLayer />}
      <div className='flex justify-end'>
        <Link
          to={routesConfig[Routes.CREATE_PRODUCT].getPath()}
          className='flex gap-2 items-center rounded-lg px-4 p-2 bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/80'
        >
          <PlusCircle />
          Create Product
        </Link>
      </div>
      {/* <ProductTable tableData={tableData} /> */}
    </div>
  )
}

export default ProductList
