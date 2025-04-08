import i18next from 'i18next'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const emailRegex = {
  pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  message: () => i18next.t('validation.emailValid')
}
export const usernameRegex = {
  pattern: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
  message: () => i18next.t('validation.usernameValid')
}

export const requiredRegex = (min?: number, max?: number) => {
  return {
    pattern: new RegExp(`^.{${min || 1},${max || ''}}$`),
    message: () => i18next.t('validation.required')
  }
}

export const requiredFileRegex = {
  pattern: /^.+$/,
  message: () => i18next.t('validation.required')
}

export const numberRequiredRegex = {
  pattern: /^\d+$/,
  message: () => i18next.t('validation.required')
}

export const passwordRegex = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  message: () => i18next.t('validation.required')
}

export const phoneRegex = {
  pattern: (value: string) => {
    return isValidPhoneNumber(value)
  },
  message: () => i18next.t('validation.required')
}

export const defaultRequiredRegex = requiredRegex()
export const longRequiredRegex = requiredRegex(1, 255)
export const shortRequiredRegex = requiredRegex(1, 50)
export const mediumRequiredRegex = requiredRegex(1, 100)
