import * as i18nIsoCountries from 'i18n-iso-countries'
import enCountries from 'i18n-iso-countries/langs/en.json'
import {
  type CountryCallingCode,
  type E164Number,
  getExampleNumber,
  isValidPhoneNumber as matchIsValidPhoneNumber,
  parsePhoneNumber
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'
import * as React from 'react'
import { forwardRef, useState } from 'react'
import { ControllerFieldState, FieldValues, UseFormReturn } from 'react-hook-form'
import PhoneInput, { type Country } from 'react-phone-number-input/input'

import { cn } from '@/lib/utils'

import { Input } from '../ui/input'
import { ComboboxCountryInput } from './combobox'
import { getCountriesOptions, isoToEmoji, replaceNumbersWithZeros } from './helpers'

type CountryOption = {
  value: Country
  label: string
  indicatif: CountryCallingCode
}

i18nIsoCountries.registerLocale(enCountries)

// eslint-disable-next-line
type InputProps<TFieldValues extends FieldValues> = {
  field: React.InputHTMLAttributes<HTMLInputElement>
  formState?: UseFormReturn<TFieldValues>
  fieldState?: ControllerFieldState
}

const PhoneInputWithCountries = (() => {
  // eslint-disable-next-line
  return forwardRef<HTMLInputElement, InputProps<any>>(({ field, formState }, ref) => {
    const options = getCountriesOptions()

    // You can use a the country of the phone number to set the default country
    const defaultCountry = parsePhoneNumber('+84012345678910')?.country
    const defaultCountryOption = options.find((option) => option.value === defaultCountry)

    const [country, setCountry] = useState<CountryOption>(defaultCountryOption || options[0]!)
    const [phoneNumber, setPhoneNumber] = useState<E164Number>(field.value as unknown as E164Number)

    const placeholder = replaceNumbersWithZeros(getExampleNumber(country.value, examples)!.formatInternational())

    const onCountryChange = (value: CountryOption) => {
      setPhoneNumber('' as unknown as E164Number)
      setCountry(value)
      field.onChange?.('' as unknown as React.ChangeEvent<HTMLInputElement>)
    }

    const onPhoneNumberChange = (value: E164Number) => {
      if (!value) {
        setPhoneNumber('' as unknown as E164Number)
        field.onChange?.('' as unknown as React.ChangeEvent<HTMLInputElement>)
        return
      }
      setPhoneNumber(value)

      field.onChange?.(value as unknown as React.ChangeEvent<HTMLInputElement>)
      const isValidPhoneNumber = matchIsValidPhoneNumber(phoneNumber ?? '')
      console.log('isValidPhoneNumber', isValidPhoneNumber)

      if (!isValidPhoneNumber) {
        console.log(formState?.formState.errors)

        formState?.setError?.(field.name as string, {
          message: 'Please fill in a valid phone number'
        })
      } else {
        formState?.clearErrors?.(field.name as string)
      }
    }

    return (
      <div className={cn('not-prose mt-8 flex flex-col gap-4', field.className)}>
        <div className='flex gap-2'>
          <ComboboxCountryInput
            value={country}
            onValueChange={onCountryChange}
            options={options}
            placeholder='Find your country...'
            renderOption={({ option }) => `${isoToEmoji(option.value)} ${option.label}`}
            renderValue={(option) => option.label}
            emptyMessage='No country found.'
          />
          <PhoneInput
            ref={ref}
            international
            withCountryCallingCode
            country={country.value.toUpperCase() as Country}
            value={phoneNumber}
            inputComponent={Input}
            placeholder={placeholder}
            onChange={onPhoneNumberChange}
          />
        </div>
      </div>
    )
  })
})()

PhoneInputWithCountries.displayName = 'PhoneInputWithCountries'

export { PhoneInputWithCountries }
