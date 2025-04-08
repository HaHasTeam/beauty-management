import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { TOrderRequest } from '@/types/order-request'

interface OrderRequestTableFloatingBarProps {
  table: Table<TOrderRequest>
}

export function OrderRequestTableFloatingBar({ table }: OrderRequestTableFloatingBarProps) {
  const { t } = useTranslation()
  const selectedRows = table.getSelectedRowModel().rows

  if (selectedRows.length === 0) {
    return null
  }

  return (
    <div className='fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-background px-4 py-2 shadow-lg'>
      <span className='text-sm font-medium'>{t('orderRequest.selected', { count: selectedRows.length })}</span>
      <Button variant='outline' size='sm' onClick={() => table.resetRowSelection()}>
        {t('common.clear')}
      </Button>
    </div>
  )
}
