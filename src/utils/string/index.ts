export const getKeyFromString = (str: string): string => {
  return str.replace(/ /g, '_').toLowerCase()
}

export const getDisplayString = (str: string): string => {
  return str.replace(/_/g, ' ').toLowerCase()
}
