export const getKeyFromString = (str: string): string => {
  return str.replace(/ /g, '_').toLowerCase()
}

export const getDisplayString = (str: string): string => {
  return str.replace(/_/g, ' ').toLowerCase()
}

export const minifyString = (str?: string): string => {
  if (!str) return ''
  return '#' + str.replace(/-/g, '').toUpperCase().slice(0, 10)
}
export const minifyStringId = (str?: string): string => {
  if (!str) return ''
  return '#' + str.replace(/-/g, '').toUpperCase().slice(0, 10)
}

type Address = {
  detailAddress: string
  ward: string
  district: string
  province: string
  fullAddress: string
}

/**
 * Parses an address string into an Address object.
 * @param address - The input address string (e.g., "fdsafsa, hcm, hcm, hcm").
 * @returns An Address object with detailAddress, ward, district, province, and fullAddress.
 */
export function parseAddress(address: string): Address {
  // Split the address string by commas and trim whitespace
  const parts = address.split(',').map((part) => part.trim())

  // Ensure there are at least four parts (fill with empty strings if necessary)
  while (parts.length < 4) {
    parts.unshift('')
  }

  return {
    detailAddress: parts[0],
    ward: parts[1],
    district: parts[2],
    province: parts[3],
    fullAddress: address
  }
}
