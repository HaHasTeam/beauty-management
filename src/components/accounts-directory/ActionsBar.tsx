import { FilterIcon } from 'lucide-react'

import Button from '../button'
import { Card } from '../ui/card'
import InviteCoWorker from './InviteCoWorker'

const ActionsBar = () => {
  return (
    <Card className={'border-zinc-200 p-3 dark:border-zinc-800 w-full sticky top-28 z-10 bg-white'}>
      {/* Charts */}
      <div className='flex w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden'>
        <div className='w-full flex items-center gap-4'>
          <Button variant={'outline'} className=''>
            <FilterIcon />
            <span>Filter</span>
          </Button>
          <InviteCoWorker />
        </div>
      </div>
    </Card>
  )
}

export default ActionsBar
