import { ArrowDown, ArrowUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TTransaction } from '@/types/transaction'

interface TransactionTypeCellProps {
  transaction: TTransaction
}

type TypeConfig = {
  label: string
  icon: React.ReactNode
  tooltip: string
  textColor: string
  bgColor: string
}

function getTypeConfig(transaction: TTransaction): TypeConfig {
  // Credit transactions have positive amounts
  const isCredit = transaction.amount >= 0

  if (isCredit) {
    return {
      label: 'Credit',
      icon: <ArrowUp className='h-3.5 w-3.5' />,
      tooltip: 'Amount added to account',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50'
    }
  } else {
    return {
      label: 'Debit',
      icon: <ArrowDown className='h-3.5 w-3.5' />,
      tooltip: 'Amount subtracted from account',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50'
    }
  }
}

export function TransactionTypeCell({ transaction }: TransactionTypeCellProps) {
  const typeConfig = getTypeConfig(transaction)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant='outline'
            className={cn(
              'h-7 font-medium flex items-center justify-start space-x-1 px-2 py-1 border',
              typeConfig.bgColor,
              typeConfig.textColor,
              'border-slate-200 hover:border-slate-300'
            )}
          >
            <span className='flex-shrink-0'>{typeConfig.icon}</span>
            <span>{typeConfig.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{typeConfig.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
