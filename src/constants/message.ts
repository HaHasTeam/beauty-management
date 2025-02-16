// productMessages.ts
import { useTranslation } from 'react-i18next'

export const useProductFormMessage = () => {
  const { t } = useTranslation()

  return {
    SKURequired: t('productFormMessage.SKURequired'),
    SKURequiredLength: t('productFormMessage.SKURequiredLength'),
    SKUValidate: t('productFormMessage.SKUValidate'),
    SKUValidateFull: t('productFormMessage.SKUValidateFull'),
    SKURegex: t('productFormMessage.SKURegex'),
    priceValidate: t('productFormMessage.priceValidate'),
    quantityValidate: t('productFormMessage.quantityValidate'),
    quantityRequired: t('productFormMessage.quantityRequired'),
    quantityClassificationRequired: t('productFormMessage.quantityClassificationRequired'),
    priceRequired: t('productFormMessage.priceRequired'),
    priceClassificationRequired: t('productFormMessage.priceClassificationRequired'),
    productNameRequired: t('productFormMessage.productNameRequired'),
    productNameLengthRequired: t('productFormMessage.productNameLengthRequired'),
    brandRequired: t('productFormMessage.brandRequired'),
    categoryRequired: t('productFormMessage.categoryRequired'),
    imagesRequired: t('productFormMessage.imagesRequired'),
    descriptionRequired: t('productFormMessage.descriptionRequired'),
    descriptionTooLong: t('productFormMessage.descriptionTooLong'),
    statusRequired: t('productFormMessage.statusRequired'),
    classificationTitleRequired: t('productFormMessage.classificationTitleRequired'),
    successCreateOfficialMessage: t('productFormMessage.successCreateOfficialMessage'),
    successUpdateOfficialMessage: t('productFormMessage.successUpdateOfficialMessage'),
    successCreateInactiveMessage: t('productFormMessage.successCreateInactiveMessage'),
    successUpdateInactiveMessage: t('productFormMessage.successUpdateInactiveMessage'),
    successStatusMessage: t('productFormMessage.successStatusMessage'),
    categoryLastLevel: t('productFormMessage.categoryLastLevel')
  }
}

export const useProductPageMessage = () => {
  const { t } = useTranslation()

  return {
    emptyProductTitle: t('empty.productDetail.title'),
    emptyProductMessage: t('empty.productDetail.description')
  }
}
