import { type Table } from '@tanstack/react-table'
import { Download, Flag, ListPlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Routes, routesConfig } from '@/configs/routes'
import useGrant from '@/hooks/useGrant'
import { exportTableToCSV } from '@/lib/export'
import { IBlogDetails } from '@/types/blog'
import { RoleEnum } from '@/types/enum'

interface BlogTableToolbarActionsProps {
  table: Table<IBlogDetails>
}

export function BlogTableToolbarActions({ table }: BlogTableToolbarActionsProps) {
  // const handleAddBlog = () => {}
  const [isOpened, setIsOpened] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleAddBlog = () => {
    navigate(routesConfig[Routes.CREATE_BLOG].getPath())
  }
  const isGrant = useGrant([RoleEnum.ADMIN, RoleEnum.OPERATOR])
  return (
    <div className='flex items-center gap-2'>
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BanReportDialog
          Report={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null} */}
      {isGrant && (
        <Dialog open={isOpened} onOpenChange={setIsOpened}>
          <DialogTrigger>
            <Button size={'sm'} onClick={handleAddBlog}>
              <ListPlusIcon />
              {t('button.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl max-h-[70%] overflow-auto'>
            <DialogTitle className='flex items-center gap-2'>
              <Flag className='h-5 w-5' />
              New Report
            </DialogTitle>
            <DialogDescription>
              <div className='text-gray-600 text-sm'>Please fill in the form below to report a new issue.</div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'Report' + Date.now(),
            excludeColumns: ['select', 'actions']
          })
        }
        className='gap-2'
      >
        <Download className='size-4' aria-hidden='true' />
        {t('button.export')}
      </Button>

      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  )
}
