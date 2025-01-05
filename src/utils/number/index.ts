export const formatCurrency = (amount: number, locale: string = 'vi-VN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

export const formatNumber = (amount: number | string, symbol?: string, locale: string = 'vi-VN') => {
  return (
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2
    }).format(typeof amount === 'string' ? Number(amount) : amount) + (symbol ? symbol : '')
  )
}
