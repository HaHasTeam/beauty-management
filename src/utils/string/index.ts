export const getKeyFromString = (str: string): string => {
  return str.replace(/ /g, '_').toLowerCase()
}
