import { ChevronDown, ChevronUp, TicketCheck, Users } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { DiscountTypeEnum } from '@/types/enum'
import { TGroupProduct } from '@/types/group-product'
import { formatCurrency, formatNumber } from '@/utils/number'

interface GroupProductStrategyCellProps {
  groupProduct: TGroupProduct
}

export function GroupProductStrategyCell({ groupProduct }: GroupProductStrategyCellProps) {
  const [expanded, setExpanded] = useState(false)
  const { criterias } = groupProduct

  // If no criterias, show a placeholder
  if (!criterias?.length) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-1.5'>
        <TicketCheck className='h-4 w-4 mr-1.5 text-muted-foreground' />
        <span className='italic'>No strategy</span>
      </div>
    )
  }

  const toggleExpanded = () => setExpanded(!expanded)
  const sortedCriterias = [...criterias].sort((a, b) => a.threshold - b.threshold)

  return (
    <div className='w-full bg-card rounded-md'>
      <div className='p-1.5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-md'>
              <TicketCheck className='h-4 w-4' />
            </div>
            <div className='flex flex-col'>
              <div className='text-xs font-medium text-muted-foreground'>
                <span className='font-bold'>{criterias.length}</span> Discount Tiers
              </div>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='h-6 w-6 p-0 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent'
            onClick={toggleExpanded}
          >
            {expanded ? <ChevronUp className='h-3.5 w-3.5' /> : <ChevronDown className='h-3.5 w-3.5' />}
          </Button>
        </div>

        {expanded && (
          <div className='mt-3 pl-2 relative'>
            <div className='relative pb-1'>
              {/* Timeline line */}
              <div
                className='absolute top-0 left-3.5 w-0.5 bg-primary/20 rounded-full'
                style={{
                  height: `calc(100% - ${sortedCriterias.length > 0 ? 24 : 0}px)`
                }}
              ></div>

              {/* Timeline items */}
              <div className='space-y-3.5'>
                {sortedCriterias.map((criteria, i) => (
                  <div key={criteria.id} className='relative pl-9 group'>
                    {/* Timeline dot */}
                    <div
                      className='absolute left-0 top-0 flex items-center justify-center w-7 h-7 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full shadow-md z-10 border-2 border-background transition-all duration-200 group-hover:scale-110'
                      style={{
                        opacity: 1 - i * 0.15
                      }}
                    >
                      <TicketCheck className='h-4 w-4' />
                    </div>

                    {/* Timeline content */}
                    <div className='flex flex-col pl-2 py-0.5 rounded-md transition-all duration-200 group-hover:bg-muted/50'>
                      <div className='flex items-center gap-3 text-xs'>
                        <span className='font-semibold bg-primary/10 px-2 py-1 rounded-md text-primary shadow-sm'>
                          {criteria.voucher.discountType === DiscountTypeEnum.AMOUNT
                            ? formatCurrency(criteria.voucher.discountValue)
                            : formatNumber(criteria.voucher.discountValue * 100, '%')}{' '}
                          off
                        </span>
                        <div className='flex items-center gap-1 text-muted-foreground'>
                          <Users className='h-3 w-3' />
                          <span className='font-medium'>{formatNumber(criteria.threshold, ' People')}</span>
                        </div>
                      </div>

                      {/* Content separator - only for items that aren't the last one */}
                      {i < sortedCriterias.length - 1 && <div className='mt-2 h-px w-full bg-border/30'></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
