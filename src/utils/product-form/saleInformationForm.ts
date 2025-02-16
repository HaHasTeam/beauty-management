// import { IClassificationOption, ICombination } from '@/types/productForm'

import { IClassificationOption, ICombination } from '@/types/productForm'

// export const regenerateUpdatedOptions = (newCombinations: ICombination[]): IClassificationOption[] => {
//   const updatedOptions: IClassificationOption[] = []

//   // Extract unique options from combinations
//   const optionsSet1 = new Set<string>()
//   const optionsSet2 = new Set<string>()

//   newCombinations.forEach((combo) => {
//     const parts = combo?.title?.split('-') ?? ''
//     optionsSet1.add(parts[0])
//     if (parts[1]) {
//       optionsSet2.add(parts[1])
//     }
//   })

//   // Construct updatedOptions from sets
//   const options1 = Array.from(optionsSet1)
//   const options2 = Array.from(optionsSet2)

//   if (options1.length) {
//     updatedOptions.push({ title: `Phân loại 1`, options: options1 })
//   }

//   if (options2.length) {
//     updatedOptions.push({ title: `Phân loại 2`, options: options2 })
//   }

//   return updatedOptions
// }

// export const regenerateUpdatedOptions = (newCombinations: ICombination[]): IClassificationOption[] => {
//   console.log(newCombinations)
//   const updatedOptions: IClassificationOption[] = []

//   // Extract unique options and their types from combinations
//   const optionsSet1 = new Set<string>()
//   const optionsSet2 = new Set<string>()
//   const optionsSet3 = new Set<string>()

//   // Track classification types
//   let type1: string | undefined
//   let type2: string | undefined
//   let type3: string | undefined

//   newCombinations.forEach((combo) => {
//     // Extract classification types from the combination
//     if (combo.color && !type1 && !type2 && !type3) {
//       if (combo.size) {
//         type1 = 'color'
//         type2 = 'size'
//       } else if (combo.other) {
//         type1 = 'color'
//         type3 = 'other'
//       } else {
//         type1 = 'color'
//       }
//     } else if (combo.size && !type1 && !type2 && !type3) {
//       if (combo.color) {
//         type1 = 'color'
//         type2 = 'size'
//       } else if (combo.other) {
//         type1 = 'size'
//         type3 = 'other'
//       } else {
//         type1 = 'size'
//       }
//     } else if (combo.other && !type1 && !type2 && !type3) {
//       if (combo.color) {
//         type1 = 'color'
//         type2 = 'other'
//       } else if (combo.size) {
//         type1 = 'size'
//         type2 = 'other'
//       } else {
//         type1 = 'other'
//       }
//     }

//     // Extract values based on title parts
//     const parts = combo?.title?.split('-') ?? []
//     if (parts[0]) optionsSet1.add(parts[0])
//     if (parts[1]) optionsSet2.add(parts[1])
//     if (parts[2]) optionsSet3.add(parts[2])
//   })

//   // Construct updatedOptions from sets
//   const options1 = Array.from(optionsSet1)
//   const options2 = Array.from(optionsSet2)
//   const options3 = Array.from(optionsSet3)

//   if (options1.length) {
//     updatedOptions.push({
//       title: type1 || 'Phân loại 1',
//       options: options1
//     })
//   }

//   if (options2.length) {
//     updatedOptions.push({
//       title: type2 || 'Phân loại 2',
//       options: options2
//     })
//   }

//   if (options3.length) {
//     updatedOptions.push({
//       title: type3 || 'Phân loại 3',
//       options: options3
//     })
//   }

//   return updatedOptions
// }

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
