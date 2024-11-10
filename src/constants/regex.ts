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

export const passwordRegex = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  message:
    'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number and one special character'
}

export const phoneRegex = {
  pattern: /^[0-9]{10,15}$/,
  message: 'Please enter a valid phone number'
}
