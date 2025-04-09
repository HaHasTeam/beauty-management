export const formatCurrency = (amount: number, locale: string = 'vi-VN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatNumber = (amount: number | string, symbol?: string, locale: string = 'en-US') => {
  return (
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2
    }).format(typeof amount === 'string' ? Number(amount) : amount) + (symbol ? symbol : '')
  )
}
