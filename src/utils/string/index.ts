export const getKeyFromString = (str: string): string => {
  return str.replace(/ /g, '_').toLowerCase()
}

export const getDisplayString = (str: string): string => {
  return str.replace(/_/g, ' ').toLowerCase()
}

export const minifyString = (str?: string): string => {
  if (!str) return ''
  return str.replace(/-/g, '').toUpperCase().slice(0, 10)
}
