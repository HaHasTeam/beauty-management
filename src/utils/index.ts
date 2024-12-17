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
