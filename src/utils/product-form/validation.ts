import i18next from 'i18next'

import { IClassificationOption, ICombination } from '@/types/productForm'

export const validateOptionTitles = (
  classificationOptions: IClassificationOption[],
  classificationIndex: number
): number | null => {
  const options = classificationOptions[classificationIndex].options
  const optionSet = new Set()
  for (let i = 0; i < options.length; i++) {
    if (optionSet.has(options[i])) {
      return i
    }
    optionSet.add(options[i])
  }
  return null
}

export const validateSKUs = (combinations: ICombination[]) => {
  // Create a Map to track SKUs and their indices
  const skuMap = new Map<string, number[]>()
  let duplicatedIndices: number[] = []

  combinations.forEach((combo, index) => {
    // Only check for duplicates if SKU is not an empty string
    if (combo.sku !== '') {
      if (!skuMap.has(combo.sku ?? '')) {
        // First occurrence of this SKU
        skuMap.set(combo.sku ?? '', [index])
      } else {
        // SKU already exists, add this index to its list
        const existingIndices = skuMap.get(combo.sku ?? '')!
        existingIndices.push(index)

        // Update the duplicated indices
        duplicatedIndices = [...existingIndices]
      }
    }
  })

  return {
    isUnique: duplicatedIndices.length === 0,
    duplicatedIndices,
    errorMessage: duplicatedIndices.length > 0 ? i18next.t('productFormMessage.SKURequired') : ''
  }
}
