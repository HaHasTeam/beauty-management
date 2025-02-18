import { FileText, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import BrandSection from '@/components/branch/BrandSection'
import ClassificationDetails from '@/components/product/ClassificationDetails'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ProductDetails = () => {
  const { t } = useTranslation()
  const product = {
    id: 'b37f244e-ae50-4f1e-9519-27f30be278d9',
    createdAt: '2025-02-16T13:30:09.861Z',
    updatedAt: '2025-02-16T13:30:09.861Z',
    name: '[BeauLeaf] Dầu dưỡng tóc phục hồi BeauLeaf Miracle Hair Oil 100ml',
    description: '<p>thông tin mô tả</p>',
    detail: '{"organizationName":["org1"],"organizationAddress":["address1"]}',
    sku: 'sku-1234',
    certificate: 'https://storage.googleapis.com/test-firebase-storage-d1b61.appspot.com/1739712608982.pdf',
    status: 'OFFICIAL',
    category: {
      id: 'b6917c5f-2cd9-4bf4-99e1-676dcc194166',
      createdAt: '2024-12-10T09:56:45.497Z',
      updatedAt: '2024-12-10T09:56:45.497Z',
      name: 'Smooth',
      level: 2,
      detail: {
        origin: {
          type: 'singleChoice',
          label: 'Xuất xứ',
          options: [
            {
              label: 'Việt Nam',
              value: 'vn'
            },
            {
              label: 'Khác',
              value: 'other'
            }
          ]
        },
        formula: {
          type: 'singleChoice',
          label: 'Công thức',
          options: [
            {
              label: 'Dạng mút',
              value: 'sponge'
            },
            {
              label: 'Khăn',
              value: 'towel'
            },
            {
              label: 'Dạng kem',
              value: 'cream'
            },
            {
              label: 'Dạng sánh',
              value: 'gelatinous'
            },
            {
              label: 'Dạng lỏng',
              value: 'liquid'
            },
            {
              label: 'Bột',
              value: 'powder'
            },
            {
              label: 'Rắn',
              value: 'solid'
            },
            {
              label: 'Dạng keo',
              value: 'glue-like'
            }
          ]
        },
        skinCare: {
          type: 'singleChoice',
          label: 'Chăm sóc da',
          options: [
            {
              label: 'Lỗ chân lông to',
              value: 'large-pores'
            },
            {
              label: 'Da dầu',
              value: 'oily-skin'
            },
            {
              label: 'Dưỡng ẩm',
              value: 'hydrating'
            },
            {
              label: 'Bảo vệ SPF',
              value: 'spf-coverage'
            },
            {
              label: 'Lâu trôi',
              value: 'long-lasting'
            },
            {
              label: 'Mụn Trứng Cá/ Thâm',
              value: 'acne_and_scars'
            },
            {
              label: 'Nám/ tàn nhang',
              value: 'melasma_and_freckles'
            },
            {
              label: 'Da dầu',
              value: 'oily_skin'
            },
            {
              label: 'Đóm đỏ',
              value: 'red_spots'
            },
            {
              label: 'Da không đều màu',
              value: 'uneven_skin_tone'
            },
            {
              label: 'Moisturizing',
              value: 'moisturizing'
            },
            {
              label: 'Whitening',
              value: 'whitening'
            },
            {
              label: 'Anti-Aging',
              value: 'anti_aging'
            },
            {
              label: 'Pore Control',
              value: 'pore_control'
            },
            {
              label: 'Acne Care',
              value: 'acne_care'
            },
            {
              label: 'Revitalizing',
              value: 'revitalizing'
            },
            {
              label: 'Oil Control',
              value: 'oil_control'
            },
            {
              label: 'Fine Lines & Wrinkles Treatment',
              value: 'fine_lines_and_wrinkles'
            },
            {
              label: 'Glowing',
              value: 'glowing'
            },
            {
              label: 'Repair Barrier',
              value: 'repair_barrier'
            },
            {
              label: 'Anti-dark spot',
              value: 'anti_dark_spots'
            },
            {
              label: 'Exfoliating',
              value: 'exfoliating'
            },
            {
              label: 'Cleansing',
              value: 'cleansing'
            }
          ]
        },
        skinType: {
          type: 'multipleChoice',
          label: 'Loại da',
          options: [
            {
              label: 'Mọi loại da',
              value: 'all'
            },
            {
              label: 'Da hỗn hợp',
              value: 'combination'
            },
            {
              label: 'Da thường',
              value: 'normal'
            },
            {
              label: 'Da khô',
              value: 'dry'
            },
            {
              label: 'Da dầu',
              value: 'oily'
            },
            {
              label: 'Da mụn trứng cá',
              value: 'acne'
            },
            {
              label: 'Da nhạy cảm',
              value: 'sensitive'
            },
            {
              label: 'Da sần',
              value: 'rough'
            }
          ]
        },
        batchNumber: {
          type: 'input',
          label: 'Số lô sản xuất',
          inputType: 'text'
        },
        ingredients: {
          type: 'input',
          label: 'Thành phần',
          inputType: 'text'
        },
        productType: {
          type: 'singleChoice',
          label: 'Loại bộ mỹ phẩm',
          options: [
            {
              label: 'Chăm sóc da mặt',
              value: 'face'
            },
            {
              label: 'Chăm sóc môi',
              value: 'lip'
            },
            {
              label: 'Chăm sóc mắt',
              value: 'eye'
            },
            {
              label: 'Đa năng',
              value: 'multi-function'
            }
          ]
        },
        versionType: {
          type: 'singleChoice',
          label: 'Loại phiên bản',
          options: [
            {
              label: 'Thông thường',
              value: 'normal'
            },
            {
              label: 'Limited Edition',
              value: 'limited'
            }
          ]
        },
        packagingType: {
          type: 'singleChoice',
          label: 'Kiểu đóng gói',
          options: [
            {
              label: 'Bộ đơn',
              value: 'single'
            },
            {
              label: 'Bộ đôi',
              value: 'double'
            }
          ]
        },
        quantityPerPack: {
          type: 'singleChoice',
          label: 'Quantity per pack',
          options: [
            {
              label: '1',
              value: '1'
            },
            {
              label: '2',
              value: '2'
            },
            {
              label: '5',
              value: '5'
            },
            {
              label: '8',
              value: '8'
            },
            {
              label: '10',
              value: '10'
            },
            {
              label: '15',
              value: '15'
            },
            {
              label: '20',
              value: '20'
            }
          ]
        },
        specialFeatures: {
          type: 'multipleChoice',
          label: 'Loại đặc biệt',
          options: [
            {
              label: 'Chống vi khuẩn',
              value: 'antibacterial'
            },
            {
              label: 'Khử trùng',
              value: 'disinfectant'
            },
            {
              label: 'Không chất tạo mùi',
              value: 'fragrance-free'
            },
            {
              label: 'Không cay mắt',
              value: 'tear-free'
            },
            {
              label: 'Không rửa',
              value: 'no-rinse'
            },
            {
              label: 'Không hóa chất',
              value: 'chemical-free'
            },
            {
              label: 'Không chứa paraben',
              value: 'paraben-free'
            },
            {
              label: 'An toàn cho bé',
              value: 'baby-safe'
            },
            {
              label: 'Không xà phòng',
              value: 'soap-free'
            },
            {
              label: 'Không gây dị ứng',
              value: 'hypoallergenic'
            },
            {
              label: 'Không chứa cồn',
              value: 'alcohol-free'
            },
            {
              label: 'Hữu cơ',
              value: 'organic'
            }
          ]
        },
        organizationName: {
          type: 'multipleChoice',
          label: 'Tên tổ chức chịu trách nhiệm sản xuất',
          options: [
            {
              label: 'Organization 1',
              value: 'org1'
            },
            {
              label: 'Organization 2',
              value: 'org2'
            }
          ],
          required: true
        },
        organizationAddress: {
          type: 'multipleChoice',
          label: 'Địa chỉ tổ chức chịu trách nhiệm sản xuất',
          options: [
            {
              label: 'Address 1',
              value: 'address1'
            },
            {
              label: 'Address 2',
              value: 'address2'
            }
          ],
          required: true
        }
      }
    },
    brand: {
      id: 'b6ced512-ddec-4820-b930-86583d0779c0',
      createdAt: '2024-12-20T15:22:53.722Z',
      updatedAt: '2024-12-20T15:23:20.012Z',
      name: 'Kim Thai',
      logo: 'https://storage.googleapis.com/test-firebase-storage-d1b61.appspot.com/1734708172349.jpg',
      document: 'https://storage.googleapis.com/test-firebase-storage-d1b61.appspot.com/1734708172389.jpg',
      description: '4',
      email: 'ngockim9047@gmail.com',
      phone: '0911390427',
      address: 'No',
      businessTaxCode: 'aaa',
      businessRegistrationCode: 'default_code',
      establishmentDate: '2000-01-01',
      province: 'Unknown',
      district: 'Unknown',
      ward: 'Unknown',
      businessRegistrationAddress: 'Unknown',
      star: 0,
      status: 'ACTIVE'
    },
    productClassifications: [
      {
        id: '5ced5213-d78a-4e5e-929f-bfc58c0ece63',
        createdAt: '2025-02-16T13:30:09.861Z',
        updatedAt: '2025-02-16T13:58:56.349Z',
        title: 'Default',
        price: 1234,
        quantity: 12,
        color: null,
        size: null,
        other: null,
        sku: 'sku-1234',
        type: 'DEFAULT',
        status: 'ACTIVE',
        images: []
      }
    ],
    images: [
      {
        id: '0e299e13-c340-4f7c-afcc-463fb967c002',
        createdAt: '2025-02-16T13:30:09.861Z',
        updatedAt: '2025-02-16T13:30:09.861Z',
        name: null,
        fileUrl: 'https://storage.googleapis.com/test-firebase-storage-d1b61.appspot.com/1739712607429.jpg',
        status: 'ACTIVE'
      },
      {
        id: 'aa2b04a9-7698-49a7-8d9e-6d2062504892',
        createdAt: '2025-02-16T13:30:09.861Z',
        updatedAt: '2025-02-16T13:30:09.861Z',
        name: null,
        fileUrl: 'https://storage.googleapis.com/test-firebase-storage-d1b61.appspot.com/1739712607514.jpg',
        status: 'ACTIVE'
      },
      {
        id: '0a878605-6659-45fe-be42-26859ee154c3',
        createdAt: '2025-02-16T13:30:09.861Z',
        updatedAt: '2025-02-16T13:30:09.861Z',
        name: null,
        fileUrl: 'https://storage.googleapis.com/test-firebase-storage-d1b61.appspot.com/1739712607517.jpg',
        status: 'ACTIVE'
      }
    ],
    productDiscounts: [],
    preOrderProducts: []
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>{product.name}</h1>
        <Badge variant={product.status === 'OFFICIAL' ? 'default' : 'secondary'} className='text-sm'>
          {product.status}
        </Badge>
      </div>

      {/* Basic Information Section */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='w-5 h-5' />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>ID Sản phẩm</p>
              <p className='font-medium'>{product.id}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>SKU</p>
              <p className='font-medium'>{product.sku}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Danh mục</p>
              <p className='font-medium'>
                {product.category.name} (Cấp {product.category.level})
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Ngày tạo</p>
              <p className='font-medium'>{new Date(product.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Product Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <ImageIcon className='w-5 h-5' />
            Hình ảnh sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {product.images?.map((image, index) => (
              <div key={index} className='relative aspect-square rounded-lg overflow-hidden'>
                <img
                  src={image.fileUrl || '/api/placeholder/200/200'}
                  alt={`Hình ảnh sản phẩm ${index + 1}`}
                  className='object-cover w-full h-full'
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Information Section */}
      <BrandSection brand={product.brand || null} />

      {/* Product Variants Section */}
      <ClassificationDetails classifications={product.productClassifications ?? []} />
    </div>
  )
}

export default ProductDetails
