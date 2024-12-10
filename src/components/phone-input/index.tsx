import * as i18nIsoCountries from 'i18n-iso-countries'
import enCountries from 'i18n-iso-countries/langs/en.json'
import { type CountryCallingCode, type E164Number, getExampleNumber, parsePhoneNumber } from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'
import * as React from 'react'
import { forwardRef, useState } from 'react'
import PhoneInput, { type Country } from 'react-phone-number-input/input'

import { cn } from '@/lib/utils'

import { Input } from '../ui/input'
import { ComboboxCountryInput } from './CountryCombobox'
import { getCountriesOptions, isoToEmoji, replaceNumbersWithZeros } from './helpers'

type CountryOption = {
  value: Country
  label: string
  indicatif: CountryCallingCode
}

i18nIsoCountries.registerLocale(enCountries)

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const PhoneInputWithCountries = (() => {
  return forwardRef<HTMLInputElement, InputProps>(({ ...field }, ref) => {
    const options = getCountriesOptions().filter((option) => option.value === 'VN')

    // You can use a the country of the phone number to set the default country
    const defaultCountry = parsePhoneNumber('+84012345678910')?.country
    const defaultCountryOption = options.find((option) => option.value === defaultCountry)

    const [country, setCountry] = useState<CountryOption>(defaultCountryOption || options[0]!)
    const [phoneNumber, setPhoneNumber] = useState<E164Number>(field.value as unknown as E164Number)

    React.useEffect(() => {
      setPhoneNumber(field.value as unknown as E164Number)
    }, [field.value])

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
