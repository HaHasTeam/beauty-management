import i18next from 'i18next'

import { IStepper } from '@/types/stepper'

export const getSteps = (): IStepper[] => [
  {
    id: 1,
    title: i18next.t('createProduct.basicInformation')
  },
  {
    id: 2,
    title: i18next.t('createProduct.detailInformation')
  },
  {
    id: 3,
    title: i18next.t('createProduct.classificationInformation')
  }
]
