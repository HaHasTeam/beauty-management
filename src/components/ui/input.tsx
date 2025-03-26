import * as React from 'react'

import { cn } from '@/lib/utils'

type InputType = React.HTMLInputTypeAttribute | 'currency' | 'quantity' | 'percentage'
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currencyFormat?: Intl.NumberFormat
  type?: InputType
  locale?: string
  symbol?: React.ReactNode
  maxVal?: number
}
const MAX_DIGITS = 20
const numberableTypes = ['number', 'currency', 'quantity', 'percentage']

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      currencyFormat,
      onChange,
      onFocus,
      locale = 'en-US',
      value,
      symbol,
      maxVal,
      style,
      ...props
    },
    ref
  ) => {
    const isNumberInput = numberableTypes.includes(type)
    const inputType = isNumberInput ? 'text' : type
    const isFileInput = type === 'file'

    const formatCurrency = (amount?: number): string =>
      !!amount
        ? `${new Intl.NumberFormat(locale, {
            maximumSignificantDigits: MAX_DIGITS
          }).format(amount)}`
        : ''

    const [formattedValue, setFormattedValue] = React.useState(isNumberInput ? formatCurrency(Number(value)) : value)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumberInput) {
        const inputString = event.target.value.slice(0, MAX_DIGITS + 1)

        const hasDecimalPoint = inputString.includes('.')
        const [integerPart, decimal] = inputString.split('.').map((part) => part.replace(/\D/g, ''))
        const decimalPart = hasDecimalPoint ? `.${decimal}` : ''
        const inputValue = integerPart ? Number(`${integerPart}${decimalPart}`) : undefined

        const formattedInputValue = integerPart ? `${formatCurrency(Number(integerPart))}${decimalPart}` : ''

        switch (type) {
          case 'percentage': {
            if (inputValue === undefined) {
              setFormattedValue(formattedInputValue)
              if (onChange) onChange(undefined as unknown as React.ChangeEvent<HTMLInputElement>)
              return
            }
            if (inputValue <= 100 && inputValue >= 0) {
              setFormattedValue(formattedInputValue)
              if (onChange) onChange((inputValue / 100) as unknown as React.ChangeEvent<HTMLInputElement>)
              return
            }
            if (inputValue > 100) {
              setFormattedValue('100')
              if (onChange) onChange((100 / 100) as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            if (inputValue < 0) {
              setFormattedValue('0')
              if (onChange) onChange(0 as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            break
          }
          case 'quantity': {
            if (inputValue === undefined) {
              setFormattedValue('')
              if (onChange) onChange('' as unknown as React.ChangeEvent<HTMLInputElement>)
              break
            }

            const integerPart = inputValue.toString().split('.')[0]
            const integerFormatted = formatCurrency(Number(integerPart))

            if (maxVal !== undefined) {
              if (inputValue > maxVal) {
                setFormattedValue(formatCurrency(maxVal))
                if (onChange) onChange(maxVal as unknown as React.ChangeEvent<HTMLInputElement>)
                break
              }
            }
            setFormattedValue(integerFormatted)
            if (onChange) onChange(Number(integerPart) as unknown as React.ChangeEvent<HTMLInputElement>)
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
        if (onChange) onChange(event as unknown as React.ChangeEvent<HTMLInputElement>)
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
    }, [type, symbol])

    React.useEffect(() => {
      if (value !== undefined) {
        const numberValue = type === 'percentage' ? Number(value) * 100 : Number(value)
        const formValue = isNumberInput
          ? formatCurrency(maxVal !== undefined ? (numberValue > maxVal ? maxVal : numberValue) : numberValue)
          : value
        setFormattedValue(formValue)
        if (isNumberInput && onChange && maxVal !== undefined && numberValue > maxVal) {
          onChange(maxVal as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      }
    }, [value, maxVal])

    const symbolRef = React.useRef<HTMLDivElement>(null)
    const maxValRef = React.useRef<HTMLButtonElement>(null)

    if (isFileInput) {
      return (
        <input
          type={inputType}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background file:border-0 file:bg-transparent file:text-sm',
            'file:font-medium file:text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          onChange={handleChange}
          ref={ref}
          style={style}
          {...props}
        />
      )
    }
    const handleSetMaxValue = () => {
      if (isNumberInput && !!maxVal) {
        setFormattedValue(formatCurrency(maxVal))
        if (onChange) onChange(maxVal as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    }

    return (
      <div className={cn(finalSymbol && 'flex rounded-lg shadow-sm shadow-black/5 relative w-full', className)}>
        <input
          type={inputType}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background file:border-0 file:bg-transparent file:text-sm',
            'file:font-medium file:text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          value={formattedValue}
          onChange={handleChange}
          ref={ref}
          {...props}
          style={{
            ...style,
            paddingRight: !!finalSymbol ? `${symbolRef.current?.offsetWidth ?? 0 + 16}px` : '',
            paddingLeft: maxVal !== undefined ? `62px` : ''
          }}
        />

        {finalSymbol && (
          <div
            className='inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground absolute inset-y-0 right-0 gap-1 text-[10px]'
            ref={symbolRef}
          >
            {finalSymbol}
            {`${maxVal !== undefined ? ` / ${maxVal}` : ''}`}
          </div>
        )}
        {maxVal !== undefined && (
          <button
            disabled={(value ? Number(value) : 0) >= maxVal}
            className='inline-flex items-center rounded-none disabled:opacity-30 disabled:cursor-pointer rounded-l-lg border border-input  px-3 text-sm text-muted-foreground absolute inset-y-0 left-0 gap-1 cursor-pointer bg-primary text-white hover:opacity-50'
            ref={maxValRef}
            onClick={handleSetMaxValue}
          >
            {'MAX'}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface InputNormalProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const InputNormal = React.forwardRef<HTMLInputElement, InputNormalProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
InputNormal.displayName = 'InputNormal'
export { Input, InputNormal }
