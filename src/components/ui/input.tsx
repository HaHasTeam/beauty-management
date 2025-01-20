import * as React from 'react'

import { cn } from '@/lib/utils'

type InputType = React.HTMLInputTypeAttribute | 'currency' | 'quantity' | 'percentage'
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currencyFormat?: Intl.NumberFormat
  type?: InputType
  locale?: string
  symbol?: React.ReactNode
}
const MAX_DIGITS = 99
const numberableTypes = ['number', 'currency', 'quantity', 'percentage']

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', currencyFormat, onChange, onFocus, locale = 'en-US', value, symbol, ...props }, ref) => {
    const inputType = 'text'

    const formatCurrency = (amount?: number): string =>
      !!amount
        ? `${new Intl.NumberFormat(locale, {
            maximumSignificantDigits: MAX_DIGITS
          }).format(amount)}`
        : ''

    const isNumberInput = numberableTypes.includes(type)

    const [formattedValue, setFormattedValue] = React.useState(isNumberInput ? formatCurrency(Number(value)) : value)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumberInput) {
        const inputString = event.target.value
        const hasDecimalPoint = inputString.includes('.')
        const [integerPart, decimal] = inputString.split('.').map((part) => part.replace(/\D/g, ''))
        const decimalPart = hasDecimalPoint ? `.${decimal}` : ''
        const inputValue = integerPart ? Number(`${integerPart}${decimalPart}`) : undefined

        const formattedInputValue = integerPart ? `${formatCurrency(Number(integerPart))}${decimalPart}` : ''
        switch (type) {
          case 'percentage': {
            console.log(inputValue)
            console.log(formattedInputValue)

            if (inputValue === undefined) {
              setFormattedValue(formattedInputValue)
              if (onChange) onChange(undefined as unknown as React.ChangeEvent<HTMLInputElement>)
              return
            }
            if (inputValue <= 100 && inputValue >= 0) {
              setFormattedValue(formattedInputValue)
              if (onChange) onChange(inputValue as unknown as React.ChangeEvent<HTMLInputElement>)
              return
            }
            if (inputValue > 100) {
              setFormattedValue('100')
              if (onChange) onChange(100 as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            if (inputValue < 0) {
              setFormattedValue('0')
              if (onChange) onChange(0 as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            break
          }
          case 'quantity': {
            if (inputValue === undefined) {
              setFormattedValue(formattedInputValue)
              if (onChange) onChange(undefined as unknown as React.ChangeEvent<HTMLInputElement>)
              return
            }
            const integerPart = inputValue.toString().split('.')[0]
            const integerFormatted = formatCurrency(Number(integerPart))
            setFormattedValue(integerFormatted)
            if (onChange) onChange(integerPart as unknown as React.ChangeEvent<HTMLInputElement>)
            break
          }
          default: {
            setFormattedValue(formattedInputValue)
            if (onChange) onChange(inputValue as unknown as React.ChangeEvent<HTMLInputElement>)
            break
          }
        }
      } else {
        setFormattedValue(event.target.value)
        if (onChange) onChange(event)
      }
    }

    const finalSymbol = React.useMemo(() => {
      if (symbol) return symbol
      switch (type) {
        case 'currency':
          return 'VND'
        case 'percentage':
          return '%'
        default:
          return ''
      }
    }, [type])

    React.useEffect(() => {
      if (value !== undefined) {
        setFormattedValue(isNumberInput ? formatCurrency(Number(value)) : value)
      }
    }, [value])
    const symbolRef = React.useRef<HTMLSpanElement>(null)
    return (
      <div className={cn('flex rounded-lg shadow-sm shadow-black/5 relative', className)}>
        <input
          type={inputType}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background file:border-0 file:bg-transparent file:text-sm',
            'file:font-medium file:text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            finalSymbol && `pr-[${symbolRef.current?.offsetWidth ?? 0 + 8}px]`,
            className
          )}
          value={formattedValue}
          maxLength={MAX_DIGITS}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        {finalSymbol && (
          <span
            className='inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground absolute inset-y-0 right-0'
            ref={symbolRef}
          >
            {finalSymbol}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
