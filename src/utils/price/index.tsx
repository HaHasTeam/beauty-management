import { DiscountTypeEnum } from '@/types/enum'
import { DiscountType } from '@/types/product-discount'

/**
 * Calculates the price after applying a discount.
 * Handles cases where discount or discountType are optional, null, or zero.
 *
 * @param price - The original price of the product.
 * @param discount - The discount value (optional).
 * @param discountType - The type of discount (optional, 'percentage' or 'amount').
 * @returns The discounted price.
 */
export const calculateDiscountPrice = (
  price: number,
  discount?: number | null,
  discountType?: DiscountType | null
): number => {
  if (!discount || !discountType || discount === 0) {
    return price
  }

  let discountedPrice = price

  if (discountType === DiscountTypeEnum.PERCENTAGE) {
    discountedPrice -= price * discount
  } else if (discountType === DiscountTypeEnum.AMOUNT) {
    discountedPrice -= discount
  }

  // Ensure the price is not negative
  return Math.max(discountedPrice, 0)
}
/**
 * Calculates the discount amount based on the given price and discount percentage.
 *
 * @param price - The original price of the product.
 * @param discount - The discount value (optional).
 * @param discountType - The type of discount ('percentage' or 'amount', optional).
 * @returns The final discounted price.
 */
export const calculateDiscountAmount = (
  price: number,
  discount?: number | null,
  discountType?: DiscountType | null
): number => {
  if (!discount || !discountType) {
    return price
  }

  let discountedPrice = 0

  if (discountType === DiscountTypeEnum.PERCENTAGE) {
    discountedPrice = price * discount
  } else if (discountType === DiscountTypeEnum.AMOUNT) {
    discountedPrice = discount
  }

  // Ensure the price is not negative
  return Math.max(discountedPrice, 0)
}

/**
 * Calculates the total price of a product based on discount type and quantity.
 * @param discount - The discount value.
 * @param discountType - The type of discount (percentage or amount).
 * @param price - The original price of the product.
 * @param quantity - The quantity of the product.
 * @returns The total price after applying the discount.
 */
export const calculateTotalPrice = (
  price: number,
  quantity: number,
  discount?: number | null,
  discountType?: DiscountType | null
): number => {
  const discountedPrice = calculateDiscountPrice(price, discount, discountType)
  return discountedPrice * quantity
}

/**
 * Calculate the discounted price based on the current price and discount percentage.
 *
 * @param currentPrice - The original price of the product.
 * @param discountPercent - The discount percentage to apply (0-100).
 * @returns The discounted price, rounded to two decimal places.
 */
export function calculateDiscountedPrice(currentPrice: number, discountPercent: number): number {
  if (currentPrice < 0) {
    throw new Error('Current price must be a non-negative number.')
  }

  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100.')
  }

  const discountAmount = (currentPrice * discountPercent) / 100
  const discountedPrice = currentPrice - discountAmount

  return parseFloat(discountedPrice.toFixed(2))
}
