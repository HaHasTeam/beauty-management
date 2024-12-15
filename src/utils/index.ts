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
