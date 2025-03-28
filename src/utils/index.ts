import { IProductTable, IResponseProduct } from '@/types/product'

export function generateCouponCode(): string {
  const length = Math.floor(Math.random() * (10 - 5 + 1)) + 5 // Random length between 5 and 10
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let couponCode = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    couponCode += characters[randomIndex]
  }

  return couponCode
}

export function formatPriceVND(amount: number): string {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  return formatter.format(amount)
}

/**
 * Utility function to convert an enum to an array of objects
 * @param enumObj - The enum to convert
 * @returns An array of objects with id, value, and label
 */
export const enumToArray = (enumObj: object): Array<{ id: number; value: string; label: string }> => {
  return Object.keys(enumObj).map((key, index) => ({
    id: index + 1,
    value: enumObj[key as keyof typeof enumObj],
    label: key
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()) // Format key for label
  }))
}

/**
 * Converts the raw input data into an array of IProductTable objects.
 * Each classification in a product is treated as a separate row in the output.
 *
 * @param data - Array of raw product data.
 * @returns Array of IProductTable objects.
 */
export function convertToProductTable(data: IResponseProduct[]): IProductTable[] {
  const products: IProductTable[] = []

  // Iterate through each product in the input data
  data.forEach((product) => {
    const {
      id: productId,
      name: productName,
      description,
      detail,
      sku: productSku,
      createdAt,
      updatedAt,
      brand,
      category,
      productClassifications,
      images: productImages
    } = product

    // Iterate through each classification of the product
    productClassifications.forEach((classification) => {
      const { title, price, quantity, sku, type, status, images } = classification

      // Push a new product table row for each classification
      products.push({
        id: productId, // Classification ID
        name: productName, // Name of the product
        description, // Description of the product
        detail, // Serialized detail information of the product
        sku: sku == productSku ? productSku : sku, // SKU of the classification
        price, // Price of the classification
        quantity: quantity ? quantity : 0, // Quantity available for the classification
        status, // Status of the classification
        updatedAt, // Last updated timestamp
        createdAt, // Creation timestamp
        title, // Title of the classification
        type, // Type of classification
        brand, // Associated brand
        category, // Associated category
        images: images?.length ? images : productImages, // Use classification images or fallback to product images
        productClassifications: [],
        certificates: []
      })
    })
  })

  return products // Return the transformed array
}

export function convertToProductTable2(data: IResponseProduct[]): IProductTable[] {
  if (!data || !Array.isArray(data)) return []

  const products: IProductTable[] = []

  // Iterate through each product in the input data
  data.forEach((product) => {
    const {
      id: productId,
      name: productName,
      description,
      detail,
      sku: productSku,
      createdAt,
      updatedAt,
      brand,
      category,
      status,
      productClassifications,
      images: productImages
    } = product

    // Calculate the total quantity for this product from its classifications
    const productQuantity =
      productClassifications?.reduce((sum, classification) => sum + (classification.quantity ?? 0), 0) || 0

    // Add the product information to the list
    products.push({
      id: productId || '',
      name: productName || '',
      description: description || '',
      detail: detail,
      sku: productSku,
      price: 0, // Price is not applicable here since we are listing only products
      quantity: productQuantity, // Total quantity from classifications
      status: status, // Status is not applicable here
      updatedAt,
      createdAt: createdAt || '',
      brand,
      category,
      images: productImages || [],
      productClassifications: productClassifications || [],
      certificates: []
    })
  })

  return products
}

export function convertToSlug(text: string): string {
  return text
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize Unicode characters (decompose accents)
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim() // Trim leading and trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Remove duplicate dashes
}
