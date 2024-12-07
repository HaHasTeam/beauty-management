import { IClassificationOption } from '@/types/productForm'

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
