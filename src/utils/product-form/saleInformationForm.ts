import { IClassificationOption, ICombination } from '@/types/productForm'

export const regenerateUpdatedOptions = (newCombinations: ICombination[]): IClassificationOption[] => {
  const updatedOptions: IClassificationOption[] = []

  // Extract unique options from combinations
  const optionsSet1 = new Set<string>()
  const optionsSet2 = new Set<string>()

  newCombinations.forEach((combo) => {
    const parts = combo?.title?.split('-') ?? ''
    optionsSet1.add(parts[0])
    if (parts[1]) {
      optionsSet2.add(parts[1])
    }
  })

  // Construct updatedOptions from sets
  const options1 = Array.from(optionsSet1)
  const options2 = Array.from(optionsSet2)

  if (options1.length) {
    updatedOptions.push({ title: `Phân loại 1`, options: options1 })
  }

  if (options2.length) {
    updatedOptions.push({ title: `Phân loại 2`, options: options2 })
  }

  return updatedOptions
}
