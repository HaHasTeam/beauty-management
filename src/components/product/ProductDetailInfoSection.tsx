import { useTranslation } from 'react-i18next'

import { CategoryTypeEnum, ICategoryDetail } from '@/types/category'

import { Table, TableBody, TableCell, TableRow } from '../ui/table'

interface ProductDetailInfoSectionProps {
  detail: string
  detailCategoryObject?: ICategoryDetail
}
export default function ProductDetailInfoSection({ detail, detailCategoryObject }: ProductDetailInfoSectionProps) {
  const { t } = useTranslation()
  const detailObject = JSON.parse(detail)
  const isValidDate = (value: unknown): boolean => {
    return typeof value === 'string' && !isNaN(new Date(value).getTime())
  }
  const getLabel = (key: string, value: string) => {
    const category = detailCategoryObject?.[key]

    if (
      !category ||
      (category.type !== CategoryTypeEnum.singleChoice && category.type !== CategoryTypeEnum.multipleChoice)
    ) {
      return value
    }

    const matchingOption = category?.options?.find((opt) => opt.value === value)
    return matchingOption ? matchingOption.label : value
  }
  return (
    <Table>
      <TableBody>
        {Object.entries(detailObject).map(([key, value]) => {
          const category = detailCategoryObject?.[key]
          if (!category) return null

          return (
            <TableRow key={key}>
              {/* First column: Label */}
              <TableCell className='font-medium'>{category.label}</TableCell>
              <TableCell>
                {Array.isArray(value)
                  ? value.map((val) => getLabel(key, val)).join(', ')
                  : isValidDate(value)
                    ? t('date.toLocaleDateTimeString', { val: new Date(value as string) })
                    : getLabel(key, value as string)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
