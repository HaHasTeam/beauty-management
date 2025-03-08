import { IConsultationCriteriaSectionFormData } from '@/schemas/consultation-criteria.schema'
import { IImportConsultationCriteriaSection } from '@/types/consultation-criteria'

export function generateOrderIndices(
  importedSections: IImportConsultationCriteriaSection[]
): IConsultationCriteriaSectionFormData[] {
  const sectionsWithOrder = [...importedSections]

  // Sort the sections first by mandatory status (mandatory sections first),
  // then alphabetically by section name
  sectionsWithOrder.sort((a, b) => {
    // First, prioritize mandatory sections
    if (a.mandatory && !b.mandatory) return -1
    if (!a.mandatory && b.mandatory) return 1

    return a.section.localeCompare(b.section)
  })

  return sectionsWithOrder.map((section, index) => ({
    ...section,
    orderIndex: index + 1
  }))
}

export function generateSequentialOrderIndices(
  importedSections: IImportConsultationCriteriaSection[]
): IConsultationCriteriaSectionFormData[] {
  return importedSections.map((section, index) => ({
    ...section,
    orderIndex: index + 1
  }))
}
