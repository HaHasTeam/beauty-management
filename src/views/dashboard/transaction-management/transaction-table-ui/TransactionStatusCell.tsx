import { AlertCircle, Check, Timer } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TTransaction } from '@/types/transaction'

interface TransactionStatusCellProps {
  transaction: TTransaction
}

type StatusConfig = {
  label: string
  icon: React.ReactNode
  tooltip: string
  variant: 'default' | 'success' | 'warning' | 'destructive' | 'outline'
  textColor: string
  bgColor: string
}

export function getStatusConfig(transaction: TTransaction): StatusConfig {
  const timestamp = new Date(transaction.createdAt || Date.now())
  const nowTimestamp = new Date()

  // For demonstration purposes - in a real app, you would use the actual status field
  // Here we're determining status based on the created date (newer = pending, older = completed)
  const hoursSinceCreation = Math.floor((nowTimestamp.getTime() - timestamp.getTime()) / (1000 * 60 * 60))

  if (hoursSinceCreation < 1) {
    // Pending for recent transactions
    return {
      label: 'Pending',
      icon: <Timer className='h-3.5 w-3.5' />,
      tooltip: 'Transaction is being processed',
      variant: 'outline',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50'
    }
  } else if (hoursSinceCreation < 24) {
    // Processing for transactions in the last day
    return {
      label: 'Processing',
      icon: <Timer className='h-3.5 w-3.5' />,
      tooltip: 'Transaction is being processed',
      variant: 'outline',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50'
    }
  } else if (transaction.amount < 0) {
    // Failed for negative amounts (just for demonstration)
    return {
      label: 'Failed',
      icon: <AlertCircle className='h-3.5 w-3.5' />,
      tooltip: 'Transaction failed to process',
      variant: 'destructive',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50'
    }
  } else {
    // Completed for everything else
    return {
      label: 'Completed',
      icon: <Check className='h-3.5 w-3.5' />,
      tooltip: 'Transaction completed successfully',
      variant: 'outline',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50'
    }
  }
}

export function TransactionStatusCell({ transaction }: TransactionStatusCellProps) {
  const statusConfig = getStatusConfig(transaction)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant='outline'
            className={cn(
              'h-7 font-medium flex items-center justify-start space-x-1 px-2 py-1 border',
              statusConfig.bgColor,
              statusConfig.textColor,
              'border-slate-200 hover:border-slate-300'
            )}
          >
            <span className='flex-shrink-0'>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusConfig.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
