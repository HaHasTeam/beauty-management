import { IClassificationOption, ICombination } from '@/types/productForm'

export const regenerateUpdatedOptions = (newCombinations: ICombination[]): IClassificationOption[] => {
  const updatedOptions: IClassificationOption[] = []

  // Extract unique values for each type
  const uniqueValues = {
    color: new Set<string>(),
    size: new Set<string>(),
    other: new Set<string>()
  }

  // Determine which fields are actually being used
  const usedFields: { field: keyof typeof uniqueValues; hasValue: boolean }[] = []

  // First pass: gather all unique values and determine used fields
  newCombinations.forEach((combo) => {
    if (combo.color) uniqueValues.color.add(combo.color)
    if (combo.size) uniqueValues.size.add(combo.size)
    if (combo.other) uniqueValues.other.add(combo.other)
  })

  // Determine which fields are being used (have values)
  if (uniqueValues.color.size > 0) {
    usedFields.push({ field: 'color', hasValue: true })
  }
  if (uniqueValues.size.size > 0) {
    usedFields.push({ field: 'size', hasValue: true })
  }
  if (uniqueValues.other.size > 0) {
    usedFields.push({ field: 'other', hasValue: true })
  }

  // Create classification options based on used fields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  usedFields.forEach((fieldInfo, _index) => {
    const values = Array.from(uniqueValues[fieldInfo.field])
    if (values.length > 0) {
      updatedOptions.push({
        title: fieldInfo.field,
        options: values
      })
    }
  })

  return updatedOptions
}
