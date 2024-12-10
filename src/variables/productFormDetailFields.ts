import { z } from 'zod'

import { productFormMessage } from '@/constants/message'
import { IOption } from '@/types/option'

export type IFormProductFieldId = keyof z.infer<typeof FormProductSchema>['detail']

export type IProductFormFields = {
  id: IFormProductFieldId
  label: string
  type: 'multipleChoice' | 'singleChoice' | 'input' | 'date'
  options?: IOption[]
  required?: boolean
  onlyFutureDates?: boolean
  onlyPastDates?: boolean
  showTime?: boolean
  inputType?: string
}

export const productFormDetailFields: IProductFormFields[] = [
  {
    id: 'organizationName' as IFormProductFieldId,
    label: 'Tên tổ chức chịu trách nhiệm sản xuất',
    type: 'multipleChoice',
    options: [
      { value: 'org1', label: 'Organization 1' },
      { value: 'org2', label: 'Organization 2' }
    ],
    required: true
  },
  {
    id: 'organizationAddress' as IFormProductFieldId,
    label: 'Địa chỉ tổ chức chịu trách nhiệm sản xuất',
    type: 'multipleChoice',
    options: [
      { value: 'address1', label: 'Address 1' },
      { value: 'address2', label: 'Address 2' }
    ],
    required: true
  },
  {
    id: 'origin' as IFormProductFieldId,
    label: 'Xuất xứ',
    type: 'singleChoice',
    options: [
      { value: 'vn', label: 'Việt Nam' },
      { value: 'other', label: 'Khác' }
    ]
  },
  {
    id: 'batchNumber' as IFormProductFieldId,
    label: 'Số lô sản xuất',
    type: 'input',
    inputType: 'text'
  },
  {
    id: 'ingredients' as IFormProductFieldId,
    label: 'Thành phần',
    type: 'input',
    inputType: 'text'
  },
  {
    id: 'activeIngredients' as IFormProductFieldId,
    label: 'Thành phần hoạt tính',
    type: 'multipleChoice',
    options: [
      { value: 'anti_oxidants', label: 'Anti-oxidants' },
      { value: 'bha', label: 'BHA' },
      { value: 'ceramides', label: 'Ceramides' },
      { value: 'fragrance_free', label: 'Không hương liệu' },
      { value: 'hyaluronic_acid', label: 'Hyaluronic Acid' },
      { value: 'mineral_oil', label: 'Dầu khoáng' },
      { value: 'natural_origin', label: 'Nguồn gốc thiên nhiên' },
      { value: 'natural', label: 'Tự nhiên' },
      { value: 'paraben_free', label: 'Không chứa paraben' },
      { value: 'silicone_free', label: 'Không chứa silicone' },
      { value: 'vitamin_c', label: 'Vitamin C' },
      { value: 'vitamin_e', label: 'Vitamin E' },
      { value: 'alcohol_free', label: 'Alcohol Free' },
      { value: 'amino_acid', label: 'Amino Acid' }
    ]
  },

  {
    id: 'volume' as IFormProductFieldId,
    label: 'Thể tích',
    type: 'singleChoice',
    options: [
      { value: '10ml', label: '10ml' },
      { value: '20ml', label: '20ml' },
      { value: '30ml', label: '30ml' },
      { value: '50ml', label: '50ml' },
      { value: '100ml', label: '100ml' },
      { value: '150ml', label: '150ml' },
      { value: '200ml', label: '200ml' },
      { value: '250ml', label: '250ml' },
      { value: '300ml', label: '300ml' },
      { value: '400ml', label: '400ml' },
      { value: '500ml', label: '500ml' },
      { value: '750ml', label: '750ml' },
      { value: '1L', label: '1L' }
    ]
  },
  {
    id: 'weight' as IFormProductFieldId,
    label: 'Trọng lượng',
    type: 'singleChoice',
    options: [
      { value: '10g', label: '10g' },
      { value: '20g', label: '20g' },
      { value: '30g', label: '30g' },
      { value: '50g', label: '50g' },
      { value: '100g', label: '100g' },
      { value: '150g', label: '150g' },
      { value: '200g', label: '200g' },
      { value: '250g', label: '250g' },
      { value: '300g', label: '300g' },
      { value: '400g', label: '400g' },
      { value: '500g', label: '500g' },
      { value: '750g', label: '750g' },
      { value: '1kg', label: '1kg' },
      { value: '1.5kg', label: '1.5kg' },
      { value: '2kg', label: '2kg' },
      { value: '3kg', label: '3kg' },
      { value: '5kg', label: '5kg' }
    ]
  },
  {
    id: 'expiryDate' as IFormProductFieldId,
    label: 'Ngày hết hạn',
    type: 'date',
    onlyFutureDates: true
  },
  {
    id: 'expiryPeriod' as IFormProductFieldId,
    label: 'Hạn sử dụng',
    type: 'singleChoice',
    options: [
      { value: '1', label: '1 tháng' },
      { value: '2', label: '2 tháng' },
      { value: '3', label: '3 tháng' },
      { value: '6', label: '6 tháng' },
      { value: '12', label: '12 tháng' },
      { value: '24', label: '24 tháng' },
      { value: '36', label: '36 tháng' }
    ]
  },
  {
    id: 'storageCondition' as IFormProductFieldId,
    label: 'Điều kiện bảo quản',
    type: 'singleChoice',
    options: [
      { value: 'normal', label: 'Điều kiện thường' },
      { value: 'cool_storage_23_26', label: 'Bảo quản mát (23°C - 26°C)' },
      { value: 'cold_storage_5_10', label: 'Bảo quản lạnh (5°C - 10°C)' },
      { value: 'freezer_storage_neg15_0', label: 'Bảo quản ngăn đá (-15°C - 0°C)' },
      { value: 'deep_freeze_storage_below_neg15', label: 'Bảo quản đông lạnh (< -15°C)' }
    ]
  },
  {
    id: 'formula' as IFormProductFieldId,
    label: 'Công thức',
    type: 'singleChoice',
    options: [
      { value: 'sponge', label: 'Dạng mút' },
      { value: 'towel', label: 'Khăn' },
      { value: 'cream', label: 'Dạng kem' },
      { value: 'gelatinous', label: 'Dạng sánh' },
      { value: 'liquid', label: 'Dạng lỏng' },
      { value: 'powder', label: 'Bột' },
      { value: 'solid', label: 'Rắn' },
      { value: 'glue-like', label: 'Dạng keo' }
    ]
  },
  {
    id: 'skinType' as IFormProductFieldId,
    label: 'Loại da',
    type: 'multipleChoice',
    options: [
      { value: 'all', label: 'Mọi loại da' },
      { value: 'combination', label: 'Da hỗn hợp' },
      { value: 'normal', label: 'Da thường' },
      { value: 'dry', label: 'Da khô' },
      { value: 'oily', label: 'Da dầu' },
      { value: 'acne', label: 'Da mụn trứng cá' },
      { value: 'sensitive', label: 'Da nhạy cảm' },
      { value: 'rough', label: 'Da sần' }
    ]
  },
  {
    id: 'productType' as IFormProductFieldId,
    label: 'Loại bộ mỹ phẩm',
    type: 'singleChoice',
    options: [
      { value: 'face', label: 'Chăm sóc da mặt' },
      { value: 'lip', label: 'Chăm sóc môi' },
      { value: 'eye', label: 'Chăm sóc mắt' },
      { value: 'multi-function', label: 'Đa năng' }
    ]
  },
  {
    id: 'skinCare' as IFormProductFieldId,
    label: 'Chăm sóc da',
    type: 'singleChoice',
    options: [
      { value: 'large-pores', label: 'Lỗ chân lông to' },
      { value: 'oily-skin', label: 'Da dầu' },
      { value: 'hydrating', label: 'Dưỡng ẩm' },
      { value: 'spf-coverage', label: 'Bảo vệ SPF' },
      { value: 'long-lasting', label: 'Lâu trôi' },
      { value: 'acne_and_scars', label: 'Mụn Trứng Cá/ Thâm' },
      { value: 'melasma_and_freckles', label: 'Nám/ tàn nhang' },
      { value: 'oily_skin', label: 'Da dầu' },
      { value: 'red_spots', label: 'Đóm đỏ' },
      { value: 'uneven_skin_tone', label: 'Da không đều màu' },
      { value: 'moisturizing', label: 'Moisturizing' },
      { value: 'whitening', label: 'Whitening' },
      { value: 'anti_aging', label: 'Anti-Aging' },
      { value: 'pore_control', label: 'Pore Control' },
      { value: 'acne_care', label: 'Acne Care' },
      { value: 'revitalizing', label: 'Revitalizing' },
      { value: 'oil_control', label: 'Oil Control' },
      { value: 'fine_lines_and_wrinkles', label: 'Fine Lines & Wrinkles Treatment' },
      { value: 'glowing', label: 'Glowing' },
      { value: 'repair_barrier', label: 'Repair Barrier' },
      { value: 'anti_dark_spots', label: 'Anti-dark spot' },
      { value: 'exfoliating', label: 'Exfoliating' },
      { value: 'cleansing', label: 'Cleansing' }
    ]
  },
  {
    id: 'specialFeatures' as IFormProductFieldId,
    label: 'Loại đặc biệt',
    type: 'multipleChoice',
    options: [
      { value: 'antibacterial', label: 'Chống vi khuẩn' },
      { value: 'disinfectant', label: 'Khử trùng' },
      { value: 'fragrance-free', label: 'Không chất tạo mùi' },
      { value: 'tear-free', label: 'Không cay mắt' },
      { value: 'no-rinse', label: 'Không rửa' },
      { value: 'chemical-free', label: 'Không hóa chất' },
      { value: 'paraben-free', label: 'Không chứa paraben' },
      { value: 'baby-safe', label: 'An toàn cho bé' },
      { value: 'soap-free', label: 'Không xà phòng' },
      { value: 'hypoallergenic', label: 'Không gây dị ứng' },
      { value: 'alcohol-free', label: 'Không chứa cồn' },
      { value: 'organic', label: 'Hữu cơ' }
    ]
  },
  {
    id: 'packagingType' as IFormProductFieldId,
    label: 'Kiểu đóng gói',
    type: 'singleChoice',
    options: [
      { value: 'single', label: 'Bộ đơn' },
      { value: 'double', label: 'Bộ đôi' }
    ]
  },
  {
    id: 'quantityPerPack' as IFormProductFieldId,
    label: 'Quantity per pack',
    type: 'singleChoice',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '5', label: '5' },
      { value: '8', label: '8' },
      { value: '10', label: '10' },
      { value: '15', label: '15' },
      { value: '20', label: '20' }
    ]
  },
  {
    id: 'versionType' as IFormProductFieldId,
    label: 'Loại phiên bản',
    type: 'singleChoice',
    options: [
      { value: 'normal', label: 'Thông thường' },
      { value: 'limited', label: 'Limited Edition' }
    ]
  }
]

