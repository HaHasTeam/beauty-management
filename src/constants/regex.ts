import { isValidPhoneNumber } from 'libphonenumber-js'

export const emailRegex = {
  pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  message: 'Please enter a valid email address'
}

export const requiredRegex = (min?: number, max?: number) => {
  return {
    pattern: new RegExp(`^.{${min || 1},${max || ''}}$`),
    message: 'Please fill out this field'
  }
}

export const requiredFileRegex = {
  pattern: /^.+$/,
  message: 'Please fill out this field'
}

export const numberRequiredRegex = {
  pattern: /^\d+$/,
  message: 'Please fill out this field'
}

export const passwordRegex = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  message:
    'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number and one special character'
}

export const phoneRegex = {
  pattern: (value: string) => {
    return isValidPhoneNumber(value)
  },
  message: 'Please fill in a valid phone number'
}

export const defaultRequiredRegex = requiredRegex()
export const longRequiredRegex = requiredRegex(1, 255)
export const shortRequiredRegex = requiredRegex(1, 50)
export const mediumRequiredRegex = requiredRegex(1, 100)
export const integerRequiredRegex = requiredRegex(1)
