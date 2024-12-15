import i18n from 'i18next'
import detector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import intervalPlural from 'i18next-intervalplural-postprocessor'
import moment from 'moment'
import { initReactI18next } from 'react-i18next'

export const supportedLngs = ['en', 'vi']

i18n
  .use(HttpApi)
  .use(detector)
  .use(initReactI18next)
  .use(intervalPlural)
  .init({
    supportedLngs,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    ns: ['layout'],
    defaultNS: 'layout',
    fallbackLng: ['vi'],
    lng: 'vi',
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (value instanceof Date) {
          return moment(value).format(format || 'DD/MM/YYYY') // Use 'DD/MM/YYYY' as default format
        }

        if (format === 'currency') {
          const currency = lng === 'vi' ? 'VND' : 'USD' // Change currency per language
          return Intl.NumberFormat(lng, { style: 'currency', currency }).format(value)
        }
        return value
      }
    }
  })

export default i18n
