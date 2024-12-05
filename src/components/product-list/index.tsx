import { PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Routes, routesConfig } from '@/configs/routes'
import { StatusEnum } from '@/types/brand'
import { IProductTable, IResponseProduct } from '@/types/product'

import ProductTable from '../product-list/ProductTable'

const index = () => {
  const products: IResponseProduct[] = [
    {
      id: '10d64537-6eab-4491-8ea3-af0713ac78a0',
      name: 'Lemonade LipBalm',
      description: 'good',
      detail: 'made in Viet Nam',
      price: 123,
      quantity: 150,
      status: 'ACTIVE',
      category: {
        id: 'c5e6d8d1-23b9-44b2-bcb7-1d040d23ff60',
        createdAt: '2024-11-22T13:40:06.245Z',
        updatedAt: '2024-11-22T13:40:06.245Z',
        name: 'lipstick'
      },
      brand: {
        id: 'b15e7081-a88c-4289-89d1-e2538493b88c',
        createdAt: '2024-11-22T13:39:57.714Z',
        updatedAt: '2024-11-22T13:39:57.714Z',
        name: 'Beauty Han',
        logo: 'https://example.com/logos/beauty-essentials.png',
        document: 'https://example.com/docs/beauty-essentials-doc.pdf',
        description: 'Premium beauty products for skincare and wellness.',
        email: 'contact@beautyessentials.com',
        phone: '0900123456',
        address: '123 Beauty Avenue, Beauty City',
        star: 0,
        status: StatusEnum.PENDING
      },
      productClassifications: [
        {
          id: '6d9d27c0-f242-4c20-b068-b6820851d228',
          title: 'red',
          quantity: 100,
          status: 'ACTIVE'
        },
        {
          id: '838f269b-f5e2-445a-87f3-2ca8b35b8ab9',
          title: 'orange',
          quantity: 50,
          status: 'ACTIVE'
        }
      ],
      images: [
        {
          id: '0c330d77-3122-4142-81aa-1b837680066c',
          createdAt: '2024-11-22T13:40:49.557Z',
          updatedAt: '2024-11-22T13:40:49.557Z',
          name: 'image2',
          fileUrl: 'llaaaertyu',
          status: 'ACTIVE'
        },
        {
          id: 'f8a6755d-a59d-45c0-bd39-6552151136a0',
          createdAt: '2024-11-22T13:40:49.557Z',
          updatedAt: '2024-11-22T13:40:49.557Z',
          name: 'image1',
          fileUrl: '123abc',
          status: 'ACTIVE'
        }
      ]
    }
  ]
  const tableData: IProductTable[] = products.map((product) => ({
    id: product.id ?? '',
    name: product.name,
    price: product.price ?? 0,
    quantity: product.quantity ?? 0,
    description: product.description ?? '',
    detail: product.detail ?? '',
    brand: product.brand?.name ?? '',
    category: product.category?.name ?? '',
    menu: ''
  }))

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex justify-end'>
        <Link
          to={routesConfig[Routes.CREATE_PRODUCT].getPath()}
          className='flex gap-2 items-center rounded-lg px-4 p-2 bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/80'
        >
          <PlusCircle />
          Create Product
        </Link>
      </div>
      <ProductTable tableData={tableData} />
    </div>
  )
}

export default index