export const FormProductSchema = z
  .object({
    // basic information
    name: z
      .string()
      .min(1, { message: productFormMessage.productNameRequired })
      .max(120, { message: productFormMessage.productNameLengthRequired }),
    brand: z.string().min(1, { message: productFormMessage.brandRequired }),
    category: z.string().min(1, { message: productFormMessage.categoryRequired }),
    images: z.array(z.string()).min(1, { message: productFormMessage.imagesRequired }),
    description: z
      .string()
      .transform((val) => val.replace(/<[^>]*>/g, '').trim())
      .refine((val) => val.length > 0, { message: productFormMessage.descriptionRequired })
      .refine((val) => val.length <= 5000, { message: productFormMessage.descriptionTooLong })
      // Convert back to original format for form submission
      .transform((val) => `<p>${val}</p>`),
    status: z.string().min(1, { message: productFormMessage.statusRequired }),
    // detail information
    detail: z.record(
      z
        .union([
          z.string(), // for type 'date'
          z.array(z.string()), // for type 'singleChoice' or 'multipleChoice'
          z.number(), // for type 'input' with number
          z.string() // for type 'input' with string
        ])
        .optional()
    ),
    //  sale information
    productClassifications: z
      .array(
        z.object({
          id: z.string().min(0).optional(),
          title: z.string().min(1, { message: productFormMessage.classificationTitleRequired }).optional(),
          sku: z.string().optional(),
          type: z.string().min(0).optional(),
          price: z.number().min(1000, { message: productFormMessage.priceValidate }).optional(),
          quantity: z.number().min(1, { message: productFormMessage.quantityValidate }).optional(),
          images: z.array(z.string()).min(1, { message: productFormMessage.imagesRequired }).optional()
        })
      )
      .optional(),
    price: z.number().min(1000, { message: productFormMessage.priceValidate }).optional(),
    quantity: z.number().min(1, { message: productFormMessage.quantityValidate }).optional(),
    sku: z.string().optional()
  })
  .refine(
    (data) => {
      if (!data.productClassifications || data.productClassifications.length === 0) {
        // If no productClassifications, require product price
        return data.price !== undefined || data.price !== ''
      }
      return true
    },
    {
      message: productFormMessage.priceRequired,
      path: ['price']
    }
  )
  .refine(
    (data) => {
      if (!data.productClassifications || data.productClassifications.length === 0) {
        // If no productClassifications, require product quantity
        return data.quantity !== undefined || data.quantity !== ''
      }
      return true
    },
    {
      message: productFormMessage.quantityRequired,
      path: ['quantity']
    }
  )
  .refine(
    (data) => {
      if (data.productClassifications && data.productClassifications.length > 0) {
        // If productClassifications exist, ensure price must be at least 1000đ
        return data.productClassifications.every((item) => item.price !== undefined && item.price >= 1000)
      }
      return true
    },
    {
      message: productFormMessage.priceValidate,
      path: ['productClassifications']
    }
  )
  .refine(
    (data) => {
      if (data.productClassifications && data.productClassifications.length > 0) {
        // If productClassifications exist, ensure quantity  must be at least 1
        return data.productClassifications.every((item) => item.quantity !== undefined && item.quantity >= 1)
      }
      return true
    },
    {
      message: productFormMessage.quantityValidate,
      path: ['productClassifications']
    }
  )
