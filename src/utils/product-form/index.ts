import { IClassification } from '@/types/classification'

/**
 * Finds the product classification with the minimum price.
 * @param {Array} classifications - List of product classifications.
 * @returns {Object|null|IClassification} The classification with the minimum price, or null if the list is empty.
 */
export const getCheapestClassification = (classifications: IClassification[]) => {
  if (!classifications || classifications.length === 0) return null

  return classifications.reduce(
    (cheapest, current) => {
      // Ensure both current and cheapest have a defined price before comparison
      if (current?.price !== undefined && (cheapest?.price === undefined || current.price < cheapest.price)) {
        return current
      }
      return cheapest
    },
    null as IClassification | null
  )
}
