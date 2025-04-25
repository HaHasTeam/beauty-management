import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ArrowDownCircle, ArrowUpCircle, Package, Receipt, XCircle } from 'lucide-react'
import { ElementRef, forwardRef, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getAllTransactions } from '@/network/apis/transaction'
import { TransactionTypeEnum, TTransaction } from '@/types/transaction'
import { formatCurrency } from '@/utils/number'
import { minifyStringId } from '@/utils/string'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect' // Use the local wrapper

// Get type icon utility
function getTypeIcon(type: TransactionTypeEnum) {
  switch (type) {
    case TransactionTypeEnum.DEPOSIT:
      return <ArrowDownCircle className='h-3.5 w-3.5 text-green-500' />
    case TransactionTypeEnum.WITHDRAW:
      return <ArrowUpCircle className='h-3.5 w-3.5 text-red-500' />
    case TransactionTypeEnum.ORDER_PURCHASE:
      return <Package className='h-3.5 w-3.5 text-blue-500' />
    case TransactionTypeEnum.ORDER_REFUND:
      return <Receipt className='h-3.5 w-3.5 text-purple-500' />
    case TransactionTypeEnum.BOOKING_PURCHASE:
      return <Package className='h-3.5 w-3.5 text-indigo-500' />
    case TransactionTypeEnum.BOOKING_REFUND:
      return <Receipt className='h-3.5 w-3.5 text-purple-500' />
    case TransactionTypeEnum.ORDER_CANCEL:
      return <XCircle className='h-3.5 w-3.5 text-orange-500' />
    case TransactionTypeEnum.BOOKING_CANCEL:
      return <XCircle className='h-3.5 w-3.5 text-orange-500' />
    case TransactionTypeEnum.TRANSFER_TO_WALLET:
      return <Receipt className='h-3.5 w-3.5 text-cyan-500' />
  }
}

// Format type utility
function formatType(type: TransactionTypeEnum): string {
  return type
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

interface Props extends Omit<InputProps, 'value' | 'onChange'> {
  onChange?: (value: TTransaction | TTransaction[] | null) => void // Returns full object(s)
  value?: TTransaction | TTransaction[] | null
  multiple?: boolean
}

// Function to render transaction item display
const getTransactionItemDisplay = (transaction: TTransaction) => {
  const type = transaction.type

  return (
    <div className='flex items-center gap-2 py-1 w-full text-sm'>
      <div className='flex-shrink-0 w-6 h-6 rounded-full bg-slate-100/50 flex items-center justify-center'>
        {getTypeIcon(type)}
      </div>
      <div className='font-medium whitespace-nowrap'>{minifyStringId(transaction.id)}</div>
      <span className='text-xs text-slate-500 capitalize hidden sm:inline'>{formatType(type)}</span>
      <div className='flex-grow'></div> {/* Spacer */}
      <span className='text-xs text-slate-500 hidden md:inline'>
        {transaction.createdAt ? format(new Date(transaction.createdAt), 'PP') : 'N/A'}
      </span>
      <div className='font-semibold whitespace-nowrap text-xs'>{formatCurrency(transaction.amount ?? 0)}</div>
    </div>
  )
}

const SelectTransaction = forwardRef<ElementRef<typeof AsyncSelect>, Props>((props, ref) => {
  const { t } = useTranslation() // Keep t for potential future use or standard placeholders
  const {
    placeholder = t('selectTransaction.placeholder', 'Select a transaction'),
    className,
    onChange,
    value,
    multiple = false
  } = props

  const { data: transactionList, isFetching: isGettingTransactionList } = useQuery({
    queryKey: [getAllTransactions.queryKey],
    queryFn: getAllTransactions.fn
  })

  const transactionOptions = useMemo(() => {
    if (!transactionList?.data) return []
    return transactionList.data.map((transaction) => ({
      value: transaction.id,
      label: `${minifyStringId(transaction.id)} - ${formatCurrency(transaction.amount ?? 0)}`, // Simple label
      display: getTransactionItemDisplay(transaction)
    }))
  }, [transactionList?.data])

  const selectedOptions = useMemo(() => {
    const findOption = (transactionId: string) => {
      const transaction = transactionList?.data.find((t) => t.id === transactionId)
      if (!transaction) return null
      return {
        value: transaction.id,
        label: `${minifyStringId(transaction.id)} - ${formatCurrency(transaction.amount ?? 0)}`,
        display: getTransactionItemDisplay(transaction)
      }
    }

    if (multiple) {
      if (!value) return []
      const selectedValues = Array.isArray(value) ? value : [value]
      return selectedValues.map((v) => findOption(v.id)).filter(Boolean)
    } else {
      if (!value || Array.isArray(value)) return null
      return findOption(value.id)
    }
  }, [value, transactionList?.data, multiple])

  // Basic client-side filtering (adjust if API supports filtering)
  const promiseOptions = useCallback(
    (inputValue: string): Promise<TOption[]> => {
      if (!inputValue) {
        return Promise.resolve(transactionOptions)
      }
      const lowerInputValue = inputValue.toLowerCase().trim()
      const filtered = transactionOptions.filter((option) => option.label?.toLowerCase().includes(lowerInputValue))
      return Promise.resolve(filtered)
    },
    [transactionOptions]
  )

  const handleChange = useCallback(
    (options: TOption | readonly TOption[] | null) => {
      if (multiple) {
        const optionValues = (options as TOption[]) || []
        if (onChange) {
          const selectedTransactions = optionValues
            .map((option) => transactionList?.data.find((t) => t.id === option.value))
            .filter((t): t is TTransaction => !!t)
          onChange(selectedTransactions.length > 0 ? selectedTransactions : null)
        }
      } else {
        const optionValue = options as TOption | null
        if (onChange) {
          if (!optionValue) {
            onChange(null)
            return
          }
          const selectedTransaction = transactionList?.data.find((t) => t.id === optionValue?.value)
          onChange(selectedTransaction || null)
        }
      }
    },
    [multiple, onChange, transactionList?.data]
  )

  return (
    <AsyncSelect
      ref={ref}
      cacheOptions // Cache options after first load
      defaultOptions={transactionOptions} // Load initial options
      loadOptions={promiseOptions} // Handle searching/filtering
      value={selectedOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingTransactionList}
      isClearable
      isSearchable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={handleChange as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatOptionLabel={(data: any) => data.display as React.ReactElement}
    />
  )
})

SelectTransaction.displayName = 'SelectTransaction'

export default SelectTransaction
